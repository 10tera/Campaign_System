/** @jsxImportSource @emotion/react */
/** @jsx jsx */
import { css } from "@emotion/react";
import React, { useEffect, useState, ChangeEvent, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, FormControlLabel,FormGroup, Select, MenuItem, SelectChangeEvent, TextField ,Checkbox, TableContainer, TableBody, TableRow, TableCell} from "@mui/material";
import {companysGetAll } from "../../api/ApiClient";
import {questionnaireGetAll,questionnaireAppy,questionnaireIsAlreadyAppy} from "../../api/QuestionnaireApiClient";
import { useAuthContext } from "../../context/useAuthContext";

type ReceiptCampaignType = {
    isActive: boolean,
    title: string,
    description: string,
    companyId: number,
    questions:{
        id:number,
        title:string,
    }[],
    point:number,
}
type AnswersType = {
    id:number,
    answer:number,
}

const TitleDivCss = css({
    width: "100%",
});
const TitleCss = css({
    textAlign: "center"
});
const TableContainerCss = css({
    width: "fit-content",
    margin: "0 auto"
});

const descriptionCss = css({
    whiteSpace: "pre-line",
    wordWrap: "break-word",
});
const inputFileCss = css({
    display: "none",
});

export const Questionnaire = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const authContext = useAuthContext();
    const navigate = useNavigate();
    const { id } = useParams();
    const { data, error, isLoading } = questionnaireGetAll();
    const { data: companyData, error: companyError, isLoading: companyIsLoading } = companysGetAll();
    const [isAlreadyAppy,setIsAlreadyAppy] = useState(true);
    const [isIdError, setIsIdError] = useState(true);
    const [questionnaireInfo, setQuestionnaireInfo] = useState<ReceiptCampaignType>();
    const [isError, setIsError] = useState(false);
    const [helperText, setHelperText] = useState("");
    const [isButtonDisable, setIsButtonDisable] = useState(false);

    const [answers,setAnswers] = useState<AnswersType[]>();

    useEffect(() => {
        if (!id) return;
        if (!(data && companyData)) return;
        if (!authContext?.currentUser?.uid)return;
        for (let i = 0; i < data.length; i++) {
            if (data[i].companyId === Number(id)) {
                setIsIdError(false);
                setQuestionnaireInfo(data[i]);
                getIsAlreadyAppy();
                const newAnswers:AnswersType[] = [];
                for (let j = 0; j < data[i].questions.length;j++){
                    newAnswers.push({
                        id:data[i].questions[j].id,
                        answer:1,
                    });
                }
                setAnswers(newAnswers);
                return;
            }
        }
    },[id,data,companyData]);
    const getIsAlreadyAppy = async() => {
        if (!authContext?.currentUser?.uid) return;
        try {
            const res = await questionnaireIsAlreadyAppy({ companyId: Number(id), uid: authContext?.currentUser?.uid });
            if(res.length < 1){
                setIsAlreadyAppy(false);
            }
        } catch (e) {
            console.error(e);
            return;
        }
    }
    const handleSubmitClick = async () => {
        setIsError(false);
        setHelperText("");
        if (!authContext?.currentUser?.uid) {
            setIsError(true);
            setHelperText("ログイン情報取得時エラー");
            return;
        }
        if (!questionnaireInfo?.companyId) {
            setIsError(true);
            setHelperText("キャンペーン情報取得時エラー");
            return;
        }
        if(!answers){
            setIsError(true);
            setHelperText("エラー");
            return;
        }
        for(let i=0;i<answers?.length;i++){
            if(answers[i].answer === 0){
                setIsError(true);
                setHelperText("質問に答えてください。");
                return;
            }
        }
        setIsButtonDisable(true);
        try {
            const res = await questionnaireAppy({
                companyId:questionnaireInfo.companyId,
                uid:authContext.currentUser.uid,
                answers:answers
            });
            setIsButtonDisable(false);
            window.alert("アンケートを送信しました");
            navigate("/");
        } catch (e) {
            console.error(e);
            setIsButtonDisable(false);
            setIsError(true);
            setHelperText("質問に答えてください。");
            return;
        }
    }
    const handleCheckBoxChange = (e: React.ChangeEvent<HTMLInputElement>,id:number,newAnswer:number) => {
        if(e.target.checked){
            setAnswers((prev) => prev?.map((value) => (value.id === id ? { id: id, answer: newAnswer } : value)));
        }
        else{
            setAnswers((prev) => prev?.map((value) => (value.id === id ? { id: id, answer: 0 } : value)));
        }
    }
    

    if (!id) return (<h1>不正なアンケートIDです。</h1>)
    if (isLoading || companyIsLoading) return (<h1>ロード中</h1>);
    if (error || companyError) return (<h1>エラーが発生しました</h1>);
    if (isIdError) return (<h1>Error:不正アンケートIDです。</h1>);
    return (
        <React.Fragment>
            <Button variant={"outlined"} onClick={() => navigate("/")}>トップ</Button>
            <div css={TitleDivCss}>
                <h1 css={TitleCss}>アンケート</h1>
            </div>
            <TableContainer css={TableContainerCss}>
                <TableBody>
                    <TableRow>
                        <TableCell><h2>タイトル</h2></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell><p>{questionnaireInfo?.title}</p></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell><h2>説明</h2></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell><p css={descriptionCss}>{questionnaireInfo?.description}</p></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell><h2>開催元</h2></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <p>{
                                (() => {
                                    for (let i = 0; i < companyData.length; i++) {
                                        if (companyData[i].id === Number(id)) {
                                            return companyData[i].name;
                                        }
                                    }
                                    return "can not find";
                                })()
                            }</p>
                        </TableCell>
                    </TableRow>
                    {
                        isAlreadyAppy ? <React.Fragment>
                            <TableRow>
                                <TableCell><h2>既にアンケートに答えています。</h2></TableCell>
                            </TableRow>
                        </React.Fragment> :
                            <React.Fragment>
                                <TableRow>
                                    <TableCell><h2>質問</h2></TableCell>
                                </TableRow>
                                {
                                    questionnaireInfo?.questions.map((question, question_i) => {
                                        return (
                                            <div key={`question-${question_i}`}>
                                                <TableRow>
                                                    <TableCell><h3>{question.title}</h3></TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>
                                                        <FormGroup>
                                                            <FormControlLabel control={<Checkbox onChange={(e) => handleCheckBoxChange(e, question.id, 1)} checked={answers?.find(a => a.id === question.id)?.answer === 1} />} label={"①おいしい"} />
                                                            <FormControlLabel control={<Checkbox onChange={(e) => handleCheckBoxChange(e, question.id, 2)} checked={answers?.find(a => a.id === question.id)?.answer === 2} />} label={"②普通"} />
                                                            <FormControlLabel control={<Checkbox onChange={(e) => handleCheckBoxChange(e, question.id, 3)} checked={answers?.find(a => a.id === question.id)?.answer === 3} />} label={"③良く分からない"} />
                                                            <FormControlLabel control={<Checkbox onChange={(e) => handleCheckBoxChange(e, question.id, 4)} checked={answers?.find(a => a.id === question.id)?.answer === 4} />} label={"④まずい"} />
                                                        </FormGroup>
                                                    </TableCell>
                                                </TableRow>
                                            </div>
                                        )
                                    })
                                }
                                {
                                    isError ? <TableRow>
                                        <TableCell><p>{helperText}</p></TableCell>
                                    </TableRow> : null
                                }
                                <TableRow>
                                    <TableCell><Button variant={"contained"} onClick={handleSubmitClick}>送信</Button></TableCell>
                                </TableRow>
                            </React.Fragment>
                    }
                </TableBody>
            </TableContainer>
        </React.Fragment>
    )
}