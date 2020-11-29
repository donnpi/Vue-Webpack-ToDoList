import state from '../state/state'

export default {
  updateCount(state, { num, num2 }) { // 第二个参数要传多个数据时，要以对象的形式
    state.count = num
  }
}
