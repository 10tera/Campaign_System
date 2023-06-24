/** @jsxImportSource @emotion/react */
/** @jsx jsx */
import { css } from "@emotion/react";
import React, { useEffect, useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Modal, Box, TextField, FormControl, Select, InputLabel, MenuItem, SelectChangeEvent} from "@mui/material";
import { companysGetAll, instantWinCreate } from "../../api/ApiClient";


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
const buttonCss = css({
    width: "50px",
    height: "50px",
    margin: "0 auto"
});
const prizeCss = css({
    padding: "10px",
    border: "2px solid",
    borderRadius: "2px"
});

export const CreateInstantWin = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [company, setCompany] = useState<number>(0);
    const [probability,setProbabilit] = useState(0);
    const [limit,setLimit] = useState(0);

    const { data, error, isLoading } = companysGetAll();
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [isFormError, setIsFormError] = useState(false);
    const [helperText, setHelperText] = useState("");
    const [isButtonDisable, setIsButtonDisable] = useState(false);
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
        if(!(probability > 0 && probability <= 100)){
            setIsFormError(true);
            setHelperText("0~100%で当選確率を入力してください。");
            return;
        }
        if(!(limit > 0 && Number.isInteger(limit))){
            setIsFormError(true);
            setHelperText("当選人数を正の整数で入力してください。");
            return;
        }
        setIsButtonDisable(true);
        try {
            const res = await instantWinCreate({
                isActive: false,
                title: title,
                description: description,
                companyId: company,
                probability:probability,
                limit:limit
            });
            handleCloseModal();
            window.alert("インスタントウィンを作成しました。");
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
        setProbabilit(0);
        setLimit(0);
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
    const handleProbabilityChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setProbabilit(Number(e.target.value));
    }
    const handleLimitChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setLimit(Number(e.target.value));
    }
    if (isLoading) return <h2>ロード中</h2>
    if (error) return <h2>インスタントウィン作成ページでエラーが発生しました。</h2>
    return (
        <React.Fragment>
            <h2>インスタントウィン作成</h2>
            <Button variant={"contained"} onClick={handleOpenModalClick}>作成</Button>
            <Modal open={isOpenModal} onClose={handleCloseModal}>
                <Box css={modalCss}>
                    <div css={scrollCss}>
                        <h1 css={modalChildCss}>インスタントウィン作成画面</h1>
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
                        <TextField css={modalChildCss} value={probability} onChange={handleProbabilityChange} id={"probability"} label={"当選確率(%)"} placeholder={"当選確率(%)"} type={"number"}/>
                        <TextField css={modalChildCss} value={limit} onChange={handleLimitChange} id={"limit"} label={"当選人数"} placeholder={"当選人数"} type={"number"} />
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