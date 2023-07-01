import express from "express";
import log4js from "log4js";
import mysql,{Pool} from "mysql2/promise";

const router = express.Router();
const logger = log4js.getLogger();

export default router.put("/changeUserState", async (req, res) => {
    logger.info(`Access to /shoppingRally/changeUserState`);
    let connection: any;
    try {
        if (!("companyId" in req.body && "uid" in req.body && "state" in req.body && "key" in req.body && "comment" in req.body)) {
            res.status(401).send("パラメータが不足しています。");
            return;
        }
        const pool: Pool = req.app.locals.pool;
        connection = await pool.getConnection();
        await connection.beginTransaction();
        const [] = await connection.query(`update shoppingrally_${req.body.companyId} set ${req.body.key} = ${req.body.state}, comment = '${req.body.comment}' where uid = '${req.body.uid}'`);
        await connection.commit();
        res.status(200).send("更新完了");
        return;
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