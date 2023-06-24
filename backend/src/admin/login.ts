import express from "express";
import log4js from "log4js";
import mysql from "mysql2/promise";
import { db_setting } from "../db/setting";

const router = express.Router();
const logger = log4js.getLogger();

export default router.get("/login", async (req, res) => {
    logger.info(`Access to /admin/login`);
    let connection:any;
    try {
        if (!(req.query.uid && req.query.password)) {
            res.status(401).send(`UIDが含まれていません。`);
            return;
        }
        connection = await mysql.createConnection(db_setting);
        const [row, fields] = await connection.execute(`SELECT * from admin where uid = ? and password = ? limit 1`, [req.query.uid,req.query.password]);
        if (row.length === 0) {
            res.status(401).send({msg: "cannot find"});
            await connection.end()
            return;
        }
        res.status(200).send(row[0]);
        await connection.end();
        return;
    } catch (e) {
        logger.error(e);
        res.status(401).send(`何らかのエラーが発生しました。${e}`);
        if (connection) {
            await connection.end();
        }
        return;
    }
});