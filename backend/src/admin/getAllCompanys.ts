import express from "express";
import log4js from "log4js";
import mysql,{Pool} from "mysql2/promise";

const router = express.Router();
const logger = log4js.getLogger();

export default router.get("/getAllCompanys", async (req, res) => {
    logger.info(`Access to /company/getAllCompanys`);
    let connection;
    try {
        const pool:Pool = req.app.locals.pool;
        connection = await pool.getConnection();
        
        const [row, fields] = await connection.query(`SELECT * from companys`);
        res.status(200).send(row);
        return;
    } catch (e) {
        logger.error(e);
        res.status(401).send(`何らかのエラーが発生しました。${e}`);
        return;
    }finally{
        if (connection) {
            connection.release();
        }
    }
});