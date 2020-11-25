import Vue from 'vue'

const ChildComponent = {
  template: '<div>child componnet</div>',
  mounted() {
    console.log(this.$parent.$options.name)
    console.log(this.grandpa)
  },
  inject: ['grandpa']
}

const componet = {
  name: 'comp',
  components: {
    ChildComponent
  },
  template: `
    <div :style="style">
      <slot value="hahha"></slot>
      <child-component></child-component>
    </div>
  `,
  data() {
    return {
      style: {
        width: '200px',
        height: '200px',
        border: '1px solid #aaa'
      }
    }
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
  provide() {
    return {
      grandpa: this
    }
  },
  template: `
  <div>
    <comp-one>
      <template v-slot="scope">{{scope.value}}<span></span></template>
    </comp-one>
  </div>
  `
})
