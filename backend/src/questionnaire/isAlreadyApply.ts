import express from "express";
import log4js from "log4js";
import mysql from "mysql2/promise";
import { db_setting } from "../db/setting";



const router = express.Router();
const logger = log4js.getLogger();

export default router.get("/isAlreadyApply", async (req, res) => {
    logger.info(`Access to /questionnaire/isAlreadyApply`);
    let connection: any;
    try {
        if (!("companyId" in req.query && "uid" in req.query)) {
            res.status(401).send("パラメータが不足しています");
            return;
        }
        connection = await mysql.createConnection(db_setting);
        const companyId = req.query?.companyId?.toString()
        const [row] = await connection.execute(`SELECT * from questionnaire_${companyId} where uid = ? limit 1`, [req.query.uid]);
        res.status(200).send(row);
    } catch (e) {
        await connection.rollback();
        logger.error(e);
        res.status(401).send("エラーが発生しました");
        return;
    } finally {
        if (connection) {
            await connection.end();
        }
    }
});