import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../app/context/useAuthContext";

type Props = {
    children: ReactNode;
}

export const NoAuthFirebase = ({ children }: Props) => {
    const authContext = useAuthContext();
    if(authContext?.loading)return(<h1>ロード中</h1>)
    if (authContext?.currentUser) {
        return <Navigate to={"/"}/>
    }
    else {
        return children;
    }
}