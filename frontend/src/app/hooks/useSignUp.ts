import {ChangeEvent,useReducer} from "react";
import {auth} from "../../firebase/firebase";
import { useAuthContext } from "../context/useAuthContext";

type State = {
    email: string,
    emailConfirm: string,
    password: string,
    passwordConfirm: string,
    postCode: string,
    address: string,
    name: string,
    furigana: string,
    phone: string,
    birth: string,
    helperText: string,
    isError: boolean,
    isButtonDisabled: boolean,
    mode: number,
    isNotice:boolean
};

const initialState: State = {
    email: "",
    emailConfirm: "",
    password: "",
    passwordConfirm: "",
    postCode: "",
    address: "",
    name: "",
    furigana: "",
    phone: "",
    birth: "",
    helperText: "",
    isError: false,
    isButtonDisabled: false,
    mode: 0,
    isNotice:true,
};

type Action = 
    | {type: "setEmail", payload: string}
    | {type: "setEmailConfirm",payload: string}
    | {type:"setPassword",payload:string}
    | {type:"setPasswordConfirm",payload:string}
    | {type:"setPostCode",payload:string}
    | {type:"setAddress",payload:string}
    | {type:"setName",payload:string}
    | {type:"setFurigana",payload: string}
    | {type:"setPhone",payload: string}
    | {type:"setBirth",payload:string}
    | {type:"setHelperText",payload:string}
    | {type:"setIsError",payload:boolean}
    | {type:"setIsButtonDisabled",payload:boolean}
    | {type:"setMode",payload:number}
    | {type:"setIsNotice",payload:boolean};

const reducer = (state:State,action:Action):State => {
    switch(action.type){
        case "setEmail":
            return {...state,email:action.payload};
        case "setEmailConfirm":
            return {...state,emailConfirm:action.payload};
        case "setPassword":
            return {...state,password:action.payload};
        case "setPasswordConfirm":
            return {...state,passwordConfirm:action.payload};
        case "setPostCode":
            return {...state,postCode:action.payload};
        case "setAddress":
            return {...state,address:action.payload};
        case "setName":
            return {...state,name:action.payload};
        case "setFurigana":
            return {...state,furigana:action.payload};
        case "setPhone":
            return {...state,phone:action.payload};
        case "setBirth":
            return {...state,birth:action.payload};
        case "setHelperText":
            return {...state,helperText:action.payload};
        case "setIsError":
            return {...state,isError:action.payload};
        case "setIsButtonDisabled":
            return {...state,isButtonDisabled:action.payload};
        case "setMode":
            return {...state,mode:action.payload};
        case "setIsNotice":
            return {...state,isNotice:action.payload};
        default:
            return state;
    }
};

export const useSignUp = () => {
    const authContext = useAuthContext();
    const [state,dispatch] = useReducer(reducer,initialState);
    const initError = () => {
        dispatch({type: "setIsError",payload: false});
        dispatch({type:"setHelperText",payload: ""});
    };
    const isValidate = () => {
        initError();
        if(!isEmail(state.email)){
            dispatch({type: "setIsError",payload:true});
            dispatch({type: "setHelperText",payload: "メールアドレスを入力してください。"});
            return false;
        }
        if(state.email !== state.emailConfirm){
            dispatch({ type: "setIsError", payload: true });
            dispatch({ type: "setHelperText", payload: "メールアドレスが同じではありません。" });
            return false;
        }
        if(!isPassword(state.password)){
            dispatch({ type: "setIsError", payload: true });
            dispatch({ type: "setHelperText", payload: "パスワードが弱いです。" });
            return false;
        }
        if(state.password !== state.passwordConfirm){
            dispatch({ type: "setIsError", payload: true });
            dispatch({ type: "setHelperText", payload: "パスワードが同じではありません。" });
            return false;
        }
        if(!isPostCode(state.postCode)){
            dispatch({ type: "setIsError", payload: true });
            dispatch({ type: "setHelperText", payload: "郵便番号を正しく入力してください。ハイフンなどは要りません。" });
            return false;
        }
        if(state.address.length < 1){
            dispatch({ type: "setIsError", payload: true });
            dispatch({ type: "setHelperText", payload: "住所を入力してください。" });
            return false;
        }
        if(!(state.name.length > 0 && state.name.length < 65)){
            dispatch({ type: "setIsError", payload: true });
            dispatch({ type: "setHelperText", payload: "名前を入力してください。" });
            return false;
        }
        if(!isFurigana(state.furigana)){
            dispatch({ type: "setIsError", payload: true });
            dispatch({ type: "setHelperText", payload: "フリガナを入力してください。カタカナで入力してください。" });
            return false;
        }
        if(!isPhone(state.phone)){
            dispatch({ type: "setIsError", payload: true });
            dispatch({ type: "setHelperText", payload: "電話番号を正しく入力してください。ハイフンなどは要りません。" });
            return false;
        }
        if(state.birth.length===0){
            dispatch({ type: "setIsError", payload: true });
            dispatch({ type: "setHelperText", payload: "生年月日を入力してください。" });
            return false;
        }
        return true;
    };
    const hasWhitespace = (value:string) => {
        const check = /\s/;
        return check.test(value);
    };
    const isEmail = (value:string) => {
        const check = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return check.test(value);
    };
    const isPostCode = (value:string) => {
        const check = /^[0-9]+$/;
        return check.test(value) && value.length === 7;
    };
    const isPhone = (value:string) => {
        const check = /^[0-9]+$/;
        return check.test(value) && value.length === 11;
    }
    const isPassword = (value:string) => {
        const check = /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)[a-zA-Z\d]{8,100}$/;
        return check.test(value);
    };
    const isFurigana = (value:string) => {
        const check = /^[ァ-ンヴー]+$/;
        return check.test(value) && value.length < 65;
    };
    const handleSignUpButtonClick = async() => {
        dispatch({type: "setIsButtonDisabled",payload:false});
        try {
            const userC = await authContext?.signup({
                email:state.email,
                password:state.password,
                postCode:state.postCode,
                address:state.address,
                name:state.name,
                furigana:state.furigana,
                phone:state.phone,
                birth:state.birth,
                isNotice: state.isNotice ? 1 : 0
            });
            if(userC){
                window.alert("仮登録が完了しました。メールアドレスを確認して、認証をしてください。");
            }
            else{
                dispatch({ type: "setIsError", payload: true });
                dispatch({ type: "setHelperText", payload: "何らかの理由で登録ができませんでした。" });
                dispatch({ type: "setMode", payload: 0 });
            }
            //admin_auth.setCustomUserClaims();
        } catch (e:any) {
            console.error(e);
            switch(e.code){
                case "auth/network-request-failed":
                    dispatch({type:"setIsError",payload:true});
                    dispatch({ type: "setHelperText", payload: "通信がエラーになったのか、またはタイムアウトになりました。通信環境がいい所で再度やり直してください。"});
                    dispatch({type: "setMode",payload: 0});
                    break;
                case "auth/weak-password":
                    dispatch({ type: "setIsError", payload: true });
                    dispatch({ type: "setHelperText", payload: "パスワードが短すぎます。" });
                    dispatch({ type: "setMode", payload: 0 });
                    break;
                case "auth/invalid-email":
                    dispatch({ type: "setIsError", payload: true });
                    dispatch({ type: "setHelperText", payload: "メールアドレスが正しくありません。" });
                    dispatch({ type: "setMode", payload: 0 });
                    break;
                case "auth/email-already-in-use":
                    dispatch({ type: "setIsError", payload: true });
                    dispatch({ type: "setHelperText", payload: "メールアドレスがすでに使用されています。ログインするか別のメールアドレスで作成してください。" });
                    dispatch({ type: "setMode", payload: 0 });
                    break;
                case "auth/user-disabled":
                    dispatch({ type: "setIsError", payload: true });
                    dispatch({ type: "setHelperText", payload: "入力されたメールアドレスは無効（BAN）になっています。" });
                    dispatch({ type: "setMode", payload: 0 });
                    break;
                default:
                    dispatch({ type: "setIsError", payload: true });
                    dispatch({ type: "setHelperText", payload: "何らかの理由でアカウントの作成に失敗しました。再度やり直してください。" });
                    dispatch({ type: "setMode", payload: 0 });
                    break;
            };
            dispatch({ type: "setMode", payload: 0 });
        }
    }

    const handleNextButtonClick = async () => {
        switch(state.mode){
            case 0:
                if(isValidate()){
                    dispatch({ type: "setMode", payload: 1 });
                    dispatch({ type: "setIsButtonDisabled", payload: true });
                }
                break;
            case 1:
                dispatch({ type: "setMode", payload: 2 });
                dispatch({ type: "setIsButtonDisabled", payload: true });
                break;
            case 2:
                await handleSignUpButtonClick();
                break;
            default:
                break;
        }
    };
    const handleBackButtonClick = () => {
        switch(state.mode){
            case 1:
                dispatch({ type: "setMode", payload: 0});
                break;
            case 2:
                dispatch({ type: "setMode", payload: 1 });
                dispatch({ type: "setIsButtonDisabled", payload: false });
                break;
            default:
                break;
        }
    };

    const handleEmailChange = (value: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        dispatch({type: "setEmail",payload:value.target.value});
    };
    const handleEmailConfirmChange = (value: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        dispatch({ type: "setEmailConfirm", payload: value.target.value });
    };
    const handlePasswordChange = (value: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        dispatch({ type: "setPassword", payload: value.target.value });
    };
    const handlePasswordConfirmChange = (value: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        dispatch({ type: "setPasswordConfirm", payload: value.target.value });
    };
    const handlePostCodeChange = (value: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        dispatch({ type: "setPostCode", payload:value.target.value });
    };
    const handlePhoneChange = (value: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        dispatch({type: "setPhone",payload:value.target.value});
    }
    const handleAddressChange = (value: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        dispatch({ type: "setAddress", payload: value.target.value });
    };
    const handleName = (value: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        dispatch({ type: "setName", payload: value.target.value });
    };
    const handleFurigana = (value: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        dispatch({ type: "setFurigana", payload: value.target.value });
    };
    const handleBirth = (value: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        dispatch({type: "setBirth",payload:value.target.value});
    };
    const handleIsNotice = (value: ChangeEvent<HTMLInputElement>) => {
        dispatch({ type: "setIsNotice", payload: value.target.checked });
    }

    return {state,handlePhoneChange,handleIsNotice,handleBirth,handleNextButtonClick,handleBackButtonClick,handleEmailChange,handleEmailConfirmChange,handlePasswordChange,handlePasswordConfirmChange,handlePostCodeChange,handleAddressChange,handleName,handleFurigana};
}