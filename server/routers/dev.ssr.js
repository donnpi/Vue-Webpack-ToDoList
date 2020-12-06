//启动serverCompiler编译出server bundle，每次有文件变化时产生一个新的bundle

// 目前node还不支持import语法，所以要用require。（前端代码有barbel编译）
const Router = require('koa-router')
const axios = require('axios')
const MemoryFS = require('memory-fs') // 跟fs的区别是，不把文件写到磁盘上，直接写到内存，webpack依赖的文件很多，提升了读取输出文件的效率
// 要在nodejs直接打包weboack
const webpack = require('webpack')
const path = require('path')
const fs = require('fs')
const VueServerRenderer = require('vue-server-renderer')

const serverRender = require('./server-render')
const serverConfig = require('../../build/webpack.config.server')
const { template } = require('babel-core')

// 在node环境编译webpack,这个compiler可以直接在node里直接run或者watch，然后就可以生成在服务端渲染时用到的bundle
const serverCompiler = webpack(serverConfig)
const mfs = new MemoryFS()
serverCompiler.outputFileSystem = mfs // 指定了webpackcompiler的输出目录在mfs里 把所有的文件输出都放在mfs

// 记录webpack每次打包生成的新文件
let bundle
// watch：每次更改文件都会重新执行打包
serverCompiler.watch({}, (err, stats) => {
  if (err) throw err
  stats = stats.toJson() // 非打包错误，如eslint报错不会再err出现，而是stats
  stats.errors.forEach(err => console.log(err))
  stats.warnings.forEach(warning => console.warn(err))

  // 读取生成的bundle文件
  // webpack.server指定的输出路径
  const bundlePath = path.join(
    serverConfig.output.path,
    'vue-ssr-server-bundle.json', // 使用了vueServerPlugin后默认输出的文件名
  )
  // 每次文件变化就拿到新bundle
  bundle = JSON.parse(mfs.readFileSync(bundlePath, 'utf-8'))
  console.log('new bundle generated')
})

//有请求进来时（用户访问node server中的地址）

// 写一个koa的中间件，用来处理服务端渲染要返回的东西，只要在ctx.body上指定要返回的html内容，就可以真正地返回这部分内容
const handleSSR = async (ctx) => {
  if (!bundle) { // webpack第一次打包时速度比较慢， 服务启动时可能还没打包好
    ctx.body = 'wait a minute, your order will be ready soon'
    return
  }
  // 进行服务端渲染

  // 在拼接html时，需要获取客户端dev-server打包出来的js的文件地址，写在里面。这样把html返回浏览器渲染出来时，才可以引用到客户端的js，把整个应用在客户端跑起来，而不是一个空的html
  // 这里是一个单独的server，webpack-dev-server是另一个单独的server，可以通过axios向dev-server发送请求把文件拿过来
  const clientManifestResp = await axios.get(
    'http://127.0.0.1:8000/public/vue-ssr-client-manifest.json'
  )
  const clientManifest=clientManifestResp.data

  // 通过vue-server-renderer输出的内容只是body部分，需要一个模板帮助生成完整的html
  const template = fs.readFileSync( // 通过fs读取模板
    path.join(__dirname, '../server.template.ejs'), // 需要下载ejs
    'utf-8' // 这样读取出来的才是string
  )
  const renderer = VueServerRenderer
    .createBundleRenderer(bundle, {// 传入bundle，就可生成一个可以直接调用render的function
      inject: false, // vue-server-renderer可以自行注入模板,但是指定的模板限制大，所以不用，只需要把app true渲染出来，我们自己处理剩下的内容
      clientManifest
    })

  await serverRender(ctx, renderer, template)
}

const router = new Router()
router.get('*', handleSSR) // 所有请求都通过handleSSR处理

module.exports = router

