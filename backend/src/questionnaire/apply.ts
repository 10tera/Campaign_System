import express from "express";
import log4js from "log4js";
import mysql,{Pool} from "mysql2/promise";
import dayjs from "dayjs";
import fs from "fs";



const router = express.Router();
const logger = log4js.getLogger();

export default router.post("/apply", async (req, res) => {
    logger.info(`Access to /questionnaire/apply`);
    let connection: any;
    try {
        if (!("companyId" in req.body && "uid" in req.body && "answers" in req.body)) {
            res.status(401).send("パラメータが不足しています");
            return;
        }
        const pool: Pool = req.app.locals.pool;
        connection = await pool.getConnection();
        await connection.beginTransaction();
        const [row] = await connection.query(`SELECT * from questionnaire_${req.body.companyId.toString()} where uid = ? limit 1`, [req.body.uid]);
        if (row.length !== 0) {
            res.status(401).send("既に応募済みです。");
            return;
        }
        const nowDate = dayjs();
        let insertStr_key = "";
        let insertStr_value = "";
        for(let i=0;i<req.body.answers.length;i++){
            insertStr_key += `question${req.body.answers[i].id}, `;
            insertStr_value += `${req.body.answers[i].answer}, `
        }
        const [] = await connection.query(`INSERT INTO questionnaire_${req.body.companyId.toString()} (uid, ${insertStr_key} date) values ('${req.body.uid}', ${insertStr_value} '${nowDate.format()}')`);
        fs.readFile(`config/questionnaire/${req.body.companyId.toString() }.json`,{encoding:"utf-8"},async(err,file) => {
            if(err){
                logger.error(err);
                await connection.rollback();
                return;
            }
            const jsonData = JSON.parse(file);
            const point = jsonData.point;
            if(!(Number.isInteger(point) && point > 0)){
                await connection.commit();
                res.status(200).send("応募完了");
                return;
            }
            const [row_point] = await connection.query(`SELECT * from point_${req.body.companyId.toString()} where uid = ? limit 1`,[req.body.uid]);
            if(row_point.length === 0){
                const [] = await connection.query(`INSERT INTO point_${req.body.companyId.toString()} (uid, point) values ('${req.body.uid}', ${point})`);
            }
            else{
                const [] = await connection.query(`update point_${req.body.companyId.toString()} set point = ${row_point[0].point + point}`);
            }
            await connection.commit();
            res.status(200).send("応募完了");
        });
    } catch (e) {
        if(connection){
            await connection.rollback();
        }
        logger.error(e);
        res.status(401).send("エラーが発生しました");
        return;
    } finally {
        if (connection) {
            connection.release();
        }
    }
});