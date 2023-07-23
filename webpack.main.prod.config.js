const path = require('path');

module.exports = {
    mode: 'production',
    devtool: 'source-map',
    target: 'electron-main',

    entry: {
        main: './src/main/main.js',
        preload: './src/main/preload.js'
    },

    output: {
        path: path.join(__dirname, 'release', 'app', "main"),
        filename: '[name].js',
        library: {
            type: 'umd',
        },
    },

    optimization: {
        minimize: true,
    }
};
