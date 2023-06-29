import express from "express";
import log4js from "log4js";
import dotenv from "dotenv";
import cors from "cors";
import mysql from "mysql2";
import {createPool} from "mysql2/promise";
import { db_setting } from "./db/setting";
import { db_pool_setting } from "./db/setting";
import cluster from "cluster";
import os from "os";

import addProfile from "./user/addProfile";
import setProfile from "./user/setProfile";
import deleteProfile from "./user/deleteProfile";
import getProfile from "./user/getProfile";
import getAllProfile from "./user/getAll";

import addCompany from "./admin/addCompany";
import deleteCompany from "./admin/deleteCompany";
import login from "./admin/login";
import getAllCompanys from "./admin/getAllCompanys";

import create from "./receiptCampaign/create";
import getAll from "./receiptCampaign/getAll";
import get from "./receiptCampaign/get";
import changeActive from "./receiptCampaign/changeActive";
import _delete from "./receiptCampaign/delete";
import getUserInfoReceipt from "./receiptCampaign/getUserInfo";
import apply from "./receiptCampaign/apply";
import reApply from "./receiptCampaign/reApply";
import changeUserState from "./receiptCampaign/changeUserState";

import create_instantWin from "./instantWin/create";
import getAll_instantWin from "./instantWin/getAll";
import get_instantWin from "./instantWin/get";
import changeActive_instantWin from "./instantWin/changeActive";
import _delete_instantWin from "./instantWin/delete";
import getUserInfoReceipt_instantWin from "./instantWin/getUserInfo";
import apply_instantWin from "./instantWin/apply";
import reApply_instantWin from "./instantWin/reApply";
import changeUserState_instantWin from "./instantWin/changeUserState";

import create_shoppingRally from "./shoppingRally/create";
import getAll_shoppingRally from "./shoppingRally/getAll";
import delete_shoppingRally from "./shoppingRally/delete";
import changeActive_shoppingRally from "./shoppingRally/changeActive";
import get_shoppingRally from "./shoppingRally/get";
import getUserInfo_shoppingRally from "./shoppingRally/getUserInfo";
import getStampImg_shoppingRally from "./shoppingRally/getStampImg";
import apply_shoppingRally from "./shoppingRally/apply";
import getReceiptImg_shoppingRally from "./shoppingRally/getReceiptImg";
import changeUserState_shoppingRally from "./shoppingRally/changeUserState";

import create_questionnaire from "./questionnaire/create";
import getAll_questionnaire from "./questionnaire/getAll";
import get_questionnaire from "./questionnaire/get";
import _delete_questionnaire from "./questionnaire/delete";
import changeActive_questionnaire from "./questionnaire/changeActive";
import apply_questionnaire from "./questionnaire/apply";
import isAlreadyApply_questionnaire from "./questionnaire/isAlreadyApply";

import create_onetouch from "./onetouch/create";
import _delete_onetouch from "./onetouch/delete";
import getAll_onetouch from "./onetouch/getAll";

import create_onetouchlog from "./onetouchlog/create";
import _delete_onetouchlog from "./onetouchlog/delete";
import getAll_onetouchlog from "./onetouchlog/getAll";
import getUserPoint from "./onetouchlog/getUserPoint";

import getAll_point from "./point/getAll";



dotenv.config();
log4js.configure({
    appenders:{
        stdout: {
            type:"stdout"
        },
        system:{
            type:"dateFile",
            filename: "./logs/system.log",
            pattern: '-yyyy-MM-dd',
            keepFileExt: true,
            daysToKeep: 30
        }
    },
    categories: {
        default: {
            appenders: ['stdout', 'system'],
            level: 'info'
        }
    }
});
const logger = log4js.getLogger();
logger.level = "debug";

const corsOptions = {
    origin: "http://localhost:3000",
}

if(cluster.isPrimary){
    for (let i = 0; i < os.cpus().length;i++){
        cluster.fork();
    }
}
else{
    const pool = createPool(db_pool_setting);

    const app = express();

    app.locals.pool = pool;

    app.use(express.json());
    app.use(cors());
    app.listen(process.env.PORT, () => {
        logger.info(`Start server on port ${process.env.PORT}`);
    });

    app.use("/user", addProfile);
    app.use("/user", setProfile);
    app.use("/user", deleteProfile);
    app.use("/user", getProfile);
    app.use("/user", getAllProfile);

    app.use("/company", addCompany);
    app.use("/company", deleteCompany);
    app.use("/admin", login);
    app.use("/company", getAllCompanys);

    app.use("/receiptCampaign", create);
    app.use("/receiptCampaign", getAll);
    app.use("/receiptCampaign", get);
    app.use("/receiptCampaign", changeActive);
    app.use("/receiptCampaign", _delete)
    app.use("/receiptCampaign", getUserInfoReceipt);
    app.use("/receiptCampaign", apply);
    app.use("/receiptCampaign", reApply);
    app.use("/receiptCampaign", changeUserState)

    app.use("/instantWin", create_instantWin);
    app.use("/instantWin", getAll_instantWin);
    app.use("/instantWin", get_instantWin);
    app.use("/instantWin", changeActive_instantWin);
    app.use("/instantWin", _delete_instantWin)
    app.use("/instantWin", getUserInfoReceipt_instantWin);
    app.use("/instantWin", apply_instantWin);
    app.use("/instantWin", reApply_instantWin);
    app.use("/instantWin", changeUserState_instantWin)

    app.use("/shoppingRally", create_shoppingRally);
    app.use("/shoppingRally", getAll_shoppingRally);
    app.use("/shoppingRally", delete_shoppingRally);
    app.use("/shoppingRally", changeActive_shoppingRally);
    app.use("/shoppingRally", get_shoppingRally);
    app.use("/shoppingRally", getUserInfo_shoppingRally);
    app.use("/shoppingRally", getStampImg_shoppingRally);
    app.use("/shoppingRally", apply_shoppingRally);
    app.use("/shoppingRally", getReceiptImg_shoppingRally);
    app.use("/shoppingRally", changeUserState_shoppingRally);

    app.use("/questionnaire", create_questionnaire);
    app.use("/questionnaire", getAll_questionnaire);
    app.use("/questionnaire", _delete_questionnaire);
    app.use("/questionnaire", get_questionnaire);
    app.use("/questionnaire", changeActive_questionnaire);
    app.use("/questionnaire", apply_questionnaire);
    app.use("/questionnaire", isAlreadyApply_questionnaire);

    app.use("/onetouch", create_onetouch);
    app.use("/onetouch", _delete_onetouch);
    app.use("/onetouch", getAll_onetouch);

    app.use("/onetouchlog", create_onetouchlog);
    app.use("/onetouchlog", _delete_onetouchlog);
    app.use("/onetouchlog", getAll_onetouchlog);
    app.use("/onetouchlog", getUserPoint);

    app.use("/point", getAll_point);
}


/*
const pool = mysql.createPool(db_pool_setting);

    const app = express();

    app.locals.pool = pool;

    app.use(express.json());
    app.use(cors());
    app.listen(process.env.PORT, () => {
        logger.info(`Start server on port ${process.env.PORT}`);
    });

    app.use("/user", addProfile);
    app.use("/user", setProfile);
    app.use("/user", deleteProfile);
    app.use("/user", getProfile);
    app.use("/user", getAllProfile);

    app.use("/company", addCompany);
    app.use("/company", deleteCompany);
    app.use("/admin", login);
    app.use("/company", getAllCompanys);

    app.use("/receiptCampaign", create);
    app.use("/receiptCampaign", getAll);
    app.use("/receiptCampaign", get);
    app.use("/receiptCampaign", changeActive);
    app.use("/receiptCampaign", _delete)
    app.use("/receiptCampaign", getUserInfoReceipt);
    app.use("/receiptCampaign", apply);
    app.use("/receiptCampaign", reApply);
    app.use("/receiptCampaign", changeUserState)

    app.use("/instantWin", create_instantWin);
    app.use("/instantWin", getAll_instantWin);
    app.use("/instantWin", get_instantWin);
    app.use("/instantWin", changeActive_instantWin);
    app.use("/instantWin", _delete_instantWin)
    app.use("/instantWin", getUserInfoReceipt_instantWin);
    app.use("/instantWin", apply_instantWin);
    app.use("/instantWin", reApply_instantWin);
    app.use("/instantWin", changeUserState_instantWin)

    app.use("/shoppingRally", create_shoppingRally);
    app.use("/shoppingRally", getAll_shoppingRally);
    app.use("/shoppingRally", delete_shoppingRally);
    app.use("/shoppingRally", changeActive_shoppingRally);
    app.use("/shoppingRally", get_shoppingRally);
    app.use("/shoppingRally", getUserInfo_shoppingRally);
    app.use("/shoppingRally", getStampImg_shoppingRally);
    app.use("/shoppingRally", apply_shoppingRally);
    app.use("/shoppingRally", getReceiptImg_shoppingRally);
    app.use("/shoppingRally", changeUserState_shoppingRally);

    app.use("/questionnaire", create_questionnaire);
    app.use("/questionnaire", getAll_questionnaire);
    app.use("/questionnaire", _delete_questionnaire);
    app.use("/questionnaire", get_questionnaire);
    app.use("/questionnaire", changeActive_questionnaire);
    app.use("/questionnaire", apply_questionnaire);
    app.use("/questionnaire", isAlreadyApply_questionnaire);

    app.use("/onetouch", create_onetouch);
    app.use("/onetouch", _delete_onetouch);
    app.use("/onetouch", getAll_onetouch);

    app.use("/onetouchlog", create_onetouchlog);
    app.use("/onetouchlog", _delete_onetouchlog);
    app.use("/onetouchlog", getAll_onetouchlog);
    app.use("/onetouchlog", getUserPoint);

    app.use("/point", getAll_point);
*/
