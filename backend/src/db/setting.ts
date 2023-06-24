import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

export const db_setting:mysql.ConnectionOptions = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    timezone: "jst"
}