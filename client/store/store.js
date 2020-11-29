import Vuex from 'vuex'

// 改为export一个函数，那么是在外层生成store，这俩就在外引入了
// import Vue from 'vue'
// Vue.use(Vuex) // 创建store之前要做的

// 服务端渲染时有一部分数据直接传递到客户端，我们会用拿到的这一部分数据去覆盖default的数据，因为它没有任何跟业务相关的内容，所以只是默认属性而不是真正状态
import defaultSate from './state/state'
import mutations from './mutations/mutations'
import getters from './getters/getters'
import actions from './actions/actions'

const isDev = process.env.NODE_ENV === 'development'

// 调用服务端渲染，每次一渲染都要新生成一个store
export default () => {
  const store = new Vuex.Store({
    strict: isDev, // 在开发环境下限制state的数据只能由mutations修改
    state: defaultSate,
    mutations,
    getters,
    actions,
    modules: {
      a: {
        namespaced: true, // 让a模块的mutations跟全局的命名空间冲突
        state: {
          text: 1
        },
        mutations: {
          updateText(state, text) { // 这里的state是模块a的
            console.log('a.state')
            state.text = text
          }
        },
        getters: {
          textPlus(state, getters, rootState) { // 2,所有的getters方法 3.全局的state
            return state.text + 1 + rootState.count + rootState.b.text
          }
        },
        actions: {
          add({ state, commit, rootState }) { // 和全局下的action一样，第一个参数是该模块的store，这里结构了
            commit('updateCount', { num: 56789 }, { root: true }) // root：如果要调用全局下的数据结构，如updateCount
          }
        }
      },
      b: {
        state: {
          text: 2
        },
        actions: {
          testAction({ commit }) {
            commit('a/updateText', 'test text', { root: true })
          }
        }
      }
    }
    // plugins: [
    //   (store) => {
    //     console.log('my plugin invoked')
    //   }
    // ]
  })

  // webpack 热更替普遍使用的
  if (module.hot) {
    module.hot.accept([
      './state/state',
      './mutations/mutations',
      './getters/getters',
      './actions/actions'
    ], () => {
      const newState = require('./state/state').default
      const newMutations = require('./mutations/mutations').default
      const newGetters = require('./getters/getters').default
      const newActions = require('./actions/actions').default

      store.hotUpdate({
        state: newState,
        mutations: newMutations,
        getters: newGetters,
        actions: newActions
      })
    })
  }
  return store
}
