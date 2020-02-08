// 使用store的方式来存储用户登陆成功的相关数据
// 这样写会报一个警告：'state' should be a method that returns an object in  store/user.js
// export const state = {
//   // 用户登陆成功后的数据
//   userInfo: {}
// }
// 解决：将state写成一个函数
// 写法一：
// export const state = () => {
//   return {
//     // 用户登陆成功后的数据
//     userInfo: {}
//   }
// }
// 写法二：
export const state = () => ({
  // 用户登陆成功后的数据
  userInfo: {}
})

// store中存放数据不能使用直接赋值的方式，要使用mutations方法，第一个参数一定是state
export const mutations = {
  // 将用户登录成功后的数据存到userInfo中
  setUserInfo(state, data) {
    state.userInfo = data
  }
}

// actions：固定属性，异步修改state中的值的方法，一般用于存放接口的请求
export const actions = {
  // 函数名可自定义，第一个参数必须是store，第二个参数是调用是传入的数据，返回一个promise对象
  // 登陆接口的请求
  login(store, data) {
    return this.$axios({
      method: "post",
      url: "/accounts/login",
      data
    }).then(res => {
      console.log(res);
      /* 
        根据页面的结构，如果使用localStorage的方式存储登陆成功的数据，那么无法在渲染的时候让header刷新显示
        可以用兄弟组件之间的传值来实现，但是比较麻烦，所以使用store
      */
      //  let {data}=res 解构
      let data = res.data

      //  使用commit调用mutations方法，存放数据
      store.commit('setUserInfo', data)
    });
  }
}
