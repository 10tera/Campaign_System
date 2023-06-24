/** @jsxImportSource @emotion/react */
/** @jsx jsx */
import { css } from "@emotion/react";
import React, { useEffect, useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Modal, Box, TextField, FormControl, Select, InputLabel, MenuItem, SelectChangeEvent } from "@mui/material";
import { companysGetAll } from "../../api/ApiClient";
import { OneTouchCreate } from "../../api/OnetouchApiClient";


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

export const CreateOneTouch = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [company, setCompany] = useState<number>(0);
    const [point,setPoint] = useState(0);

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
        if (!(point >= 0 && Number.isInteger(point))) {
            setIsFormError(true);
            setHelperText("交換ポイント数を正の整数で入力してください。");
            return;
        }
        setIsButtonDisable(true);
        try {
            const res = await OneTouchCreate({
                title: title,
                description: description,
                companyId: company,
                point:point
            });
            handleCloseModal();
            window.alert("ワンタッチの賞品を作成しました。");
        } catch (e) {
            console.error(e);
            setIsFormError(true);
            setHelperText("何らかのエラーが発生しました。");
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
        setPoint(0);
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
    const handlePointChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setPoint(Number(e.target.value));
    }
    if (isLoading) return <h2>ロード中</h2>
    if (error) return <h2>ワンタッチ用賞品作成ページでエラーが発生しました。</h2>
    return (
        <React.Fragment>
            <h2>ワンタッチ用賞品の作成</h2>
            <Button variant={"contained"} onClick={handleOpenModalClick}>作成</Button>
            <Modal open={isOpenModal} onClose={handleCloseModal}>
                <Box css={modalCss}>
                    <div css={scrollCss}>
                        <h1 css={modalChildCss}>ワンタッチ用商品の作成画面</h1>
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
                        <TextField css={modalChildCss} value={point} onChange={handlePointChange} id={"point"} label={"必要ポイント数"} placeholder={"必要ポイント数"} type={"number"} />
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