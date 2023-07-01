import express from "express";
import log4js from "log4js";
import mysql,{Pool} from "mysql2/promise";
import fs from "fs";

const router = express.Router();
const logger = log4js.getLogger();

export default router.delete("/delete", async (req, res) => {
    logger.info(`Access to /instantWin/delete`);
    let connection: any;
    try {
        const pool: Pool = req.app.locals.pool;
        connection = await pool.getConnection();
        await connection.beginTransaction();
        if (!req.body.companyId) {
            res.status(401).send("パラメータが不足しています。");
            return;
        }

        const [] = await connection.query(`DROP TABLE IF EXISTS instantwin_${req.body.companyId.toString()}`);

        if (fs.existsSync(`config/instantwin/${req.body.companyId.toString()}.json`)) {
            fs.unlinkSync(`config/instantwin/${req.body.companyId.toString()}.json`);
        }
        if (fs.existsSync(`config/instantwin/${req.body.companyId.toString()}`)) {
            fs.rmdirSync(`config/instantwin/${req.body.companyId.toString()}`, { recursive: true });
        }

        await connection.commit();
        res.status(200).send("削除完了");
    } catch (e) {
        if(connection){
            await connection.rollback();
        }
        logger.error(e);
        res.status(401).send("何らかのエラーが発生しました。")
    } finally {
        if (connection) {
            connection.release();
        }
    }
});