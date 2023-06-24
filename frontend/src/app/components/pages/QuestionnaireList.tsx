/** @jsxImportSource @emotion/react */
/** @jsx jsx */
import { css } from "@emotion/react";
import React, { useEffect, useState, ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TableContainer, TableHead, TableRow, TableCell, TableBody, Button } from "@mui/material";
import { companysGetAll } from "../../api/ApiClient";
import { questionnaireGetAll } from "../../api/QuestionnaireApiClient";

export const QuestionnaireList = () => {
    const { data, error, isLoading } = questionnaireGetAll();
    const { data: companyData, error: companyError, isLoading: companyIsLoading } = companysGetAll();
    const navigate = useNavigate();


    if (isLoading || companyIsLoading) return (<h1>ロード中</h1>);
    if (error || companyError) return (<h1>エラーが発生しました</h1>);
    return (
        <React.Fragment>
            <Link to={"/"}>トップ</Link>
            <h1>アンケート一覧</h1>
            <TableContainer>
                <TableHead>
                    <TableRow>
                        <TableCell align={"center"}>タイトル</TableCell>
                        <TableCell align={"center"}>開催元</TableCell>
                        <TableCell align={"center"}>詳細</TableCell>
                    </TableRow>
                    {
                        (() => {
                            const ele: any[] = [];
                            for (let i = 0; i < data.length; i++) {
                                if (data[i].isActive) {
                                    ele.push(
                                        <TableRow>
                                            <TableCell align={"center"}>{data[i].title}</TableCell>
                                            <TableCell align={"center"}>{
                                                (() => {
                                                    for (let j = 0; j < companyData.length; j++) {
                                                        if (companyData[j].id === data[i].companyId) {
                                                            return companyData[j].name;
                                                        }
                                                    }
                                                    return "can not find";
                                                })()
                                            }</TableCell>
                                            <TableCell>
                                                <Button onClick={() => navigate(`/questionnaire/${data[i].companyId}`)}>詳細</Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                }
                            }
                            return ele;
                        })()
                    }
                </TableHead>
            </TableContainer>
        </React.Fragment>
    )
}