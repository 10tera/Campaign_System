import { useQuery } from "react-query";
import axios from "axios";

const apiHost = "http://localhost:3100";
axios.defaults.headers.post["Access-Control-Allow-Origin"] = '*';
axios.defaults.headers.post["Content-Type"] = "application/json";

type DeleteOneTouchLogType = {
    id: number,
}

const DeleteOneTouchLog = async ({ id }: DeleteOneTouchLogType) => {
    const res = await axios.delete(`${apiHost}/onetouchlog/delete`, {
        data: {
            id: id
        }
    });
    return res.data;
};
export const OneTouchLogDelete = (props: DeleteOneTouchLogType) => DeleteOneTouchLog(props);

const GetAllOneTouchLog = async () => {
    const res = await axios.get(`${apiHost}/onetouchlog/getAll`);
    return res.data;
}
export const OneTouchLogGetAll = () => useQuery("oneTouchLogGetAll", GetAllOneTouchLog);