import loadtest,{LoadTestOptions} from "loadtest";
import FormData from "form-data";
import fs from "fs";
import axios from "axios";
import autocannon from "autocannon";
import { uid } from 'uid';

const options:LoadTestOptions = {
    url: "http://localhost:3100/company/getAllCompanys",
    method: "GET",
    maxRequests: 10000,
    concurrency: 1000,
    statusCallback(error, result, latency) {
        if(error){
            console.error(error)
        }
    },
};
/*
const generateBody_put = () => {
    const formData = new FormData();
    formData.append("img", new Buffer("test"));
    formData.append("prizeId", "0");
    formData.append("uid", (Math.random() * 10000).toString());
    formData.append("campaignId", "19");
    console.log(formData);
    return formData;
}
*/
const file = fs.readFileSync("test.png");

//TODO:mysqlの再起動時の初期設定の作成、暫定処理として全部をquery/poolに置き換える、その後全体テスト、

const generateAppyRequest = (): any=> {
    const requests = [];
    for(let i=0;i<2000;i++){
        const formData = new FormData();
        formData.append("img", file, {
            filename: "test.png",
            contentType: "img/png",
            knownLength: file.length
        });
        formData.append("prizeId", "0");
        formData.append("uid", uid(32));
        formData.append("campaignId", "41");
        requests.push({
            method:"POST",
            body:formData.getBuffer(),
            headers: {
                "content-type": formData.getHeaders()["content-type"]
            },
        })
    }
    return requests;
}

const option_post_apply: autocannon.Options= {
    url: "http://localhost:3100/receiptCampaign/apply",
    method: "POST",
    connections:100,
    amount:2000,
    duration:0,
    requests:generateAppyRequest()
}
const option_get: autocannon.Options = {
    url:"http://localhost:3100/company/getAllCompanys",
    method: "GET",
    duration: 0,
    connections: 1000,
    amount: 10000
}
/*
autocannon(option_post_apply, (err, result) => {
    if (err) {
        console.error('Error:', err);
    } else {
        console.log('Results:', result);
    }
});
*/
/*
autocannon(option_get, (err, result) => {
    if (err) {
        console.error('Error:', err);
    } else {
        console.log('Results:', result);
    }
});
*/

loadtest.loadTest(options,(err:any,result:any) => {
    if(err){
        return console.error(err);
    }
    console.log(result);
});
