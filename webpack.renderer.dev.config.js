const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: './src/renderer/index.jsx',

    output: {
        filename: 'renderer.js'
    },

    module: {
        rules: [{
            test: /\.(jsx)$/,
            exclude: /node_modules/,
            use: [{
                loader: 'babel-loader',
                options: { presets: ['@babel/preset-env', '@babel/preset-react'] }
            }]
        }, {
            test: /\.css$/,
            use: [{
                loader: 'style-loader'
            },{
                loader: 'css-loader',
                options: { modules: false }
            }]
        }]
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/renderer/index.html'
        })
    ],

    devServer: {
        host: 'localhost',
        port: process.env.PORT || 3000,
        hot: true,
    }
};
