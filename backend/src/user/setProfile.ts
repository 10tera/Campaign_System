import express from "express";
import log4js from "log4js";
import mysql from "mysql2/promise";
import { db_setting } from "../db/setting";

const router = express.Router();
const logger = log4js.getLogger();

export default router.put("/set", async (req, res) => {
    logger.info(`Access to /user/set`);
    let connection:any;
    try {
        connection = await mysql.createConnection(db_setting);
        await connection.beginTransaction();
        if(!(req.body.uid && req.body.kind && req.body.value)){
            res.status(401).send("パラメータが不足しています。");
            return;
        }
        if(req.body.kind === "isNotice"){
            const [] = await connection.execute(`UPDATE users SET isNotice = ${Number(req.body.value)} WHERE uid = '${req.body.uid}'`);
        }
        else{
            const [] = await connection.execute(`UPDATE users SET ${req.body.kind} = '${req.body.value}' WHERE uid = '${req.body.uid}'`);
        }
        await connection.commit();
        res.status(200).send("更新完了");
    } catch (e) {
        await connection.rollback();
        logger.error(e);
        res.status(401).send("何らかのエラーが発生しました。");
    } finally{
        return;
    }
    
});