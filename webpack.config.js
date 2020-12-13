const path = require('path');
const DotenvWebpackPlugin = require('dotenv-webpack');

module.exports = {
    entry: ['babel-polyfill', './src/app.js'],
    output: {
        path: path.resolve(__dirname, 'public/scripts'),
        filename: 'bundle.js'
    },

    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                }
            }
        }]
         
    },
    plugins: [new DotenvWebpackPlugin()],
    devServer: {
        contentBase: path.resolve(__dirname, 'public'),
        publicPath: '/scripts'
    },
   
    devtool: "source-map"
}