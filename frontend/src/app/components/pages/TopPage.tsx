/** @jsxImportSource @emotion/react */
/** @jsx jsx */
import { css } from "@emotion/react";
import React,{} from "react";
import {Link,useNavigate} from "react-router-dom";
import {Button} from "@mui/material";
import {useAuthContext} from "../../context/useAuthContext";

const TitleDivCss = css({
    width :"100%",
});
const TitleCss = css({
    textAlign:"center"
});
const FormDivCss = css({
    display: "flex",
    gap: "10px",
    flexDirection: "column",
    width: "90%",
    maxWidth: "250px",
    margin: "0 auto",
});
const FormDiv2Css = css({
    display: "flex",
    gap: "10px",
    flexDirection: "column",
    width: "90%",
    maxWidth: "250px",
    margin: "30px auto 0 auto",
});

export const TopPage = () => {
    const authContext = useAuthContext();
    const navigate = useNavigate();
    if(authContext?.loading)return (<h1>ロード中</h1>)
    return(
        <React.Fragment>
            <div css={TitleDivCss}>
                <h1 css={TitleCss}>タイトル</h1>
            </div>
            {
                !authContext?.currentUser ? <React.Fragment>
                    <div css={FormDivCss}>
                        <Button variant={"contained"} onClick={() => navigate("/signup")}>新規登録</Button>
                        <Button variant={"contained"} onClick={() => navigate("/login")}>ログイン</Button>
                        <Button variant={"contained"} onClick={() => navigate("/admin/login")}>管理者専用</Button>
                    </div>
                </React.Fragment> : 
                <React.Fragment>
                    <div css={FormDivCss}>
                        <Button variant={"contained"} onClick={() => {
                            authContext?.logout();
                        }}>ログアウト
                        </Button>
                        <Button variant={"outlined"} onClick={() => navigate("/mypage")}>マイページ</Button>
                    </div>
                    <div css={FormDiv2Css}>
                            <Button variant={"outlined"} onClick={() => navigate("/receiptCampaignList")}>レシートキャンペーン</Button>
                            <Button variant={"outlined"} onClick={() => navigate("/instantWinList")}>インスタントウィン</Button>
                            <Button variant={"outlined"} onClick={() => navigate("/shoppingRallyList")}>お買い物ラリー</Button>
                            <Button variant={"outlined"} onClick={() => navigate("/questionnaireList")}>アンケート</Button>
                            <Button variant={"outlined"} onClick={() => navigate("/onetouchList")}>ワンタッチキャンペーン</Button>
                    </div>
                </React.Fragment>
            }
        </React.Fragment>
    )
}