import express from "express";
import log4js from "log4js";
import fs from "fs";

const router = express.Router();
const logger = log4js.getLogger();

export default router.put("/changeActive", async (req, res) => {
    logger.info(`Access to /receiptCampaign/changeActive`);
    try {
        if (!(req.body.companyId)) {
            res.status(401).send("パラメータが不足しています。");
            return;
        }
        const roadFile = fs.readFileSync(`config/receiptCampaign/${req.body.companyId.toString()}.json`,"utf-8");
        const roadJsonFile = JSON.parse(roadFile);
        roadJsonFile.isActive = req.body.isActive;
        const afterData = JSON.stringify(roadJsonFile,undefined,4);
        fs.writeFile(`config/receiptCampaign/${req.body.companyId.toString()}.json`,afterData,{encoding: "utf-8"},(err) => {
            if(err){
                res.status(401).send("書き込み時にエラーが発生しました。");
                return;
            }
            res.status(200).send("更新完了");
            return;
        });
    } catch (e) {
        logger.error(e);
        res.status(401).send("何らかのエラーが発生しました。");
    } finally {
        return;
    }

});