import express from "express";
import log4js from "log4js";
import mysql,{Pool} from "mysql2/promise";

const router = express.Router();
const logger = log4js.getLogger();

export default router.post("/create", async (req, res) => {
    logger.info(`Access to /onetouch/create`);
    let connection: any;
    try {
        if (!("companyId" in req.body && "title" in req.body && "description" in req.body && "point" in req.body)) {
            res.status(401).send("パラメータが不足しています。");
            return;
        }
        if(!(Number.isInteger(req.body.point) && req.body.point > 0)){
            res.status(401).send("pointパラメータが不正です。");
            return;
        }
        const pool: Pool = req.app.locals.pool;
        connection = await pool.getConnection();
        await connection.beginTransaction();
        const [] = await connection.query(`INSERT INTO onetouch (companyId, title, description, point) values(${req.body.companyId}, '${req.body.title}', '${req.body.description}', ${req.body.point})`);
        await connection.commit();
        res.status(200).send("作成が完了しました。");
        return;
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