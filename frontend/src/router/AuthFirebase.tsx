import React,{ReactNode} from "react";
import {Navigate} from "react-router-dom";
import {useAuthContext} from "../app/context/useAuthContext";
import { Login } from "../app/components/pages";

type Props = {
    children: ReactNode;
}

export const AuthFirebase = ({children}:Props) => {
    const authContext = useAuthContext();
    if(authContext?.loading)return (<h1>ロード中</h1>)
    if(authContext?.currentUser && authContext.currentUser.emailVerified){
        return children;
    }
    else{
        if(authContext?.currentUser && !authContext.currentUser.emailVerified){
            return <Navigate to={"/emailVerify"}/>
        }
        authContext?.logout();
        return <Navigate to={"/login"}/>
    }
}