import React,{useEffect,useMemo} from "react";
import {Link} from "react-router-dom";
import {Button} from "@mui/material";
import {useAuthContext} from "../../context/useAuthContext";

export const TopPage = () => {
    const authContext = useAuthContext();
    if(authContext?.loading)return (<h1>ロード中</h1>)
    return(
        <React.Fragment>
            <div>
                <h1>タイトル</h1>
            </div>
            {
                !authContext?.currentUser ? <React.Fragment>
                    <Link to={"/signup"}>新規登録</Link>
                    <Link to={"/login"}>ログイン</Link>
                    <Link to={"/admin/login"}>管理者専用</Link>
                </React.Fragment> : 
                <React.Fragment>
                    <Button onClick={() => {
                        authContext?.logout();
                    }}>ログアウト
                    </Button>
                    <Button variant={"contained"}><Link to={"/mypage"}>マイページ</Link></Button>
                    <Link to={"/receiptCampaignList"}>レシートキャンペーン</Link>
                    <Link to={"/instantWinList"}>インスタントウィン</Link>
                    <Link to={"/shoppingRallyList"}>お買い物ラリー</Link>
                    <Link to={"/questionnaireList"}>アンケート</Link>
                    <Link to={"/onetouchList"}>ワンタッチキャンペーン</Link>
                </React.Fragment>
            }
        </React.Fragment>
    )
}