import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../app/context/useAuthContext";

type Props = {
    children: ReactNode;
}

export const NoAuthAdmin = ({ children }: Props) => {
    const authContext = useAuthContext();
    if (authContext?.adminId && authContext.adminPassword) {
        /*
        if(window.location.pathname === "/admin/login"){
            return children;
        }
        */
        return <Navigate to={"/admin/mypage"} />
    }
    else {
        return children;
    }
}