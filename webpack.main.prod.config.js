const path = require("path");

module.exports = {
    mode: 'production',
    devtool: 'source-map',
    target: 'electron-main',

    entry: {
        main: "./src/main/main.js"
    },

    output: {
        path: path.join(__dirname, 'release', 'app', "main"),
        filename: 'main.js',
        library: {
            type: 'umd',
        },
    },

    optimization: {
        minimize: true,
    }
};
