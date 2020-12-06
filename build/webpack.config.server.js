const path = require('path')
const webpack = require('webpack')
const { merge } = require('webpack-merge')
const ExtractPlugin = require('extract-text-webpack-plugin')
const baseConfig = require('./webpack.config.base')
const VueServerPlugin = require('vue-server-renderer/server-plugin')

let config

config = merge(baseConfig, {
  target: 'node', // 打包出来的程序是在node端运行的，不是浏览器端
  entry: path.join(__dirname, '../client/server-entry.js'), // 提供一个单独的入口文件
  devtool: 'source-map', // 代码调试辅助，显示出错行
  output: {
    libraryTarget: 'commonjs2', // 指定入口形式，打包出来的整个应用的入口，通过module.exports暴露出去，在node里面就可以通过require直接引用。相对于浏览器端，它没有module模块
    filename: 'server-entry.js', // 不需要hash，通过模块加载的js没必要使用浏览器的缓存功能
    path: path.join(__dirname, '../server-build'), //输出到public目录
  },
  externals: Object.keys(require('../package.json').dependencies),// wp打包时会把所有依赖的js文件打包到同一个js文件里面，因为浏览器无法通过require加载单独的文件，所以要这样一次性加载到浏览器端。而这个程序打包是要跑在node端，导出的文件只需要去require需要的包就行。不这么做会报错
  module: {
    rules: [{ // 要单独打包到一个css文件，因为如果使用style-loader会有dom操作的代码，而node端没有dom的执行环境
      test: /\.styl/,
      use: ExtractPlugin.extract({
        fallback: 'vue-style-loader',
        use: [
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true
            }
          },
          'stylus-loader'
        ]
      })
    }]
  },
  plugins: [
    new ExtractPlugin('styles.[contentHash:8].css'),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'), // 可能在代码里要引用到
      'process.env.VUE_ENV': '"sever"' // vue服务端渲染官方推荐,可能在vue-server-render中会用到
    }),
    new VueServerPlugin() // vue服务端渲染特别重要的插件，帮助处理一些复杂的逻辑，生成一个单独的json文件可以通过vue-server-renderer做很多服务端渲染相关的事，没有js文件的输出
  ]
})

module.exports = config
