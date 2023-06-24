import express from "express";
import log4js from "log4js";
import mysql from "mysql2/promise";
import fs from "fs";
import { db_setting } from "../db/setting";
import {AdminInfoType} from "../types/adminInfo";

const router = express.Router();
const logger = log4js.getLogger();

export default router.post("/add", async (req, res) => {
    logger.info(`Access to /company/add`);
    let connection: any;
    try {
        if(!req.body.name){
            res.status(401).send("パラメータが不足しています。");
            return;
        }
        connection = await mysql.createConnection(db_setting);
        await connection.beginTransaction();
        const [row,fields] = await connection.execute(`INSERT INTO companys (name) values ('${req.body.name}')`);
        const [] = await connection.execute(`CREATE TABLE point_${row.insertId.toString()}(id int AUTO_INCREMENT PRIMARY KEY, uid varchar(255) not null, point int default 0 not null)`);
        await connection.commit();
        res.status(200).send("登録が完了しました。");
        return;
    } catch (e) {
        await connection.rollback();
        logger.error(e);
        res.status(401).send("何らかのエラーが発生しました。");
    } finally{
        return;
    }
});