import express from "express";
import log4js from "log4js";
import mysql from "mysql2/promise";
import { db_setting } from "../db/setting";
import fs from "fs";

const router = express.Router();
const logger = log4js.getLogger();

export default router.get("/getUserInfo", async (req, res) => {
    logger.info(`Access to /receiptCampaign/getUserInfo`);
    let connection:any;
    if (!("uid" in req.query && "id" in req.query)) {
        res.status(401).send(`id/uidが指定されていません。`);
        return;
    }
    try {
        connection = await mysql.createConnection(db_setting);
        const id = req.query.id?.toString();
        const [row, fields] = await connection.execute(`SELECT * from receiptcampaign_${id} where uid = ? limit 1`,[req.query.uid]);
        const [row2] = await connection.execute(`SELECT * from users where uid = ? limit 1`,[req.query.uid])
        if(row.length === 0){
            res.status(200).send([]);
            return;
        }
        if(fs.existsSync(`config/receiptCampaign/${id}/${req.query.uid}.png`)){
            const base64Data = fs.readFileSync(`config/receiptCampaign/${id}/${req.query.uid}.png`,{encoding: "base64"});
            res.status(200).send([{ ...row[0], address: row2[0].address, name: row2[0].name,img:base64Data }]);
            return;
        }
        else{
            res.status(200).send([{ ...row[0], address: row2[0].address, name: row2[0].name }]);
            return;
        }
    } catch (e) {
        logger.error(e);
        res.status(401).send(`何らかのエラーが発生しました。${e}`);
        return;
    } finally {
        if (connection) {
            await connection.end();
        }
    }
});