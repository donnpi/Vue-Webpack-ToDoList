import Vue from 'vue'

const componet = {
  props: ['prop1'],
  name: 'comp',
  data() {
    return {
      style: {
        width: '200px',
        height: '200px',
        border: '1px solid #aaa'
      }
    }
  },
  //   template: `
  //   <div :style="style">
  //     <slot value="hahha"></slot>
  //   </div>
  // `,
  render(h) {
    return h('div', {
      style: this.style,
      on: {
        click: () => {
          this.$emit('click')
        }
      }
    }, [ //插槽和绑定prop
      this.$slots.header, // 默认插槽则用default
      this.prop1
    ])
  }
}

new Vue({
  components: {
    CompOne: componet
  },
  el: '#root',
  data() {
    return {
      value: '123'
    }
  },
  methods: {
    handleClick() {
      console.log('click')
    }
  },
  // template: `
  // <div>
  //   <comp-one>
  //     <template v-slot="scope">{{scope.value}}<span></span></template>
  //   </comp-one>
  // </div>
  // `,

  // 以下两个是一样的
  // render() {
  //   return this.$createElement()
  // },
  render(createElement) {
    return createElement( // 接受三个参数
      'comp-one', { // 1,需要创建的节点名，组件或dom
        ref: 'comp', // 2,节点属性 attr/props/ref/事件监听
        props: {
          prop1: this.value // prop传值
        },
        // on: {
        //   click: this.handleClick // 通过on绑定事件，如果是组件，需要通过内部$emit去发送事件（v-on处理了这个过程），如果是原生节点，则会自动处理
        // },
        nativeOn: {
          click: this.handleClick // 直接绑定到组件的根节点
        }
      }, [createElement('span', { // 3,内容，可以是节点 也可以是字符串，如this.value
          ref: 'sapn',
          slot: 'header',
          domProps: {
            innerHTML: '<span>3563</span>' // 后面的this.value就无效了
          },
          attrs: {
            id: 'test-id'
          }
        },
        this.value)])
  }
})
