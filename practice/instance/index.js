import Vue from 'vue'

const app = new Vue({
  // el: '#root', //html中被替换的标签
  template: '<div>this is {{text}} {{obj.a}}</div>',
  data: {
    text: 0,
    obj: {}
  },
  watch: {
    text(newText, OldText) {
      console.log(newText, OldText)
    }
  }
})

// 每个组件都是一个vue实例，组件里调用的this，其实就该实例（app），通过this调用xx，就像下面的app.xx是一样的

// 除了el，用别的方式把模板渲染到html上
app.$mount('#root')

// 可直接修改new出来的对象值
setInterval(() => {
  app.text += 1
}, 5000)

console.log(app.$data)
console.log(app.$props) // 实例化vue的prop自定义属性传值的对象
console.log(app.$el)

// 创建实例时传进去的一整个对象，以及new Vue时的一些默认值
console.log(app.$options)

// 这样修改无效，因为传入的options的data，是通过vue再init该对象时，做过一些修改，不是直接引用$option.data. 它们不是同一个对象
app.$options.data.text = 1

// 修改有效，说明挂载在vue实例根对象上的text，跟$data上的text是一个属性，vue：直接通过instance上调用的data，就是代理到$data上的属性
app.$data.text = 1

// 给$options.render赋值是有作用的，只是要等下一次有值变化，重新进行渲染时才会生效
// app.$options.render = (h) => {
//   return h('div', {}, 'new render function')
// }

// app.$root：根节点，在最外层生成的，通过该节点挂载到html的vue对象
console.log(app.$root === app)

// 使用组件时，在组件里写的标签 如<item><div></div></item>
console.log(app.$children)

console.log(app.$slots)
console.log(app.$scopedSlots)

console.log(app.$refs) // 快速定位模板里的html节点对象或组件（vue实例）
console.log(app.$isServer) // 服务端渲染时判断

// 组件经常要被销毁，从一个页面跳转到另一个，其watch就没用了，需要注销掉，否则可能导致内存溢出
// $watch返回一个方法，调用即可注销
const unWatch = app.$watch('text', (newText, OldText) => {
  console.log(newText, OldText)
})
unWatch() // 注销watch

// $on监听的vue对象，$emit必须通过触发同一个对象，才能被监听到，不会像dom一样往上冒泡
// 事件监听
app.$on('test', (a, b) => {
  console.log('test emited', a, b)
})
let i = 0

setInterval(() => {
  i++
  // 事件触发
  app.$emit('test', 1, 2)

  // vue是响应式框架，但我们如果给data里一个obj没有声明的值赋值，就不会引起实例的重新渲染，而forUpdate可以重新渲染
  // 但是要慎重使用，频率没控制好，一直刷新会导致应用性能低
  // 一开始没有但后面会用到的值
  // 解决方案1：可以先声明一个默认值，如一个空字符串
  // app.obj.a = i
  // app.$forceUpdate()
  // 解决方案2：这种声明属性的方式是reactive的
  app.$set(app.obj, 'a', i)

  // app.$delete 彻底删除属性
  // vue的渲染
  // 过程是异步的，比如连续改了几次a的值，只会一次渲染出来
  // vue下一次进行dom更新时，才会调用callback
  app.$nextTick()
}, 1000)

// once触发一次
app.$once('test', () => {
  console.log('once')
})
