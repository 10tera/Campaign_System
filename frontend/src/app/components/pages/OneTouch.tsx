/** @jsxImportSource @emotion/react */
/** @jsx jsx */
import { css } from "@emotion/react";
import React, { useEffect, useState, ChangeEvent, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { TableContainer, TableHead, TableRow, TableCell, TableBody, Button, FormControl, Select, MenuItem, SelectChangeEvent } from "@mui/material";
import {  companysGetAll } from "../../api/ApiClient";
import { OneTouchGetAll} from "../../api/OnetouchApiClient";
import { OneTouchLogCreate,OneTouchLogGetUserPoint } from "../../api/OnetouchLogApiClient";
import { useAuthContext } from "../../context/useAuthContext";

type ReceiptCampaignType = {
    id:number,
    title: string,
    description: string,
    companyId: number,
    point:number,
}

const descriptionCss = css({
    whiteSpace: "pre-line",
    wordWrap: "break-word",
});
const inputFileCss = css({
    display: "none",
});

export const OneTouch = () => {
    const authContext = useAuthContext();
    const navigate = useNavigate();
    const { id } = useParams();
    const { data, error, isLoading } = OneTouchGetAll();
    const { data: companyData, error: companyError, isLoading: companyIsLoading } = companysGetAll();
    const [nowPoint,setNowPoint] = useState(0);
    const [isIdError, setIsIdError] = useState(true);
    const [campaignInfo, setCampaignInfo] = useState<ReceiptCampaignType>();
    const [isError, setIsError] = useState(false);
    const [helperText, setHelperText] = useState("");
    const [isButtonDisable, setIsButtonDisable] = useState(false);
    useEffect(() => {
        if (!id) return;
        if (!(data && companyData)) return;
        for (let i = 0; i < data.length; i++) {
            if (data[i].id === Number(id)) {
                setIsIdError(false);
                setCampaignInfo(data[i]);
                try {
                    getUserPoint(data[i].companyId);
                } catch (e) {
                    console.error(e);
                    return;
                }
                return;
            }
        }
    },[id,data,companyData]);
    const getUserPoint = async(companyId:number) => {
        if(!authContext?.currentUser?.uid){
            throw new Error("ログイン情報取得時エラー");
        }
        const res:any = await OneTouchLogGetUserPoint({
            uid:authContext?.currentUser.uid,
            companyId:companyId
        });
        setNowPoint(res[0].point);
    }
    const handleSubmitClick = async () => {
        setIsError(false);
        setHelperText("");
        if (!authContext?.currentUser?.uid) {
            setIsError(true);
            setHelperText("ログイン情報取得時エラー");
            return;
        }
        if (!campaignInfo?.id) {
            setIsError(true);
            setHelperText("キャンペーン情報取得時エラー");
            return;
        }
        if(nowPoint - campaignInfo.point < 0){
            setIsError(true);
            setHelperText("ポイントが足りません。");
            return;
        }
        setIsButtonDisable(true);
        try {
            const res = await OneTouchLogCreate({
                uid:authContext.currentUser.uid,
                prizeId: campaignInfo.id
            });
            window.alert("応募が完了しました");
            navigate("/");
        } catch (e) {
            setIsError(true);
            setHelperText("何らかのエラーが発生しました。");
            setIsButtonDisable(false);
            return;
        }
    }
    if (!id) return (<h1>不正なキャンペーンIDです。</h1>)
    if (isLoading || companyIsLoading) return (<h1>ロード中</h1>);
    if (error || companyError) return (<h1>エラーが発生しました</h1>);
    if (isIdError) return (<h1>不正なキャンペーンIDです。</h1>);
    return (
        <React.Fragment>
            <h1>ワンタッチキャンペーン賞品交換</h1>
            <h2>キャンペーンタイトル</h2>
            <p>{campaignInfo?.title}</p>
            <h2>説明</h2>
            <p css={descriptionCss}>{campaignInfo?.description}</p>
            <h2>開催元</h2>
            <p>{
                (() => {
                    for (let i = 0; i < companyData.length; i++) {
                        if (companyData[i].id === Number(campaignInfo?.companyId)) {
                            return companyData[i].name;
                        }
                    }
                    return "can not find";
                })()
            }</p>
            <h2>賞品ID</h2>
            <p>{campaignInfo?.id}</p>
            <h2>交換ポイント数</h2>
            <p>{campaignInfo?.point}</p>
            <h2>現在の所持ポイント数</h2>
            <p>{nowPoint}</p>
            {
                isError ? <p>{helperText}</p> : null
            }
            <Button disabled={isButtonDisable} variant={"contained"} onClick={handleSubmitClick}>交換する</Button>
        </React.Fragment>
    )
}