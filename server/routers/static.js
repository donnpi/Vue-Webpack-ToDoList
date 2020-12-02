const Router = require('koa-router')
const send = require('koa-send')

// 只会处理/public开头的路径
const staticRouter = new Router({ prefix: '/public' })

staticRouter.get('/*', async ctx => {
  await send(ctx, ctx.path)
})

module.exports = staticRouter
