/** @jsxImportSource @emotion/react */
/** @jsx jsx */
import { css } from "@emotion/react";
import React,{ ChangeEventHandler } from "react";
import {TextField,Button,Checkbox,FormGroup,FormControlLabel} from "@mui/material";
import { Link } from "react-router-dom";
import { useSignUp } from "../../hooks/useSignUp";

const divCss = css({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
});

const formCss = css({
    display: "flex",
    flexFlow: "column",
    gap: "20px",
    margin :"0 auto",
    padding: "2em 2em",
    alignItems: "center",
    width: "200px",
    height: "auto",
    border:  "solid 3px white",
    boxShadow: "rgb(145 158 171 / 24%) -24px 24px 72px -8px",
    borderRadius: "10px",
});

export const SignUp = () => {
    const {state,handlePhoneChange,handleBirth,handleNextButtonClick,handleIsNotice,handleBackButtonClick,handleEmailChange,handleEmailConfirmChange,handlePasswordChange,handlePasswordConfirmChange,handlePostCodeChange,handleAddressChange,handleFurigana,handleName} = useSignUp();
    return(
        <React.Fragment>
            <div css={divCss}>
                <div css={formCss}>
                    <h1>新規登録</h1>
                    {
                        (() => {
                            switch(state.mode){
                                case 0:
                                    return (
                                        <React.Fragment>
                                            <TextField value={state.email} id={"email"} label={"メールアドレス"} type={"email"} placeholder={"xxx@email.com"} onChange={handleEmailChange}></TextField>
                                            <TextField value={state.emailConfirm} id={"emailConfirm"} label={"メールアドレス再入力"} placeholder={"xxx@email.com"} type={"email"} onChange={handleEmailConfirmChange}></TextField>
                                            <TextField value={state.password} id={"password"} label={"パスワード"} placeholder={"*****"} type={"password"} onChange={handlePasswordChange}></TextField>
                                            <TextField value={state.passwordConfirm} id={"passwordConfirm"} label={"パスワード再入力"} placeholder={"*****"} type={"password"} onChange={handlePasswordConfirmChange}></TextField>
                                            <TextField value={state.postCode} id={"postCode"} label={"郵便番号"} placeholder={"0001111"} type={"number"} onChange={handlePostCodeChange}></TextField>
                                            <TextField value={state.address} id={"address"} label={"住所"} placeholder={"XX県XX市..."} type={"text"} onChange={handleAddressChange}></TextField>
                                            <TextField value={state.name} id={"name"} label={"名前"} placeholder={"苗字名前"} type={"text"} onChange={handleName}></TextField>
                                            <TextField value={state.furigana} id={"furigana"} label={"フリガナ"} placeholder={"ミョウジナマエ"} type={"text"} onChange={handleFurigana}></TextField>
                                            <TextField value={state.phone} id={"phone"} label={"電話番号"} placeholder={"00011112222"} type={"number"} onChange={handlePhoneChange}></TextField>
                                            <TextField value={state.birth} id={"birth"} type={"date"} onChange={handleBirth}></TextField>
                                            <FormGroup>
                                                <FormControlLabel control={<Checkbox checked={state.isNotice} onChange={handleIsNotice}/>} label={"お知らせメールを希望するか"}/>
                                            </FormGroup>
                                            {
                                                state.isError ? <p>{state.helperText}</p> : null
                                            }
                                            <Button onClick={handleNextButtonClick} variant={"contained"}>次へ</Button>
                                            <Link to={"/login"}>ログイン</Link>
                                        </React.Fragment>
                                    );
                                case 1:
                                    return (
                                        <React.Fragment>
                                            <h2>利用規約</h2>
                                            <p>----------------------</p>
                                            <p>次へを押すことで利用規約に同意したものとみなします。</p>
                                            <Button onClick={handleBackButtonClick} variant={"contained"}>戻る</Button>
                                            <Button onClick={handleNextButtonClick} variant={"contained"}>次へ</Button>
                                            <Link to={"/login"}>ログイン</Link>
                                        </React.Fragment>
                                    );
                                case 2:
                                    return(
                                        <React.Fragment>
                                            <p>本当に登録しますか</p>
                                            <Button onClick={handleBackButtonClick} variant={"contained"}>戻る</Button>
                                            <Button onClick={handleNextButtonClick} variant={"contained"} disabled={!state.isButtonDisabled}>登録する</Button>
                                            <Link to={"/login"}>ログイン</Link>
                                        </React.Fragment>
                                    )
                                default:
                                    return null;
                            }
                        })()
                    }
                </div>
            </div>
        </React.Fragment>
    )
}