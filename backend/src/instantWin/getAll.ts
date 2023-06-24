import express from "express";
import log4js from "log4js";
import mysql from "mysql2/promise";
import fs from "fs";
import { db_setting } from "../db/setting";

const router = express.Router();
const logger = log4js.getLogger();

export default router.get("/getAll", async (req, res) => {
    logger.info(`Access to /instantWin/getAll`);
    try {
        let data: any = [];
        fs.readdir(`config/instantWin`, (err, files) => {
            if (err) {
                logger.error(err);
                res.status(401).send(`ファイル読み込み時にエラーが発生しました。`);
                return;
            }
            files.forEach(file => {
                if (file.endsWith(".json") || file.endsWith(".JSON")) {
                    const fileData = fs.readFileSync(`config/instantWin/${file}`, "utf-8");
                    const fileJsonData = JSON.parse(fileData);
                    data.push(fileJsonData);
                }
            })
            res.status(200).send(data);
            return;
        });

    } catch (e) {
        logger.error(e);
        res.status(401).send(`何らかのエラーが発生しました。${e}`);
        return;
    }
});