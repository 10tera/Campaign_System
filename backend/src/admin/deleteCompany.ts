import express from "express";
import log4js from "log4js";
import mysql from "mysql2/promise";
import fs from "fs";
import { db_setting } from "../db/setting";

const router = express.Router();
const logger = log4js.getLogger();

export default router.delete("/delete", async (req, res) => {
    logger.info(`Access to /company/delete`);
    let connection: any;
    try {
        connection = await mysql.createConnection(db_setting);
        await connection.beginTransaction();
        if (!req.body.id) {
            res.status(401).send("パラメータが不足しています。");
            return;
        }
        
        const [] = await connection.execute(`DELETE FROM companys WHERE id = ${req.body.id}`);
        const [] = await connection.execute(`DROP TABLE IF EXISTS point_${req.body.id}`);
        /*
        const [] = await connection.execute(`DROP TABLES IF EXISTS receiptCampaign_${req.body.uid}`);
        const [] = await connection.execute(`DROP TABLES IF EXISTS shoppingRally_${req.body.uid}`);
        const [] = await connection.execute(`DROP TABLES IF EXISTS instantWin_${req.body.uid}`);
        const [] = await connection.execute(`DROP TABLES IF EXISTS oneTouch_${req.body.uid}`);
        if (fs.existsSync(`config/${req.body.uid}`)){
            fs.rmdirSync(`config/${req.body.uid}`, { recursive: true });
        }
        if (fs.existsSync(`config/adminInfo_${req.body.uid}.json`)){
            fs.unlinkSync(`config/adminInfo_${req.body.uid}.json`);
        }
        */
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
        return;
    }
});