const path = require('path');
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
