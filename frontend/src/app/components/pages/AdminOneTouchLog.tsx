/** @jsxImportSource @emotion/react */
/** @jsx jsx */
import { css } from "@emotion/react";
import React, { useEffect, useState, ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Checkbox, FormGroup, FormControlLabel, AppBar, Toolbar, Button, Modal, Box, TextField, TableContainer, TableHead, TableRow, TableCell, TableBody, Select, FormControl, MenuItem, SelectChangeEvent, TableFooter, TablePagination } from "@mui/material";
import { useAuthContext } from "../../context/useAuthContext";
import { OneTouchLogDelete,OneTouchLogGetAll } from "../../api/OnetouchLogApiClient";
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


export const AdminOneTouchLog = () => {
    const navigate = useNavigate();
    const authContext = useAuthContext();
    const { data: data, error, isLoading, refetch, isRefetching } = OneTouchLogGetAll();

    const [isOpen, setIsOpen] = useState(false);
    const [targetDeleteId, setTargetDeleteId] = useState(0);


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

    const handleModalClose = () => {
        setIsOpen(false);
        setTargetDeleteId(0);
    }
    const handleDeleteModalOpen = (id: number) => {
        setTargetDeleteId(id);
        setIsOpen(true);
    }

    const handleDeleteCampaign = async () => {
        try {
            const res = await OneTouchLogDelete({ id: targetDeleteId });
            refetch();
            handleModalClose();
            window.alert("削除しました。");
        } catch (e) {
            console.error(e);
            window.alert("エラーにより削除できませんでした。");
            return;
        }
    }
    const handleDownloadCsv = () => {
        let csvData = "";

        if (!data) {
            window.alert("error")
            return;
        }
        csvData += `ログID,ユーザーUID,賞品ID\n`;
        for(let i=0;i<data.length;i++){
            csvData += `${data[i].id},${data[i].uid},${data[i].prizeId}\n`;
        }
        downloadCSV(csvData, "data.csv");
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
                <h2>ワンタッチログ管理</h2>
                <h2>一覧</h2>
                <Button variant={"contained"} onClick={handleDownloadCsv}>CSVでダウンロード</Button>
                <React.Fragment>
                    <TableContainer>
                        <TableHead>
                            <TableRow>
                                <TableCell align={"right"}>ログID</TableCell>
                                <TableCell align={"right"}>交換したユーザーUID</TableCell>
                                <TableCell align={"right"}>賞品ID</TableCell>
                                <TableCell align={"right"}>ログ削除</TableCell>
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
                                                    <TableCell align={"right"}>{data[i].prizeId}</TableCell>
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
                                                    <TableCell align={"right"}>{data[i].uid}</TableCell>
                                                    <TableCell align={"right"}>{data[i].prizeId}</TableCell>
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
                    <h2>ログ削除画面</h2>
                    <p>ログID[{targetDeleteId.toString()}]のログを削除しますか？</p>
                    <Button variant={"contained"} onClick={handleDeleteCampaign}>削除する</Button>
                </Box>
            </Modal>
        </React.Fragment>
    )
}