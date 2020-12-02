// import Todo from '../views/todo/todo.vue'
// import Login from '../views/login/login.vue'

export
default [{
  path: '/',
  redirect: '/app'
}, {
  path: '/app',
  // path: '/app/:id', // 可通过$routes的params参数拿到，$routes还可拿到query，是一个对象
  props: true, // 会把params prop到组件里，不需要$routes获取。
  // 如果组件获取params时，是用$route,则是从当前路由上读取，该组件的使用就一定要作为route配置的component，而不能作为一个单纯的组件。用props实现解耦。
  components: {
    default: () =>
      import('../views/todo/todo.vue')
    // a: Login // 在同一个路径下显示不同部分：router-view命名
  },
  name: 'app', // 可以通过name代替路径跳转,:to="{ name: 'app' }""
  meta: { // 保存路由信息，在html的head中会写一些meta元信息,用于seo。vue组件比较难直接在里面写，就在配置里写
    title: 'this is a todolist',
    description: 'welcome to Tonz Space'
  },
  beforeEnter(to, from, next) {
    // 局部路由，类似于beforeEach,不过是在进入该路由之前被调用
    console.log('app route before enter')
    next()
  }
  // children: [{
  //   // 要在Todo组件里放route-view，在匹配到test路径时才会显示相应组件
  //   path: 'test',
  //   component: Login
  // }]
},
{
  path: '/login',
  component: () =>
    import('../views/login/login.vue')
}
]
