import express from "express";
import log4js from "log4js";
import mysql from "mysql2/promise";
import fs from "fs";
import { db_setting } from "../db/setting";

const router = express.Router();
const logger = log4js.getLogger();

export default router.post("/create", async (req, res) => {
    logger.info(`Access to /receiptCampaign/create`);
    let connection: any;
    try {
        if (!(req.body.data && req.body.data.companyId)) {
            res.status(401).send("パラメータが不足しています。");
            return;
        }
        const dataStr = JSON.stringify(req.body.data,undefined,4);
        if (fs.existsSync(`config/receiptCampaign/${req.body.data.companyId.toString()}.json`)){
            res.status(401).send("既に指定された企業ではキャンペーンが開催されています。");
            return;
        }
        fs.mkdirSync(`config/receiptCampaign/${req.body.data.companyId.toString()}`);
        fs.writeFile(`config/receiptCampaign/${req.body.data.companyId.toString()}.json`, dataStr, { encoding: "utf-8" },async(err) => {
            if(err){
                logger.error(err);
                res.status(401).send("ファイル作成時にエラーが発生しました。");
                return;
            }
            connection = await mysql.createConnection(db_setting);
            await connection.beginTransaction();
            const [] = await connection.execute(`CREATE TABLE receiptCampaign_${req.body.data.companyId.toString()}(id int AUTO_INCREMENT PRIMARY KEY, uid varchar(255) not null, imgPath varchar(255) not null, state tinyint not null, prize varchar(255) not null, comment varchar(255) not null, date varchar(255) not null)`);
            await connection.commit();
            res.status(200).send("作成が完了しました。");
            return;
        });
        //fs.writeFileSync(`config/receiptCampaign/${req.body.data.companyId.toString()}.json`,dataStr,{encoding: "utf-8"});
    } catch (e) {
        await connection.rollback();
        logger.error(e);
        res.status(401).send("何らかのエラーが発生しました。");
    } finally {
        return;
    }
});