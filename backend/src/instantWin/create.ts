import express from "express";
import log4js from "log4js";
import mysql,{Pool} from "mysql2/promise";
import fs from "fs";

const router = express.Router();
const logger = log4js.getLogger();

export default router.post("/create", async (req, res) => {
    logger.info(`Access to /instantWin/create`);
    let connection: any;
    try {
        if (!(req.body.data && req.body.data.companyId)) {
            res.status(401).send("パラメータが不足しています。");
            return;
        }
        const dataStr = JSON.stringify(req.body.data, undefined, 4);
        if (fs.existsSync(`config/instantWin/${req.body.data.companyId.toString()}.json`)) {
            res.status(401).send("既に指定された企業ではキャンペーンが開催されています。");
            return;
        }
        fs.mkdirSync(`config/instantWin/${req.body.data.companyId.toString()}`);
        fs.writeFile(`config/instantWin/${req.body.data.companyId.toString()}.json`, dataStr, { encoding: "utf-8" }, async (err) => {
            if (err) {
                logger.error(err);
                res.status(401).send("ファイル作成時にエラーが発生しました。");
                return;
            }
            const pool: Pool = req.app.locals.pool;
            connection = await pool.getConnection();
            await connection.beginTransaction();
            const [] = await connection.query(`CREATE TABLE instantwin_${req.body.data.companyId.toString()}(id int AUTO_INCREMENT PRIMARY KEY, uid varchar(255) not null, imgPath varchar(255) not null, state tinyint not null, comment varchar(255) not null, date varchar(255) not null)`);
            await connection.commit();
            res.status(200).send("作成が完了しました。");
            return;
        });
    } catch (e) {
        if(connection){
            await connection.rollback();
        }
        logger.error(e);
        res.status(401).send("何らかのエラーが発生しました。");
    } finally {
        if (connection) {
            connection.release();
        }
    }
});