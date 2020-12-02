// 区分路由
import createApp from './create-app'

export default context => { // 这里接受的context等于renderer.renderToString 传入的context
  // 可能会有异步操作，要让vue-server-renderer知道什么时候异步操作结束
  return new Promise((resolve, reject) => {
    const { app, router } = createApp()

    // 给路由推送一条记录，服务端浏览器有默认路由，服务端的app，router这几个还只是对象，没有走真正的渲染这一步，只有主动地调用router.push 才会执行这部分代码，匹配到要调用的组件
    router.push(context.url)

    // onReady一个路由记录被推进去之后，所有异步操作比如路由里有异步加载组件完成，才会调用它的回调，主要是在服务端渲染获取数据的操作
    router.onReady(() => {
      // 给url匹配相应的组件
      const matchedComponents = router.getMatchedComponents()
      if (!matchedComponents.length) {
        return reject(new Error('no component matched'))
      }
      context.meta = app.$meta()
      resolve(app)
    })
  })
}
