/** @jsxImportSource @emotion/react */
/** @jsx jsx */
import { css } from "@emotion/react";
import React, { useEffect, useState, ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Checkbox, FormGroup, FormControlLabel, AppBar, Toolbar, Button, Modal, Box, TextField, TableContainer, TableHead, TableRow, TableCell, TableBody, Select, FormControl, MenuItem, SelectChangeEvent, TableFooter, TablePagination } from "@mui/material";
import { useAuthContext } from "../../context/useAuthContext";
import {companysGetAll} from "../../api/ApiClient";
import { PointGetAllUser } from "../../api/PointApiClient";
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


export const AdminUserPoint = () => {
    const navigate = useNavigate();
    const authContext = useAuthContext();
    const { data: companys_data, error, isLoading} = companysGetAll();

    const [data, setData] = useState<any>(undefined);
    const [userUid, setUserUid] = useState("");
    const [companyId,setCompanyId] = useState(-1);

    const [searchingCompany,setSearchingCompany] = useState<any>(undefined);

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
    const handleCompanySelectChange = (e:SelectChangeEvent<any>) => {
        setCompanyId(Number(e.target.value));
    }
    const handleSearchButtonClick = async () => {
        let isOk = false;
        for (let i = 0; i < companys_data.length; i++) {
            if (companys_data[i].id === companyId) {
                setSearchingCompany(companys_data[i]);
                isOk = true;
                break;
            }
        }
        if (!isOk) return;
        try {
            const res = await PointGetAllUser({companyId:companyId});
            let afterData: any = [...res];
            if (userUid !== "") {
                let tmp: any = [];
                for (let i = 0; i < afterData.length; i++) {
                    if (afterData[i].uid === userUid) {
                        tmp.push(afterData[i]);
                    }
                }
                afterData = [...tmp];
            }
            setData(afterData);
        } catch (e) {
            console.error(e);
            return;
        }
        
    };

    const handleDownloadCsv = () => {
        let csvData = "";
        csvData += "ID,ユーザーUID,保有ポイント\n";
        for (let i = 0; i < data.length; i++) {
            csvData += `${data[i].id},${data[i].uid},${data[i].point}\n`;
        }
        downloadCSV(csvData, "data.csv");
    }
    const handleUserUidChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setUserUid(e.target.value);
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
                <h2>ユーザー情報管理</h2>
                <h3>検索条件</h3>
                <TableContainer>
                    <TableBody>
                        <TableRow>
                            <TableCell align={"right"}>ユーザーUID</TableCell>
                            <TableCell align={"right"}>
                                <TextField type={"text"} value={userUid} onChange={handleUserUidChange} />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align={"right"}>企業</TableCell>
                            <TableCell>
                                <FormControl>
                                    {/*
                                        eslint-disable-next-line
                                    */}
                                    <Select value={companyId} onChange={handleCompanySelectChange} label={"企業"}>
                                        {
                                            (() => {
                                                let ele: any = [];
                                                for (let i = 0; i < companys_data.length; i++) {
                                                    ele.push(<MenuItem key={companys_data[i].id} value={companys_data[i].id}>{companys_data[i].name}</MenuItem>);
                                                }
                                                return ele;
                                            })()
                                        }
                                    </Select>
                                </FormControl>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </TableContainer>
                <Button variant={"contained"} onClick={handleSearchButtonClick}>検索する</Button>
                <h3>検索結果</h3>
                {
                    data ? <React.Fragment>
                        <h2>管理</h2>
                        <p>{searchingCompany.name}のポイントテーブルを表示中</p>
                        <Button variant={"contained"} onClick={handleDownloadCsv}>現在の検索結果でCSVダウンロード</Button>
                    </React.Fragment> :null
                }
                
                <h2>一覧</h2>
                <React.Fragment>
                    <TableContainer>
                        <TableHead>
                            <TableRow>
                                <TableCell align={"right"}>ID</TableCell>
                                <TableCell align={"right"}>ユーザーUID</TableCell>
                                <TableCell align={"right"}>保有ポイント</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                data ? <React.Fragment>
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
                                                            <TableCell align={"right"}>{data[i].point}</TableCell>
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
                                                            <TableCell align={"right"}>{data[i].point}</TableCell>
                                                        </TableRow>
                                                    );
                                                }
                                                return ele;
                                            }
                                        })()
                                    }
                                </React.Fragment> :
                                <p>検索してください</p>
                                
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