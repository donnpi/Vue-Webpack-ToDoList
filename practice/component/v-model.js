import Vue from 'vue'

const component = {
  model: { // 没搞明白
    prop: 'value1',
    event: 'change'
  },
  props: ['value', 'value1'],
  template: `
  <div>
    <input type="text" @input="handleInput" :value="value">
  </div>
  `,
  methods: {
    handleInput(e) {
      this.$emit('input', e.target.value)
    }
  }
}

// 组件之间的数据双向绑定（组件间v-model运作原理）：
// 父传子：子组件input的value值来自于prop父组件的data，
// 子传父：父组件监听子组件input行为，并触发自身行为：将子组件input的value传给data
new Vue({
  components: {
    CompOne: component
  },
  el: '#root',
  data() {
    return {
      value: '123'
    }
  },
  template: `
    <div>
      <comp-one v-model="value"> </comp-one>
        <p>v-model本质上以下：props和事件监听 arguments是实参合集</p>
      <comp-one :value="value" @input="value=arguments[0]"> </comp-one>
    </div>
  `
})
