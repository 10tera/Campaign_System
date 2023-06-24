import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../app/context/useAuthContext";

type Props = {
    children: ReactNode;
}

export const AuthAdmin = ({ children }: Props) => {
    const authContext = useAuthContext();
    if (authContext?.adminId && authContext.adminPassword) {
        return children;
    }
    else {
        return <Navigate to={"/admin/login"} />
    }
}