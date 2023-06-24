import { ChangeEvent, useReducer } from "react";
import {useNavigate} from "react-router-dom";
import { auth } from "../../firebase/firebase";
import { useAuthContext } from "../context/useAuthContext";

type State = {
    email: string,
    password: string,
    helperText: string,
    isError: boolean,
    isButtonDisabled: boolean,
};

const initialState: State = {
    email: "",
    password: "",
    helperText: "",
    isError: false,
    isButtonDisabled: true,
};

type Action =
    | { type: "setEmail", payload: string }
    | { type: "setPassword", payload: string }
    | { type: "setHelperText", payload: string }
    | { type: "setIsError", payload: boolean }
    | { type: "setIsButtonDisabled", payload: boolean };

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "setEmail":
            return { ...state, email: action.payload };
        case "setPassword":
            return { ...state, password: action.payload };
        case "setHelperText":
            return { ...state, helperText: action.payload };
        case "setIsError":
            return { ...state, isError: action.payload };
        case "setIsButtonDisabled":
            return { ...state, isButtonDisabled: action.payload };
        default:
            return state;
    }
};

export const useLogin = () => {
    const authContext = useAuthContext();
    const navigate = useNavigate();
    const [state, dispatch] = useReducer(reducer, initialState);
    const initError = () => {
        dispatch({ type: "setIsError", payload: false });
        dispatch({ type: "setHelperText", payload: "" });
    };
    const handleNextButtonClick = async () => {
        initError();
        if(!(state.email.length !== 0 && state.password.length !== 0)){
            dispatch({type: "setIsError",payload: true});
            dispatch({type: "setHelperText",payload: "入力してください。"});
            return;
        }
        dispatch({ type: "setIsButtonDisabled", payload: false });
        try {
            const userC = await authContext?.login({email:state.email,password:state.password});
            navigate("/");
        } catch (e:any) {
            dispatch({ type: "setIsButtonDisabled", payload: true });
            switch (e.code) {
                case "auth/network-request-failed":
                    dispatch({ type: "setIsError", payload: true });
                    dispatch({ type: "setHelperText", payload: "通信がエラーになったのか、またはタイムアウトになりました。通信環境がいい所で再度やり直してください。" });
                    break;
                case "auth/wrong-password":
                    dispatch({ type: "setIsError", payload: true });
                    dispatch({ type: "setHelperText", payload: "パスワードが間違っています。" });
                    break;
                case "auth/invalid-email":
                    dispatch({ type: "setIsError", payload: true });
                    dispatch({ type: "setHelperText", payload: "メールアドレスが正しくありません。" });
                    break;
                case "auth/user-disabled":
                    dispatch({ type: "setIsError", payload: true });
                    dispatch({ type: "setHelperText", payload: "ユーザーが無効化/BANされています。" });
                    break;
                case "auth/user-not-found":
                    dispatch({ type: "setIsError", payload: true });
                    dispatch({ type: "setHelperText", payload: "入力されたメールアドレスは見つかりませんでした。" });
                    break;
                default:
                    console.error(e);
                    dispatch({ type: "setIsError", payload: true });
                    dispatch({ type: "setHelperText", payload: "何らかの理由でアカウントの作成に失敗しました。再度やり直してください。" });
                    break;
            };

        }
    };
    const handleEmailChange = (value: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        dispatch({ type: "setEmail", payload: value.target.value });
    };
    const handlePasswordChange = (value: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        dispatch({ type: "setPassword", payload: value.target.value });
    };

    return {state,handleEmailChange,handlePasswordChange,handleNextButtonClick};
}