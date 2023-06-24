/** @jsxImportSource @emotion/react */
/** @jsx jsx */
import { css } from "@emotion/react";
import React,{useState,ChangeEvent} from "react";
import {Link} from "react-router-dom";
import { TextField, Button } from "@mui/material";
import { useAuthContext } from "../../context/useAuthContext";

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

export const ResetPassword = () => {
    const authContext = useAuthContext();
    const [email,setEmail] = useState("");
    const [isError,setIsError] = useState(false);
    const [helperText,setHelperText] = useState("");
    const [isButtonDisable,setIsButtondisable] = useState(false);
    const isEmail = (value: string) => {
        const check = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return check.test(value);
    };
    const handleEmailChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setEmail(e.target.value);
    };
    const initError = () => {
        setIsError(false);
        setHelperText("");
    }
    const handleButtonClick = async() => {
        initError();
        if(!isEmail(email)){
            setIsError(true);
            setHelperText("有効なメールアドレスを入力してください。");
            return;
        }
        try {
            await authContext?.resetPassword({email:email});
            window.alert("メールを送信しました。パスワードを再設定してください。");
            return;
        } catch (e) {
            console.error(e);
            setIsError(true);
            setHelperText("何らかのエラーが発生しました。");
            return;
        }
    }

    return(
        <React.Fragment>
            <div css={divCss}>
                <div css={formCss}>
                    <h1>パスワード初期化</h1>
                    <TextField value={email} id={"email"} label={"メールアドレス"} type={"email"} placeholder={"xxx@email.com"} onChange={handleEmailChange}></TextField>
                    {
                        isError ? <p>{helperText}</p> : null
                    }
                    <Button onClick={handleButtonClick} disabled={isButtonDisable} variant={"contained"}>ログイン</Button>
                    <Link to={"/login"}>送信</Link>
                    <Link to={"/resetPassword"}>パスワードを忘れた方</Link>
                </div>
            </div>
        </React.Fragment>
    )
}