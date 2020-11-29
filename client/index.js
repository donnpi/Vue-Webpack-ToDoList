import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import App from './app.vue'

// import './assets/styles/test.css';
import './assets/styles/style.styl'
import './assets/styles/global.styl'

import createRouter from './config/router'
import createStore from './store/store'

// 使挂载在根节点的router对象，每个子组件都可以拿到它
Vue.use(VueRouter)
// 创建应用的router对象
const router = createRouter()

Vue.use(Vuex)
const store = createStore()

// 使用router异步加载功能，有个store模块只有在异步加载的那个模块才要用到，把这部分代码拆分到那个模块里面
// 动态注册模块
store.registerModule('c', {
  state: {
    text: 3
  }
})
// store.unregisterModule('c')

// // 创建div插入到body里
// const root = document.createElement('div')
// document.body.appendChild(root)

// 注册路由守卫,每次路由跳转时都会触发该钩子
router.beforeEach((to, from, next) => {
  // 可进行数据校验
  console.log('before each')
  next()
})
router.beforeResolve((to, from, next) => {
  console.log('before resolve')
  next()
})
router.afterEach((to, from) => {
  console.log('after each')
})

new Vue({
  router, // 挂载路由
  store, // 使用store
  // render 渲染App
  render: (h) => h(App)

  // mount 将App挂载到html节点上
}).$mount('#root')
