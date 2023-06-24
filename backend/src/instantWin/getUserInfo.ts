import express from "express";
import log4js from "log4js";
import mysql from "mysql2/promise";
import { db_setting } from "../db/setting";
import fs from "fs";

const router = express.Router();
const logger = log4js.getLogger();

export default router.get("/getUserInfo", async (req, res) => {
    logger.info(`Access to /instantWin/getUserInfo`);
    if (!(req.query.uid && req.query.id)) {
        res.status(401).send(`id/uidが指定されていません。`);
        return;
    }
    try {
        const connection = await mysql.createConnection(db_setting);
        const [row, fields] = await connection.execute<mysql.RowDataPacket[]>(`SELECT * from instantwin_${req.query.id.toString()} where uid = ? limit 1`, [req.query.uid]);
        const [row2] = await connection.execute<mysql.RowDataPacket[]>(`SELECT * from users where uid = ? limit 1`, [req.query.uid])
        if (row.length === 0) {
            res.status(200).send([]);
            return;
        }
        if (fs.existsSync(`config/instantWin/${req.query.id.toString()}/${req.query.uid}.png`)) {
            const base64Data = fs.readFileSync(`config/instantWin/${req.query.id.toString()}/${req.query.uid}.png`, { encoding: "base64" });
            res.status(200).send([{ ...row[0], address: row2[0].address, name: row2[0].name, img: base64Data }]);
            return;
        }
        else {
            res.status(200).send([{ ...row[0], address: row2[0].address, name: row2[0].name }]);
            return;
        }
    } catch (e) {
        logger.error(e);
        res.status(401).send(`何らかのエラーが発生しました。${e}`);
        return;
    }
});