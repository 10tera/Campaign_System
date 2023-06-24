import express from "express";
import log4js from "log4js";
import mysql from "mysql2/promise";
import fs from "fs";
import { db_setting } from "../db/setting";

const router = express.Router();
const logger = log4js.getLogger();

export default router.post("/create", async (req, res) => {
    logger.info(`Access to /questionnaire/create`);
    let connection: any;
    try {
        if (!("companyId" in req.body && "isActive" in req.body && "title" in req.body && "description" in req.body && "questions" in req.body && "point" in req.body && req.body.questions.length > 0)) {
            res.status(401).send("パラメータが不足しています。");
            return;
        }
        const dataStr = JSON.stringify(req.body, undefined, 4);
        if (fs.existsSync(`config/questionnaire/${req.body.companyId.toString()}.json`)) {
            res.status(401).send("既に指定された企業ではキャンペーンが開催されています。");
            return;
        }
        let dbInitStr = "";
        for(let i=0;i<req.body.questions.length;i++){
            dbInitStr += `question${req.body.questions[i].id} tinyint not null,`;
        }
        fs.writeFile(`config/questionnaire/${req.body.companyId.toString()}.json`, dataStr, { encoding: "utf-8" }, async (err) => {
            if (err) {
                logger.error(err);
                res.status(401).send("ファイル作成時にエラーが発生しました。");
                return;
            }
            connection = await mysql.createConnection(db_setting);
            await connection.beginTransaction();
            const [] = await connection.execute(`CREATE TABLE questionnaire_${req.body.companyId.toString()}(id int AUTO_INCREMENT PRIMARY KEY, uid varchar(255) not null, ${dbInitStr} date varchar(255) not null)`);
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