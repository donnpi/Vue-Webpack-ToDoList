// 每次服务端渲染都要渲染新的app，不能用上次渲染过的app对象进行下一次渲染，因为它包含了上一次渲染的状态，会影响当前次渲染内容
// 该文件类似于index.js，初始化内容放到这里
import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import Meta from 'vue-meta'

import App from './app.vue'
import createStore from './store/store'
import createRouter from './config/router'
import Notification from './components/notification'

import './assets/styles/global.styl'

Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(Meta)
Vue.use(Notification)
console.log('hhjkf')

// 每次调用该方法，都会返回一批新的对象，防止应用在node端内存溢出
export default () => {
  const router = createRouter()
  const store = createStore()

  const app = new Vue({
    router,
    store,
    render: h => h(App)
  })
  return { app, router, store }
}
