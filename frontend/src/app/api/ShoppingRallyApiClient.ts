import { useQuery } from "react-query";
import axios from "axios";
import jssha from "jssha";

const apiHost = process.env.REACT_APP_APIHOST;
axios.defaults.headers.post["Access-Control-Allow-Origin"] = '*';
axios.defaults.headers.post["Content-Type"] = "application/json";

type DeleteShoppingRallyType = {
    companyId:number;
};
type ChangeActiveShoppingRallyType = {
    isActive:boolean,
    companyId:number,
};
type GetShoppingRallyType = {
    companyId:number,
};
type GetUserInfoShoppingRallyType = {
    uid:string | undefined,
    companyId:number,
};
type GetStampImgShoppingRallyType = {
    companyId:number,
};
type GetReceiptImgByUserPathType = {
    companyId:number,
    path:string,
};
type ChangeUserStateShoppingRallyType = {
    companyId:number,
    uid:string,
    state:number,
    key:string,
    comment:string,
};

const ChangeUserStateShoppingRally = async ({companyId,uid,state,key,comment}: ChangeUserStateShoppingRallyType) => {
    const res = await axios.put(`${apiHost}/shoppingRally/changeUserState`,{
        companyId:companyId,
        uid:uid,
        state:state,
        key:key,
        comment:comment
    }).catch((e) => {
        throw e;
    });
    return res.data;
}
export const shoppingRallyChangeUserState = (props:ChangeUserStateShoppingRallyType) => ChangeUserStateShoppingRally(props);

const GetReceiptImgByUserPath = async({companyId,path}:GetReceiptImgByUserPathType) => {
    const res = await axios.get(`${apiHost}/shoppingRally/getReceiptImg`,{
        params:{
            companyId:companyId,
            path:path
        }
    }).catch((e) => {
        throw e;
    });
    return res.data;
};
export const shoppingRallyGetReceiptImg = (props:GetReceiptImgByUserPathType) => GetReceiptImgByUserPath(props);

const ApplyShoppingRally = async (formData: FormData) => {
    const res = await axios.post(`${apiHost}/shoppingRally/apply`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    }).catch((e) => {
        throw e;
    });
    return res.data;
}
export const shoppingRallyApply = (props: FormData) => ApplyShoppingRally(props);

const GetStampImgShoppingRally = async({companyId}:GetStampImgShoppingRallyType) => {
    const res = await axios.get(`${apiHost}/shoppingRally/getStampImg`,{
        params:{
            companyId:companyId
        }
    });
    return res.data;
}
export const shoppingRallyGetStampImg = (props: GetStampImgShoppingRallyType) => useQuery("shoppingRallyGetStampImg",() => GetStampImgShoppingRally(props));

const GetUserInfoShoppingRally = async ({ uid, companyId }: GetUserInfoShoppingRallyType) => {
    if (!uid) {
        return [];
    }
    const res = await axios.get(`${apiHost}/shoppingRally/getUserInfo`, {
        params: {
            uid: uid,
            companyId:companyId
        }
    }).catch((e) => {
        throw e;
    });
    return res.data;
}
export const shoppingRallyGetUserInfo = (props: GetUserInfoShoppingRallyType) => useQuery("shoppingRallyGetUserInfo", () => GetUserInfoShoppingRally(props));
export const shoppingRallyGetUserInfo_NoQuery = (props: GetUserInfoShoppingRallyType) => GetUserInfoShoppingRally(props);

const GetShoppingRally = async ({ companyId }: GetShoppingRallyType) => {
    if (companyId === 0 || !companyId) {
        return [];
    }
    const res = await axios.get(`${apiHost}/shoppingRally/get`, {
        params: {
            companyId: companyId
        }
    });
    return res.data;
}
export const shoppingRallyGet = (props: GetShoppingRallyType) => GetShoppingRally(props);

const ChangeActiveShoppingRally = async ({ isActive, companyId }: ChangeActiveShoppingRallyType) => {
    const res = await axios.put(`${apiHost}/shoppingRally/changeActive`, {
        isActive: isActive,
        companyId: companyId
    }).catch((e) => {
        throw e;
    });
    return res.data;
}
export const shoppingRallyChangeActive = (props: ChangeActiveShoppingRallyType) => ChangeActiveShoppingRally(props);

const DeleteShoppingRally = async ({ companyId }: DeleteShoppingRallyType) => {
    const res = await axios.delete(`${apiHost}/shoppingRally/delete`, {
        data:{
            companyId:companyId
        }
    }).catch((e) => {
        throw e;
    });
    return res.data;
}
export const shoppingRallyDelete = (props: DeleteShoppingRallyType) => DeleteShoppingRally(props);

const GetAllShoppingRally = async () => {
    const res = await axios.get(`${apiHost}/shoppingRally/getAll`);
    return res.data;
}
export const shoppingRallyGetAll = () => useQuery("shoppingRallyGetAll", GetAllShoppingRally);

const CreateShoppingRally = async(formData:FormData) => {
    const res = await axios.post(`${apiHost}/shoppingRally/create`,formData,{
        headers:{
            "Content-Type": "multipart/form-data",
        }
    }).catch((e) => {
        throw e;
    });
    return res.data;
};
export const shoppingRallyCreate = (props:FormData) => CreateShoppingRally(props);