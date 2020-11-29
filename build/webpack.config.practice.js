const path = require('path')
const HTMLPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const { merge } = require('webpack-merge')

// 引入基础配置
const baseConfig = require('./webpack.config.base')

let config

const devServer = {
  port: 8000,
  host: '0.0.0.0',
  overlay: {
    errors: true
  },
  hot: true
}

const defaultPlugins = [
  new webpack.DefinePlugin({
    'process.env': { NODE_ENV: '"development"' }
  }),
  new HTMLPlugin({
    template: path.join(__dirname, 'template.html') // 生成需要的html文件时，会以此为模板
  })
]

config = merge(baseConfig, {
  entry: path.join(__dirname, '../practice/index.js'),
  devtool: '#cheap-module-eval-source-map',
  module: {
    rules: [{
      test: /\.styl/,
      use: [
        'vue-style-loader',
        'css-loader',
        {
          loader: 'postcss-loader',
          options: {
            sourceMap: true
          }
        },
        'stylus-loader'
      ]
    }]
  },
  devServer,

  resolve: {
    alias: {
      vue: path.join(__dirname, '../node_modules/vue/dist/vue.esm.js') // 指定vue的版本
        // node_modules里有非常多不同版本的vue，提供许多不同环境的支持，
        // 在import Vue from 'vue'时，默认情况下都是runtime.xx.js
        // 而当有runtime时，vue对象中不可用template作为模板，无法编译
    }
  },
  plugins: defaultPlugins.concat([
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ])
})

module.exports = config
