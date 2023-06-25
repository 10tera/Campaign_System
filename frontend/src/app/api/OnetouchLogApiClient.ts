import { useQuery } from "react-query";
import axios from "axios";

const apiHost = process.env.REACT_APP_APIHOST;
axios.defaults.headers.post["Access-Control-Allow-Origin"] = '*';
axios.defaults.headers.post["Content-Type"] = "application/json";

type DeleteOneTouchLogType = {
    id: number,
}
type CreateOneTouchLogType = {
    uid:string,
    prizeId:number,
}
type GetUserPointType = {
    companyId:number,
    uid:string,
}

const GetUserPoint = async({companyId,uid}:GetUserPointType) => {
    const res = await axios.get(`${apiHost}/onetouchlog/getUserPoint`,{
        params:{
            companyId:companyId,
            uid:uid
        }
    }).catch((e) => {
        throw e;
    });
    return res.data;
};
export const OneTouchLogGetUserPoint = (props:GetUserPointType) => GetUserPoint(props);

const DeleteOneTouchLog = async ({ id }: DeleteOneTouchLogType) => {
    const res = await axios.delete(`${apiHost}/onetouchlog/delete`, {
        data: {
            id: id
        }
    }).catch((e) => {
        throw e;
    });
    return res.data;
};
export const OneTouchLogDelete = (props: DeleteOneTouchLogType) => DeleteOneTouchLog(props);

const GetAllOneTouchLog = async () => {
    const res = await axios.get(`${apiHost}/onetouchlog/getAll`).catch((e) => {
        throw e;
    });
    return res.data;
}
export const OneTouchLogGetAll = () => useQuery("oneTouchLogGetAll", GetAllOneTouchLog);

const CreateOneTouchLog = async ({uid,prizeId}: CreateOneTouchLogType) => {
    const res = await axios.post(`${apiHost}/onetouchlog/create`, {
        uid:uid,
        prizeId:prizeId
    }).catch((e) => {
        throw e;
    });
    return res.data;
};
export const OneTouchLogCreate = (props: CreateOneTouchLogType) => CreateOneTouchLog(props);