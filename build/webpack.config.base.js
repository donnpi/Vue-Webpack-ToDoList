const path = require('path')

//判断是否为测试环境,在启动脚本时设置的环境变量都是存在于process.env这个对象里面的
const isDev = process.env.NODE_ENV === "development"

const config = {
    //设置webpack的编译目标是web平台
    target: "web",
    //声明编译的入口文件                             
    entry: path.join(__dirname, 'src/index.js'),
    //  声明出口文件，将挂载的App全部打包成一个bundle.js,在浏览器中可以直接运行的代码  
    output: {
        path: path.join(__dirname, 'dist'),
        filename: "bundle.js"
    },
    //因为webpack只能处理js文件,且只识别ES5的语法，当有其他格式的文件时，需要在module为其指定loader，处理完之后可以直接在js代码里import
    module: {
        rules: [{
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.jsx$/,
                loader: 'babel-loader'
            },
            {
                // Es5以上的js代码需要编译
                test: /\.jsx$/,
                loader: 'babel-loader',
                // node_modules在发布时就编译过了
                exclude: /node_modules/
            },
            {
                test: /\.(gif|jpg|jpeg|png|svg)$/,
                use: [{
                    //url-loader实际上依赖于file-loader,file-loader处理完文件可以保存为一个文件供处理                           
                    loader: 'url-loader',
                    options: {
                        limit: 1024, //在limit范围的小图片被转换成base64码，直接存放在js中,从而减少新文件的产生，以减少http请求.
                        name: '[name].[ext]' //输出文件的名字,[name] 文件原名,[ext]文件扩展名.
                    }
                }]
            }
        ]
    }
}



module.exports = config //声明一个config的配置,用于对外暴露