import express from "express";
import log4js from "log4js";
import mysql,{Pool} from "mysql2/promise";
import multer from "multer";
import dayjs from "dayjs";
import fs from "fs";

const upload = multer({dest:"uploadDist/"});


const router = express.Router();
const logger = log4js.getLogger();

export default router.post("/apply",upload.single("img"),async(req,res) => {
    logger.info(`Access to /receiptCampaign/apply`);
    let connection:any;
    try {
        if(!(req.file && req.body && req.body.prizeId && req.body.uid && req.body.campaignId)){
            console.log("err_param")
            console.log(req.body.uid)
            console.log(req.file)
            res.status(401).send("パラメータが不足しています");
            return;
        }
        const pool:Pool = req.app.locals.pool;
        connection = await pool.getConnection();
        await connection.beginTransaction();
        const [row,fields1]:any = await connection.query(`SELECT * from receiptcampaign_${req.body.campaignId} where uid = ? limit 1`, [req.body.uid]);
        
        if(row.length !== 0){
            console.log("3")
            res.status(401).send("既に応募済みです。");
            return;
        }
        
        const nowDate = dayjs();
        const [row2,fields2] = await connection.query(`INSERT INTO receiptcampaign_${req.body.campaignId} (uid, imgPath, state, prize, comment, date) values ('${req.body.uid}', '${req.body.uid}.png', 0, '${req.body.prizeId}', '', '${nowDate.format()}')`);
        fs.rename(`uploadDist/${req.file.filename}`,`config/receiptCampaign/${req.body.campaignId}/${req.body.uid}.png`,async(err) => {
            if(err){
                logger.error(err);
                await connection.rollback();
                res.status(401).send("エラーが発生しました");
                return;
            }
            await connection.commit();
            res.status(200).send("応募完了");
        });
    } catch (e) {
        if(connection){
            await connection.rollback();
        }
        logger.error(e);
        res.status(401).send("エラーが発生しました");
        return;
    } finally {
        if (connection) {
            connection.release();
        }
    }
});