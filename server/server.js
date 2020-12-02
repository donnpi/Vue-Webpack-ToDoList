// 起一个nodejs server端口

const Koa = require('koa')
const send = require('koa-send')
const path = require('path')
const favicon = require('koa-favicon')

const staticRouter=require('./routers/static')

const app = new Koa()

const isDev = process.env.NODE_ENV === 'development' // 服务端渲染分开发状态和正式环境

// 简单的中间件记录所有服务端的请求，以及抓取错误
app.use(async (ctx, next) => {
  try {
    console.log(`request with path ${ctx.path}`) // 记录所有请求的路径
    await next()
  } catch (err) {
    console.log(err)
    ctx.status = 500
    if (isDev) {
      ctx.body = err.message
    } else {
      ctx.body = 'please try again later'
    }
  }
})

app.use(favicon(path.join(__dirname, '../favicon.ico')))

// 设置favicon的，无法运行，自己找的见上
// app.use(async (ctx, next) => {
//   if (ctx.path === '/favicon.ico') {
//     await send(ctx, '/favicon.ico', { root: path.join(__dirname, './') })
//   } else {
//     await next()
//   }
// })


app.use(staticRouter.routes()).use(staticRouter.allowedMethods()) // koa既定用法

let pageRouter
if(isDev){
  pageRouter=require('./routers/dev.ssr')
}else{
  pageRouter=require('./routers/ssr')
}
app.use(pageRouter.routes()).use(pageRouter.allowedMethods()) // koa既定用法

const HOST = process.env.HOST || '0.0.0.0'
const PORT = process.env.PORT || 3333

app.listen(PORT, HOST, () => {
  console.log(`server is running on ${HOST}:${PORT}`)
})
