import express from "express";
import log4js from "log4js";
import mysql,{Pool} from "mysql2/promise";

const router = express.Router();
const logger = log4js.getLogger();

export default router.get("/get", async (req, res) => {
    logger.info(`Access to /instantWin/get`);
    let connection;
    if (!req.query.id) {
        res.status(401).send(`キャンペーンidが指定されていません。`);
        return;
    }
    try {
        const pool: Pool = req.app.locals.pool;
        connection = await pool.getConnection();
        const [row, fields] = await connection.query<mysql.RowDataPacket[]>(`SELECT * from instantwin_${req.query.id.toString()}`);
        res.status(200).send(row);
        return;
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