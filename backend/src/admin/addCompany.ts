import express from "express";
import log4js from "log4js";
import mysql,{Pool} from "mysql2/promise";

const router = express.Router();
const logger = log4js.getLogger();

export default router.post("/add", async (req, res) => {
    logger.info(`Access to /company/add`);
    let connection;
    try {
        if(!req.body.name){
            res.status(401).send("パラメータが不足しています。");
            return;
        }
        const pool: Pool = req.app.locals.pool;
        connection = await pool.getConnection();
        await connection.beginTransaction();
        const [row]:any = await connection.query(`INSERT INTO companys (name) values ('${req.body.name}')`);
        await connection.query(`CREATE TABLE point_${row.insertId.toString()}(id int AUTO_INCREMENT PRIMARY KEY, uid varchar(255) not null, point int default 0 not null)`);
        await connection.commit();
        res.status(200).send("登録が完了しました。");
        return;
    } catch (e) {
        if(connection){
            await connection.rollback();
        }
        logger.error(e);
        res.status(401).send("何らかのエラーが発生しました。");
    } finally{
        if(connection){
            connection.release();
        }
        return;
    }
});