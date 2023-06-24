import {Routes,Route} from "react-router-dom";
import {TopPage,SignUp,Login, MyPage,EmailVerify,ResetPassword,AdminLogin,AdminMyPage,AdminReceiptCampaign,ReceiptCampaignList,ReceiptCampaign,AdminInstantWin,InstantWin,InstantWinList,AdminShoppingRally,ShoppingRallyList,ShoppingRally,AdminQuestionnaire,Questionnaire,QuestionnaireList, AdminOneTouch, AdminOneTouchLog, OneTouchList, OneTouch, AdminUserInfo, AdminUserPoint} from "../app/components/pages";
import { AuthFirebase } from "./AuthFirebase";
import { NoAuthFirebase } from "./NoAuthFirebase";
import { AuthAdmin } from "./AuthAdmin";
import { NoAuthAdmin } from "./NoAuthAdmin";

export const Router = () => {
    return(
        <Routes>
            <Route index path={"/"} element={<TopPage/>}></Route>
            <Route path={"/signup"} element={<NoAuthFirebase children={<SignUp/>} />}></Route>
            <Route path={"/login"} element={<NoAuthAdmin children={<NoAuthFirebase children={<Login />} />}/>}></Route>
            <Route path={"/mypage"} element={<AuthFirebase children={<MyPage/>}/>}></Route>
            <Route path={"/emailVerify"} element={<EmailVerify/>}></Route>
            <Route path={"/resetPassword"} element={<NoAuthFirebase children={<ResetPassword/>}/>}></Route>
            <Route path={"/admin/login"} element={<NoAuthFirebase children={<NoAuthAdmin children={<AdminLogin />} />}/>}></Route>
            <Route path={"/admin/mypage"} element={<AuthAdmin children={<AdminMyPage/>}/>}></Route>
            <Route path={"/admin/receiptCampaign"} element={<AuthAdmin children={<AdminReceiptCampaign/>}/>}></Route>
            <Route path={"/admin/instantWin"} element={<AuthAdmin children={<AdminInstantWin/>}/>}></Route>
            <Route path={"/admin/shoppingRally"} element={<AuthAdmin children={<AdminShoppingRally/>}/>}></Route>
            <Route path={"/admin/questionnaire"} element={<AuthAdmin children={<AdminQuestionnaire/>} />}></Route>
            <Route path={"/admin/onetouch"} element={<AuthAdmin children={<AdminOneTouch/>}/>}></Route>
            <Route path={"/admin/onetouch/log"} element={<AuthAdmin children={<AdminOneTouchLog/>}/>}></Route>
            <Route path={"/admin/userInfo"} element={<AuthAdmin children={<AdminUserInfo/>}/>}></Route>
            <Route path={"/admin/userPoint"} element={<AuthAdmin children={<AdminUserPoint/>}/>}></Route>

            <Route path={"/receiptCampaignList"} element={<AuthFirebase children={<ReceiptCampaignList/>}/>}></Route>
            <Route path={"/receiptCampaign/:id"} element={<AuthFirebase children={<ReceiptCampaign/>}/>}></Route>

            <Route path={"/instantWinList"} element={<AuthFirebase children={<InstantWinList/>}/>}></Route>
            <Route path={"/instantWin/:id"} element={<AuthFirebase children={<InstantWin/>}/>}></Route>

            <Route path={"/shoppingRallyList"} element={<AuthFirebase children={<ShoppingRallyList/>}/>}></Route>
            <Route path={"/shoppingRally/:id"} element={<AuthFirebase children={<ShoppingRally/>}/>}></Route>

            <Route path={"/questionnaireList"} element={<AuthFirebase children={<QuestionnaireList/>}/>}></Route>
            <Route path={"/questionnaire/:id"} element={<AuthFirebase children={<Questionnaire/>}/>}></Route>

            <Route path={"/onetouchList"} element={<AuthFirebase children={<OneTouchList/>}/>}></Route>
            <Route path={"/onetouch/:id"} element={<AuthFirebase children={<OneTouch/>}/>}></Route>
        </Routes>
    )
}