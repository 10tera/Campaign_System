/** @jsxImportSource @emotion/react */
/** @jsx jsx */
import { css } from "@emotion/react";
import React, { useEffect, useState, ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Checkbox, FormGroup, FormControlLabel, AppBar, Toolbar, Button, Modal, Box, TextField, TableContainer, TableHead, TableRow, TableCell, TableBody, TableFooter, TablePagination, Select, FormControl, MenuItem, SelectChangeEvent } from "@mui/material";
import { useAuthContext } from "../../context/useAuthContext";
import { companysGetAll } from "../../api/ApiClient";
import {questionnaireGetAll,questionnaireChangeActive,questionnaireGet,questionnaireDelete} from "../../api/QuestionnaireApiClient";

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
type QuestionnaireType = {
    isActive: boolean,
    title: string,
    description: string,
    companyId: number,
    questions:{
        id:number,
        title:string,
    }[],
    point:number,
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

export const AdminQuestionnaire = () => {
    const navigate = useNavigate();
    const authContext = useAuthContext();
    const { data, error, isLoading } = questionnaireGetAll();
    const { data: companyData, error: companyError, isLoading: companyIsLoading } = companysGetAll();
    const [receiptId, setReceiptId] = useState("");
    const [userUid, setUserUid] = useState("");
    const [campaignId, setCampaignId] = useState(-1);

    const [searchingCampaign, setSearchingCampaign] = useState<QuestionnaireType>();
    const [searchedAllData, setSearchedAllData] = useState<any>();


    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };



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
            const allData = await questionnaireGet({ companyId: campaignId });
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
        let column = "";
        for(let i=0;i<searchingCampaign.questions.length;i++){
            column += `質問${searchingCampaign.questions[i].id},`
        }
        csvData += `アンケート結果ID,ユーザーUID,${column}回答日\n`;
        for (let i = 0; i < searchedAllData?.length; i++) {
            let answerStr = "";
            for (let j = 0; j < searchingCampaign.questions.length; j++) {
                switch (searchedAllData[i][`question${searchingCampaign.questions[j].id}`]) {
                    case 1:
                        answerStr += "おいしい,";
                        break;
                    case 2:
                        answerStr += "普通,";
                        break;
                    case 3:
                        answerStr += "良く分からない,";
                        break;
                    case 4:
                        answerStr += "まずい,";
                        break;
                    default:
                        answerStr += "can not find,";
                        break;
                }
            }
            csvData += `${searchedAllData[i].id},${searchedAllData[i].uid},${answerStr}${searchedAllData[i].date}\n`;
        }
        downloadCSV(csvData, "data.csv");
    }

    const handleChangeActive = async () => {
        if (!(searchingCampaign?.companyId)) {
            window.alert("不具合により変更できませんでした");
            return;
        }
        try {
            const res = await questionnaireChangeActive({ companyId: searchingCampaign?.companyId, isActive: !searchingCampaign?.isActive });
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
            const res = await questionnaireDelete({ companyId: searchingCampaign.companyId });
            window.alert("削除しました。");
            navigate("/admin/mypage");
        } catch (e) {
            console.error(e);
            window.alert("エラーにより削除できませんでした。");
            return;
        }
    }


    if (isLoading || companyIsLoading) return (<h1>ロード中</h1>)
    if (error || companyError) return (<h1>取得時にエラーが発生しました。</h1>)
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
                <h2>アンケート管理</h2>
                <h3>検索条件</h3>
                <TableContainer>
                    <TableBody>
                        <TableRow>
                            <TableCell align={"right"}>アンケート結果ID</TableCell>
                            <TableCell>
                                {/*
                                    eslint-disable-next-line
                                */}
                                <TextField type={"text"} value={receiptId} onChange={handleReceiptIdChange} />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align={"right"}>アンケート</TableCell>
                            <TableCell>
                                <FormControl>
                                    {/*
                                        eslint-disable-next-line
                                    */}
                                    <Select value={campaignId} onChange={handleCampaignSelectChange} label={"アンケート"}>
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
                            <TableCell align={"right"}>ユーザーUID</TableCell>
                            <TableCell>
                                {/*
                                    eslint-disable-next-line
                                */}
                                <TextField type={"text"} value={userUid} onChange={handleUserUidChange} />
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
                {
                    searchingCampaign ?
                        <React.Fragment>
                            <h2>アンケート内容</h2>
                            <h3>タイトル</h3>
                            <p>{searchingCampaign?.title}</p>
                            <h3>説明</h3>
                            <p>{searchingCampaign?.description}</p>
                            <h3>付与ポイント数</h3>
                            <p>{searchingCampaign?.point.toString()}</p>
                            <h3>開催元企業</h3>
                            <p>{
                                (() => {
                                    for (let j = 0; j < companyData.length; j++) {
                                        if (companyData[j].id === searchingCampaign?.companyId) {
                                            return companyData[j].name;
                                        }
                                    }
                                    return "can not find";
                                })()
                            }</p>
                            <h3>質問</h3>
                            {
                                searchingCampaign?.questions.map((question) => {
                                    return (<p>・{question.title}</p>)
                                })
                            }
                        </React.Fragment> :
                        null
                }
                <h2>一覧</h2>
                {

                    searchingCampaign ?
                        <React.Fragment>
                            <TableContainer>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align={"right"}>アンケート結果ID</TableCell>
                                        <TableCell align={"right"}>ユーザーUID</TableCell>
                                        {
                                            searchingCampaign.questions.map((question) => {
                                                return(
                                                    <TableCell align={"right"}>質問{question.id}</TableCell>
                                                )
                                            })
                                        }
                                        <TableCell align={"right"}>回答日</TableCell>
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
                                                            {
                                                                searchingCampaign.questions.map((question) => {
                                                                    return <TableCell align={"right"}>{
                                                                        (() => {
                                                                            switch(searchedAllData[i][`question${question.id}`]){
                                                                                case 1:
                                                                                    return "おいしい";
                                                                                case 2:
                                                                                    return "普通";
                                                                                case 3:
                                                                                    return "良く分からない";
                                                                                case 4:
                                                                                    return "まずい"
                                                                                default:
                                                                                    return "can not find";
                                                                            }
                                                                        })()
                                                                    }</TableCell>
                                                                })
                                                            }
                                                            <TableCell align={"right"}>{searchedAllData[i].date}</TableCell>
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
                                                            {
                                                                searchingCampaign.questions.map((question) => {
                                                                    return <TableCell align={"right"}>{
                                                                        (() => {
                                                                            switch (searchedAllData[i][`question${question.id}`]) {
                                                                                case 1:
                                                                                    return "おいしい";
                                                                                case 2:
                                                                                    return "普通";
                                                                                case 3:
                                                                                    return "良く分からない";
                                                                                case 4:
                                                                                    return "まずい"
                                                                                default:
                                                                                    return "can not find";
                                                                            }
                                                                        })()
                                                                    }</TableCell>
                                                                })
                                                            }
                                                            <TableCell align={"right"}>{searchedAllData[i].date}</TableCell>
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
            
        </React.Fragment>
    )
}