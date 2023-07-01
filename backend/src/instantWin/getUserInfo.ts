import express from "express";
import log4js from "log4js";
import mysql,{Pool} from "mysql2/promise";
import fs from "fs";

const router = express.Router();
const logger = log4js.getLogger();

export default router.get("/getUserInfo", async (req, res) => {
    logger.info(`Access to /instantWin/getUserInfo`);
    if (!("uid" in req.query && "id" in req.query)) {
        res.status(401).send(`id/uidが指定されていません。`);
        return;
    }
    let connection;
    try {
        const pool: Pool = req.app.locals.pool;
        connection = await pool.getConnection();
        const [row, fields] = await connection.query<mysql.RowDataPacket[]>(`SELECT * from instantwin_${req.query.id?.toString()} where uid = ? limit 1`, [req.query.uid]);
        const [row2] = await connection.query<mysql.RowDataPacket[]>(`SELECT * from users where uid = ? limit 1`, [req.query.uid])
        if (row.length === 0) {
            res.status(200).send([]);
            return;
        }
        if (fs.existsSync(`config/instantWin/${req.query.id?.toString()}/${req.query.uid}.png`)) {
            const base64Data = fs.readFileSync(`config/instantWin/${req.query.id?.toString()}/${req.query.uid}.png`, { encoding: "base64" });
            res.status(200).send([{ ...row[0], address: row2[0].address, name: row2[0].name, img: base64Data }]);
            return;
        }
        else {
            res.status(401).send("画像ファイルが存在しません");
            return;
        }
    } catch (e) {
        logger.error(e);
        res.status(401).send(`何らかのエラーが発生しました。${e}`);
        return;
    } finally {
        if (connection) {
            connection.release();
        }
    }
});