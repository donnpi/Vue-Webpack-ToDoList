<template>
  <div id="app">
    <Header></Header>
    <!--   <Todo></Todo> -->
    <!-- <p>{{fullName}}{{counter}}</p> -->
    <!-- <p>{{textA}} {{textPlus}}</p> -->
    <router-link to="/app">app</router-link>
    <router-link to="/login">login</router-link>
    <!-- 过度动画 -->
    <transition name="fade">
      <router-view />
    </transition>
      <!-- <router-view name="a" />  -->
    <Footer></Footer>
  </div>
</template>

<script>
import {
  mapState,
  mapGetters,
  mapActions,
  mapMutations
} from 'vuex'
import Header from './layout/header.vue'
import Footer from './layout/footer.jsx'
// import Todo from './views/todo/todo.vue'

export default {
  metaInfo: {
    title: 'Tonz\'s Todo App'
  },
  components: {
    Header,
    Footer
  },
  mounted() {
    console.log(this.$route)
    console.log(this.$store) // 指向在应用入口传入的store对象
    this.updateCountAsync({ num: 5, time: 2000 })
    // let i = 1
    // setInterval(() => {
    //   this.updateCount( {
    //     num: i++,
    //     num2: 2
    //   })
    // }, 1000)
    this['a/updateText']('123')
    this['a/add']()
  },
  computed: {
    // textA() {
    //   return this.$store.state.b.text
    // },
    ...mapState({
      counter: (state) => state.count + 1,
      textA: state => state.a.text,
      textC: state => state.c.text
    }),
    // count() {
    //   return this.$store.state.count
    // },
    ...mapGetters({
      fullName: 'fullName',
      textPlus: 'a/textPlus'
    })
    // fullName() {
    //   return this.$store.getters.fullName
    // }
  },
  methods: {
    ...mapActions(['updateCountAsync', 'a/add']),
    ...mapMutations(['updateCount', 'a/updateText'])
  }
}
</script>

<style lang="stylus" scoped>
#app
  position absolute
  left 0
  right 0
  top 0
  bottom 0
  #cover
      position absolute
      left 0
      right 0
      top 0
      bottom 0
      background-color #999
      opacity 0.2
      z-index -1
</style>
