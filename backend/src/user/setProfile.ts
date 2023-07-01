import express from "express";
import log4js from "log4js";
import mysql,{Pool} from "mysql2/promise";

const router = express.Router();
const logger = log4js.getLogger();

export default router.put("/set", async (req, res) => {
    logger.info(`Access to /user/set`);
    let connection:any;
    try {
        const pool: Pool = req.app.locals.pool;
        connection = await pool.getConnection();
        await connection.beginTransaction();
        if(!("uid" in req.body && "kind" in req.body && "value" in req.body)){
            res.status(401).send("パラメータが不足しています。");
            return;
        }
        if(req.body.kind === "isNotice"){
            const [] = await connection.query(`UPDATE users SET isNotice = ${Number(req.body.value)} WHERE uid = '${req.body.uid}'`);
        }
        else{
            const [] = await connection.query(`UPDATE users SET ${req.body.kind} = '${req.body.value}' WHERE uid = '${req.body.uid}'`);
        }
        await connection.commit();
        res.status(200).send("更新完了");
    } catch (e) {
        logger.error(e);
        if(connection){
            await connection.rollback();
        }
        res.status(401).send("何らかのエラーが発生しました。");
    } finally {
        if (connection) {
            connection.release();
        }
    }
});