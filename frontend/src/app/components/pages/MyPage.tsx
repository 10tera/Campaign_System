/** @jsxImportSource @emotion/react */
/** @jsx jsx */
import { css } from "@emotion/react";
import React,{useEffect,useState,ChangeEvent} from "react";
import {Link,useNavigate} from "react-router-dom";
import {AppBar,Toolbar,Button,Modal,Box,TextField,FormGroup,FormControlLabel,Checkbox} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { userGet ,userSet,userDelete} from "../../api/ApiClient";
import { useAuthContext } from "../../context/useAuthContext";
import { auth } from "../../../firebase/firebase";

const mainDivCss = css({
    paddingLeft: "30px",
    paddingRight: "30px"
});
const appBarCss = css({
    //display:"flex",
    //flexWrap: "nowrap",
    //maxWidth:"100%"
    width: "100%"
});
const barButtonCss = css({
    color:"white",
    marginLeft: "20px",
    borderColor: "white",
    border: "1px solid",
    borderRadius: "2px"
});

const gridCss = css({
    width: "100%",
    maxWidth: "700px",
    margin: "0 auto"
});

const gridCildCss = css({
    wordBreak: "break-all"
});

const modalCss =css({
    position: "absolute",
    top:"50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    width: "80%",
    maxWidth: "400px",
    border: "2px solid",
    boxShadow: "24",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    flexFlow: "column",
    gap: "20px",
});
const modalChildCss = css({
    margin: "0 auto"
});

export const MyPage = () => {
    const authContext = useAuthContext();
    const navigate = useNavigate();
    const [isOpenModal,setIsOpenModal] = useState(false);
    const [nowChange,setNowChange] = useState("");
    const [newValue,setNewValue] = useState("");
    const [isError,setIsError] = useState(false);
    const [helperText,setHelperText] = useState("");
    const [isButtonDisable,setIsButtondisable] = useState(false);
    const {data,error,isLoading,refetch} = userGet({uid: authContext?.currentUser?.uid});
    useEffect(() => {
        if (!isLoading) {
            authContext?.setProfile(data);
        }
    }, [data]);
    const isFurigana = (value: string) => {
        const check = /^[ァ-ンヴー]+$/;
        return check.test(value) && value.length < 65;
    };
    const isPostCode = (value: string) => {
        const check = /^[0-9]+$/;
        return check.test(value) && value.length === 7;
    };
    const isPhone = (value: string) => {
        const check = /^[0-9]+$/;
        return check.test(value) && value.length === 11;
    }
    const isPassword = (value: string) => {
        const check = /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)[a-zA-Z\d]{8,100}$/;
        return check.test(value);
    };
    const initError = () => {
        setIsError(false);
        setHelperText("");
    }
    const handleNewValueChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setNewValue(event.target.value);
    }
    const handleCloseModal = () => {
        setIsOpenModal(false);
        setNewValue("");
        initError();
        setIsButtondisable(false);
    }

    const handleOpenButtonClick = (kind:string) => {
        setNewValue("");
        setIsOpenModal(true);
        setNowChange(kind);
    }
    const handleChangeButtonClick = async() => {
        initError();
        setIsButtondisable(true);
        switch(nowChange){
            case "パスワード":
                if(!isPassword(newValue)){
                    setIsError(true);
                    setHelperText("パスワードが弱いです。");
                    setIsButtondisable(false);
                    return;
                }
                try {
                    await authContext?.changePassword({password: newValue});
                    handleCloseModal();
                    window.alert("パスワードを更新しました。");
                } catch (e:any) {
                    console.log(e.code);
                    setIsError(true);
                    setHelperText("パスワードの更新に失敗しました。セッションを新しくするために、ログアウトしたのち、再度ログインしてみてください。");
                    setIsButtondisable(false);
                    return;
                }
                break;
            case "名前":
                if (!(newValue.length > 0 && newValue.length < 65)){
                    setIsError(true);
                    setHelperText("名前を入力してください。");
                    setIsButtondisable(false);
                    return;
                }
                try {
                    const res = await userSet({uid:authContext?.currentUser?.uid,kind: "name",value: newValue});
                    // @ts-ignore
                    refetch();
                    handleCloseModal();
                    window.alert("更新しました。")
                } catch (e) {
                    console.error(e);
                    setIsError(true);
                    setHelperText("更新時にエラーが発生しました。");
                    setIsButtondisable(false);
                    return;
                }
                break;
            case "フリガナ":
                if(!isFurigana(newValue)){
                    setIsError(true);
                    setHelperText("フリガナをカタカナで入力して下さい。");
                    setIsButtondisable(false);
                    return;
                }
                try {
                    const res = await userSet({ uid: authContext?.currentUser?.uid, kind: "furigana", value: newValue });
                    // @ts-ignore
                    refetch();
                    handleCloseModal();
                    window.alert("更新しました。")
                } catch (e) {
                    console.error(e);
                    setIsError(true);
                    setHelperText("更新時にエラーが発生しました。");
                    setIsButtondisable(false);
                    return;
                }
                break;
            case "郵便番号":
                if(!isPostCode(newValue)){
                    setIsError(true);
                    setHelperText("郵便番号を数字で入力してください。ハイフンは要りません。");
                    setIsButtondisable(false);
                    return;
                }
                try {
                    const res = await userSet({ uid: authContext?.currentUser?.uid, kind: "postCode", value: newValue });
                    // @ts-ignore
                    refetch();
                    handleCloseModal();
                    window.alert("更新しました。")
                } catch (e) {
                    console.error(e);
                    setIsError(true);
                    setHelperText("更新時にエラーが発生しました。");
                    setIsButtondisable(false);
                    return;
                }
                break;
            case "住所":
                if (newValue.length === 0){
                    setIsError(true);
                    setHelperText("住所を入力してください。");
                    setIsButtondisable(false);
                    return;
                }
                try {
                    const res = await userSet({ uid: authContext?.currentUser?.uid, kind: "address", value: newValue });
                    // @ts-ignore
                    refetch();
                    handleCloseModal();
                    window.alert("更新しました。")
                } catch (e) {
                    console.error(e);
                    setIsError(true);
                    setHelperText("更新時にエラーが発生しました。");
                    setIsButtondisable(false);
                    return;
                }
                break;
            case "生年月日":
                if (newValue.length === 0){
                    setIsError(true);
                    setHelperText("生年月日を入力してください。");
                    setIsButtondisable(false);
                    return;
                }
                try {
                    const res = await userSet({ uid: authContext?.currentUser?.uid, kind: "birth", value: newValue });
                    // @ts-ignore
                    refetch();
                    handleCloseModal();
                    window.alert("更新しました。")
                } catch (e) {
                    console.error(e);
                    setIsError(true);
                    setHelperText("更新時にエラーが発生しました。");
                    setIsButtondisable(false);
                    return;
                }
                break;
            case "電話番号":
                if(!isPhone(newValue)){
                    setIsError(true);
                    setHelperText("電話番号を数字で入力してください。ハイフンは要りません。");
                    setIsButtondisable(false);
                    return;
                }
                try {
                    const res = await userSet({ uid: authContext?.currentUser?.uid, kind: "phone", value: newValue });
                    // @ts-ignore
                    refetch();
                    handleCloseModal();
                    window.alert("更新しました。")
                } catch (e) {
                    console.error(e);
                    setIsError(true);
                    setHelperText("更新時にエラーが発生しました。");
                    setIsButtondisable(false);
                    return;
                }
                break;
            case "お知らせ":
                const noticeStr = newValue === "" ? "0" : newValue;
                try {
                    const res = await userSet({uid:authContext?.currentUser?.uid,kind:"isNotice",value:noticeStr});
                    // @ts-ignore
                    refetch();
                    handleCloseModal();
                    window.alert("更新しました。")
                } catch (e) {
                    console.error(e);
                    setIsError(true);
                    setHelperText("更新時にエラーが発生しました。");
                    setIsButtondisable(false);
                    return;
                }
                break;
            default:
                return;
        }
        handleCloseModal();
    }
    const handleDeleteUser = async () => {
        setIsButtondisable(true);
        try {
            const uid = authContext?.currentUser?.uid;
            await authContext?.deleteUserLogout();
            await userDelete({uid:uid});
            navigate("/");
        } catch (e) {
            console.error(e);
            setIsError(true);
            setHelperText("削除時にエラーが発生しました。ログインしなおしたりして、再度お試しください。");
            setIsButtondisable(false);
        }
    }

    if(isLoading)return (<h1>ロード中</h1>)
    
    if(error)return(<h3>エラーが発生しました。再度読み込んでみてください</h3>)
    return(
        <React.Fragment>
            <div>
                <AppBar position={"static"} css={appBarCss}>
                    <Toolbar>
                        <h4>{authContext?.profile?.name} のマイページ</h4>
                        <Button css={barButtonCss} onClick={() => {
                            navigate("/")
                        }}>ホーム</Button>
                        <Button css={barButtonCss} onClick={() => {
                            authContext?.logout();
                        }}>ログアウト
                        </Button>
                        <Button css={barButtonCss} onClick={async() => {
                            setIsOpenModal(true);
                            setNowChange("deleteUser");
                        }}>アカウント削除
                        </Button>
                    </Toolbar>
                </AppBar>
                <Modal open={isOpenModal} onClose={handleCloseModal}>
                    <Box css={modalCss}>
                        {
                            nowChange === "deleteUser" ? 
                            <React.Fragment>
                                    <h1 css={modalChildCss}>アカウント削除</h1>
                                    <p>本当に削除しますか？</p>
                                    {
                                        isError ? <p>{helperText}</p>: null
                                    }
                                    <Button disabled={isButtonDisable} css={modalChildCss} variant={"contained"} onClick={handleDeleteUser}>削除する</Button>
                            </React.Fragment>:
                            <React.Fragment>
                                    <h1 css={modalChildCss}>変更画面</h1>
                                    {
                                        (() => {
                                            switch (nowChange) {
                                                case "パスワード":
                                                    return <TextField css={modalChildCss} value={newValue} id={"password"} label={"パスワード"} placeholder={"*****"} type={"password"} onChange={handleNewValueChange}></TextField>
                                                case "名前":
                                                    return <TextField css={modalChildCss} value={newValue} onChange={handleNewValueChange} id={"name"} label={"名前"} placeholder={"苗字名前"} type={"text"} />;
                                                case "フリガナ":
                                                    return <TextField css={modalChildCss} value={newValue} id={"furigana"} label={"フリガナ"} placeholder={"ミョウジナマエ"} type={"text"} onChange={handleNewValueChange}></TextField>;
                                                case "郵便番号":
                                                    return <TextField css={modalChildCss} value={newValue} id={"postCode"} label={"郵便番号"} placeholder={"0001111"} type={"number"} onChange={handleNewValueChange}></TextField>;
                                                case "住所":
                                                    return <TextField css={modalChildCss} value={newValue} id={"address"} label={"住所"} placeholder={"XX県XX市..."} type={"text"} onChange={handleNewValueChange}></TextField>;
                                                case "生年月日":
                                                    return <TextField css={modalChildCss} value={newValue} id={"birth"} type={"date"} onChange={handleNewValueChange}></TextField>;
                                                case "電話番号":
                                                    return <TextField css={modalChildCss} value={newValue} id={"phone"} label={"電話番号"} placeholder={"00011112222"} type={"number"} onChange={handleNewValueChange}></TextField>;
                                                case "お知らせ":
                                                    return <FormGroup><FormControlLabel label={"お知らせメールを希望するか"} control={<Checkbox checked={newValue === "1" ? true:false} onChange={(e) => e.target.checked ? setNewValue("1"):setNewValue("0")}/>}/></FormGroup>
                                                default: return null;
                                            }
                                        })()
                                    }
                                    {
                                        isError ? <p>{helperText}</p> : null
                                    }
                                    <Button disabled={isButtonDisable} css={modalChildCss} variant={"contained"} onClick={handleChangeButtonClick}>変更する</Button>
                            </React.Fragment>
                        }
                    </Box>
                </Modal>
                <div css={mainDivCss}>
                    <h2>登録情報</h2>
                    <Grid css={gridCss} container spacing={2}>
                        <Grid xs={4}>
                            <h4>メールアドレス</h4>
                        </Grid>
                        <Grid css={gridCildCss} xs={4}>
                            <p>{authContext?.currentUser?.email}</p>
                        </Grid>
                        <Grid xs={4}>
                            <p>変更不可</p>
                        </Grid>
                        <Grid xs={4}>
                            <h4>パスワード</h4>
                        </Grid>
                        <Grid css={gridCildCss} xs={4}>
                            <p>****************</p>
                        </Grid>
                        <Grid xs={4}>
                            <Button onClick={() => handleOpenButtonClick("パスワード")}>変更</Button>
                        </Grid>
                        <Grid xs={4}>
                            <h4>名前</h4>
                        </Grid>
                        <Grid css={gridCildCss} xs={4}>
                            <p>{authContext?.profile?.name}</p>
                        </Grid>
                        <Grid xs={4}>
                            <Button onClick={() => handleOpenButtonClick("名前")}>変更</Button>
                        </Grid>
                        <Grid xs={4}>
                            <h4>フリガナ</h4>
                        </Grid>
                        <Grid css={gridCildCss} xs={4}>
                            <p>{authContext?.profile?.furigana}</p>
                        </Grid>
                        <Grid xs={4}>
                            <Button onClick={() => handleOpenButtonClick("フリガナ")}>変更</Button>
                        </Grid>
                        <Grid xs={4}>
                            <h4>郵便番号</h4>
                        </Grid>
                        <Grid css={gridCildCss} xs={4}>
                            <p>{authContext?.profile?.postCode}</p>
                        </Grid>
                        <Grid xs={4}>
                            <Button onClick={() => handleOpenButtonClick("郵便番号")}>変更</Button>
                        </Grid>
                        <Grid xs={4}>
                            <h4>住所</h4>
                        </Grid>
                        <Grid css={gridCildCss} xs={4}>
                            <p>{authContext?.profile?.address}</p>
                        </Grid>
                        <Grid xs={4}>
                            <Button onClick={() => handleOpenButtonClick("住所")}>変更</Button>
                        </Grid>
                        <Grid xs={4}>
                            <h4>生年月日</h4>
                        </Grid>
                        <Grid css={gridCildCss} xs={4}>
                            <p>{authContext?.profile?.birth}</p>
                        </Grid>
                        <Grid xs={4}>
                            <Button onClick={() => handleOpenButtonClick("生年月日")}>変更</Button>
                        </Grid>
                        <Grid xs={4}>
                            <h4>電話番号</h4>
                        </Grid>
                        <Grid css={gridCildCss} xs={4}>
                            <p>{authContext?.profile?.phone}</p>
                        </Grid>
                        <Grid xs={4}>
                            <Button onClick={() => handleOpenButtonClick("電話番号")}>変更</Button>
                        </Grid>
                        <Grid xs={4}>
                            <h4>お知らせメール</h4>
                        </Grid>
                        <Grid css={gridCildCss} xs={4}>
                            <p>{authContext?.profile?.isNotice === 1 ? "希望する" : "希望しない"}</p>
                        </Grid>
                        <Grid xs={4}>
                            <Button onClick={() => handleOpenButtonClick("お知らせ")}>変更</Button>
                        </Grid>
                    </Grid>
                </div>
            </div>
        </React.Fragment>
    )
}