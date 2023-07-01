import express from "express";
import log4js from "log4js";
import mysql,{Pool} from "mysql2/promise";
import multer from "multer";
import fs from "fs";

const upload = multer({ dest: "uploadDist/" });


const router = express.Router();
const logger = log4js.getLogger();

export default router.post("/reApply", upload.single("img"), async (req, res) => {
    logger.info(`Access to /instantWin/reApply`);
    let connection: any;
    try {
        if (!(req.file && req.body && "uid" in req.body && "campaignId" in req.body)) {
            res.status(401).send("パラメータが不足しています");
            return;
        }
        const pool: Pool = req.app.locals.pool;
        connection = await pool.getConnection();
        await connection.beginTransaction();
        const [row, fields] = await connection.query(`SELECT * from instantwin_${req.body.campaignId} where uid = ? and state = 1 limit 1`, [req.body.uid]);
        if (row.length === 0) {
            res.status(401).send("既に応募済みです。");
            return;
        }
        const [] = await connection.query(`UPDATE instantwin_${req.body.campaignId} set state = 0 where uid = '${req.body.uid}'`);
        fs.rename(`uploadDist/${req.file.filename}`, `config/instantwin/${req.body.campaignId}/${req.body.uid}.png`, async (err) => {
            if (err) {
                logger.error(err);
                await connection.rollback();
                res.status(401).send("エラーが発生しました");
                return;
            }
            await connection.commit();
            res.status(200).send("再応募完了");
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