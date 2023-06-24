/** @jsxImportSource @emotion/react */
/** @jsx jsx */
import { css } from "@emotion/react";
import React, { useEffect, useState, ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Checkbox, FormGroup, FormControlLabel, AppBar, Toolbar, Button, Modal, Box, TextField, TableContainer, TableHead, TableRow, TableCell, TableBody, Select, FormControl, MenuItem, SelectChangeEvent, TableFooter, TablePagination } from "@mui/material";
import { useAuthContext } from "../../context/useAuthContext";
import { userGetAll } from "../../api/ApiClient";
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
const tableDescriptionCss = css({
    width: "500px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
});

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


export const AdminUserInfo = () => {
    const navigate = useNavigate();
    const authContext = useAuthContext();
    const { data: data_origin, error, isLoading, refetch, isRefetching } = userGetAll();

    const [data, setData] = useState<any>();
    const [userUid,setUserUid] = useState("");

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        setData(data_origin);
    }, [data_origin, isLoading, isRefetching]);

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
    const handleSearchButtonClick = async () => {
        let afterData: any = [...data_origin];
        if(userUid !== ""){
            let tmp:any = [];
            for(let i=0;i<afterData.length;i++){
                if(afterData[i].uid === userUid){
                    tmp.push(afterData[i]);
                }
            }
            afterData = [...tmp];
        }
        setData(afterData);
    };

    const handleDownloadCsv = () => {
        let csvData = "";
        csvData += "ID,ユーザーUID,郵便番号,住所,名前,フリガナ,電話番号,生年月日,通知の希望\n";
        for(let i=0;i<data.length;i++){
            const isNoticeStr = data[i].isNotice ? "希望する" : "希望しない";
            const postCode = data[i].postCode.toString().substr(0,3) + "-" + data[i].postCode.toString().substr(3);
            const phone = data[i].phone.toString().substr(0,3) + "-" + data[i].phone.toString().substr(3,4) + "-" + data[i].phone.toString().substr(7);
            csvData += `${data[i].id},${data[i].uid},${postCode},${data[i].address},${data[i].name},${data[i].furigana},${phone},${data[i].birth},${isNoticeStr}\n`;
        }
        downloadCSV(csvData, "data.csv");
    }
    const handleUserUidChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setUserUid(e.target.value);
    }

    if (isLoading) return (<h1>ロード中</h1>)
    if (error) return (<h1>取得時にエラーが発生しました。</h1>)
    if (!data) return (<h1>データ取得中</h1>)
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
                <h2>ユーザー情報管理</h2>
                <h3>検索条件</h3>
                <TableContainer>
                    <TableBody>
                        <TableRow>
                            <TableCell align={"right"}>ユーザーUID</TableCell>
                            <TableCell align={"right"}>
                                <TextField type={"text"} value={userUid} onChange={handleUserUidChange}/>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </TableContainer>
                <Button variant={"contained"} onClick={handleSearchButtonClick}>検索する</Button>
                <h3>検索結果</h3>
                <h2>管理</h2>
                <Button variant={"contained"} onClick={handleDownloadCsv}>現在の検索結果でCSVダウンロード</Button>
                <h2>一覧</h2>
                <React.Fragment>
                    <TableContainer>
                        <TableHead>
                            <TableRow>
                                <TableCell align={"right"}>ID</TableCell>
                                <TableCell align={"right"}>ユーザーUID</TableCell>
                                <TableCell align={"right"}>郵便番号</TableCell>
                                <TableCell align={"right"}>住所</TableCell>
                                <TableCell align={"right"}>名前</TableCell>
                                <TableCell align={"right"}>フリガナ</TableCell>
                                <TableCell align={"right"}>電話番号</TableCell>
                                <TableCell align={"right"}>生年月日</TableCell>
                                <TableCell align={"right"}>通知の希望</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                (() => {
                                    if (!data) return null;
                                    let ele: any = [];
                                    if (rowsPerPage > 0) {
                                        for (let i = page * rowsPerPage; i < Math.min(page * rowsPerPage + rowsPerPage, data.length); i++) {
                                            ele.push(
                                                <TableRow key={`data-${i}`}>
                                                    <TableCell align={"right"}>{data[i].id}</TableCell>
                                                    <TableCell align={"right"}>{data[i].uid}</TableCell>
                                                    <TableCell align={"right"}>{data[i].postCode}</TableCell>
                                                    <TableCell align={"right"}>{data[i].address}</TableCell>
                                                    <TableCell align={"right"}>{data[i].name}</TableCell>
                                                    <TableCell align={"right"}>{data[i].furigana}</TableCell>
                                                    <TableCell align={"right"}>{data[i].phone}</TableCell>
                                                    <TableCell align={"right"}>{data[i].birth}</TableCell>
                                                    <TableCell align={"right"}>{
                                                        (() => {
                                                            switch(data[i].isNotice){
                                                                case 0:
                                                                    return "希望しない";
                                                                case 1:
                                                                    return "希望する";
                                                                default:
                                                                    return "error";
                                                            }
                                                        })()
                                                    }</TableCell>
                                                </TableRow>
                                            );
                                        }
                                        return ele;
                                    }
                                    else {
                                        for (let i = 0; i < data.length; i++) {
                                            ele.push(
                                                <TableRow key={`data-${i}`}>
                                                    <TableCell align={"right"}>{data[i].id}</TableCell>
                                                    <TableCell align={"right"}>{data[i].uid}</TableCell>
                                                    <TableCell align={"right"}>{data[i].postCode}</TableCell>
                                                    <TableCell align={"right"}>{data[i].address}</TableCell>
                                                    <TableCell align={"right"}>{data[i].name}</TableCell>
                                                    <TableCell align={"right"}>{data[i].furigana}</TableCell>
                                                    <TableCell align={"right"}>{data[i].phone}</TableCell>
                                                    <TableCell align={"right"}>{data[i].birth}</TableCell>
                                                    <TableCell align={"right"}>{
                                                        (() => {
                                                            switch (data[i].isNotice) {
                                                                case 0:
                                                                    return "希望しない";
                                                                case 1:
                                                                    return "希望する";
                                                                default:
                                                                    return "error";
                                                            }
                                                        })()
                                                    }</TableCell>
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
                                count={data?.length}
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
                </React.Fragment>
            </div>
        </React.Fragment>
    )
}