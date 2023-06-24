import express from "express";
import log4js from "log4js";
import mysql from "mysql2/promise";
import { db_setting } from "../db/setting";
import { connect } from "http2";

const router = express.Router();
const logger = log4js.getLogger();

export default router.get("/getAll", async (req, res) => {
    logger.info(`Access to /point/getAll`);
    try {
        if (!("companyId" in req.query)) {
            res.status(401).send(`パラメータが不足しています。`);
            return;
        }
        const connection = await mysql.createConnection(db_setting);
        const [row, fields] = await connection.execute<mysql.RowDataPacket[]>(`SELECT * from point_${req.query.companyId?.toString()}`);
        res.status(200).send(row);
        return;
    } catch (e) {
        logger.error(e);
        res.status(401).send(`何らかのエラーが発生しました。${e}`);
        return;
    }
});