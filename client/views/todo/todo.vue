<template>
  <section class="real-app">
    <input
      type="text"
      class="add-input"
      autofocus="autofocus"
      placeholder="接下来要做什么呢？"
      @keyup.enter="addTodo"
    />
    <item
      v-for="todo in filteredTodos"
      :key="todo.id"
      :todo="todo"
      @del="deleteTodo"
    />
    <tabs
      :filter="filter"
      :todos="todos"
      @toggle="toggleFilter"
      @clearAllCompelted="clearAllCompelted"
    />
  </section>
</template>

<script>
import Item from './item.vue'
import Tabs from './tabs.vue'
let id = 0
export default {
  metaInfo: {
    title: 'Tonz\'s Todo App'
  },
  beforeRouteEnter (to, from, next) {
    // 拿不到this
    console.log('todo before enter')
    next()
  },
  beforeRouteUpdate (to, from, next) {
    // 路由更新时用
    console.log('todo before update')
    next()
  },
  beforeRouteLeave (to, from, next) {
    // 比如表单页面离开前，询问用户是否离开
    console.log('todo leave')
    next()
  },

  props: ['id'],
  data () {
    return {
      // 事项列表
      todos: [],
      // 被选中tabs列表
      filter: 'all'
    }
  },
  components: {
    Item,
    Tabs
  },
  methods: {
    addTodo (e) {
      if (e.target.value.trim() === '') return
      // 在第一行插入
      this.todos.unshift({
        id: id++,
        content: e.target.value.trim(),
        // 任务状态
        completed: false
      })
      e.target.value = ''
    },
    deleteTodo (id) {
      this.todos.splice(this.todos.findIndex(todo => todo.id === id), 1)
    },
    // 切换tabs的激活项
    toggleFilter (state) {
      this.filter = state
    },
    clearAllCompelted () {
      this.todos = this.todos.filter(todo => !todo.completed)
    }

  },
  computed: {
    filteredTodos () {
      if (this.filter === 'all') {
        return this.todos
      } else {
        const completed = this.filter !== 'active'
        return this.todos.filter(todo => todo.completed === completed)
      }
    }
  },
  mounted () {
    console.log(this.id)
  }
}
</script>

<style lang="stylus" scoped>
.real-app {
  width: 600px;
  margin: 0 auto;
  box-shadow: 0 0 5px #666;
}

.add-input {
  position: relative;
  margin: 0;
  width: 100%;
  font-size: 24px;
  font-family: inherit;
  font-weight: inherit;
  line-height: 1.4em;
  border: none;
  outline: none;
  color: inherit;
  box-sizing: border-box;
  font-smoothing: antialiased;
  padding: 16px 16px 16px 36px;
  border: none;
  box-shadow: inset 0 -2px 1px rgba(0, 0, 0, 0.03);
}
</style>
