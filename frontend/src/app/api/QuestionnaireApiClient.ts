import { useQuery } from "react-query";
import axios from "axios";

const apiHost = "http://localhost:3100";
axios.defaults.headers.post["Access-Control-Allow-Origin"] = '*';
axios.defaults.headers.post["Content-Type"] = "application/json";

type CreateQuestionnaireType = {
    companyId:number,
    isActive:boolean,
    title: string,
    description:string,
    questions:{
        id:number,
        title:string,
    }[],
    point:number,
}
type DeleteQuestionnaireType = {
    companyId:number,
}
type ChangeActiveQuestionnaireType = {
    isActive:boolean,
    companyId:number,
}
type GetQuestionnaireType = {
    companyId:number,
}
type ApplyQuestionnaireType = {
    companyId:number,
    uid:string,
    answers:{
        id:number,
        answer:number,
    }[],
}
type IsAlreadyApplyQuestionnaireType = {
    companyId:number,
    uid:string,
}

const IsAlreadyApplyQuestionnaire = async({companyId,uid}:IsAlreadyApplyQuestionnaireType) => {
    const res = await axios.get(`${apiHost}/questionnaire/isAlreadyApply`,{
        params:{
            companyId:companyId,
            uid:uid
        }
    }).catch((e) => {
        throw e;
    })
    return res.data;
}
export const questionnaireIsAlreadyAppy = (props:IsAlreadyApplyQuestionnaireType) => IsAlreadyApplyQuestionnaire(props);

const ApplyQuestionnaire = async({companyId,uid,answers}:ApplyQuestionnaireType) => {
    const res = await axios.post(`${apiHost}/questionnaire/apply`, {
        companyId:companyId,
        uid:uid,
        answers:answers,
    }).catch((e) => {
        throw e;
    });
    return res.data;
}
export const questionnaireAppy = (props:ApplyQuestionnaireType) => ApplyQuestionnaire(props);

const GetQuestionnaire = async ({ companyId }: GetQuestionnaireType) => {
    if (companyId === 0 || !companyId) {
        return [];
    }
    const res = await axios.get(`${apiHost}/questionnaire/get`, {
        params: {
            companyId: companyId
        }
    });
    return res.data;
}
export const questionnaireGet = (props: GetQuestionnaireType) => GetQuestionnaire(props);

const ChangeActiveQuestionnaire = async ({ isActive, companyId }: ChangeActiveQuestionnaireType) => {
    const res = await axios.put(`${apiHost}/questionnaire/changeActive`, {
        isActive: isActive,
        companyId: companyId
    }).catch((e) => {
        throw e;
    });
    return res.data;
}
export const questionnaireChangeActive = (props: ChangeActiveQuestionnaireType) => ChangeActiveQuestionnaire(props);

const DeleteQuestionnaire = async ({ companyId }: DeleteQuestionnaireType) => {
    const res = await axios.delete(`${apiHost}/questionnaire/delete`, {
        data: {
            companyId: companyId
        }
    }).catch((e) => {
        throw e;
    });
    return res.data;
}
export const questionnaireDelete = (props: DeleteQuestionnaireType) => DeleteQuestionnaire(props);

const GetAllQuestionnaire = async () => {
    const res = await axios.get(`${apiHost}/questionnaire/getAll`);
    return res.data;
}
export const questionnaireGetAll = () => useQuery("questionnaireGetAll", GetAllQuestionnaire);

const CreateQuestionnaire = async ({companyId,isActive,title,description,questions,point}:CreateQuestionnaireType) => {
    const res = await axios.post(`${apiHost}/questionnaire/create`,{
        companyId:companyId,
        isActive:isActive,
        title:title,
        description:description,
        questions:questions,
        point:point,
    }).catch((e) => {
        throw e;
    });
    return res.data;
};
export const questionnaireCreate = (props: CreateQuestionnaireType) => CreateQuestionnaire(props);