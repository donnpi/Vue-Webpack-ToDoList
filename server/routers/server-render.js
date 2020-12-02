const ejs = require('ejs') // 要用ejs渲染template
module.exports = async (ctx, renderer, template) => { //renderer开发时和正式环境创建的流程不一样，所以要在外部进行传入，template也是
  ctx.headers["ContentType"] = 'true/html' // 要返回html的内容
  // vue-server-renderer服务端渲染时拿到context，渲染完成之后会在上面插入很多属性，包括客户端js，css路径，html上到title，description等，方便我们渲染html。
  const context = { url: ctx.path }

  try {
    const appString = await renderer.renderToString(context)

    //拿到meta信息
    const {title}=context.meta.inject()

    // 渲染html
    const html = ejs.render(template, {
      appString,
      style: context.renderStyles(),// 拿到带有style标签的整个字符串，直接扔到html里即可，不需要自己再写style标签
      scripts: context.renderScripts(),
      title:title.text()
    })
    ctx.body = html // 把html返回客户端
  } catch (err) {
    console.log('render error' + err)
    throw err
  }

}
