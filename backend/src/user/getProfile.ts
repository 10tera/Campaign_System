import express from "express";
import log4js from "log4js";
import mysql from "mysql2/promise";
import { db_setting } from "../db/setting";

const router = express.Router();
const logger = log4js.getLogger();


export default router.get("/get", async (req, res) => {
    logger.info(`Access to /user/get`);
    let connection;
    try {
        if(!req.query.uid){
            res.status(401).send(`UIDが含まれていません。`);
            return;
        }
        connection = await mysql.createConnection(db_setting);
        const [row, fields] = await connection.execute<mysql.RowDataPacket[]>(`SELECT * from users where uid = ? limit 1`, [req.query.uid]);
        if(row.length === 0){
            res.status(401).send(`データが見つかりませんでした。`);
            return;
        }
        res.status(200).send(row[0]);
        return;
    } catch (e) {
        logger.error(e);
        res.status(401).send(`何らかのエラーが発生しました。${e}`);
        return;
    } finally {
        if (connection) {
            await connection.end();
        }
    }
});