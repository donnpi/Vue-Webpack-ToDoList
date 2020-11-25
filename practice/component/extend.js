import Vue from 'vue'
const component = {
  template: `
  <div>
    <p>{{propOne}}</p>
  </div>`,
  data() {
    return {}
  },
  props: {
    active: Boolean,
    propOne: String,
    onChange: Function
  },
  methods: {
    handleChange() {
      this.$emit('change')
    }
  }
}

// Vue.extend得到的是Vue的一个子类
const CompVue = Vue.extend(component)

// 继承component的一个Compvue实例
new CompVue({
  el: '#root',
  propsData: { // 继承的时候，需要propsData{}接受父组件传递的参数
    propOne: 'xxx'
  },
  data: {
    text: '123' // 新定义的data数据会覆盖原com组件数据，方法周期等不会覆盖，会先执行com组件的，再执行compVue里的。
  }
})

// 继承组件方法二
// const component2 = {
//   extends: component,
//   data() {
//     return {
//       text: '1'
//     }
//   }
// }

// new Vue({
//   el: '#root',
//   components: {
//     Comp: component2
//   },
//   template: `<comp></comp>`

// })
