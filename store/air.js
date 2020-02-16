export const state = () => {
  return {
    // 历史纪录
    history: [],
    // 订单详情信息
    orderDetail:{
      seat_infos:{}
    }
  }
}

export const mutations = {
  // 存储历史记录的数据
  setHistory(state, data) {
    // 让后浏览的记录在前面展示
    state.history.unshift(data)
    // 让历史记录只展示特定的条数
    state.history.length = 5
  },
  // 修改订单详情的方法
  setOrderDetail(state,data){
    state.orderDetail=data
  }
}
