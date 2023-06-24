import express from "express";
import log4js from "log4js";
import mysql from "mysql2/promise";
import fs from "fs";
import { db_setting } from "../db/setting";

const router = express.Router();
const logger = log4js.getLogger();

export default router.put("/changeUserState", async (req, res) => {
    logger.info(`Access to /receiptCampaign/changeUserState`);
    let connection: any;
    try {
        if (!(req.body.companyId && req.body.id && req.body.state)) {
            res.status(401).send("パラメータが不足しています。");
            return;
        }
        connection = await mysql.createConnection(db_setting);
        await connection.beginTransaction();
        const [] = await connection.execute(`update receiptcampaign_${req.body.companyId} set state = ${req.body.state}, comment = '${req.body.comment}' where id = ${req.body.id}`);
        await connection.commit();
        res.status(200).send("更新完了");
        return;
    } catch (e) {
        logger.error(e);
        await connection.rollback();
        res.status(401).send("何らかのエラーが発生しました。");
    } finally {
        return;
    }

});