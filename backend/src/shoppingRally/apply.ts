import express from "express";
import log4js from "log4js";
import mysql from "mysql2/promise";
import { db_setting } from "../db/setting";
import multer from "multer";
import dayjs from "dayjs";
import fs from "fs";

const upload = multer({ dest: "uploadDist/" });


const router = express.Router();
const logger = log4js.getLogger();

export default router.post("/apply", upload.single("img"), async (req, res) => {
    logger.info(`Access to /shoppingRally/apply`);
    let connection: any;
    try {
        if (!(req.file && "uid" in req.body && "companyId" in req.body && "key" in req.body)) {
            res.status(401).send("パラメータが不足しています");
            return;
        }
        connection = await mysql.createConnection(db_setting);
        await connection.beginTransaction();
        const [row] = await connection.execute(`SELECT * from shoppingrally_${req.body.companyId} where uid = ? limit 1`, [req.body.uid]);
        if(row.length === 0){
            //0:承認中
            //1:未送付
            //2:承認済み
            //3:却下
            let state1 = 1;
            let state2 = 1;
            let state3 = 1;
            switch (req.body.key) {
                case "img1":
                    state1 = 0;
                    break;
                case "img2":
                    state2 = 0;
                    break;
                case "img3":
                    state3 = 0;
                    break;
                default:
                    res.status(401).send("パラメータが不足しています");
                    return;
            }
            const nowDate = dayjs();
            const [] = await connection.execute(`INSERT INTO shoppingrally_${req.body.companyId} (uid, state1, state2, state3, comment, date) values ('${req.body.uid}', ${state1}, ${state2}, ${state3}, '', '${nowDate.format()}')`);
            fs.rename(`uploadDist/${req.file.filename}`, `config/shoppingRally/${req.body.companyId}/${req.body.uid}_${req.body.key}.png`, async (err) => {
                if (err) {
                    logger.error(err);
                    res.status(401).send("エラーが発生しました");
                    return;
                }
                await connection.commit();
                res.status(200).send("応募完了");
            });
        }
        else{
            let key = "";
            switch (req.body.key) {
                case "img1":
                    key = "state1";
                    break;
                case "img2":
                    key = "state2";
                    break;
                case "img3":
                    key = "state3";
                    break;
                default:
                    res.status(401).send("パラメータが不足しています");
                    return;
            }
            if(!(row[0][key] === 1 || row[0][key] === 3)){
                res.status(401).send("更新はできません。");
                return;
            }
            const [] = await connection.execute(`UPDATE shoppingrally_${req.body.companyId} set ${key} = 0 where uid = '${req.body.uid}'`);
            fs.rename(`uploadDist/${req.file.filename}`, `config/shoppingRally/${req.body.companyId}/${req.body.uid}_${req.body.key}.png`, async (err) => {
                if (err) {
                    logger.error(err);
                    res.status(401).send("エラーが発生しました");
                    return;
                }
                await connection.commit();
                res.status(200).send("再応募完了");
            });
        }
        
    } catch (e) {
        await connection.rollback();
        logger.error(e);
        res.status(401).send("エラーが発生しました");
        return;
    } finally {
        if (connection) {
            await connection.end();
        }
    }
});