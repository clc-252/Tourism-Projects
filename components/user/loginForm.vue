<template>
  <el-form ref="form" :model="form" class="form" :rules="rules">
    <el-form-item prop="username">
      <el-input placeholder="用户名/手机" v-model="form.username"></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input placeholder="密码" type="password" v-model="form.password"></el-input>
    </el-form-item>
    <p class="form-text">
      <nuxt-link to="#">忘记密码</nuxt-link>
    </p>
    <el-button class="submit" type="primary" @click="handleLoginSubmit">登录</el-button>
  </el-form>
</template>

<script>
export default {
  data() {
    /*  
        rule：校验规则
        value：文本框中的值
        callback：该函数必须执行，如果校验不通过则传入错误提示信息，通过就不需要传递参数
    */
    const validateUsername = (rule, value, callback) => {
      // 通过value校验到底是否是手机号码, true的话表示通过，false就不通过
      const isValid = /^1[3-9][0-9]{9}$/.test(value);
      // 判断输入的手机号码格式是否正确
      if (value === "") {
        callback(new Error("请输入手机号"));
      } else if (!isValid) {
        callback(new Error("手机号码格式不正确"));
      } else {
        callback();
      }
    };
    return {
      // 表单数据
      form: {
        username: "",
        password: ""
      },
      // 表单的校验规则
      rules: {
        username: [
          // validator:自定义校验函数
          { validator: validateUsername, trigger: "blur" }
        ],
        password: [{ required: true, message: "密码不能为空", trigger: "blur" }]
      }
    };
  },
  methods: {
    // 处理登陆的事件
    handleLoginSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          // this.$axios({
          //   method: "post",
          //   url: "/accounts/login",
          //   data: this.form
          // }).then(res => {
          //   console.log(res);
          //   /* 
          //     根据页面的结构，如果使用localStorage的方式存储登陆成功的数据，那么无法在渲染的时候让header刷新显示
          //     可以用兄弟组件之间的传值来实现，但是比较麻烦，所以使用store
          //   */
          // //  let {data}=res 解构
          // let data=res.data
           
          // //  使用commit调用mutations方法，存放数据
          // this.$store.commit('user/setUserInfo',data)
          // // 登陆成功跳转到首页
          // this.$router.push('/')
          // });


          // 通过dispatch调用action中的方法
          this.$store.dispatch('user/login',this.form).then(()=>{
            this.$message.success('登陆成功！')
            // 跳转到首页
            // this.$router.push('/')
            // push跳转：路由内存中会多一条记录；如果是replace替换当前的路由
            // 跳转回上一个页面
            this.$router.replace(this.$route.query.returnUrl||'/')
          })
        }
      });
    }
  }
};
</script>

<style lang='less' scoped>
.form {
  padding: 25px;
  .form-text {
    font-size: 12px;
    color: #409eff;
    text-align: right;
    line-height: 1;
  }
  .submit {
    width: 100%;
    margin-top: 10px;
  }
}
</style>