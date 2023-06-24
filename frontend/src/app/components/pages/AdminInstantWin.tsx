/** @jsxImportSource @emotion/react */
/** @jsx jsx */
import { css } from "@emotion/react";
import React, { useEffect, useState, ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Checkbox, FormGroup, FormControlLabel, AppBar, Toolbar, Button, Modal, Box, TextField, TableContainer, TableHead, TableRow, TableCell, TableBody, Select, FormControl, MenuItem, SelectChangeEvent ,TableFooter,TablePagination} from "@mui/material";
import { useAuthContext } from "../../context/useAuthContext";
import { instantWinGetAll, instantWinChangeActive, instantWinDelete, instantWinGet, instantWinGetUserInfo_NoQuery, instantWinChangeUserState } from "../../api/ApiClient";
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
type InstantWinType = {
    isActive: boolean,
    title: string,
    description: string,
    companyId: number,
    probability: number,
    limit: number,
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


export const AdminInstantWin = () => {
    const navigate = useNavigate();
    const authContext = useAuthContext();
    const { data, error, isLoading,refetch } = instantWinGetAll();
    const [receiptId, setReceiptId] = useState("");
    const [userUid, setUserUid] = useState("");
    const [campaignId, setCampaignId] = useState(-1);

    const [searchingCampaign, setSearchingCampaign] = useState<InstantWinType>();
    const [searchedAllData, setSearchedAllData] = useState<any>();
    const [userInfo, setUserInfo] = useState<any>();

    const [isOpen, setIsOpen] = useState(false);
    const [comment, setComment] = useState("");

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [checked_state0, setChecked_state0] = useState(false);
    const [checked_state1, setChecked_state1] = useState(false);
    const [checked_state2, setChecked_state2] = useState(false);
    const [checked_state3, setChecked_state3] = useState(false);


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
            setChecked_state3(false);
        }
        else {
            setChecked_state0(false);
            setChecked_state1(false);
            setChecked_state2(false);
            setChecked_state3(false);
        }
    }

    const handleChecked_state1_Change = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setChecked_state0(false);
            setChecked_state1(true);
            setChecked_state2(false);
            setChecked_state3(false);
        }
        else {
            setChecked_state0(false);
            setChecked_state1(false);
            setChecked_state2(false);
            setChecked_state3(false);
        }
    }

    const handleChecked_state2_Change = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setChecked_state0(false);
            setChecked_state1(false);
            setChecked_state2(true);
            setChecked_state3(false);
        }
        else {
            setChecked_state0(false);
            setChecked_state1(false);
            setChecked_state2(false);
            setChecked_state3(false);
        }
    }

    const handleChecked_state3_Change = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setChecked_state0(false);
            setChecked_state1(false);
            setChecked_state2(false);
            setChecked_state3(true);
        }
        else {
            setChecked_state0(false);
            setChecked_state1(false);
            setChecked_state2(false);
            setChecked_state3(false);
        }
    }

    const handleModalClose = () => {
        setIsOpen(false);
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
            const allData = await instantWinGet({ id: campaignId });
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
                    if (afterData[i].state === 0) {
                        tmp.push(afterData[i]);
                    }
                }
                afterData = [...tmp];
            }
            if (checked_state1) {
                let tmp = [];
                for (let i = 0; i < afterData.length; i++) {
                    if (afterData[i].state === 1) {
                        tmp.push(afterData[i]);
                    }
                }
                afterData = [...tmp];
            }
            if (checked_state2) {
                let tmp = [];
                for (let i = 0; i < afterData.length; i++) {
                    if (afterData[i].state === 2) {
                        tmp.push(afterData[i]);
                    }
                }
                afterData = [...tmp];
            }
            if (checked_state3) {
                let tmp = [];
                for (let i = 0; i < afterData.length; i++) {
                    if (afterData[i].state === 3) {
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
            let stateStr = "error";
            if (searchedAllData[i].state === 0) {
                stateStr = "未確認";
            }
            else if (searchedAllData[i].state === 1) {
                stateStr = "却下"
            }
            else if (searchedAllData[i].state === 2) {
                stateStr = "当選"
            }
            else if(searchedAllData[i].state === 3){
                stateStr = "落選";
            }
            csvData += `${searchedAllData[i].id},${searchedAllData[i].uid},${searchedAllData[i].date},${stateStr},${searchedAllData[i].comment}\n`;
        }
        downloadCSV(csvData, "data.csv");
    }

    const handleChangeActive = async () => {
        if (!(searchingCampaign?.companyId)) {
            window.alert("不具合により変更できませんでした");
            return;
        }
        try {
            const res = await instantWinChangeActive({ companyId: searchingCampaign?.companyId, isActive: !searchingCampaign?.isActive });
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
            const res = await instantWinDelete({ companyId: searchingCampaign.companyId });
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
            const data = await instantWinGetUserInfo_NoQuery({ id: searchingCampaign.companyId, uid: uid });
            setIsOpen(true);
            setUserInfo(data);
            if (data !== undefined && data.length !== 0) {
                setComment(data[0].comment);
            }
        } catch (e) {
            console.error(e);
            return;
        }

    }
    const handleCommentChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setComment(e.target.value);
    }
    const handleChangeState_to1 = async () => {
        if (userInfo[0].state === 1) return;
        if (searchingCampaign?.companyId === undefined) return;
        try {
            const res = await instantWinChangeUserState({ id: userInfo[0].id, comment: comment, state: 1, companyId: searchingCampaign?.companyId });
            window.alert("更新しました。");
            handleSearchButtonClick();
            handleModalClose();
        } catch (e) {
            console.error(e);
            window.alert("更新に失敗しました。");
            return;
        }
    }
    const handleChangeState_to2 = async () => {
        if (userInfo[0].state === 2) return;
        if (searchingCampaign?.companyId === undefined) return;
        if(searchingCampaign.limit <= 0){
            window.alert("既に当選数上限に達しています。");
            return;
        }
        try {
            const res = await instantWinChangeUserState({ id: userInfo[0].id, comment: comment, state: 2, companyId: searchingCampaign?.companyId });
            window.alert("更新しました。当選結果を検索結果からご覧ください。");
            await refetch();
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
                <h2>インスタントウィン管理</h2>
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
                            <TableCell align={"right"}>インスタントウィン</TableCell>
                            <TableCell>
                                <FormControl>
                                    {/*
                                        eslint-disable-next-line
                                    */}
                                    <Select value={campaignId} onChange={handleCampaignSelectChange} label={"インスタントウィン"}>
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
                                    <FormControlLabel control={<Checkbox checked={checked_state2} onChange={handleChecked_state2_Change} />} label={"当選"} />
                                    <FormControlLabel control={<Checkbox checked={checked_state3} onChange={handleChecked_state3_Change} />} label={"落選"} />
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
                            <h3>残り当選数は...「{searchingCampaign.limit}」</h3>
                            <p>※リアルタイムの残り当選数は再度検索ボタンをクリックすることで反映されます。</p>
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
                                        <TableCell align={"right"}>ステータス</TableCell>
                                        <TableCell align={"right"}>コメント</TableCell>
                                        <TableCell align={"right"}>変更</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        (() => {
                                            if (!searchedAllData) return null;
                                            let ele: any = [];
                                            if(rowsPerPage > 0){
                                                for (let i = page * rowsPerPage; i < Math.min(page * rowsPerPage + rowsPerPage, searchedAllData?.length); i++) {
                                                    ele.push(
                                                        <TableRow key={`userdata-${i}`}>
                                                            <TableCell align={"right"}>{searchedAllData[i].id}</TableCell>
                                                            <TableCell align={"right"}>{searchedAllData[i].uid}</TableCell>
                                                            <TableCell align={"right"}>{searchedAllData[i].date}</TableCell>
                                                            <TableCell align={"right"}>{
                                                                (() => {
                                                                    if (searchedAllData[i].state === 0) {
                                                                        return "未確認";
                                                                    }
                                                                    else if (searchedAllData[i].state === 1) {
                                                                        return "却下"
                                                                    }
                                                                    else if (searchedAllData[i].state === 2) {
                                                                        return "当選"
                                                                    }
                                                                    else if (searchedAllData[i].state === 3) {
                                                                        return "落選"
                                                                    }
                                                                    else {
                                                                        return "error"
                                                                    }
                                                                })()
                                                            }</TableCell>
                                                            <TableCell align={"right"}>{searchedAllData[i].comment}</TableCell>
                                                            <TableCell align={"right"}><Button variant={"contained"} onClick={() => handleOpenModal(searchedAllData[i].uid)}>変更</Button></TableCell>
                                                        </TableRow>
                                                    );
                                                }
                                                return ele;
                                            }
                                            else{
                                                for (let i = 0; i < searchedAllData?.length; i++) {
                                                    ele.push(
                                                        <TableRow key={`userdata-${i}`}>
                                                            <TableCell align={"right"}>{searchedAllData[i].id}</TableCell>
                                                            <TableCell align={"right"}>{searchedAllData[i].uid}</TableCell>
                                                            <TableCell align={"right"}>{searchedAllData[i].date}</TableCell>
                                                            <TableCell align={"right"}>{
                                                                (() => {
                                                                    if (searchedAllData[i].state === 0) {
                                                                        return "未確認";
                                                                    }
                                                                    else if (searchedAllData[i].state === 1) {
                                                                        return "却下"
                                                                    }
                                                                    else if (searchedAllData[i].state === 2) {
                                                                        return "当選"
                                                                    }
                                                                    else if (searchedAllData[i].state === 3) {
                                                                        return "落選"
                                                                    }
                                                                    else {
                                                                        return "error"
                                                                    }
                                                                })()
                                                            }</TableCell>
                                                            <TableCell align={"right"}>{searchedAllData[i].comment}</TableCell>
                                                            <TableCell align={"right"}><Button variant={"contained"} onClick={() => handleOpenModal(searchedAllData[i].uid)}>変更</Button></TableCell>
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
            <Modal open={isOpen} onClose={handleModalClose}>
                <Box css={modalCss}>
                    {
                        (() => {
                            if (userInfo === undefined || userInfo.length === 0) return null;
                            return (
                                <React.Fragment>
                                    <h3>更新画面</h3>
                                    <TableContainer>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell><h4>UID</h4></TableCell>
                                                <TableCell>{userInfo[0].uid}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell><h4>名前</h4></TableCell>
                                                <TableCell>{userInfo[0].name}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell><h4>住所</h4></TableCell>
                                                <TableCell>{userInfo[0].address}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell><h4>コメント</h4></TableCell>
                                                <TableCell><TextField type={"text"} value={comment} onChange={handleCommentChange} /></TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell><h4>ステータス</h4></TableCell>
                                                <TableCell>{
                                                    (() => {
                                                        if (userInfo[0].state === 0) {
                                                            return "未確認";
                                                        }
                                                        else if (userInfo[0].state === 1) {
                                                            return "却下"
                                                        }
                                                        else if (userInfo[0].state === 2) {
                                                            return "当選"
                                                        }
                                                        else if(userInfo[0].state === 3){
                                                            return "落選"
                                                        }
                                                        else {
                                                            return "error"
                                                        }
                                                    })()}</TableCell>
                                                {
                                                    (() => {
                                                        if (userInfo[0].state === 0) {
                                                            //未確認
                                                            return (
                                                                <React.Fragment>
                                                                    <TableCell><Button onClick={handleChangeState_to2}>承認済みにする</Button></TableCell>
                                                                    <TableCell><Button onClick={handleChangeState_to1}>未承認(却下)にする</Button></TableCell>
                                                                </React.Fragment>
                                                            );
                                                        }
                                                        else if (userInfo[0].state === 1) {
                                                            //却下
                                                            return (
                                                                <TableCell><Button onClick={handleChangeState_to2}>承認済みにする</Button></TableCell>
                                                            )
                                                        }
                                                        else if (userInfo[0].state === 2) {
                                                            return "変更不可"
                                                        }
                                                        else if(userInfo[0].state === 3){
                                                            return "変更不可";
                                                        }
                                                        else {
                                                            return "error"
                                                        }
                                                    })()
                                                }
                                            </TableRow>
                                        </TableBody>
                                    </TableContainer>
                                    <h2>レシート画像</h2>
                                    <img css={css({
                                        width: "600px"
                                    })} src={`data:image/png;base64,${userInfo[0].img}`}></img>
                                </React.Fragment>
                            )
                        })()
                    }
                </Box>
            </Modal>
        </React.Fragment>
    )
}