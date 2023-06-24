import express from "express";
import log4js from "log4js";
import mysql from "mysql2/promise";
import fs from "fs";
import { db_setting } from "../db/setting";

const router = express.Router();
const logger = log4js.getLogger();

export default router.delete("/delete", async (req, res) => {
    logger.info(`Access to /shoppingRally/delete`);
    let connection: any;
    try {
        if (!("companyId" in req.body)) {
            res.status(401).send("パラメータが不足しています。");
            return;
        }
        connection = await mysql.createConnection(db_setting);
        await connection.beginTransaction();
        const [] = await connection.execute(`DROP TABLE IF EXISTS shoppingrally_${req.body.companyId.toString()}`);

        if (fs.existsSync(`config/shoppingRally/${req.body.companyId.toString()}.json`)) {
            fs.unlinkSync(`config/shoppingRally/${req.body.companyId.toString()}.json`);
        }
        if (fs.existsSync(`config/shoppingRally/${req.body.companyId.toString()}`)) {
            fs.rmdirSync(`config/shoppingRally/${req.body.companyId.toString()}`, { recursive: true });
        }
        if (fs.existsSync(`config/shoppingRally/${req.body.companyId.toString()}.png`)){
            fs.unlinkSync(`config/shoppingRally/${req.body.companyId.toString()}.png`);
        }
        await connection.commit();
        res.status(200).send("削除完了");
    } catch (e) {
        await connection.rollback();
        logger.error(e);
        res.status(401).send("何らかのエラーが発生しました。")
    } finally {
        return;
    }
});