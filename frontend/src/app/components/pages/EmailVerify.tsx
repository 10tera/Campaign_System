import React,{useState} from "react";
import {Link, Navigate} from "react-router-dom";
import {Button} from "@mui/material";
import { sendEmailVerification } from "firebase/auth";
import {useAuthContext} from "../../context/useAuthContext";

export const EmailVerify = () => {
    const [isButtonDisable,setIsButtonDisable] = useState(false);
    const authContext = useAuthContext();
    if(authContext?.loading)return(<h1>ロード中</h1>);
    if(authContext?.currentUser && authContext.currentUser.emailVerified)return <Navigate to={"/"}/>
    if(authContext?.currentUser && !authContext.currentUser.emailVerified){
        return(
            <React.Fragment>
                <h1>認証メールから認証してください</h1>
                <Button variant={"contained"} disabled={isButtonDisable} onClick={async() => {
                    if(authContext.currentUser){
                        setIsButtonDisable(true);
                        await sendEmailVerification(authContext.currentUser);
                    }
                }}>認証メールを再送信する</Button>
                <Button variant={"contained"}><Link to={"/"} style={{color: "white"}}>ホームへ戻る</Link></Button>
            </React.Fragment>
        )
    }
    else{
        return <Navigate to={"/"}/>
    }
}