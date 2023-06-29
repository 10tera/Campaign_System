import express from "express";
import log4js from "log4js";
import mysql,{Pool} from "mysql2/promise";

const router = express.Router();
const logger = log4js.getLogger();

export default router.get("/login", async (req, res) => {
    logger.info(`Access to /admin/login`);
    let connection;
    try {
        if (!("uid" in req.query && "password" in req.query)) {
            res.status(401).send(`UIDが含まれていません。`);
            return;
        }
        const pool: Pool = req.app.locals.pool;
        connection = await pool.getConnection();
        const [row, fields]:any = await connection.execute(`SELECT * from admin where uid = ? and password = ? limit 1`, [req.query.uid,req.query.password]);
        if (row.length === 0) {
            res.status(401).send({msg: "cannot find"});
            return;
        }
        res.status(200).send(row[0]);
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