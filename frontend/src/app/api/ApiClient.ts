import {useQuery} from "react-query";
import axios from "axios";
import jssha from "jssha";

const apiHost = "http://localhost:3100";
axios.defaults.headers.post["Access-Control-Allow-Origin"] = '*';
axios.defaults.headers.post["Content-Type"] = "application/json";

type AddProfileType = {
    postCode: string,
    address: string,
    name: string,
    furigana: string,
    phone: string,
    birth: string,
    uid: string,
    isNotice: number,
}

type GetProfileType = {
    uid:string | undefined,
}
type DeleteProfileType = {
    uid:string | undefined,
}
type SetProfileType = {
    uid:string | undefined,
    kind:string,
    value:string,
}
type AddCompanyType = {
    name:string,
}
type DeleteCompanyType = {
    id:number
}
type LoginAdminType = {
    uid:string,
    password:string,
}

type CreateReceiptCampaignType = {
    isActive: boolean,
    title: string,
    description: string,
    companyId: number,
    prizes: {
        id: number,
        title: string,
        description: string,
    }[],
}
type GetReceiptCampaignType = {
    id:number | undefined
}
type ChangeActiveReceiptCampaignType = {
    isActive: boolean,
    companyId:number
}
type DeleteReceiptCampaignType = {
    companyId:number,
}
type GetUserInfoReceiptCampaignType = {
    uid:string | undefined,
    id:number,
}
type ApplyReceiptCampaignType = FormData
type ChangeUserStateReceiptCampaignType = {
    id:number,
    companyId:number,
    state:number,
    comment:string
}

type CreateInstantWinType = {
    isActive: boolean,
    title: string,
    description: string,
    companyId: number,
    probability: number,
    limit: number,
}
type GetInstantWinType = {
    id: number | undefined,
}
type ChangeActiveInstantWinType = {
    isActive: boolean,
    companyId: number,
}
type DeleteInstantWinType = {
    companyId: number,
}
type GetUserInfoInstantWinType = {
    uid: string | undefined,
    id: number,
}
type ChangeUserStateInstantWinType = {
    id: number,
    companyId: number,
    state: number,
    comment: string
}

const ChangeUserStateInstantWin = async ({ id, companyId, state, comment }: ChangeUserStateInstantWinType) => {
    const res = await axios.put(`${apiHost}/instantWin/changeUserState`, {
        id: id,
        companyId: companyId,
        state: state,
        comment: comment
    }).catch((e) => {
        throw e;
    });
    return res.data;
}
export const instantWinChangeUserState = (props: ChangeUserStateInstantWinType) => ChangeUserStateInstantWin(props);


const ReApplyInstantWin = async (formData: FormData) => {
    const res = await axios.post(`${apiHost}/instantWin/reApply`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    }).catch((e) => {
        throw e;
    });
    return res.data;
}
export const instantWinReApply = (props: FormData) => ReApplyInstantWin(props);

const ApplyInstantWin = async (formData: FormData) => {
    const res = await axios.post(`${apiHost}/instantWin/apply`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",

        }
    }).catch((e) => {
        throw e;
    });
    return res.data;
}
export const instantWinApply = (props: FormData) => ApplyInstantWin(props);

const GetUserInfoInstantWin = async ({ uid, id }: GetUserInfoInstantWinType) => {
    if (!uid) {
        return [];
    }
    const res = await axios.get(`${apiHost}/instantWin/getUserInfo`, {
        params: {
            uid: uid,
            id: id
        }
    }).catch((e) => {
        throw e;
    });
    return res.data;
}
export const instantWinGetUserInfo = (props: GetUserInfoInstantWinType) => useQuery("instantWinGetUserInfo", () => GetUserInfoInstantWin(props));
export const instantWinGetUserInfo_NoQuery = (props: GetUserInfoInstantWinType) => GetUserInfoInstantWin(props);

const DeleteInstantWin = async ({ companyId }: DeleteInstantWinType) => {
    const res = await axios.delete(`${apiHost}/instantWin/delete`, {
        data: {
            companyId: companyId
        }
    }).catch((e) => {
        throw e;
    });
    return res.data;
}
export const instantWinDelete = (props: DeleteInstantWinType) => DeleteInstantWin(props);

const ChangeActiveInstantWin = async ({ isActive, companyId }: ChangeActiveInstantWinType) => {
    const res = await axios.put(`${apiHost}/instantWin/changeActive`, {
        isActive: isActive,
        companyId: companyId
    }).catch((e) => {
        throw e;
    });
    return res.data;
}
export const instantWinChangeActive = (props: ChangeActiveInstantWinType) => ChangeActiveInstantWin(props);

const GetInstantWin = async ({ id }: GetInstantWinType) => {
    if (id === 0 || !id) {
        return [];
    }
    const res = await axios.get(`${apiHost}/instantWin/get`, {
        params: {
            id: id
        }
    });
    return res.data;
}
export const instantWinGet = (props: GetInstantWinType) => GetInstantWin(props);

const GetAllInstantWin = async () => {
    const res = await axios.get(`${apiHost}/instantWin/getAll`);
    return res.data;
}
export const instantWinGetAll = () => useQuery("instantWinGetAll", GetAllInstantWin);

const CreateInstantWin = async (props: CreateInstantWinType) => {
    const res = await axios.post(`${apiHost}/instantWin/create`, {
        data: props
    }).catch((e) => {
        throw e;
    });
    return res.data;
}
export const instantWinCreate = (props: CreateInstantWinType) => CreateInstantWin(props);


const ChangeUserStateReceiptCampaign = async({id,companyId,state,comment}:ChangeUserStateReceiptCampaignType) => {
    const res = await axios.put(`${apiHost}/receiptCampaign/changeUserState`,{
        id:id,
        companyId:companyId,
        state:state,
        comment:comment
    }).catch((e) => {
        throw e;
    });
    return res.data;
}
export const ReceiptCampaignChangeUserState = (props:ChangeUserStateReceiptCampaignType) => ChangeUserStateReceiptCampaign(props);


const ReApplyReceiptCampaign = async(formData:ApplyReceiptCampaignType) => {
    const res = await axios.post(`${apiHost}/receiptCampaign/reApply`,formData,{
        headers:{
            "Content-Type": "multipart/form-data",
        }
    }).catch((e) => {
        throw e;
    });
    return res.data;
}
export const receiptCampaignReApply = (props:ApplyReceiptCampaignType) => ReApplyReceiptCampaign(props);

const ApplyReceiptCampaign = async(formData:ApplyReceiptCampaignType) => {
    const res = await axios.post(`${apiHost}/receiptCampaign/apply`,formData,{
        headers:{
            "Content-Type": "multipart/form-data",
            
        }
    }).catch((e) => {
        throw e;
    });
    return res.data;
}
export const receiptCampaignApply = (props:ApplyReceiptCampaignType) => ApplyReceiptCampaign(props);

const GetUserInfoReceiptCampaign = async({uid,id}:GetUserInfoReceiptCampaignType) => {
    if(!uid){
        return [];
    }
    const res = await axios.get(`${apiHost}/receiptCampaign/getUserInfo`,{
        params:{
            uid:uid,
            id:id
        }
    }).catch((e) => {
        throw e;
    });
    return res.data;
}
export const receiptCampaignGetUserInfo = (props: GetUserInfoReceiptCampaignType) => useQuery("receiptCampaignGetUserInfo",() => GetUserInfoReceiptCampaign(props));
export const receiptCampaignGetUserInfo_NoQuery = (props:GetUserInfoReceiptCampaignType) => GetUserInfoReceiptCampaign(props);

const DeleteReceiptCampaign = async({companyId}:DeleteReceiptCampaignType) => {
    const res = await axios.delete(`${apiHost}/receiptCampaign/delete`,{
        data:{
            companyId:companyId
        }
    }).catch((e) => {
        throw e;
    });
    return res.data;
}
export const receiptCampaignDelete = (props:DeleteReceiptCampaignType) => DeleteReceiptCampaign(props);

const ChangeActiveReceiptCampaign = async({isActive,companyId}:ChangeActiveReceiptCampaignType) => {
    const res = await axios.put(`${apiHost}/receiptCampaign/changeActive`,{
        isActive:isActive,
        companyId:companyId
    }).catch((e) => {
        throw e;
    });
    return res.data;
}
export const receiptCampaignChangeActive = (props:ChangeActiveReceiptCampaignType) => ChangeActiveReceiptCampaign(props);

const GetReceiptCampaign = async({id}:GetReceiptCampaignType) => {
    if(id===0 || !id){
        return [];
    }
    const res = await axios.get(`${apiHost}/receiptCampaign/get`,{
        params:{
            id: id
        }
    });
    return res.data;
}
export const receiptCampaignGet = (props:GetReceiptCampaignType) => GetReceiptCampaign(props);

const GetAllReceiptCampaign = async() => {
    const res = await axios.get(`${apiHost}/receiptCampaign/getAll`);
    return res.data;
}
export const receiptCampaignGetAll = () => useQuery("receiptCampaignGetAll",GetAllReceiptCampaign);

const CreateReceiptCampaign = async(props:CreateReceiptCampaignType) => {
    const res = await axios.post(`${apiHost}/receiptCampaign/create`,{
        data:props
    }).catch((e) => {
        throw e;
    });
    return res.data;
}
export const receiptCampaignCreate = (props:CreateReceiptCampaignType) => CreateReceiptCampaign(props);

const addCompany = async ({name}:AddCompanyType) => {
    const res = await axios.post(`${apiHost}/company/add`,{
        name:name
    }).catch((e) => {
        throw e;
    });
    return res.data;
}
export const companyAdd = (props:AddCompanyType) => addCompany(props);

const deleteCompany = async ({id}:DeleteCompanyType) => {
    const res = await axios.delete(`${apiHost}/company/delete`,{
        data:{
            id:id
        }
    }).catch((e) => {
        throw e;
    });
    return res.data;
}
export const companyDelete = (props:DeleteCompanyType) => deleteCompany(props);

const getAllCompanys = async() => {
    const res = await axios.get(`${apiHost}/company/getAllCompanys`);
    return res.data;
}
export const companysGetAll = () => useQuery("companysGetAll",getAllCompanys);

const loginAdmin = async ({uid,password}:LoginAdminType) => {
    const shaObj = new jssha("SHA-256", "TEXT", { encoding: "UTF8" });
    shaObj.update(password);
    const hash = shaObj.getHash("HEX");
    const res = await axios.get(`${apiHost}/admin/login`,{
        params:{
            uid:uid,
            password:hash
        }
    }).catch((e) => {
        throw e;
    })
    return res.data;
}
export const adminLogin = (props:LoginAdminType) => loginAdmin(props);

const deleteProfile = async ({uid}:DeleteProfileType) => {
    const res = await axios.delete(`${apiHost}/user/delete`,{
        data:{
            uid:uid
        }
    }).catch((e) => {
        throw e;
    });
    return res.data;
};
export const userDelete = (props:DeleteProfileType) => deleteProfile(props);

const getProfile = async ({uid}:GetProfileType) => {
    const res = await axios.get(`${apiHost}/user/get`,{
        params:{
            uid:uid,
        }
    });
    return res.data;
};
export const userGet = (props:GetProfileType) => useQuery("userGet",() => getProfile(props),{
    retry: 1,
});

const setProfile = async({uid,kind,value}:SetProfileType) => {
    const res = await axios.put(`${apiHost}/user/set`,{
        uid:uid,
        kind:kind,
        value:value
    }).catch((e) => {
        throw e;
    });
    return res.data;
}
export const userSet = (props:SetProfileType) => setProfile(props);

const addProfile = async ({postCode,address,name,furigana,phone,birth,uid,isNotice}:AddProfileType) => {
    const res = await axios.post(`${apiHost}/user/add`,{
        postCode:postCode,
        address: address,
        name: name,
        furigana: furigana,
        phone: phone,
        birth: birth,
        uid: uid,
        isNotice:isNotice
        }).catch((e) => {
            throw e;
        });
    return res.data;
};
export const userAdd = (props:AddProfileType) => addProfile(props);