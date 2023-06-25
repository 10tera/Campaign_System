/** @jsxImportSource @emotion/react */
/** @jsx jsx */
import { css } from "@emotion/react";
import React, { useEffect, useState, ChangeEvent, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { TableContainer, TableHead, TableRow, TableCell, TableBody, Button, FormControl, Select, MenuItem, SelectChangeEvent } from "@mui/material";
import { companysGetAll,   instantWinReApply } from "../../api/ApiClient";
import {shoppingRallyGetAll,shoppingRallyGetUserInfo,shoppingRallyGetStampImg,shoppingRallyApply} from "../../api/ShoppingRallyApiClient";
import { useAuthContext } from "../../context/useAuthContext";

type ReceiptCampaignType = {
    isActive: boolean,
    title: string,
    description: string,
    companyId: number,
    probability: number,
    limit: number,
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
const gridStampCss = css({
    display: "grid",
    gridGap: "10px",
    gridTemplateColumns: "repeat(auto-fill,150px)",
    gridTemplateRows: "auto",
});
const stampDivCss = css({
    position: "relative",
    width: "150px",
    height: "150px",
});
const stampImgCss = css({
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    objectFit: "cover",
    zIndex: "3"
});
const pInImgCss = css({
    position: "absolute",
    transform: "translate(-50%,-50%)",
    top: "40%",
    left: "50%",
    fontSize: "25px",
    zIndex: "2",
});
const overlayInImgCss = css({
    position: "absolute",
    top:"0",
    left: "0",
    width: "100%",
    height: "100%",
    backgroundColor:"rgba(0,0,0,0.3)",
    borderRadius: "50%",
    zIndex: "1"
});

export const ShoppingRally = () => {
    const authContext = useAuthContext();
    const navigate = useNavigate();
    const { id } = useParams();
    const { data, error, isLoading } = shoppingRallyGetAll();
    const { data: companyData, error: companyError, isLoading: companyIsLoading } = companysGetAll();
    const { data: userInfo, error: userInfoError, isLoading: userInfoIsLoading } = shoppingRallyGetUserInfo({ companyId: Number(id), uid: authContext?.currentUser?.uid });
    const { data: stampImg, error: stampImgError, isLoading: stampImgIsLoading} = shoppingRallyGetStampImg({companyId:Number(id)});
    const [isIdError, setIsIdError] = useState(true);
    const [campaignInfo, setCampaignInfo] = useState<ReceiptCampaignType>();
    const [isError, setIsError] = useState(false);
    const [helperText, setHelperText] = useState("");

    const inputRef1 = useRef<HTMLInputElement>(null);
    const inputRef2 = useRef<HTMLInputElement>(null);
    const inputRef3 = useRef<HTMLInputElement>(null);
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
    },[id,data,companyData]);
    const handleSelectFileButtonClick1 = () => {
        inputRef1.current?.click();
    }
    const handleSelectFileButtonClick2 = () => {
        inputRef2.current?.click();
    }
    const handleSelectFileButtonClick3 = () => {
        inputRef3.current?.click();
    }
    const handleSelectFileChange1 = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length !== 1) {
            return;
        }
        submit("img1", e.target.files[0]);
    }
    const handleSelectFileChange2 = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length !== 1) {
            return;
        }
        submit("img2", e.target.files[0]);
    }
    const handleSelectFileChange3 = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length !== 1) {
            return;
        }
        submit("img3",e.target.files[0]);
    }

    const submit = async (key:string,file:File) => {
        setIsError(false);
        setHelperText("");
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
        
        try {
            const formData = new FormData();
            formData.append("img",file);
            formData.append("key",key);
            formData.append("uid", authContext?.currentUser?.uid);
            formData.append("companyId", campaignInfo?.companyId.toString());
            const res = await shoppingRallyApply(formData);
            window.alert("応募が完了しました");
            navigate("/");
        } catch (e) {
            setIsError(true);
            setHelperText("何らかのエラーが発生しました。");
            return;
        }
        
    }
    const handleReSubmit = async () => {
        setIsError(false);
        setHelperText("");
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
        try {
            const formData = new FormData();
            formData.append("uid", authContext?.currentUser?.uid);
            formData.append("campaignId", campaignInfo?.companyId.toString());
            const res = await instantWinReApply(formData);
            window.alert("再応募が完了しました");
            navigate("/");
        } catch (e) {
            setIsError(true);
            setHelperText("何らかのエラーが発生しました。");
            return;
        }
    }

    if (!id) return (<h1>不正なキャンペーンIDです。</h1>)
    if (isLoading || companyIsLoading || userInfoIsLoading || stampImgIsLoading) return (<h1>ロード中</h1>);
    if (error || companyError || userInfoError || stampImgError) return (<h1>エラーが発生しました</h1>);
    if (isIdError) return (<h1>不正なキャンペーンIDです。</h1>);
    return (
        <React.Fragment>
            <Button variant={"outlined"} onClick={() => navigate("/")}>トップ</Button>
            <div css={TitleDivCss}>
                <h1 css={TitleCss}>お買い物ラリー応募</h1>
            </div>
            <TableContainer css={TableContainerCss}>
                <TableBody>
                    <TableRow>
                        <TableCell><h2>キャンペーンタイトル</h2></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell><p>{campaignInfo?.title}</p></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell><h2>説明</h2></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell><p css={descriptionCss}>{campaignInfo?.description}</p></TableCell>
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
                    <TableRow>
                        <TableCell><h2>スタンプ</h2></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <p>スタンプをクリックして、レシート画像を送付してください。</p>
                            <p>※画像を選択すると、自動で送信されます。誤送付にご注意ください。</p>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <div css={gridStampCss}>
                                {
                                    (() => {
                                        console.log(userInfo[0]);
                                        //未応募
                                        if (userInfo.length === 0) {
                                            return (<div>
                                                <input onChange={handleSelectFileChange1} css={inputFileCss} ref={inputRef1} type={"file"} accept={"image/*"} />
                                                <input onChange={handleSelectFileChange2} css={inputFileCss} ref={inputRef2} type={"file"} accept={"image/*"} />
                                                <input onChange={handleSelectFileChange3} css={inputFileCss} ref={inputRef3} type={"file"} accept={"image/*"} />
                                                <img css={stampImgCss} src={`data:image/png;base64,${stampImg}`} onClick={handleSelectFileButtonClick1} />
                                                <img css={stampImgCss} src={`data:image/png;base64,${stampImg}`} onClick={handleSelectFileButtonClick2} />
                                                <img css={stampImgCss} src={`data:image/png;base64,${stampImg}`} onClick={handleSelectFileButtonClick3} />
                                                {
                                                    isError ? <p>{helperText}</p> : null
                                                }
                                            </div>)
                                        }
                                        else {
                                            let ele = [];
                                            switch (userInfo[0].state1) {
                                                case 0:
                                                    ele.push(<div css={stampDivCss}>
                                                        <img css={stampImgCss} src={`data:image/png;base64,${stampImg}`} />
                                                        <p css={pInImgCss}>承認中</p>
                                                        <div css={overlayInImgCss} />
                                                    </div>)
                                                    break;
                                                case 1:
                                                    ele.push(<React.Fragment>
                                                        <input onChange={handleSelectFileChange1} css={inputFileCss} ref={inputRef1} type={"file"} accept={"image/*"} />
                                                        <img css={stampImgCss} src={`data:image/png;base64,${stampImg}`} onClick={handleSelectFileButtonClick1} />
                                                    </React.Fragment>)
                                                    break;
                                                case 2:
                                                    ele.push(<div css={stampDivCss}>
                                                        <img css={stampImgCss} src={`data:image/png;base64,${stampImg}`} />
                                                        <p css={pInImgCss}>承認済み</p>
                                                        <div css={overlayInImgCss} />
                                                    </div>)
                                                    break;
                                                case 3:
                                                    ele.push(<React.Fragment>
                                                        <input onChange={handleSelectFileChange1} css={inputFileCss} ref={inputRef1} type={"file"} accept={"image/*"} />
                                                        <img css={stampImgCss} src={`data:image/png;base64,${stampImg}`} onClick={handleSelectFileButtonClick1} />
                                                    </React.Fragment>)
                                                    break
                                                default:
                                                    return null;
                                            }
                                            switch (userInfo[0].state2) {
                                                case 0:
                                                    ele.push(<div css={stampDivCss}>
                                                        <img css={stampImgCss} src={`data:image/png;base64,${stampImg}`} />
                                                        <p css={pInImgCss}>承認中</p>
                                                        <div css={overlayInImgCss} />
                                                    </div>)
                                                    break;
                                                case 1:
                                                    ele.push(<React.Fragment>
                                                        <input onChange={handleSelectFileChange2} css={inputFileCss} ref={inputRef2} type={"file"} accept={"image/*"} />
                                                        <img css={stampImgCss} src={`data:image/png;base64,${stampImg}`} onClick={handleSelectFileButtonClick2} />
                                                    </React.Fragment>)
                                                    break;
                                                case 2:
                                                    ele.push(<div css={stampDivCss}>
                                                        <img css={stampImgCss} src={`data:image/png;base64,${stampImg}`} />
                                                        <p css={pInImgCss}>承認済み</p>
                                                        <div css={overlayInImgCss} />
                                                    </div>)
                                                    break;
                                                case 3:
                                                    ele.push(<React.Fragment>
                                                        <input onChange={handleSelectFileChange2} css={inputFileCss} ref={inputRef2} type={"file"} accept={"image/*"} />
                                                        <img css={stampImgCss} src={`data:image/png;base64,${stampImg}`} onClick={handleSelectFileButtonClick2} />
                                                    </React.Fragment>)
                                                    break
                                                default:
                                                    return null;
                                            }
                                            switch (userInfo[0].state3) {
                                                case 0:
                                                    ele.push(<div css={stampDivCss}>
                                                        <img css={stampImgCss} src={`data:image/png;base64,${stampImg}`} />
                                                        <p css={pInImgCss}>承認中</p>
                                                        <div css={overlayInImgCss} />
                                                    </div>)
                                                    break;
                                                case 1:
                                                    ele.push(<React.Fragment>
                                                        <input onChange={handleSelectFileChange3} css={inputFileCss} ref={inputRef3} type={"file"} accept={"image/*"} />
                                                        <img css={stampImgCss} src={`data:image/png;base64,${stampImg}`} onClick={handleSelectFileButtonClick3} />
                                                    </React.Fragment>)
                                                    break;
                                                case 2:
                                                    ele.push(<div css={stampDivCss}>
                                                        <img css={stampImgCss} src={`data:image/png;base64,${stampImg}`} />
                                                        <p css={pInImgCss}>承認済み</p>
                                                        <div css={overlayInImgCss} />
                                                    </div>)
                                                    break;
                                                case 3:
                                                    ele.push(<React.Fragment>
                                                        <input onChange={handleSelectFileChange3} css={inputFileCss} ref={inputRef3} type={"file"} accept={"image/*"} />
                                                        <img css={stampImgCss} src={`data:image/png;base64,${stampImg}`} onClick={handleSelectFileButtonClick3} />
                                                    </React.Fragment>)
                                                    break
                                                default:
                                                    return null;
                                            }
                                            return ele;
                                        }
                                        return null;
                                    })()
                                }
                            </div>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </TableContainer>
            
        </React.Fragment>
    )
}