import express from "express";
import log4js from "log4js";
import mysql,{Pool} from "mysql2/promise";

const router = express.Router();
const logger = log4js.getLogger();

export default router.get("/getUserInfo", async (req, res) => {
    logger.info(`Access to /shoppingRally/getUserInfo`);
    let connection;
    try {
        if (!("uid" in req.query && "companyId" in req.query)) {
            res.status(401).send(`id/uidが指定されていません。`);
            return;
        }
        const uid = req.query.uid;
        const companyId = req.query.companyId?.toString();
        const pool: Pool = req.app.locals.pool;
        connection = await pool.getConnection();
        const [row, fields] = await connection.query<mysql.RowDataPacket[]>(`SELECT * from shoppingrally_${companyId} where uid = ? limit 1`, [uid]);
        const [row2] = await connection.query<mysql.RowDataPacket[]>(`SELECT * from users where uid = ? limit 1`, [uid])
        if (row.length === 0 || row2.length === 0) {
            res.status(200).send([]);
            return;
        }
        res.status(200).send([{ ...row[0], address: row2[0].address, name: row2[0].name }]);
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