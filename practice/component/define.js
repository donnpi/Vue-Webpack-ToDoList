import Vue from 'vue'
const component = {
  template: `
  <div>
    <span v-show="active">see me if active</span>
    <p>{{propOne}}</p>
    <p @click="handleChange">{{propOne}}</p>
  </div>`,
  // 在使用data定义组件内的数据时，如果该组件不是通new Vue的方式生成的，data必须是一个function，return的也必须是一新建的对象，不能是定义在全局的对象
  data() {
    return {}
  },
  props: {
    active: { type: Boolean, default () { return {} } },
    propOne: String,
    onChange: Function
  },
  methods: {
    handleChange() {
      this.$emit('change')
    }
  }
}

// 把component变成一个租价
// 方式一：全局定义：在全局下，Vue这个类的component方法，把将其定义为组件
// 一个Vue的组件可视作一个类，类的命名用大写字母开头
Vue.component('CompOne', component)

new Vue({
  el: '#root',
  data: {
    prop1: 'text1'

  },
  methods: {
    handleChange() {
      this.prop1 += 1
    }
  },
  template: `
  <div>
    <comp-one :active="false" :prop-one="prop1" @change="handleChange"></comp-one>
    <comp-one :active="true"></comp-one>
  </div>
  `,
  // 方式二，局部定义
  components: {
    CompOne: component
  }
})
