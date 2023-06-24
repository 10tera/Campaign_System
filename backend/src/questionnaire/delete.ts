import express from "express";
import log4js from "log4js";
import mysql from "mysql2/promise";
import fs from "fs";
import { db_setting } from "../db/setting";

const router = express.Router();
const logger = log4js.getLogger();

export default router.delete("/delete", async (req, res) => {
    logger.info(`Access to /questionnaire/delete`);
    let connection: any;
    try {
        connection = await mysql.createConnection(db_setting);
        await connection.beginTransaction();
        if (!("companyId" in req.body)) {
            res.status(401).send("パラメータが不足しています。");
            return;
        }

        const [] = await connection.execute(`DROP TABLE IF EXISTS questionnaire_${req.body.companyId.toString()}`);

        if (fs.existsSync(`config/questionnaire/${req.body.companyId.toString()}.json`)) {
            fs.unlinkSync(`config/questionnaire/${req.body.companyId.toString()}.json`);
        }

        await connection.commit();
        res.status(200).send("削除完了");
    } catch (e) {
        await connection.rollback();
        logger.error(e);
        res.status(401).send("何らかのエラーが発生しました。")
    } finally {
        if (connection) {
            await connection.end();
        }
    }
});