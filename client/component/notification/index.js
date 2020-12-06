// import Notification from './notification.vue'

// export default (Vue) => { // 在使用vue install插件时会接受一个vue参数
//   Vue.component(Notification.name, Notification) // 写组件时注意要在内部定义name，这样好维护
// }

import Notification from './notification.vue'

export default (Vue) => {
  Vue.component(Notification.name, Notification)
}
