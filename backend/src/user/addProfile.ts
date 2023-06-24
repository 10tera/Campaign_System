import express from "express";
import log4js from "log4js";
import mysql from "mysql2/promise";
import { db_setting } from "../db/setting";

import { isPostCode, isAddress, isName, isFurigana, isPhone, isBirth } from "./logic";


const router = express.Router();
const logger = log4js.getLogger();

export default router.post("/add",async(req,res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Authorization, Accept");
    try {
        logger.info(`Access to /user/add`);
        if (!isPostCode(req.body.postCode)) {
            res.status(401).send("郵便番号が正しくありません。");
            return;
        }
        if (!isAddress(req.body.address)) {
            res.status(401).send("住所が正しくありません。");
            return;
        }
        if (!isName(req.body.name)) {
            res.status(401).send("名前が正しくありません。");
            return;
        }
        if (!isFurigana(req.body.furigana)) {
            res.status(401).send("フリガナが正しくありません。");
            return;
        }
        if (!isPhone(req.body.phone)) {
            res.status(401).send("電話番号が正しくありません。");
            return;
        }
        if (!isBirth(req.body.birth)) {
            res.status(401).send("生年月日が正しくありません。");
            return;
        }
        if (!req.body.uid) {
            res.status(401).send("UIDを検出できませんでした。");
            return;
        }
        if(req.body.isNotice === undefined){
            res.status(401).send("お知らせメールの有無を検出できませんでした。");
            return;
        }
    } catch (e) {
        logger.error(e);
        res.status(401).send("何らかのエラーが発生しました。");
        return;
    }
    let connection:any;
    try {
        connection = await mysql.createConnection(db_setting);
        await connection.beginTransaction();
        if(req.body.isNotice === 0){
            const [row, fields] = await connection.execute(`INSERT INTO users (uid, postCode, address, name, furigana, phone, birth, isNotice) values ('${req.body.uid}', '${req.body.postCode}', '${req.body.address}', '${req.body.name}', '${req.body.furigana}', '${req.body.phone}', '${req.body.birth}', 0)`);
        }
        else{
            const [row, fields] = await connection.execute(`INSERT INTO users (uid, postCode, address, name, furigana, phone, birth) values ('${req.body.uid}', '${req.body.postCode}', '${req.body.address}', '${req.body.name}', '${req.body.furigana}', '${req.body.phone}', '${req.body.birth}')`);
        }
        await connection.commit();
        res.status(200).send("登録完了");
    } catch (e) {
        logger.error(e);
        res.status(401).send("DB操作でエラーが発生しました。");
        await connection?.rollback();
    } finally {
        if (connection) {
            await connection.end();
        }
    }
});