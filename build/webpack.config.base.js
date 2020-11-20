const path = require('path')
const isDev = process.env.NODE_ENV === "development"
const crearteVueLoaderOptions = require('./vue-loader.config')

const config = {
    target: "web",
    entry: path.join(__dirname, '../client/index.js'),
    output: {
        path: path.join(__dirname, '../dist'),
        filename: "bundle.js"
    },
    module: {
        rules: [{
                test: /\.(vue|js|jsx)$/,
                loader: 'eslint-loader',
                exclude: /node_modules/,
                enforce: 'pre' //pre，在真正的loader之前，预处理。如果此处检测报错，不会交由后续loader处理
            }, {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: crearteVueLoaderOptions(isDev)
            },
            {
                test: /\.jsx$/,
                loader: 'babel-loader'
            },
            {
                // Es5以上的js代码需要编译
                test: /\.js$/,
                loader: 'babel-loader',
                // node_modules在发布时就编译过了
                exclude: /node_modules/
            },
            {
                test: /\.(gif|jpg|jpeg|png|svg)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 1024,
                        // 把静态文件放到单独的文件夹，根据开发的目录结构去生成资源的目录结构
                        name: 'resources/[path][name].[hash:8].[ext]'
                    }
                }]
            }
        ]
    }
}



module.exports = config
