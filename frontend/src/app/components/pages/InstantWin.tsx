/** @jsxImportSource @emotion/react */
/** @jsx jsx */
import { css } from "@emotion/react";
import React, { useEffect, useState, ChangeEvent, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { TableContainer, TableHead, TableRow, TableCell, TableBody, Button, FormControl, Select, MenuItem, SelectChangeEvent } from "@mui/material";
import { instantWinGetAll, companysGetAll, instantWinGetUserInfo, instantWinApply, instantWinReApply } from "../../api/ApiClient";
import { useAuthContext } from "../../context/useAuthContext";

type ReceiptCampaignType = {
    isActive: boolean,
    title: string,
    description: string,
    companyId: number,
    probability: number,
    limit: number,
}

const descriptionCss = css({
    whiteSpace: "pre-line",
    wordWrap: "break-word",
});
const inputFileCss = css({
    display: "none",
});

export const InstantWin = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const authContext = useAuthContext();
    const navigate = useNavigate();
    const { id } = useParams();
    const { data, error, isLoading } = instantWinGetAll();
    const { data: companyData, error: companyError, isLoading: companyIsLoading } = companysGetAll();
    const { data: receiptUserInfo, error: receiptUserInfoError, isLoading: receiptUserInfoIsLoading } = instantWinGetUserInfo({ id: Number(id), uid: authContext?.currentUser?.uid });
    const [isIdError, setIsIdError] = useState(true);
    const [campaignInfo, setCampaignInfo] = useState<ReceiptCampaignType>();
    const [isError, setIsError] = useState(false);
    const [helperText, setHelperText] = useState("");
    const [isButtonDisable, setIsButtonDisable] = useState(false);

    const [imgFile, setImgFile] = useState<File>();
    useEffect(() => {
        if (!id) return;
        if (!(data && companyData)) return;
        for (let i = 0; i < data.length; i++) {
            if (data[i].companyId === Number(id)) {
                setIsIdError(false);
                setCampaignInfo(data[i]);
                return;
            }
        }
    },[]);
    const handleSelectFileButtonClick = () => {
        inputRef.current?.click();
    }
    const handleSelectFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length !== 1) {
            return;
        }
        setImgFile(e.target.files[0]);
    }
    const handleSubmitClick = async () => {
        setIsError(false);
        setHelperText("");
        if (!imgFile) {
            setIsError(true);
            setHelperText("レシート画像を選択してください。");
            return;
        }
        if (!authContext?.currentUser?.uid) {
            setIsError(true);
            setHelperText("ログイン情報取得時エラー");
            return;
        }
        if (!campaignInfo?.companyId) {
            setIsError(true);
            setHelperText("キャンペーン情報取得時エラー");
            return;
        }
        setIsButtonDisable(true);
        try {
            const formData = new FormData();
            formData.append("img", imgFile);
            formData.append("uid", authContext?.currentUser?.uid);
            formData.append("campaignId", campaignInfo?.companyId.toString());
            const res = await instantWinApply(formData);
            window.alert("応募が完了しました");
            navigate("/");
        } catch (e) {
            setIsError(true);
            setHelperText("何らかのエラーが発生しました。");
            setIsButtonDisable(false);
            return;
        }
    }
    const handleReSubmit = async () => {
        setIsError(false);
        setHelperText("");
        if (!imgFile) {
            setIsError(true);
            setHelperText("レシート画像を選択してください。");
            return;
        }
        if (!authContext?.currentUser?.uid) {
            setIsError(true);
            setHelperText("ログイン情報取得時エラー");
            return;
        }
        if (!campaignInfo?.companyId) {
            setIsError(true);
            setHelperText("キャンペーン情報取得時エラー");
            return;
        }
        setIsButtonDisable(true);
        try {
            const formData = new FormData();
            formData.append("img", imgFile);
            formData.append("uid", authContext?.currentUser?.uid);
            formData.append("campaignId", campaignInfo?.companyId.toString());
            const res = await instantWinReApply(formData);
            window.alert("再応募が完了しました");
            navigate("/");
        } catch (e) {
            setIsError(true);
            setHelperText("何らかのエラーが発生しました。");
            setIsButtonDisable(false);
            return;
        }
    }

    if (!id) return (<h1>不正なキャンペーンIDです。</h1>)
    if (isLoading || companyIsLoading || receiptUserInfoIsLoading) return (<h1>ロード中</h1>);
    if (error || companyError || receiptUserInfoError) return (<h1>エラーが発生しました</h1>);
    if (isIdError) return (<h1>不正なキャンペーンIDです。</h1>);
    return (
        <React.Fragment>
            <h1>レシートキャンペーン応募</h1>
            <h2>キャンペーンタイトル</h2>
            <p>{campaignInfo?.title}</p>
            <h2>説明</h2>
            <p css={descriptionCss}>{campaignInfo?.description}</p>
            <h2>開催元</h2>
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
            {
                (() => {
                    //未応募
                    if (receiptUserInfo.length === 0) {
                        return (<div>
                            <h3>レシート画像選択</h3>
                            <input onChange={handleSelectFileChange} css={inputFileCss} ref={inputRef} type={"file"} accept={"image/*"} />
                            <Button variant={"contained"} onClick={handleSelectFileButtonClick}>ファイル選択</Button>
                            {
                                isError ? <p>{helperText}</p> : null
                            }
                            <Button disabled={isButtonDisable} variant={"contained"} onClick={handleSubmitClick}>応募する</Button>
                        </div>)
                    }
                    //承認中
                    else if (receiptUserInfo[0].state === 0) {
                        return (<div>
                            <h3>現在、送信されたレシート画像は承認作業中です。</h3>
                        </div>)
                    }
                    //未承認
                    else if (receiptUserInfo[0].state === 1) {
                        return (<div>
                            <h3>送信されたレシート画像は承認されませんでした。再度レシート画像を送信可能です。</h3>
                            <h2>レシート画像選択</h2>
                            <input onChange={handleSelectFileChange} css={inputFileCss} ref={inputRef} type={"file"} accept={"image/*"} />
                            <Button variant={"contained"} onClick={handleSelectFileButtonClick}>ファイル選択</Button>
                            {
                                isError ? <p>{helperText}</p> : null
                            }
                            <Button disabled={isButtonDisable} variant={"contained"} onClick={handleReSubmit}>応募する</Button>
                        </div>)
                    }
                    //承認済み
                    else if (receiptUserInfo[0].state === 2) {
                        return (<div>
                            <h3>当選</h3>
                        </div>)
                    }
                    else if(receiptUserInfo[0].state === 3){
                        return <div>
                            <h3>落選</h3>
                        </div>
                    }
                    return null;
                })()
            }
        </React.Fragment>
    )
}