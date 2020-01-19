// 使用store的方式来存储用户登陆成功的相关数据
export const state = {
  // 用户登陆成功后的数据
  userInfo: {}
}

// store中存放数据不能使用直接赋值的方式，要使用mutations方法，第一个参数一定是state
export const mutations = {
  // 将用户登录成功后的数据存到userInfo中
  setUserInfo(state, data) {
    state.userInfo = data
  }
}
