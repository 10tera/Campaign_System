/** @jsxImportSource @emotion/react */
/** @jsx jsx */
import { css } from "@emotion/react";
import React, { useEffect, useState, ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Checkbox, FormGroup, FormControlLabel, AppBar, Toolbar, Button, Modal, Box, TextField, TableContainer, TableHead, TableRow, TableCell, TableBody, Select, FormControl, MenuItem, SelectChangeEvent, TableFooter, TablePagination } from "@mui/material";
import { useAuthContext } from "../../context/useAuthContext";
import { companysGetAll} from "../../api/ApiClient";
import { OneTouchGetAll,OneTouchDelete } from "../../api/OnetouchApiClient";
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
    whiteSpace:"nowrap",
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


export const AdminOneTouch = () => {
    const navigate = useNavigate();
    const authContext = useAuthContext();
    const { data:data_origin, error, isLoading, refetch,isRefetching } = OneTouchGetAll();
    const {data:data_companys,error:error_companys,isLoading:isLoading_companys} = companysGetAll();

    const [isOpen, setIsOpen] = useState(false);
    const [targetDeleteId,setTargetDeleteId] = useState(0);

    const [prizeId,setPrizeId] = useState<string>("");
    const [companyId,setCompanyId] = useState<number>(-1);

    const [data,setData] = useState<any>();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        setData(data_origin);
    },[data_origin,isLoading,isRefetching]);

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

    const handleModalClose = () => {
        setIsOpen(false);
        setTargetDeleteId(0);
    }
    const handleDeleteModalOpen = (id:number) => {
        setTargetDeleteId(id);
        setIsOpen(true);
    }
    const handleSearchButtonClick = async () => {
        let afterData: any = [...data_origin];
        if(prizeId !== ""){
            let tmp = [];
            for (let i = 0; i < afterData.length; i++) {
                if (afterData[i].id.toString() === prizeId) {
                    tmp.push(afterData[i]);
                }
            }
            afterData = [...tmp];
        }
        if(companyId && companyId >= 0){
            let tmp = [];
            for (let i = 0; i < afterData.length; i++) {
                if (afterData[i].companyId === companyId) {
                    tmp.push(afterData[i]);
                }
            }
            afterData = [...tmp];
        }
        setData(afterData);
    };

    const handleDownloadCsv = () => {
        let csvData = "";
        downloadCSV(csvData, "data.csv");
    }

    const handleDeleteCampaign = async () => {
        try {
            const res = await OneTouchDelete({id: targetDeleteId});
            refetch();
            handleModalClose();
            window.alert("削除しました。");
        } catch (e) {
            console.error(e);
            window.alert("エラーにより削除できませんでした。");
            return;
        }
    }
    const handlePrizeIdChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setPrizeId(event.target.value);
    }
    const handleCompanyChange = (e: SelectChangeEvent<any>) => {
        setCompanyId(e.target.value);
    }

    if (isLoading || isLoading_companys) return (<h1>ロード中</h1>)
    if (error || error_companys) return (<h1>取得時にエラーが発生しました。</h1>)
    if(!data)return (<h1>データ取得中</h1>)
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
                <h2>ワンタッチ管理</h2>
                <h3>検索条件</h3>
                <TableContainer>
                    <TableBody>
                        <TableRow>
                            <TableCell align={"right"}>賞品ID</TableCell>
                            <TableCell>
                                {/*
                                    eslint-disable-next-line
                                */}
                                <TextField value={prizeId?.toString()} onChange={handlePrizeIdChange} type={"text"}/>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align={"right"}>開催元企業</TableCell>
                            <TableCell>
                                <FormControl>
                                    {/*
                                        eslint-disable-next-line
                                    */}
                                    <Select value={companyId} onChange={handleCompanyChange} label={"開催元企業"}>
                                        <MenuItem key={"-1"} value={-1}>全選択</MenuItem>
                                        {
                                            (() => {
                                                let ele: any = [];
                                                for (let i = 0; i < data_companys.length; i++) {
                                                    ele.push(<MenuItem key={data_companys[i].id} value={data_companys[i].id}>{data_companys[i].name}</MenuItem>);
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
                {/*
                <h2>管理</h2>
                <Button variant={"contained"} onClick={handleDownloadCsv}>現在の検索結果でCSVダウンロード</Button>
                */}
                <h2>一覧</h2>
                <React.Fragment>
                    <TableContainer>
                        <TableHead>
                            <TableRow>
                                <TableCell align={"right"}>賞品ID</TableCell>
                                <TableCell align={"right"}>開催元企業</TableCell>
                                <TableCell align={"right"}>タイトル</TableCell>
                                <TableCell align={"right"}>説明</TableCell>
                                <TableCell align={"right"}>必要ポイント数</TableCell>
                                <TableCell align={"right"}>削除</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                (() => {
                                    if(!data)return null;
                                    let ele: any = [];
                                    if (rowsPerPage > 0) {
                                        for (let i = page * rowsPerPage; i < Math.min(page * rowsPerPage + rowsPerPage, data.length); i++) {
                                            ele.push(
                                                <TableRow key={`data-${i}`}>
                                                    <TableCell align={"right"}>{data[i].id}</TableCell>
                                                    <TableCell align={"right"}>{
                                                        (() => {
                                                            for (let j = 0; j < data_companys.length; j++) {
                                                                if (data_companys[j].id === data[i].companyId) {
                                                                    return data_companys[j].name;
                                                                }
                                                            }
                                                            return "can not find";
                                                        })()
                                                    }</TableCell>
                                                    <TableCell align={"right"}>{data[i].title}</TableCell>
                                                    <TableCell align={"right"}>
                                                        <p css={tableDescriptionCss}>{data[i].description}</p>
                                                    </TableCell>
                                                    <TableCell align={"right"}>{data[i].point.toString()}</TableCell>
                                                    <TableCell align={"right"}><Button variant={"contained"} onClick={() => handleDeleteModalOpen(data[i].id)}>削除</Button></TableCell>
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
                                                    <TableCell align={"right"}>{
                                                        (() => {
                                                            for (let j = 0; j < data_companys.length; j++) {
                                                                if (data_companys[j].id === data[i].companyId) {
                                                                    return data_companys[j].name;
                                                                }
                                                            }
                                                            return "can not find";
                                                        })()
                                                    }</TableCell>
                                                    <TableCell align={"right"}>{data[i].title}</TableCell>
                                                    <TableCell align={"right"}>
                                                        <p css={tableDescriptionCss}>{data[i].description}</p>
                                                    </TableCell>
                                                    <TableCell align={"right"}>{data[i].point.toString()}</TableCell>
                                                    <TableCell align={"right"}><Button variant={"contained"} onClick={() => handleDeleteModalOpen(data[i].id)}>削除</Button></TableCell>
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
            <Modal open={isOpen} onClose={handleModalClose}>
                <Box css={modalCss}>
                    <h2>賞品削除画面</h2>
                    <p>賞品ID[{targetDeleteId.toString()}]の賞品を削除しますか？</p>
                    <Button variant={"contained"} onClick={handleDeleteCampaign}>削除する</Button>
                </Box>
            </Modal>
        </React.Fragment>
    )
}