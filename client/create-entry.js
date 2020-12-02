// 服务端渲染时客户端js要做相应配合
import createApp from './create-app'

const { app, router } = createApp()

router.onReady(() => {
  app.$mount('#root')
})
