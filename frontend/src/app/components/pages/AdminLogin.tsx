/** @jsxImportSource @emotion/react */
/** @jsx jsx */
import { css } from "@emotion/react";
import React, { useState,ChangeEvent} from "react";
import { TextField, Button } from "@mui/material";
import { Link ,useNavigate} from "react-router-dom";
import { useAuthContext } from "../../context/useAuthContext";
import {adminLogin} from "../../api/ApiClient";

const divCss = css({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
});

const formCss = css({
    display: "flex",
    flexFlow: "column",
    gap: "20px",
    margin: "0 auto",
    padding: "2em 2em",
    alignItems: "center",
    width: "200px",
    height: "auto",
    border: "solid 3px white",
    boxShadow: "rgb(145 158 171 / 24%) -24px 24px 72px -8px",
    borderRadius: "10px",
});

export const AdminLogin = () => {
    const authContext = useAuthContext();
    const navigate = useNavigate();
    const [uid,setUid] = useState("");
    const [password,setPassword] = useState("");
    const [isError,setIsError] = useState(false);
    const [helperText,setHelperText] = useState("");
    const [isButtonDisable,setIsButtonDisable] = useState(false);
    const handleUidChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setUid(e.target.value);
    };
    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setPassword(e.target.value);
    };
    const initError = () => {
        setIsError(false);
        setHelperText("");
    }
    const handleButtonClick = async() => {
        initError();
        if(uid.length === 0 || password.length === 0){
            setIsError(true);
            setHelperText("入力してください。");
            return;
        }
        setIsButtonDisable(true);
        try {
            const res = await adminLogin({uid:uid,password:password});
            authContext?.setAdminId(uid);
            authContext?.setAdminPassword(password);
            navigate("/");
        } catch (e) {
            console.error(e);
            setIsError(true);
            setHelperText("ログインできませんでした。パスワードが間違っている可能性があります。");
            setIsButtonDisable(false);
            return;
        }
    }
    return(
        <React.Fragment>
            <div css={divCss}>
                <div css={formCss}>
                    <h1>ログイン</h1>
                    <TextField value={uid} id={"uid"} label={"UID"} type={"text"} placeholder={"xxxx"} onChange={handleUidChange}></TextField>
                    <TextField value={password} id={"password"} label={"パスワード"} placeholder={"*****"} type={"password"} onChange={handlePasswordChange}></TextField>
                    {
                        isError ? <p>{helperText}</p> : null
                    }
                    <Button onClick={handleButtonClick} disabled={isButtonDisable} variant={"contained"}>ログイン</Button>
                    <Link to={"/"}>ホーム</Link>
                </div>
            </div>
        </React.Fragment>
    )
};