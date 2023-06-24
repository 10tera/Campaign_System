/** @jsxImportSource @emotion/react */
/** @jsx jsx */
import { css } from "@emotion/react";
import React, { useEffect, useState, ChangeEvent,useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Modal, Box, TextField, FormControl, Select, InputLabel, MenuItem, SelectChangeEvent } from "@mui/material";
import { companysGetAll } from "../../api/ApiClient";
import {shoppingRallyCreate} from "../../api/ShoppingRallyApiClient";

const modalCss = css({
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    width: "100%",
    maxWidth: "800px",
    border: "2px solid",
    boxShadow: "24",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    flexFlow: "column",
    gap: "20px",
    maxHeight: "90%",
});
const modalChildCss = css({
    //margin: "0 auto"
});
const scrollCss = css({
    display: "flex",
    flexFlow: "column",
    overflow: "auto",
    gap: "20px",
    maxHeight: "100%"
});
const descriptionCss = css({
    margin: "0 auto",
    width: "100%",
});
const inputFileCss = css({
    display: "none",
});


export const CreateShoppingRally = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [company, setCompany] = useState<number>(0);
    const [imgFile, setImgFile] = useState<File>();

    const { data, error, isLoading } = companysGetAll();
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [isFormError, setIsFormError] = useState(false);
    const [helperText, setHelperText] = useState("");
    const [isButtonDisable, setIsButtonDisable] = useState(false);

    const handleSelectFileButtonClick = () => {
        inputRef.current?.click();
    }
    const handleSelectFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length !== 1) {
            return;
        }
        setImgFile(e.target.files[0]);
    }
    
    const initError = () => {
        setIsFormError(false);
        setHelperText("");
    }
    const handleSubmit = async () => {
        initError();
        if (title === "") {
            setIsFormError(true);
            setHelperText("タイトルを入力してください。");
            return;
        }
        if (description === "") {
            setIsFormError(true);
            setHelperText("説明文を入力してください。");
            return;
        }
        if (company === 0) {
            setIsFormError(true);
            setHelperText("企業を選択してください。");
            return;
        }
        if(!imgFile){
            setIsFormError(true);
            setHelperText("画像ファイルを選択してください。");
            return;
        }
        setIsButtonDisable(true);
        const formData = new FormData();
        formData.append("img",imgFile);
        formData.append("title",title);
        formData.append("description",description);
        formData.append("companyId",company.toString());
        try {
            const res = await shoppingRallyCreate(formData);
            handleCloseModal();
            window.alert("お買い物ラリーを作成しました。");
        } catch (e) {
            console.error(e);
            setIsFormError(true);
            setHelperText("何らかのエラーが発生しました。既に指定した企業ではキャンペーンが開催されている可能性があります。");
            setIsButtonDisable(false);
            return;
        }
    }
    const handleCloseModal = () => {
        setIsOpenModal(false);
        setCompany(0);
    }
    const handleOpenModalClick = () => {
        setIsOpenModal(true);
        initError();
        setTitle("");
        setDescription("");
        setCompany(0);
        setImgFile(undefined);
        setIsButtonDisable(false);
    }
    const handleTitleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setTitle(e.target.value);
    }
    const handleDescriptionChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setDescription(e.target.value);
    }
    const handleSelectChange = (e: SelectChangeEvent<any>) => {
        setCompany(e.target.value);
    }
    if (isLoading) return <h2>ロード中</h2>
    if (error) return <h2>お買い物ラリー作成ページでエラーが発生しました。</h2>
    return (
        <React.Fragment>
            <h2>お買い物ラリー作成</h2>
            <Button variant={"contained"} onClick={handleOpenModalClick}>作成</Button>
            <Modal open={isOpenModal} onClose={handleCloseModal}>
                <Box css={modalCss}>
                    <div css={scrollCss}>
                        <h1 css={modalChildCss}>お買い物ラリー作成画面</h1>
                        <TextField css={modalChildCss} value={title} onChange={handleTitleChange} id={"title"} label={"タイトル"} placeholder={"タイトル"} type={"text"} />
                        <TextField css={descriptionCss} value={description} onChange={handleDescriptionChange} id={"description"} label={"説明"} placeholder={"説明"} type={"text"} multiline />
                        <FormControl>
                            <InputLabel>開催元企業</InputLabel>
                            <Select label={"開催元企業"} value={company} onChange={handleSelectChange}>
                                {
                                    (() => {
                                        const ele = [];
                                        for (let i = 0; i < data.length; i++) {
                                            ele.push(<MenuItem key={data[i].id} value={data[i].id}>{data[i].name}</MenuItem>);
                                        }
                                        return ele;
                                    })()
                                }
                            </Select>
                        </FormControl>
                        <h2 css={modalChildCss}>スタンプ画像選択(正方形画像の選択を推奨します)</h2>
                        <input onChange={handleSelectFileChange} css={inputFileCss} ref={inputRef} type={"file"} accept={"image/*"} />
                        <Button variant={"contained"} onClick={handleSelectFileButtonClick}>ファイル選択</Button>
                        {imgFile ? <p>{imgFile.name} を選択中</p> : null}
                        {
                            isFormError ? <p>{helperText}</p> : null
                        }
                        <Button variant={"contained"} disabled={isButtonDisable} onClick={handleSubmit}>作成する</Button>
                    </div>
                </Box>
            </Modal>
        </React.Fragment>
    )
}