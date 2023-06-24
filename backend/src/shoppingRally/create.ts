import express from "express";
import log4js from "log4js";
import mysql from "mysql2/promise";
import fs from "fs";
import multer from "multer";
import { db_setting } from "../db/setting";

const router = express.Router();
const logger = log4js.getLogger();
const upload = multer({ dest: "uploadDist/" });

export default router.post("/create", upload.single("img"), async (req, res) => {
    logger.info(`Access to /shoppingRally/create`);
    let connection: any;
    try {
        if (!(req.file && req.body && req.body.companyId && req.body.title && req.body.description)) {
            res.status(401).send("パラメータが不足しています。");
            return;
        }
        const jsonData:any = {};
        jsonData.isActive = false;
        jsonData.title = req.body.title;
        jsonData.description = req.body.description;
        jsonData.companyId = Number(req.body.companyId);
        const dataStr = JSON.stringify(jsonData, undefined, 4);
        if (fs.existsSync(`config/shoppingRally/${req.body.companyId}.json`)) {
            res.status(401).send("既に指定された企業ではキャンペーンが開催されています。");
            return;
        }
        fs.mkdirSync(`config/shoppingRally/${req.body.companyId.toString()}`);
        fs.renameSync(`uploadDist/${req.file.filename}`,`config/shoppingRally/${req.body.companyId}.png`);
        fs.writeFile(`config/shoppingRally/${req.body.companyId}.json`, dataStr, { encoding: "utf-8" }, async (err) => {
            if (err) {
                logger.error(err);
                res.status(401).send("ファイル作成時にエラーが発生しました。");
                return;
            }
            connection = await mysql.createConnection(db_setting);
            await connection.beginTransaction();
            const [] = await connection.execute(`CREATE TABLE shoppingrally_${req.body.companyId}(id int AUTO_INCREMENT PRIMARY KEY, uid varchar(255) not null, state1 tinyint not null, state2 tinyint not null, state3 tinyint not null, comment varchar(255) not null, date varchar(255) not null)`);
            await connection.commit();
            res.status(200).send("作成が完了しました。");
            return;
        });
    } catch (e) {
        await connection.rollback();
        logger.error(e);
        res.status(401).send("何らかのエラーが発生しました。");
    } finally {
        if (connection) {
            await connection.end();
        }
    }
});