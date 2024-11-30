const path = require('path');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        popup: './src/popup.js',
        background: './src/background.js',
        content: './src/content.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    mode: 'development',
    watch: true,
    devtool: 'cheap-module-source-map',
    plugins: [
        // new HtmlWebpackPlugin({
        //     template: './src/popup.html',
        //     filename: 'popup.html'
        // }),
        new CopyWebpackPlugin({
            patterns: [{
                    from: 'static'
                }, {
                    from: path.resolve(__dirname, './assets'),
                    to: path.resolve(__dirname, './dist/assets')
                },
            ]
        }),
    ]
}
