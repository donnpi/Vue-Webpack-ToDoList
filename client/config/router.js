import Router from 'vue-router'

import routes from './routes'

// 不简单暴露一个对象的原因：
// export default new Router({routes})
// 如果这么做，在全局任意地方import的router都是同一个，如果项目需要服务端渲染，该文件只export一个router
// 每次服务端渲染都会重新生成一个新的app，route只有一个对象就会缓存每次新建的app，服务端渲染流程结束后app对象不会释放掉，导致内存溢出

export default () => {
  return new Router({
    routes,
    mode: 'history', // 默认hash，hash更多是用于定位，不能做路由状态的记录，不会被搜索引擎解析，会让网址的seo不好
    // base: '/base/', // 基路径，非强制
    linkActiveClass: 'active-link', // ，指定router-link被激活时显示的样式，用于写全局样式
    linkExactActiveClass: 'extract-active-link', // 路径完全匹配时加上该类名
    scrollBehavior(to, from, savedPositon) {
      // to，from拿到的是完整的路由对象
      // savedPositon：如果有进入过该路由，在该路由上的滚动条历史位置
      if (savedPositon) {
        return savedPositon // 回到历史位置
      } else {
        return { x: 0, y: 0 }
      }
    },
    fallback: true // 遇到不支持histroy路由的浏览器，自动fallback为hash模式。如果设置为false，每次路由跳转都会到后端返回新内容，比较耗时
    // parseQuery(query) {
    //   // 自定义格式化get请求参数，query是字符串
    // },
    // stringifyQuery() {
    //   // 自定义obj转换字符串
    // }

  })
}
