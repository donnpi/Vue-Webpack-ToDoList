import Vue from 'vue'

new Vue({
  el: '#root',
  template: `
  <div>
    <p>{{name}}</p>
    <p>{{getName()}}</p>
    <p>Number{{number}}</p>
    <p><input type="text" v-model="number"></p>
    <p><input type="text" v-model="firstName"></p>
    <p><input type="text" v-model="lastName"></p>
    <p>fulName:{{fulName}}</p>
    <p><input type="text" v-model="obj.a"></p>
  </div>`,
  data: {
    firstName: 'Tonz',
    lastName: 'Yorke',
    number: 1,
    fulName: '',
    obj: { a: 123 }
  },
  computed: {
    // name() {
    //   console.log('new name')
    //   return `${this.firstName}-${this.lastName}`
    // },

    name: {
      get() {
        console.log('new name')
        return `${this.firstName}-${this.lastName}`
      },
      set(name) { // 不推荐用
        const names = name.split(' ')
        this.firstName = names[0]
        this.lastName = names[1]
      }
    }
  },
  watch: {
    // obj: {
    //   // watch方法最初绑定时不会执行，这样写就会
    //   handler(newName, oldName) {
    //     console.log('obj.a changed')
    //   },
    //   immediate: true,
    //   deep: true // 如果监听的是对象,默认情况下，handle只监听obj引用的变化，也就是只有直接给obj赋值才会监听到，而obj下面的属性变化则无法触发。开启了deep就把obj下面的属性一层层遍历完，每一层属性变化都能触发监听事件。

    //   // 缺点：性能消耗大，修改obj任何一处都会触发
    // },
    // 解决：在字符串上写对象的深入属性调用，能一层层解析到最后一个.,监听到真正想监听的属性
    'obj.a': {
      handler(newName, oldName) {
        console.log('obj.a changed')
      },
      immediate: true,
      deep: true // 如果监听的是对象,默认情况下，handle只监听obj引用的变化，也就是只有直接给obj赋值才会监听到，而obj下面的属性变化则无法触发。开启了deep就把obj下面的属性一层层遍历完，每一层属性变化都能触发监听事件。

      // 缺点：性能消耗大，修改obj任何一处都会触发
      // 解决：

    }

  },
  methods: {
    getName() {
      console.log('getName invoked')
      return `${this.firstName}-${this.lastName}`
    }
  }
})
