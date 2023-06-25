/**
 * @type import('webpack').Configuration
 */

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const Dotenv = require("dotenv-webpack");
const environment = process.env.NODE_ENV || "dev";

module.exports = {
    entry: "./src/main.tsx",
    output: {
        path: path.resolve(__dirname, "docs/"),
        filename: "[name].js",
        clean: true

    },
    module: {
        rules: [{
            test: /\.ts[x]?$/, use: "ts-loader"
        }]
    },
    target: "web",
    resolve: {
        extensions: [".ts", ".js", ".tsx", ".jsx", ".json"],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./public/index.html",
            filename: "index.html",
            publicPath: "./"
        }),
        new Dotenv({
            path: path.resolve(__dirname,`.env.${environment}`),
        }),
    ],
    watch: true
}