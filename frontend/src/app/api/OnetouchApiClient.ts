import { useQuery } from "react-query";
import axios from "axios";

const apiHost = process.env.REACT_APP_APIHOST;
axios.defaults.headers.post["Access-Control-Allow-Origin"] = '*';
axios.defaults.headers.post["Content-Type"] = "application/json";

type CreateOneTouchType = {
    companyId:number,
    title:string,
    description:string,
    point:number,
}
type DeleteOneTouchType = {
    id:number,
}

const DeleteOneTouch = async({id}:DeleteOneTouchType) => {
    const res = await axios.delete(`${apiHost}/onetouch/delete`,{
        data:{
            id:id
        }
    }).catch((e) => {
        throw e;
    });
    return res.data;
};
export const OneTouchDelete = (props:DeleteOneTouchType) => DeleteOneTouch(props);

const GetAllOneTouch = async() => {
    const res = await axios.get(`${apiHost}/onetouch/getAll`,{

    }).catch((e) => {
        throw e;
    });
    return res.data;
};
export const OneTouchGetAll = () => useQuery("OneTouchGetAll",GetAllOneTouch);

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