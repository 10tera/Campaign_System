import express from "express";
import log4js from "log4js";
import mysql from "mysql2/promise";
import { db_setting } from "../db/setting";
import fs from "fs";

const router = express.Router();
const logger = log4js.getLogger();

export default router.get("/getReceiptImg", async (req, res) => {
    logger.info(`Access to /shoppingRally/getReceiptImg`);
    try {
        if (!("path" in req.query && "companyId" in req.query)) {
            res.status(401).send(`path/companyIdが指定されていません。`);
            return;
        }
        const path = req.query.path;
        const companyId = req.query.companyId?.toString();
        console.log(path);
        if (fs.existsSync(`config/shoppingRally/${companyId}/${path}`)) {
            const base64Data = fs.readFileSync(`config/shoppingRally/${companyId}/${path}`, { encoding: "base64" });
            res.status(200).send(base64Data);
            return;
        }
        else{
            res.status(401).send("ファイルが存在しません。");
            return;
        }
    } catch (e) {
        logger.error(e);
        res.status(401).send(`何らかのエラーが発生しました。${e}`);
        return;
    }
});