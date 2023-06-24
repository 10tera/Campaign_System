import {ReactNode,useState,useEffect} from "react";
import { AuthContext } from "./AuthContext";
import {auth,firebase} from "../../firebase/firebase";
import { User,createUserWithEmailAndPassword ,sendEmailVerification,deleteUser,signInWithEmailAndPassword,signOut,updatePassword,sendPasswordResetEmail} from "firebase/auth";
import {userAdd} from "../api/ApiClient";

type Props = {
    children: ReactNode;
}

type SignUpProps = {
    email: string,
    password: string,
    postCode: string,
    address: string,
    name: string,
    furigana: string,
    phone: string,
    birth: string,
    isNotice:number
};

type LoginProps = {
    email: string,
    password: string,
};

type ProfileType = {
    address: string,
    birth: string,
    furigana: string,
    id: number,
    name: string,
    phone: string,
    postCode: string,
    uid: string,
    isNotice:number
}

export const AuthContextProvider = ({children}: Props) => {
    const [adminId,setAdminId] = useState<string | undefined>(undefined);
    const [adminPassword,setAdminPassword] = useState<string | undefined>(undefined);

    const [loading,setLoading] = useState(true);
    const [currentUser,setCurrentUser] = useState<User | null>();
    const [profile,setProfile] = useState<ProfileType | undefined>(undefined);
    const signup = async ({email,password,postCode,address,name,furigana,phone,birth,isNotice}: SignUpProps) => {
        let userCredential;
        try {
            userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const res = await userAdd({postCode:postCode,address:address,name:name,furigana:furigana,phone:phone,birth:birth,uid:userCredential.user.uid,isNotice:isNotice});
            await sendEmailVerification(userCredential.user);
            return userCredential;
        } catch (e) {
            if(userCredential){
                deleteUser(userCredential.user);
            }
            throw e;
        }
    }
    const login = async({email,password}:LoginProps) => {
        let userCredential;
        try {
            userCredential = await signInWithEmailAndPassword(auth,email,password);
            return userCredential;
        } catch (e) {
            throw e;
        }
    }
    const changePassword = async({password}:{password:string}) => {
        if(!currentUser)throw new Error("current user is null");
        try {
            await updatePassword(currentUser,password);
        } catch (e) {
            throw e;
        }
    }
    const resetPassword = async({email}:{email:string}) => {
        if(!email)throw new Error("emai is null");
        try {
            await sendPasswordResetEmail(auth,email);
        } catch (e) {
            throw e;
        }
    };
    const deleteUserLogout = async() => {
        try {
            await currentUser?.delete();
            setProfile(undefined);
            setCurrentUser(null);
        } catch (e) {
            throw e;
        }
    }
    const logout = async() => {
        try {
            await signOut(auth);
            setProfile(undefined);
            setCurrentUser(null);
        } catch (e) {
            throw e;
        }
    }
    useEffect(() => {
        auth.onAuthStateChanged(user => {
            setCurrentUser(user);
            if(!user)setProfile(undefined);
            setLoading(false);
        });
    },[]);
    return(
        <AuthContext.Provider value={{adminId,adminPassword:adminPassword,setAdminId:setAdminId,setAdminPassword:setAdminPassword,deleteUserLogout:deleteUserLogout,resetPassword:resetPassword,changePassword:changePassword,profile:profile,setProfile:setProfile,loading:loading,setLoading:setLoading,signup:signup,login:login,currentUser:currentUser,logout:logout}}>
            {children}
        </AuthContext.Provider>
    )
}