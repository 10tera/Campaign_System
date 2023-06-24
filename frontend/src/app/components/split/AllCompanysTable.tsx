/** @jsxImportSource @emotion/react */
/** @jsx jsx */
import { css } from "@emotion/react";
import React, { useEffect, useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { TableContainer, Table, TableHead, TableBody, TableCell, TableRow, Paper, Button, Modal, Box, TextField } from "@mui/material";

import { companysGetAll ,companyAdd,companyDelete} from "../../api/ApiClient";

const modalCss = css({
    position: "absolute",
    top: "50%",
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

export const AllCompanysTable = () => {
    const navigate = useNavigate();
    const {data,error,isLoading,refetch} = companysGetAll();
    const [isOpenModal,setIsOpenModal] = useState(false);
    const [newName,setNewName] = useState("");
    const [isError,setIsError] = useState(false);
    const [helperText,setHelperText] = useState("");
    const [isButtonDisable,setIsButtondisable] = useState(false);
    const [nowAddMode,setNowAddMode] = useState(true);
    const [deleteId,setDeleteId] = useState<number|undefined>(undefined);
    const initError = () => {
        setIsError(false);
        setHelperText("");
    }
    const handleCloseModal = () => {
        setIsOpenModal(false);
        initError();
        setNewName("");
        setIsButtondisable(false);
    }
    const handleDeleteButtonClick = (id:number) => {
        initError();
        setIsOpenModal(true);
        setNowAddMode(false);
        setDeleteId(id);
    }
    const handleAddButtonClick = () => {
        initError();
        setIsOpenModal(true);
        setNowAddMode(true);
        setNewName("");
    }
    const deleteAdminClick = async() => {
        initError();
        setIsButtondisable(true);
        if(!deleteId){
            setIsError(true);
            setHelperText("内部エラーが発生しました。");
            setIsButtondisable(false);
            return;
        }
        try {
            const res = await companyDelete({id:deleteId});
            handleCloseModal();
            window.alert("削除しました");
            refetch();
        } catch (e) {
            console.error(e);
            setIsError(true);
            setHelperText("内部エラーが発生しました。");
            setIsButtondisable(false);
            return;
        }
    }
    const addAdminClick = async() => {
        initError();
        const check = /^[0-9a-zA-Z]*$/;
        if(newName === ""){
            setIsError(true);
            setHelperText("入力してください。");
            return;
        }
        setIsButtondisable(true);
        try {
            const res = await companyAdd({name:newName});
            handleCloseModal();
            window.alert("追加しました");
            refetch();
        } catch (e) {
            console.error(e);
            setIsError(true);
            setHelperText("内部エラーが発生しました。");
            setIsButtondisable(false);
            return;
        }
    }
    if(isLoading)return (<h2>ロード中</h2>)
    if(error)return(<h2>企業一覧の取得時にエラーが発生しました。</h2>)
    return(
        <React.Fragment>
            <h2>企業一覧</h2>
            <Button variant={"contained"} onClick={handleAddButtonClick}>企業追加</Button>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell align={"right"}>企業名</TableCell>
                            <TableCell align={"right"}>削除</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            data.map((row:any) => {
                                return(
                                <TableRow key={row.id}>
                                    <TableCell>{row.id}</TableCell>
                                    <TableCell align={"right"}>{row.name}</TableCell>
                                    <TableCell align={"right"}><Button variant={"contained"} onClick={() => handleDeleteButtonClick(row.id)}>削除</Button></TableCell>
                                </TableRow>)
                            })
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <Modal open={isOpenModal} onClose={handleCloseModal}>
                <Box css={modalCss}>
                    {
                        nowAddMode ? 
                        <React.Fragment>
                            <h1 css={modalChildCss}>企業追加</h1>
                            <TextField css={modalChildCss} value={newName} id={"newName"} label={"企業名"} type={"text"} onChange={(e) => setNewName(e.target.value)}/>
                                {
                                    isError ? <p>{helperText}</p> : null
                                }
                            <Button css={modalChildCss} variant={"contained"} disabled={isButtonDisable} onClick={addAdminClick}>追加する</Button>
                        </React.Fragment>:
                        <React.Fragment>
                            <h1 css={modalChildCss}>企業削除</h1>
                            <p>本当に削除しますか？</p>
                            {
                                isError ? <p>{helperText}</p> : null
                            }
                            <Button css={modalChildCss} variant={"contained"} disabled={isButtonDisable} onClick={deleteAdminClick}>削除する</Button>
                        </React.Fragment>
                    }
                </Box>
            </Modal>
        </React.Fragment>
    )
};