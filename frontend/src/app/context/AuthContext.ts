import { UserCredential,User } from "firebase/auth";
import { createContext ,Dispatch,SetStateAction} from "react";

type SignUpProps = {
    email: string,
    password: string,
    postCode: string,
    address: string,
    name: string,
    furigana: string,
    phone: string,
    birth: string,
    isNotice:number,
}

type LoginProps = {
    email: string,
    password: string,
}

type ProfileType = {
    address:string,
    birth:string,
    furigana:string,
    id:number,
    name:string,
    phone:string,
    postCode:string,
    uid:string,
    isNotice:number
}

type AuthContextValue = {
    currentUser: User |null | undefined;
    profile: ProfileType | undefined;
    setProfile: Dispatch<SetStateAction<ProfileType | undefined>>;
    loading: boolean;
    setLoading: Dispatch<SetStateAction<boolean>>;
    signup: (props: SignUpProps) => Promise<UserCredential>;
    login: (props: LoginProps) => Promise<UserCredential>;
    logout: () => Promise<void>;
    resetPassword: (props:{email:string}) => Promise<void>;
    changePassword: (props:{password:string}) => Promise<void>;
    deleteUserLogout: () => Promise<void>;
    //admin
    adminId:string|undefined;
    adminPassword:string|undefined;
    setAdminId:Dispatch<SetStateAction<string|undefined>>;
    setAdminPassword:Dispatch<SetStateAction<string|undefined>>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);