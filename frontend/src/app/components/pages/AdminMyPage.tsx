/** @jsxImportSource @emotion/react */
/** @jsx jsx */
import { css } from "@emotion/react";
import React, { useEffect, useState, ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Button, Modal, Box, TextField } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";

import { useAuthContext } from "../../context/useAuthContext";
import { AllCompanysTable } from "../split/AllCompanysTable";
import {CreateReceiptCampaign} from "../split/CreateReceiptCampaign";
import {CreateInstantWin } from "../split/CreateInstantWin";
import { CreateShoppingRally } from "../split/CreateShoppingRally";
import {CreateQuestionnaire} from "../split/CreateQuestionnaire";
import { CreateOneTouch } from "../split/CreateOneTouch";

const mainDivCss = css({
    paddingLeft: "30px",
    paddingRight: "30px"
});
const appBarCss = css({
    //display:"flex",
    //flexWrap: "nowrap",
    //maxWidth:"100%"
    width: "100%"
});
const barButtonCss = css({
    color: "white",
    marginLeft: "20px",
    borderColor: "white",
    border: "1px solid",
    borderRadius: "2px"
});
const gridCss = css({
    width: "100%",
    maxWidth: "700px",
    margin: "0 auto"
});

const gridCildCss = css({
    wordBreak: "break-all"
});

export const AdminMyPage = () => {
    const authContext = useAuthContext();
    const navigate = useNavigate();
    return(
        <React.Fragment>
            <div>
                <AppBar position={"static"} css={appBarCss}>
                    <Toolbar>
                        <h4>キャンペーン事務局管理ページ</h4>
                        <Button css={barButtonCss} onClick={() => {
                            navigate("/")
                        }}>ホーム</Button>
                        <Button css={barButtonCss} onClick={() => {
                            authContext?.setAdminPassword(undefined);
                            authContext?.setAdminId(undefined);
                            navigate("/")
                        }}>ログアウト
                        </Button>
                    </Toolbar>
                </AppBar>
                <div css={mainDivCss}>
                    <h2>アカウント情報</h2>
                    <Grid css={gridCss} container spacing={2}>
                        <Grid xs={6}>
                            <h4>ログイン用ID</h4>
                        </Grid>
                        <Grid xs={6}>
                            <p>{authContext?.adminId}</p>
                        </Grid>
                    </Grid>
                    <AllCompanysTable/>
                    <h2>ユーザー情報管理</h2>
                    <Link to={"/admin/userInfo"}>ユーザー情報管理ページ</Link>
                    <h2>ユーザー保有ポイント管理</h2>
                    <Link to={"/admin/userPoint"}>ユーザー保有ポイント管理ページ</Link>
                    <CreateReceiptCampaign/>
                    <h2>レシートキャンペーン管理ページ</h2>
                    <Link to={"/admin/receiptCampaign"}>レシートキャンペーン管理</Link>
                    <CreateInstantWin/>
                    <h2>インスタントウィン管理ページ</h2>
                    <Link to={"/admin/instantWin"}>インスタントウィン管理</Link>
                    <CreateShoppingRally/>
                    <h2>お買い物ラリー管理ページ</h2>
                    <Link to={"/admin/shoppingRally"}>お買い物ラリー管理</Link>
                    <CreateQuestionnaire/>
                    <h2>アンケート管理ページ</h2>
                    <Link to={"/admin/questionnaire"}>アンケート管理</Link>
                    <CreateOneTouch/>
                    <h2>ワンタッチ管理ページ</h2>
                    <Link to={"/admin/onetouch"}>ワンタッチ管理</Link>
                    <h2>ワンタッチログ管理ページ</h2>
                    <Link to={"/admin/onetouch/log"}>ワンタッチログ管理</Link>
                </div>
            </div>
        </React.Fragment>
    )
}