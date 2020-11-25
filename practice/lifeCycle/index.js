import Vue from 'vue'

const app = new Vue({
  // el: '#root', // 如果没有挂载到节点上，只会执行beforeCreate和created
  // template: '<div>{{text}}</div>',
  data: {
    text: 0
  },
  beforeCreate() { // 未完成reactive，此时不修改data中的数据，最早放到created
    // el：undefined 拿不到组件对应的dom节点，此时无法执行dom操作
    console.log(this.$el, 'beforeCreate')
  },
  created() { // 完成reactive
    //  el：undefined 此时无法执行dom操作 可进行数据操作
    console.log(this.$el, 'createed')
  },
  beforeMount() {
    // el：挂载的节点#root
    console.log(this.$el, 'beforeMount')
  },
  mounted() {
    // el：执行了render后调用mounted，el变成渲染出来的HTML（template）与dom相关的操作一般在这处理，也可进行数据操作
    console.log(this.$el, 'mounted')

    // 经过mounted之后实例彻底完成，后续的过程都需要外部触发
  },
  beforeUpdate() {
    console.log(this, 'beforeUpdate')
  },
  updated() {
    console.log(this, 'updated')
  },
  activated() { // 在组件章节讲解
    console.log(this, 'activated')
  },
  deactivated() { // 在组件章节讲解
    console.log(this, 'deactivated')
  },
  beforeDestroy() {
    console.log(this, 'beforeDestroy')
  },
  destroyed() {
    console.log(this, 'destroyed')
  },
  render(h) {
    // 可见render方法是在beforeMount和mounted之间执行的
    console.log('render function invoked')

    // h即vue中createElement方法
    return h('div', {}, this.text)
  },
  renderError(h, err) {
    // 只有在开发环境才会执行,本组件的render出错时调用，子组件不可
    return h('div', {}, err.stack)
  },
  errorCaptured() {
    // 正式环境也可用，可收集线上错误，会向上冒泡，子组件的错误也可捕获到
  }
})

app.$mount('#root')

// setInterval(() => {
//   // 每次数据更新时执行beforeUpdate和updated
//   app.text = app.text += 1
// }, 2000)

setTimeout(() => {
  app.$destroy() // 销毁实例，解除所有时间监听和watch。可观察到执行了beforeDestroy和destroyed
}, 1000)
