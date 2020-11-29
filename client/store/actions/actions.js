export default {
  updateCountAsync(store, data) { // 1,整个store对象 2,触发actions传入的值
    setTimeout(() => {
      store.commit('updateCount', { num: data.num })
    }, data.time)
  }
}
