import express from "express";
import log4js from "log4js";
import fs from "fs";

const router = express.Router();
const logger = log4js.getLogger();

export default router.get("/getAll", async (req, res) => {
    logger.info(`Access to /questionnaire/getAll`);
    try {
        let data: any = [];
        fs.readdir(`config/questionnaire`, (err, files) => {
            if (err) {
                logger.error(err);
                res.status(401).send(`ファイル読み込み時にエラーが発生しました。`);
                return;
            }
            files.forEach(file => {
                if (file.endsWith(".json") || file.endsWith(".JSON")) {
                    const fileData = fs.readFileSync(`config/questionnaire/${file}`, "utf-8");
                    const fileJsonData = JSON.parse(fileData);
                    data.push(fileJsonData);
                }
            })
            res.status(200).send(data);
            return;
        });

    } catch (e) {
        logger.error(e);
        res.status(401).send(`何らかのエラーが発生しました。${e}`);
        return;
    }
});