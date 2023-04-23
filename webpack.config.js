const path = require("path")
const TerserPlugin = require("terser-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// const FileManagerPlugin = require("filemanager-webpack-plugin");

module.exports = (env) => ({
    entry: path.resolve(__dirname, "./scripts/index.ts"),
    output: {
        path: path.resolve(__dirname, "./dist"),
        filename: "js/[name].[contenthash:6].js",
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader"
                ]
            },
            {
                test: /\.ts$/,
                use: "ts-loader"
            }
        ]
    },
    devServer: {
        open: true,
        hot: true
    },
    resolve: {
        alias: {
            
        },
        extensions: [".js",".ts",".css"]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname,"./index.html"),
            inject: "body"
        }),
        new MiniCssExtractPlugin({
            filename: "css/index.css",
            insert: "head"
        }),
        new TerserPlugin({
            parallel: true,
            extractComments: false,
            terserOptions: {
                ecma: undefined,
                warnings: false,
                parse: {},
                compress: {
                    drop_console: true,
                    drop_debugger: true,
                }
            }
        })
    ],
    mode: env.mode || 'development',
    optimization: {
        minimize: true,
        minimizer: [
            new CssMinimizerPlugin()
        ]
    }
})