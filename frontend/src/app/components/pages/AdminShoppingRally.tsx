/** @jsxImportSource @emotion/react */
/** @jsx jsx */
import { css } from "@emotion/react";
import React, { useEffect, useState, ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Checkbox, FormGroup, FormControlLabel, AppBar, Toolbar, Button, Modal, Box, TextField, TableContainer, TableHead, TableRow, TableCell, TableBody, Select, FormControl, MenuItem, SelectChangeEvent, TableFooter, TablePagination } from "@mui/material";
import { useAuthContext } from "../../context/useAuthContext";
import {shoppingRallyGetAll,shoppingRallyDelete,shoppingRallyChangeActive,shoppingRallyGet,shoppingRallyGetUserInfo_NoQuery,shoppingRallyGetReceiptImg,shoppingRallyChangeUserState} from "../../api/ShoppingRallyApiClient";
import { TablePaginationActions } from "../split/TablePaginationActions";

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
const modalCss = css({
    position: "absolute",
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: "800px",
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: "24",
    backgroundColor: "white",
    //alignItems: "center",
    //justifyContent: "center",
    //display: "flex",
    //flexFlow: "column",
})
const barButtonCss = css({
    color: "white",
    marginLeft: "20px",
    borderColor: "white",
    border: "1px solid",
    borderRadius: "2px"
});
type ShoppingRallyType = {
    isActive: boolean,
    title: string,
    description: string,
    companyId: number,
}

const downloadCSV = (csvData: string, fileName: string) => {
    let bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
    const blob = new Blob([bom, csvData], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
}


export const AdminShoppingRally = () => {
    const navigate = useNavigate();
    const authContext = useAuthContext();
    const { data, error, isLoading, refetch } = shoppingRallyGetAll();
    const [receiptId, setReceiptId] = useState("");
    const [userUid, setUserUid] = useState("");
    const [campaignId, setCampaignId] = useState(-1);

    const [searchingCampaign, setSearchingCampaign] = useState<ShoppingRallyType>();
    const [searchedAllData, setSearchedAllData] = useState<any>();
    const [userInfo, setUserInfo] = useState<any>();

    const [isOpen, setIsOpen] = useState(false);
    const [comment, setComment] = useState("");

    const [isImgModalOpen,setIsImgModalOpen] = useState(false);
    const [receiptImg,setReceiptImg] = useState("");


    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [checked_state0, setChecked_state0] = useState(false);
    const [checked_state1, setChecked_state1] = useState(false);
    const [checked_state2, setChecked_state2] = useState(false);


    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        console.log(event.target.value)
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChecked_state0_Change = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setChecked_state0(true);
            setChecked_state1(false);
            setChecked_state2(false);
        }
        else {
            setChecked_state0(false);
            setChecked_state1(false);
            setChecked_state2(false);
        }
    }

    const handleChecked_state1_Change = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setChecked_state0(false);
            setChecked_state1(true);
            setChecked_state2(false);
        }
        else {
            setChecked_state0(false);
            setChecked_state1(false);
            setChecked_state2(false);
        }
    }

    const handleChecked_state2_Change = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setChecked_state0(false);
            setChecked_state1(false);
            setChecked_state2(true);
        }
        else {
            setChecked_state0(false);
            setChecked_state1(false);
            setChecked_state2(false);
        }
    }

    const handleModalClose = () => {
        setIsOpen(false);
    }

    const handleImgModalClose = () => {
        setIsImgModalOpen(false);
    }
    const handleImgModalOpen = async(path:string) => {
        try {
            if (!searchingCampaign?.companyId)return;
            const res = await shoppingRallyGetReceiptImg({ companyId: searchingCampaign?.companyId ,path: path});
            setReceiptImg(res);
            setIsImgModalOpen(true);
        } catch (e) {
            console.error(e);
            window.alert("画像取得時にエラーが発生しました。");
            return;
        }
    }

    const handleReceiptIdChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setReceiptId(e.target.value);
    };
    const handleUserUidChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setUserUid(e.target.value);
    };
    const handleCampaignSelectChange = (e: SelectChangeEvent<any>) => {
        setCampaignId(e.target.value);
    }
    const handleSearchButtonClick = async () => {
        let isOk = false;
        for (let i = 0; i < data.length; i++) {
            if (data[i].companyId === campaignId) {
                setSearchingCampaign(data[i]);
                isOk = true;
                break;
            }
        }
        if (!isOk) return;
        try {
            const allData = await shoppingRallyGet({ companyId: campaignId });
            let afterData: any = [...allData];
            
            if (receiptId !== "") {
                let tmp = [];
                for (let i = 0; i < allData.length; i++) {
                    if (allData[i].id.toString() === receiptId) {
                        tmp.push(allData[i]);
                    }
                }
                afterData = [...tmp];
            }
            if (userUid !== "") {
                let tmp = [];
                for (let i = 0; i < afterData.length; i++) {
                    if (afterData[i].uid === userUid) {
                        tmp.push(afterData[i]);
                    }
                }
                afterData = [...tmp];
            }
            if (checked_state0) {
                let tmp = [];
                for (let i = 0; i < afterData.length; i++) {
                    if(afterData[i].state1 === 0 || afterData[i].state2 === 0 || afterData[i].state3 === 0){
                        tmp.push(afterData[i]);
                    }
                }
                afterData = [...tmp];
            }
            //却下選択時
            if (checked_state1) {
                let tmp = [];
                for (let i = 0; i < afterData.length; i++) {
                    if (afterData[i].state1 === 3 || afterData[i].state2 === 3 || afterData[i].state3 === 3) {
                        tmp.push(afterData[i]);
                    }
                }
                afterData = [...tmp];
            }
            //承認済み選択時
            if (checked_state2) {
                let tmp = [];
                for (let i = 0; i < afterData.length; i++) {
                    if (afterData[i].state1 === 2 && afterData[i].state2 === 2 && afterData[i].state3 === 2) {
                        tmp.push(afterData[i]);
                    }
                }
                afterData = [...tmp];
            }
            
            setSearchedAllData(afterData);
        } catch (e) {
            console.error(e);
            window.alert("取得時にエラーが発生しました");
            return;
        }

    };

    const handleDownloadCsv = () => {
        let csvData = "";

        if (!searchingCampaign) {
            window.alert("error")
            return;
        }
        for (let i = 0; i < searchedAllData?.length; i++) {
            let state1Str = "error";
            let state2Str = "error";
            let state3Str = "error";
            if (searchedAllData[i].state1 === 0) {
                state1Str = "未確認";
            }
            else if (searchedAllData[i].state1 === 1) {
                state1Str = "未送付"
            }
            else if (searchedAllData[i].state1 === 2) {
                state1Str = "承認済み"
            }
            else if(searchedAllData[i].state1 === 3){
                state1Str = "却下";
            }
            if (searchedAllData[i].state2 === 0) {
                state2Str = "未確認";
            }
            else if (searchedAllData[i].state2 === 1) {
                state2Str = "未送付"
            }
            else if (searchedAllData[i].state2 === 2) {
                state2Str = "承認済み"
            }
            else if (searchedAllData[i].state2 === 3) {
                state2Str = "却下";
            }
            if (searchedAllData[i].state3 === 0) {
                state3Str = "未確認";
            }
            else if (searchedAllData[i].state3 === 1) {
                state3Str = "未送付"
            }
            else if (searchedAllData[i].state3 === 2) {
                state3Str = "承認済み"
            }
            else if (searchedAllData[i].state3 === 3) {
                state3Str = "却下";
            }
            csvData += `${searchedAllData[i].id},${searchedAllData[i].uid},${searchedAllData[i].date},${state1Str},${state2Str},${state3Str},${searchedAllData[i].comment}\n`;
        }
        downloadCSV(csvData, "data.csv");
    }

    const handleChangeActive = async () => {
        if (!(searchingCampaign?.companyId)) {
            window.alert("不具合により変更できませんでした");
            return;
        }
        try {
            const res = await shoppingRallyChangeActive({ companyId: searchingCampaign?.companyId, isActive: !searchingCampaign?.isActive });
            window.alert("変更しました。");
            navigate("/admin/mypage");
        } catch (e) {
            console.error(e);
            window.alert("エラーにより変更できませんでした。");
            return;
        }
    };
    const handleDeleteCampaign = async () => {
        if (!searchingCampaign?.companyId) {
            window.alert("不具合により変更できませんでした");
            return;
        }
        try {
            const res = await shoppingRallyDelete({ companyId: searchingCampaign.companyId });
            window.alert("削除しました。");
            navigate("/admin/mypage");
        } catch (e) {
            console.error(e);
            window.alert("エラーにより削除できませんでした。");
            return;
        }
    }

    const handleOpenModal = async (uid: string) => {
        if (!searchingCampaign?.companyId) {
            return;
        }
        try {
            const data = await shoppingRallyGetUserInfo_NoQuery({ companyId: searchingCampaign.companyId, uid: uid });
            if (data !== undefined && data.length !== 0) {
                setComment(data[0].comment);
                setIsOpen(true);
                setUserInfo(data[0]);
            }
            else{
                window.alert("取得時にエラーが発生しました。");
            }
        } catch (e) {
            console.error(e);
            return;
        }

    }
    const handleCommentChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setComment(e.target.value);
    }
    const handleChangeStateTo2 = async(key:string) => {
        if(searchingCampaign?.companyId === undefined)return;
        try {
            const res = await shoppingRallyChangeUserState({companyId:searchingCampaign.companyId,state:2,uid:userInfo.uid,comment:comment,key:key});
            await refetch();
            window.alert("更新しました。");
            handleSearchButtonClick();
            handleModalClose();
        } catch (e) {
            console.error(e);
            window.alert("更新に失敗しました。");
            return;
        }
    }
    const handleChangeStateTo3 = async(key:string) => {
        if (searchingCampaign?.companyId === undefined) return;
        try {
            const res = await shoppingRallyChangeUserState({ companyId: searchingCampaign.companyId, state: 3, uid: userInfo.uid, comment: comment, key: key });
            await refetch();
            window.alert("更新しました。");
            handleSearchButtonClick();
            handleModalClose();
        } catch (e) {
            console.error(e);
            window.alert("更新に失敗しました。");
            return;
        }
    }

    if (isLoading) return (<h1>ロード中</h1>)
    if (error) return (<h1>取得時にエラーが発生しました。</h1>)
    return (
        <React.Fragment>
            <AppBar position={"static"} css={appBarCss}>
                <Toolbar>
                    <h4>キャンペーン事務局管理ページ</h4>
                    <Button css={barButtonCss} onClick={() => {
                        navigate("/")
                    }}>ホーム</Button>
                    <Button css={barButtonCss} onClick={() => {
                        navigate("/admin/mypage")
                    }}>管理マイページ</Button>
                    <Button css={barButtonCss} onClick={() => {
                        authContext?.setAdminPassword(undefined);
                        authContext?.setAdminId(undefined);
                        navigate("/")
                    }}>ログアウト
                    </Button>
                </Toolbar>
            </AppBar>
            <div css={mainDivCss}>
                <h2>お買い物ラリー管理</h2>
                <h3>検索条件</h3>
                <TableContainer>
                    <TableBody>
                        <TableRow>
                            <TableCell align={"right"}>レシートID</TableCell>
                            <TableCell>
                                {/*
                                    eslint-disable-next-line
                                */}
                                <TextField type={"text"} value={receiptId} onChange={handleReceiptIdChange} />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align={"right"}>お買い物ラリー</TableCell>
                            <TableCell>
                                <FormControl>
                                    {/*
                                        eslint-disable-next-line
                                    */}
                                    <Select value={campaignId} onChange={handleCampaignSelectChange} label={"お買い物ラリー"}>
                                        {
                                            (() => {
                                                let ele: any = [];
                                                for (let i = 0; i < data.length; i++) {
                                                    ele.push(<MenuItem key={data[i].companyId} value={data[i].companyId}>{data[i].title}</MenuItem>);
                                                }
                                                return ele;
                                            })()
                                        }
                                    </Select>
                                </FormControl>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align={"right"}>応募者UID</TableCell>
                            <TableCell>
                                {/*
                                    eslint-disable-next-line
                                */}
                                <TextField type={"text"} value={userUid} onChange={handleUserUidChange} />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align={"right"}>応募確認状況</TableCell>
                            <TableCell align={"right"}>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox checked={checked_state0} onChange={handleChecked_state0_Change} />} label={"未確認"} />
                                    <FormControlLabel control={<Checkbox checked={checked_state1} onChange={handleChecked_state1_Change} />} label={"却下"} />
                                    <FormControlLabel control={<Checkbox checked={checked_state2} onChange={handleChecked_state2_Change} />} label={"承認済み"} />
                                </FormGroup>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </TableContainer>
                <Button variant={"contained"} onClick={handleSearchButtonClick}>検索する</Button>
                <h3>検索結果</h3>
                <h2>ステータス管理</h2>
                {
                    searchingCampaign ?
                        <React.Fragment>
                            <h3>現在は「{searchingCampaign.isActive ? "開催中" : "未開催中"}」</h3>
                            <Button variant={"contained"} onClick={handleChangeActive}>切り替える</Button>
                            <Button variant={"contained"} onClick={handleDeleteCampaign}>キャンペーンデータを削除する</Button>
                            <Button variant={"contained"} onClick={handleDownloadCsv}>現在の検索結果でCSVダウンロード</Button>
                        </React.Fragment> :
                        <p>検索してください</p>
                }
                
                <h2>一覧</h2>
                {
                    searchingCampaign ?
                        <React.Fragment>
                            <TableContainer>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align={"right"}>レシートID</TableCell>
                                        <TableCell align={"right"}>ユーザーUID</TableCell>
                                        <TableCell align={"right"}>応募日</TableCell>
                                        <TableCell align={"right"}>ステータス1</TableCell>
                                        <TableCell align={"right"}>ステータス2</TableCell>
                                        <TableCell align={"right"}>ステータス3</TableCell>
                                        <TableCell align={"right"}>画像1</TableCell>
                                        <TableCell align={"right"}>画像2</TableCell>
                                        <TableCell align={"right"}>画像3</TableCell>
                                        <TableCell align={"right"}>コメント</TableCell>
                                        <TableCell align={"right"}>ステータス変更</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        (() => {
                                            if (!searchedAllData) return null;
                                            let ele: any = [];
                                            if (rowsPerPage > 0) {
                                                for (let i = page * rowsPerPage; i < Math.min(page * rowsPerPage + rowsPerPage, searchedAllData?.length); i++) {
                                                    ele.push(
                                                        <TableRow key={`userdata-${i}`}>
                                                            <TableCell align={"right"}>{searchedAllData[i].id}</TableCell>
                                                            <TableCell align={"right"}>{searchedAllData[i].uid}</TableCell>
                                                            <TableCell align={"right"}>{searchedAllData[i].date}</TableCell>
                                                            <TableCell align={"right"}>{
                                                                (() => {
                                                                    if (searchedAllData[i].state1 === 0) {
                                                                        return "未確認";
                                                                    }
                                                                    else if (searchedAllData[i].state1 === 1) {
                                                                        return "未送付";
                                                                    }
                                                                    else if (searchedAllData[i].state1 === 2) {
                                                                        return "承認済み";
                                                                    }
                                                                    else if(searchedAllData[i].state1 === 3){
                                                                        return "却下";
                                                                    }
                                                                    else {
                                                                        return "error"
                                                                    }
                                                                })()
                                                            }</TableCell>
                                                            <TableCell align={"right"}>{
                                                                (() => {
                                                                    if (searchedAllData[i].state2 === 0) {
                                                                        return "未確認";
                                                                    }
                                                                    else if (searchedAllData[i].state2 === 1) {
                                                                        return "未送付";
                                                                    }
                                                                    else if (searchedAllData[i].state2 === 2) {
                                                                        return "承認済み";
                                                                    }
                                                                    else if (searchedAllData[i].state2 === 3) {
                                                                        return "却下";
                                                                    }
                                                                    else {
                                                                        return "error"
                                                                    }
                                                                })()
                                                            }</TableCell>
                                                            <TableCell align={"right"}>{
                                                                (() => {
                                                                    if (searchedAllData[i].state3 === 0) {
                                                                        return "未確認";
                                                                    }
                                                                    else if (searchedAllData[i].state3 === 1) {
                                                                        return "未送付";
                                                                    }
                                                                    else if (searchedAllData[i].state3 === 2) {
                                                                        return "承認済み";
                                                                    }
                                                                    else if (searchedAllData[i].state3 === 3) {
                                                                        return "却下";
                                                                    }
                                                                    else {
                                                                        return "error"
                                                                    }
                                                                })()
                                                            }</TableCell>
                                                            <TableCell align={"right"}><Button variant={"contained"} onClick={() => handleImgModalOpen(`${searchedAllData[i].uid}_img1.png`)}>画像1</Button></TableCell>
                                                            <TableCell align={"right"}><Button variant={"contained"} onClick={() => handleImgModalOpen(`${searchedAllData[i].uid}_img2.png`)}>画像2</Button></TableCell>
                                                            <TableCell align={"right"}><Button variant={"contained"} onClick={() => handleImgModalOpen(`${searchedAllData[i].uid}_img3.png`)}>画像3</Button></TableCell>
                                                            <TableCell align={"right"}>{searchedAllData[i].comment}</TableCell>
                                                            <TableCell align={"right"}><Button variant={"contained"} onClick={() => handleOpenModal(searchedAllData[i].uid)}>変更</Button></TableCell>
                                                        </TableRow>
                                                    );
                                                }
                                                return ele;
                                            }
                                            else {
                                                for (let i = 0; i < searchedAllData?.length; i++) {
                                                    ele.push(
                                                        <TableRow key={`userdata-${i}`}>
                                                            <TableCell align={"right"}>{searchedAllData[i].id}</TableCell>
                                                            <TableCell align={"right"}>{searchedAllData[i].uid}</TableCell>
                                                            <TableCell align={"right"}>{searchedAllData[i].date}</TableCell>
                                                            <TableCell align={"right"}>{
                                                                (() => {
                                                                    if (searchedAllData[i].state1 === 0) {
                                                                        return "未確認";
                                                                    }
                                                                    else if (searchedAllData[i].state1 === 1) {
                                                                        return "未送付";
                                                                    }
                                                                    else if (searchedAllData[i].state1 === 2) {
                                                                        return "承認済み";
                                                                    }
                                                                    else if (searchedAllData[i].state1 === 3) {
                                                                        return "却下";
                                                                    }
                                                                    else {
                                                                        return "error"
                                                                    }
                                                                })()
                                                            }</TableCell>
                                                            <TableCell align={"right"}>{
                                                                (() => {
                                                                    if (searchedAllData[i].state2 === 0) {
                                                                        return "未確認";
                                                                    }
                                                                    else if (searchedAllData[i].state2 === 1) {
                                                                        return "未送付";
                                                                    }
                                                                    else if (searchedAllData[i].state2 === 2) {
                                                                        return "承認済み";
                                                                    }
                                                                    else if (searchedAllData[i].state2 === 3) {
                                                                        return "却下";
                                                                    }
                                                                    else {
                                                                        return "error"
                                                                    }
                                                                })()
                                                            }</TableCell>
                                                            <TableCell align={"right"}>{
                                                                (() => {
                                                                    if (searchedAllData[i].state3 === 0) {
                                                                        return "未確認";
                                                                    }
                                                                    else if (searchedAllData[i].state3 === 1) {
                                                                        return "未送付";
                                                                    }
                                                                    else if (searchedAllData[i].state3 === 2) {
                                                                        return "承認済み";
                                                                    }
                                                                    else if (searchedAllData[i].state3 === 3) {
                                                                        return "却下";
                                                                    }
                                                                    else {
                                                                        return "error"
                                                                    }
                                                                })()
                                                            }</TableCell>
                                                            <TableCell align={"right"}><Button variant={"contained"} onClick={() => handleImgModalOpen(`${searchedAllData[i].uid}_img1.png`)}>画像1</Button></TableCell>
                                                            <TableCell align={"right"}><Button variant={"contained"} onClick={() => handleImgModalOpen(`${searchedAllData[i].uid}_img2.png`)}>画像2</Button></TableCell>
                                                            <TableCell align={"right"}><Button variant={"contained"} onClick={() => handleImgModalOpen(`${searchedAllData[i].uid}_img3.png`)}>画像3</Button></TableCell>
                                                            <TableCell align={"right"}>{searchedAllData[i].comment}</TableCell>
                                                        </TableRow>
                                                    );
                                                }
                                                return ele;
                                            }
                                        })()
                                    }
                                </TableBody>
                                <TableFooter>
                                    <TablePagination rowsPerPageOptions={[1, 2, 5, 10, 20, 50, 100, { label: "全て", value: -1 }]}
                                        count={searchedAllData?.length}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        SelectProps={{
                                            inputProps: {
                                                'aria-label': 'rows per page',
                                            },
                                            native: true,
                                        }}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                        ActionsComponent={TablePaginationActions}
                                    />
                                </TableFooter>
                            </TableContainer>
                        </React.Fragment> :
                        <p>検索してください</p>
                }
            </div>
            <Modal open={isImgModalOpen} onClose={handleImgModalClose}>
                <Box css={modalCss}>
                    <img src={`data:image/png;base64,${receiptImg}`}/>
                </Box>
            </Modal>
            
            <Modal open={isOpen} onClose={handleModalClose}>
                <Box css={modalCss}>
                    {
                        userInfo ? <React.Fragment>
                            <h3>ステータス1</h3>
                            {
                                (() => {
                                    if (userInfo.state1 === 0) {
                                        return <React.Fragment>
                                            未確認
                                            <Button variant={"contained"} onClick={() => handleChangeStateTo2("state1")}>承認する</Button>
                                            <Button variant={"contained"} onClick={() => handleChangeStateTo3("state1")}>却下する</Button>
                                        </React.Fragment>
                                    }
                                    else if (userInfo.state1 === 1) {
                                        return "未送付";
                                    }
                                    else if (userInfo.state1 === 2) {
                                        return "承認済み";
                                    }
                                    else if (userInfo.state1 === 3) {
                                        return <React.Fragment>
                                            却下
                                            <Button variant={"contained"} onClick={() => handleChangeStateTo2("state1")}>承認する</Button>
                                        </React.Fragment>
                                    }
                                    else {
                                        return "error"
                                    }
                                })()
                            }
                            <h3>ステータス2</h3>
                            {
                                (() => {
                                    if (userInfo.state2 === 0) {
                                        return <React.Fragment>
                                            未確認
                                            <Button variant={"contained"} onClick={() => handleChangeStateTo2("state2")}>承認する</Button>
                                            <Button variant={"contained"} onClick={() => handleChangeStateTo3("state2")}>却下する</Button>
                                        </React.Fragment>
                                    }
                                    else if (userInfo.state2 === 1) {
                                        return "未送付";
                                    }
                                    else if (userInfo.state2 === 2) {
                                        return "承認済み";
                                    }
                                    else if (userInfo.state2 === 3) {
                                        return <React.Fragment>
                                            却下
                                            <Button variant={"contained"} onClick={() => handleChangeStateTo2("state2")}>承認する</Button>
                                        </React.Fragment>
                                    }
                                    else {
                                        return "error"
                                    }
                                })()
                            }
                            <h3>ステータス3</h3>
                            {
                                (() => {
                                    if (userInfo.state3 === 0) {
                                        return <React.Fragment>
                                            未確認
                                            <Button variant={"contained"} onClick={() => handleChangeStateTo2("state3")}>承認する</Button>
                                            <Button variant={"contained"} onClick={() => handleChangeStateTo3("state3")}>却下する</Button>
                                        </React.Fragment>
                                    }
                                    else if (userInfo.state3 === 1) {
                                        return "未送付";
                                    }
                                    else if (userInfo.state3 === 2) {
                                        return "承認済み";
                                    }
                                    else if (userInfo.state3 === 3) {
                                        return <React.Fragment>
                                            却下
                                            <Button variant={"contained"} onClick={() => handleChangeStateTo2("state3")}>承認する</Button>
                                        </React.Fragment>
                                    }
                                    else {
                                        return "error"
                                    }
                                })()
                            }
                            <h3>コメント</h3>
                            <TextField value={comment} onChange={handleCommentChange} type={"text"}/>
                        </React.Fragment>:
                        null
                    }
                </Box>
            </Modal>
        </React.Fragment>
    )
}