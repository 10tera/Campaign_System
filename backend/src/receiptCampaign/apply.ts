import express from "express";
import log4js from "log4js";
import mysql from "mysql2/promise";
import { db_setting } from "../db/setting";
import multer from "multer";
import dayjs from "dayjs";
import fs from "fs";

const upload = multer({dest:"uploadDist/"});


const router = express.Router();
const logger = log4js.getLogger();

export default router.post("/apply",upload.single("img"),async(req,res) => {
    logger.info(`Access to /receiptCampaign/apply`);
    let connection: any;
    try {
        if(!(req.file && req.body && req.body.prizeId && req.body.uid && req.body.campaignId)){
            console.log(req.body.uid)
            console.log(req.file)
            res.status(401).send("パラメータが不足しています");
            return;
        }
        connection = await mysql.createConnection(db_setting);
        await connection.beginTransaction();
        const [row] = await connection.execute(`SELECT * from receiptcampaign_${req.body.campaignId} where uid = ? limit 1`, [req.body.uid]);
        if(row.length !== 0){
            res.status(401).send("既に応募済みです。");
            return;
        }
        const nowDate = dayjs();
        const [] = await connection.execute(`INSERT INTO receiptcampaign_${req.body.campaignId} (uid, imgPath, state, prize, comment, date) values ('${req.body.uid}', '${req.body.uid}.png', 0, '${req.body.prizeId}', '', '${nowDate.format()}')`);
        fs.rename(`uploadDist/${req.file.filename}`,`config/receiptCampaign/${req.body.campaignId}/${req.body.uid}.png`,async(err) => {
            if(err){
                logger.error(err);
                res.status(401).send("エラーが発生しました");
                return;
            }
            await connection.commit();
            res.status(200).send("応募完了");
        });
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