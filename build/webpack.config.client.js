const path = require('path')
const HTMLPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const ExtractPlugin = require('extract-text-webpack-plugin')
  // 合并webpack配置的工具
const { merge } = require('webpack-merge')
const VueClientPlugin=require('vue-server-renderer/client-plugin')

const isDev = process.env.NODE_ENV === 'development'
  // 引入基础配置
const baseConfig = require('./webpack.config.base')

let config

const devServer = {
  port: 8000,
  host: '0.0.0.0',
  overlay: {
    errors: true
  },
  // open: true ,
  hot: true,
  historyApiFallback: {
    index: '/public/index.html' // webpack-devserver没有做路径的映射关系，不认识前端路由的路径。前端使用history路由，是一个完整的url，服务端接收后要进行匹配，才能完成请求操作。当手动刷新时，这个url请求到服务器端，服务端并没有这个地址，就404了。这个设置将index设置为htmlPlugin生成的html。跟base里设置的publicPath有关
  }
}

const defaultPlugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: isDev ? '"development"' : '"production"'
    }
  }),
  new HTMLPlugin({
    template: path.join(__dirname, 'template.html')
  }),
  new VueClientPlugin() // 用于服务端渲染
]

if (isDev) {
  // merge得到的是一个新的对象，不会修改base设置
  config = merge(baseConfig, {
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
    // 在dev和非dev使用的plugin不一样，但是默认defaultPlugins的配置都有，所以用concat连接数组
    plugins: defaultPlugins.concat([
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin()
    ])
  })
} else {
  config = merge(baseConfig, {
    entry: {
      app: path.join(__dirname, '../client/index.js'),
      vendor: ['vue']
    },
    output: {
      filename: '[name].[chunkhash:8].js',
      publicPath:'/public/'
    },
    module: {
      rules: [{
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
    plugins: defaultPlugins.concat([
      new ExtractPlugin('styles.[contentHash:8].css'),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor'
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'runtime'
      })
    ])
  })
}

module.exports = config
