const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        index: ['./src/index.js', "./src/convert.js"],
        circumcircle: "./src/circumcircle.js",
        superTriangle: "./src/superTriangle.js"
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[contenthash].js',
        clean: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            chunks: ["index"],
            inject: true,
            filename: "index.html"
        }),
        new HtmlWebpackPlugin({
            template: "./src/circumcircle.html",
            chunks: ["circumcircle"],
            inject: true,
            filename: "circumcircle.html"
        }),
        new HtmlWebpackPlugin({
            template: "./src/superTriangle.html",
            chunks: ["superTriangle"],
            inject: true,
            filename: "superTriangle.html"
        }),
    ],
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    "style-loader",
                    "css-loader",
                    "sass-loader",
                ],
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    }
};
