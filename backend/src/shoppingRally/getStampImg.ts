import express from "express";
import log4js from "log4js";
import mysql from "mysql2/promise";
import fs from "fs";
import { db_setting } from "../db/setting";

const router = express.Router();
const logger = log4js.getLogger();

export default router.get("/getStampImg", async (req, res) => {
    logger.info(`Access to /shoppingRally/getStampImg`);
    try {
        if(!("companyId" in req.query)){
            res.status(401).send("パラメータが不足しています。");
            return;
        }
        const companyId = req.query.companyId?.toString();
        if(fs.existsSync(`config/shoppingRally/${companyId}.png`)){
            const base64Data = fs.readFileSync(`config/shoppingRally/${companyId}.png`, { encoding: "base64" });
            res.status(200).send(base64Data);
            return;
        }
        else{
            res.status(401).send("画像が見つかりませんでした。");
            return;
        }

    } catch (e) {
        logger.error(e);
        res.status(401).send(`何らかのエラーが発生しました。${e}`);
        return;
    }
});