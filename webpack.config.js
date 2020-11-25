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
  // 将输入的js文件，以及它所依赖的所有资源打包成一个bundle.js,是在浏览器中可以直接运行的代码
  output: {
    path: path.join(__dirname, 'dist'),
    // 每一次打包都会生成一个唯一的 hash
    filename: "bundle.[hash:8].js"
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
          //url-loader封装了file-loader,处理完文件后，换名字可以保存到另外的地方
          loader: 'url-loader',
          // opitons 指定loader的操作方式
          options: {
            limit: 1024, //在limit范围的小图片被转换成base64码，直接存放在js中,从而减少新文件的产生，以减少http请求.
            name: '[name].[ext]' //输出文件的名字,[name] 文件原名,[ext]文件扩展名.
          }
        }]
      }
    ]
  },
  plugins: [
    //DefinePlugin，在此处可以根据isdev定义环境变量process.env,这是可被项目中的js代码调用到的
    // 1.vue会根据不同的process.env区分打包，如果是development,会给一些特殊的错误提醒等,而这些特殊项在正式环境是不需要的
    // 2，是webpack 也会根据process.env去选择不同源代码的版本去打包
    // '""'写法：因为调用数据实际是''里面的内容，如果没有""，则''里就是一个未声明的变量
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: isDev ? '"development"' : '"production"'
      }
    }),
    //没有HTMLPlugin,打包的内容就没有html，项目是跑不起来的，它能生成一个html入口文件
    new HTMLPlugin()
  ]
}

if (isDev) {
  //测试环境下的配置
  config.module.rules.push({
      test: /\.styl/,
      use: [
        'style-loader', //在css外面包裹一层js代码，变成一个style标签写到html里面
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
    //devtool：在浏览器中调试时,显示的代码是项目中的代码（vue/es6）,而不是编译后的。避免调试时，连自己都看不懂
  config.devtool = '#cheap-module-eval-source-map'

  config.devServer = {
      port: 8080,
      // 这么设置，本地可通过localhost或127.0.0.1访问，也可以通过本机的内网ip访问
      host: '0.0.0.0',
      overlay: {
        errors: true, //编译中遇到的错误都会显示到网页中去
      },
      // open: true ,   //项目启动时,会默认打开浏览器
      hot: true //在单页面应用开发中，开启hot后, 只重新渲染当前页更改的组件，不会重新加载页面，所以数据都还会在
    },
    config.plugins.push( //添加两个插件用于hot:true的配置
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin() //减少一些不重要的信息被展示
    )
} else {
  // 正式环境的打包配置
  config.entry = {
      app: path.join(__dirname, 'src/index.js'),
      vendor: ['vue'] //需要单独打包框架
    }
    // chunk是在entry里声明的不同节点，每个节点都是不同的chunck
    // 使用hash时，打包的每个模块都是同一个hash，是整个应用的hash
    // 一旦使用了不同的entry，或者把类库文件单独打包时，必须使用chunckhash，因为用hash时app和vendor的hash码是一样的了,这样每次业务代码更新,vendor也会更新,单独打包也就没有了意义.
  config.output.filename = '[name].[chunkhash:8].js'
  config.module.rules.push({
      test: /\.styl/,
      use: ExtractPlugin.extract({
        fallback: 'style-loader',
        use: [
          // 正式环境把样式单独写到一个css文件，所以这里不需要style-loader
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
      //把非js代码单独打包成一个静态资源文件，
      // 1，因为该文件可能单独做浏览器缓存，
      // 2，希望在html头里引入一个单独的文件，因为通过js把样式写入浏览器效率不高
      new ExtractPlugin('styles.[contentHash:8].css'), //指定输出的静态文件名，contentHash根据输出的css文件hash一个单独的值，而不是output的filename
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor'
          //单独打包类库文件（框架/第三方包）
          // 这些代码的稳定性高，不像业务代码要经常更新。我们希望浏览器尽可能久地去缓存这类文件。
          // 如果和业务代码打包在一起，整个js文件都会跟着业务代码的更新而更新，所以单独拆分出来打包
      }),
      new webpack.optimize.CommonsChunkPlugin({ //把webpack生成在app.js里的一些相关代码单独打包出为一个文件,用于解决部分浏览器长缓存问题
        name: 'runtime'
          //好处：有新的模块加入时，webpack会给每个模块加一个id，有新的模块加入时，如果插入的顺序是在中间，会导致后面每一个模块的id发生变化，导致打包出的内容hash产生变化，，通过hash实现浏览器长缓存的功能就失效。
          // 这样做就规避了问题，vendo要放在runtime前面
      })
    )
}

module.exports = config //声明一个config的配置,用于对外暴露