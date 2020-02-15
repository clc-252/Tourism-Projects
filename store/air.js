export const state = () => {
  return {
    // 历史纪录
    history: []
  }
}

export const mutations = {
  setHistory(state, data) {
    state.history.push(data)
  }
}
