import express from "express";
import log4js from "log4js";
import mysql from "mysql2/promise";
import { db_setting } from "../db/setting";

const router = express.Router();
const logger = log4js.getLogger();

export default router.post("/create", async (req, res) => {
    logger.info(`Access to /onetouchlog/create`);
    let connection: any;
    try {
        if (!("uid" in req.body && "prizeId" in req.body)) {
            res.status(401).send("パラメータが不足しています。");
            return;
        }
        connection = await mysql.createConnection(db_setting);
        await connection.beginTransaction();
        const [row_prize] = await connection.execute(`SELECT * FROM onetouch where id = ${req.body.prizeId}`);
        if(!(row_prize && row_prize.length > 0)){
            res.status(401).send("賞品が存在しません。");
            return;
        }
        const needPoint = row_prize[0].point;
        const companyId = row_prize[0].companyId.toString()
        const [row_userData] = await connection.execute(`SELECT * FROM point_${companyId} where uid = '${req.body.uid}'`);
        if(!(row_userData && row_userData.length > 0)){
            res.status(401).send("ユーザーポイントデータがありません。");
            return;
        }
        const nowPoint = row_userData[0].point;
        if(nowPoint - needPoint < 0){
            res.status(401).send("ポイントが足りません。");
            return;
        }
        const [] = await connection.execute(`UPDATE point_${companyId} set point = ${nowPoint-needPoint} where uid = '${req.body.uid}'`);
        const [] = await connection.execute(`INSERT INTO onetouchlog (uid, prizeId) values('${req.body.uid}', ${req.body.prizeId})`);
        await connection.commit();
        res.status(200).send("作成が完了しました。");
        return;
    } catch (e) {
        await connection.rollback();
        logger.error(e);
        res.status(401).send("何らかのエラーが発生しました。");
    } finally {
        if (connection) {
            await connection.end();
        }
    }
});