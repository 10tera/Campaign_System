import loadtest,{LoadTestOptions} from "loadtest";
import FormData from "form-data";

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
const generateBody_put = () => {
    const formData = new FormData();
    formData.append("img", new Buffer("test"));
    formData.append("prizeId", "0");
    formData.append("uid", (Math.random() * 10000).toString());
    formData.append("campaignId", "19");

    return formData;
}
const options_put: LoadTestOptions = {
    url: "http://localhost:3100/receiptCampaign/apply",
    method: "POST",
    maxRequests: 1,
    concurrency: 1,
    contentType: "application/json",
    body:generateBody_put,
    statusCallback(error, result, latency) {
        if (error) {
            console.error(error)
        }
    },
};
/*
loadtest.loadTest(options,(err:any,result:any) => {
    if(err){
        return console.error(err);
    }
    console.log(result);
});
*/
loadtest.loadTest(options_put, (err: any, result: any) => {
    if (err) {
        return console.error(err);
    }
    console.log(result);
});