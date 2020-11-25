import Vue from 'vue'

// 在template中能访问的数据：绑定在this上的所有值，白名单：js的全局对象，但是定义在外层的全局变量是不可访问的
var globalVar = '111' // eslint-disable-line

new Vue({
  el: '#root',
  //   template: `
  //     <div :id="aaa" @click="handleClick">
  //       {{isActive?'active':'not active'}}
  //       {{template里的运算限于能一行得到结果的简单运算}}
  //       {{Date.now()}}可调用js的一些原生对象
  //       <p v-html="html"></p>转义html标签
  //     </div>
  // `,
  template: `
    <div :class="{active : isActive}">
      <p v-html="html"></p>
      <p :style="style">{{joinArr(arr)}}</p>
    </div>
  `,
  data: {
    isActive: false,
    html: '<span>dgfj</span>',
    aaa: 'main',
    arr: [1, 2, 3],
    style: {
      appearance: 'none'
    }
    // 消除浏览器默认样式。vue有fro-fix功能，会自动加浏览器适配的前缀
  },
  methods: {
    handleClick: function() {},
    joinArr(arr) {
      return arr.join(' ')
    }
  }
})
