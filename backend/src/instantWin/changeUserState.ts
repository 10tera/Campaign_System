import express from "express";
import log4js from "log4js";
import mysql from "mysql2/promise";
import fs from "fs";
import { db_setting } from "../db/setting";

const router = express.Router();
const logger = log4js.getLogger();

const isHit = (p:number) => {
    const randomN = Math.random() * 100;
    console.log(randomN);
    console.log(p);
    return randomN <= p;
}

export default router.put("/changeUserState", async (req, res) => {
    logger.info(`Access to /instantWin/changeUserState`);
    let connection: any;
    try {
        if (!(req.body.companyId && req.body.id && req.body.state)) {
            res.status(401).send("パラメータが不足しています。");
            return;
        }
        connection = await mysql.createConnection(db_setting);
        await connection.beginTransaction();
        if(req.body.state === 1){
            const [] = await connection.execute(`update instantwin_${req.body.companyId} set state = 1, comment = '${req.body.comment}' where id = ${req.body.id}`);
            await connection.commit();
            res.status(200).send("更新完了");
            return;
        }
        const [row] = await connection.execute(`select * from instantwin_${req.body.companyId} where id = ${req.body.id}`);
        if(row.length < 1){
            res.status(401).send("DBに存在しません。");
            return;
        }
        if(row[0].state === 2 || row[0].state === 3){
            res.status(401).send("既に抽選済み");
            return;
        }
        if(!fs.existsSync(`config/instantWin/${req.body.companyId}.json`)){
            res.status(401).send("ファイルが存在しません。");
            return;
        }
        fs.readFile(`config/instantWin/${req.body.companyId}.json`,"utf-8",async(err,file) => {
            if(err){
                logger.error(err);
                res.status(401).send("何らかのエラーが発生しました。");
                return;
            }
            const jsonData = JSON.parse(file);
            if(jsonData.limit < 1){
                res.status(401).send("当選数制限です。");
                return;
            }
            const result = isHit(jsonData.probability);
            console.log(result)
            if(result){
                const [] = await connection.execute(`update instantwin_${req.body.companyId} set state = 2, comment = '${req.body.comment}' where id = ${req.body.id}`);
                jsonData.limit--;
                const after = JSON.stringify(jsonData, undefined, 4);
                fs.writeFile(`config/instantWin/${req.body.companyId}.json`, after, async (err2) => {
                    if (err2) {
                        logger.error(err2);
                        res.status(401).send("何らかのエラーが発生しました。");
                        return;
                    }
                    await connection.commit();
                    res.status(200).send("更新完了");
                    return;
                });
            }
            else{
                const [] = await connection.execute(`update instantwin_${req.body.companyId} set state = 3, comment = '${req.body.comment}' where id = ${req.body.id}`);
                await connection.commit();
                res.status(200).send("更新完了");
                return;
            }
            
        });
        
    } catch (e) {
        logger.error(e);
        await connection.rollback();
        res.status(401).send("何らかのエラーが発生しました。");
    } finally {
        if (connection) {
            await connection.end();
        }
    }

});