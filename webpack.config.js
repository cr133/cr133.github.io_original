const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.html$/,
                loader: "html-loader"
            },
            {
                test: /\.(css|scss)$/,
                loader: "style-loader!css-loader!sass-loader"
            }
        ]
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: "./src/index.html",
            filename: "./index.html"
        })
    ]
}