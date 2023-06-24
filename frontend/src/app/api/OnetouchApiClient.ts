import { useQuery } from "react-query";
import axios from "axios";

const apiHost = "http://localhost:3100";
axios.defaults.headers.post["Access-Control-Allow-Origin"] = '*';
axios.defaults.headers.post["Content-Type"] = "application/json";

type CreateOneTouchType = {
    companyId:number,
    title:string,
    description:string,
    point:number,
}

const CreateOneTouch = async({companyId,title,description,point}:CreateOneTouchType) => {
    const res = await axios.post(`${apiHost}/onetouch/create`,{
        companyId:companyId,
        title:title,
        description:description,
        point:point,
    }).catch((e) => {
        throw e;
    });
    return res.data;
};
export const OneTouchCreate = (props:CreateOneTouchType) => CreateOneTouch(props);