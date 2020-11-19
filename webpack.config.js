const path = require('path')
const HTMLPlugin = require('html-webpack-plugin')
const webpack = require("webpack")
const ExtractPlugin = require("extract-text-webpack-plugin")

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
            // {
            //     test: /\.css$/,
            //     use: [
            //       //将css的样式写入到html里面去
            //         'style-loader',     
            //         //处理css文件                 
            //         'css-loader'                      
            //     ]
            // },
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
    },
    plugins: [
        //主要作用是，在此处可以根据isdev配置环境变量process.env,
        // 一是可以在js代码中可以获取到process.env,
        // 二是webpack或则vue等根据process.env如果是development,会给一些特殊的错误提醒等,而这些特殊项在正式环境是不需要的
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: isDev ? '"development"' : '"production"'
            }
        }),
        //引入HTMLPlugin,将打包好的js融入html
        new HTMLPlugin()
    ]
}

if (isDev) {
    //如果是测试环境下的一些配置
    config.module.rules.push({
            test: /\.styl/,
            use: [
                'style-loader', //将样式写入到html
                'css-loader', //css-loader处理css，将其模块化
                {
                    loader: 'postcss-loader',
                    options: {
                        //stylus-loader和postcss-loader自己都会生成sourceMap,如果前面stylus-loader已生成了sourceMap，那么postcss-loader可以直接引用前面的sourceMap
                        sourceMap: true,
                    }
                },
                //将stylus转换成css后,抛给上一层的css-loader
                'stylus-loader'
            ]
        })
        //devtool的作用是在浏览器中调试时,显示的代码和我们的项目中的代码基本相似,而不是编译后的代码。避免于我们调试时，连自己都看不懂                                          
    config.devtool = '#cheap-module-eval-source-map'
    config.devServer = { //这个devServer的配置是在webpack2.x以后引入的,1.x是没有的
            port: 8080,
            host: '127.0.0.1',
            overlay: {
                errors: true, //编译中遇到的错误都会显示到网页中去
            },
            //项目启动时,会默认帮你打开浏览器
            // open: true ,                                
            hot: true //在单页面应用开发中,我们修改了代码后是整个页面都刷新,开启hot后, 只重新渲染当前页更改的组件，不会重新加载页面，所以数据都还会在
        },
        config.plugins.push( //添加两个插件用于hot:true的配置
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoEmitOnErrorsPlugin()
        )
} else {
    config.entry = {
        app: path.join(__dirname, 'src/index.js'),
        vendor: ['vue']
    }
    config.output.filename = '[name].[chunkhash:8].js' //此处一定是chunkhash,因为用hash时app和vendor的hash码是一样的了,这样每次业务代码更新,vendor也会更新,也就没有了意义.
    config.module.rules.push({
            test: /\.styl/,
            use: ExtractPlugin.extract({
                fallback: 'style-loader',
                use: [
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true,
                        }
                    },
                    'stylus-loader'
                ]
            })
        }, ),
        config.plugins.push(
            new ExtractPlugin('styles.[contentHash:8].css'), //定义打包分离出的css文件名
            new webpack.optimize.CommonsChunkPlugin({ //定义静态文件打包
                name: 'vendor'
            }),
            new webpack.optimize.CommonsChunkPlugin({ //将app.js文件中一些关于webpack文件的配置单独打包出为一个文件,用于解决部分浏览器长缓存问题   
                name: 'runtime'
            })
        )
}

module.exports = config //声明一个config的配置,用于对外暴露