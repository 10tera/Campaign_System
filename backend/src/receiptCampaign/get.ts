import express from "express";
import log4js from "log4js";
import mysql,{Pool} from "mysql2/promise";

const router = express.Router();
const logger = log4js.getLogger();

export default router.get("/get", async (req, res) => {
    logger.info(`Access to /receiptCampaign/get`);
    let connection;
    if(!("id" in req.query)){
        res.status(401).send(`キャンペーンidが指定されていません。`);
        return;
    }
    try {
        const pool: Pool = req.app.locals.pool;
        connection = await pool.getConnection();
        const id = req.query.id?.toString();
        const [row, fields] = await connection.query<mysql.RowDataPacket[]>(`SELECT * from receiptcampaign_${id}`);
        res.status(200).send(row);
        return;
    } catch (e) {
        logger.error(e);
        res.status(401).send(`何らかのエラーが発生しました。${e}`);
        return;
    } finally {
        if (connection) {
            connection.release();
        }
    }
});