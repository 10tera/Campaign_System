/** @jsxImportSource @emotion/react */
/** @jsx jsx */
import { css } from "@emotion/react";
import React, { ChangeEventHandler } from "react";
import { TextField, Button } from "@mui/material";
import {Link} from "react-router-dom";
import { useLogin } from "../../hooks/useLogin";

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

export const Login = () => {
    const {handleEmailChange,handleNextButtonClick,handlePasswordChange,state} = useLogin();
    return (
        <React.Fragment>
            <div css={divCss}>
                <div css={formCss}>
                    <h1>ログイン</h1>
                    <TextField value={state.email} id={"email"} label={"メールアドレス"} type={"email"} placeholder={"xxx@email.com"} onChange={handleEmailChange}></TextField>
                    <TextField value={state.password} id={"password"} label={"パスワード"} placeholder={"*****"} type={"password"} onChange={handlePasswordChange}></TextField>
                    {
                        state.isError ? <p>{state.helperText}</p> : null
                    }
                    <Button onClick={handleNextButtonClick} disabled={!state.isButtonDisabled} variant={"contained"}>ログイン</Button>
                    <Link to={"/signup"}>新規登録</Link>
                    <Link to={"/resetPassword"}>パスワードを忘れた方</Link>
                </div>
            </div>
        </React.Fragment>
    )
}