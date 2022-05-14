const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        index: './src/index.js',
        circumcircle: "./src/circumcircle.js"
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
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
    ],
    devServer: {
        static: "./dist",
        hot: true
    },
    mode: "development"
};
