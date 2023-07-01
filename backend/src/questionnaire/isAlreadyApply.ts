import express from "express";
import log4js from "log4js";
import mysql,{Pool} from "mysql2/promise";

const router = express.Router();
const logger = log4js.getLogger();

export default router.get("/isAlreadyApply", async (req, res) => {
    logger.info(`Access to /questionnaire/isAlreadyApply`);
    let connection;
    try {
        if (!("companyId" in req.query && "uid" in req.query)) {
            res.status(401).send("パラメータが不足しています");
            return;
        }
        const pool: Pool = req.app.locals.pool;
        connection = await pool.getConnection();
        const companyId = req.query?.companyId?.toString()
        const [row] = await connection.query(`SELECT * from questionnaire_${companyId} where uid = ? limit 1`, [req.query.uid]);
        res.status(200).send(row);
    } catch (e) {
        logger.error(e);
        res.status(401).send("エラーが発生しました");
        return;
    } finally {
        if (connection) {
            connection.release();
        }
    }
});