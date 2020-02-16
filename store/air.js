export const state = () => {
  return {
    // 历史纪录
    history: []
  }
}

export const mutations = {
  setHistory(state, data) {
    // 让后浏览的记录在前面展示
    state.history.unshift(data)
    // 让历史记录只展示特定的条数
    state.history.length = 5
  }
}
