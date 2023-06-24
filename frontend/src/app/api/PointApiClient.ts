import { useQuery } from "react-query";
import axios from "axios";

const apiHost = "http://localhost:3100";
axios.defaults.headers.post["Access-Control-Allow-Origin"] = '*';
axios.defaults.headers.post["Content-Type"] = "application/json";

type GetAllUserPointType = {
    companyId:number,
}

const GetAllUserPoint = async({companyId}:GetAllUserPointType) => {
    const res = await axios.get(`${apiHost}/point/getAll`,{
        params:{
            companyId:companyId
        }
    }).catch((e) => {
        throw e;
    });
    return res.data;
};
export const PointGetAllUser = (props:GetAllUserPointType) => GetAllUserPoint(props);