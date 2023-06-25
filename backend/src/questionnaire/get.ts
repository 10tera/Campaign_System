import express from "express";
import log4js from "log4js";
import mysql from "mysql2/promise";
import { db_setting } from "../db/setting";

const router = express.Router();
const logger = log4js.getLogger();

export default router.get("/get", async (req, res) => {
    logger.info(`Access to /questionnaire/get`);
    let connection;
    try {
        if (!("companyId" in req.query)) {
            res.status(401).send(`キャンペーンidが指定されていません。`);
            return;
        }
        const companyId = req.query.companyId?.toString();
        connection = await mysql.createConnection(db_setting);
        const [row, fields] = await connection.execute<mysql.RowDataPacket[]>(`SELECT * from questionnaire_${companyId}`);
        res.status(200).send(row);
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