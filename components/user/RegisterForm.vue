<template>
  <el-form :model="form" ref="form" :rules="rules" class="form">
    <el-form-item class="form-item" prop="username">
      <el-input placeholder="用户名手机" v-model="form.username"></el-input>
    </el-form-item>

    <el-form-item class="form-item" prop="captcha">
      <el-input placeholder="验证码" v-model="form.captcha">
        <template slot="append">
          <el-button @click="handleSendCaptcha">发送验证码</el-button>
        </template>
      </el-input>
    </el-form-item>

    <el-form-item class="form-item" prop="nickname">
      <el-input placeholder="你的名字" v-model="form.nickname"></el-input>
    </el-form-item>

    <el-form-item class="form-item" prop="password">
      <el-input placeholder="密码" type="password" v-model="form.password"></el-input>
    </el-form-item>

    <el-form-item class="form-item" prop="checkPassword">
      <el-input placeholder="确认密码" type="password" v-model="form.checkPassword"></el-input>
    </el-form-item>

    <el-button class="submit" type="primary" @click="handleRegSubmit">注册</el-button>
  </el-form>
</template>

<script>
export default {
  data() {
    // 用户名的验证规则
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
    // 密码的验证规则
    var validatePassword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.form.checkPassword !== "") {
          this.$refs.form.validateField("checkPassword");
        }
        callback();
      }
    };
    // 确认密码的验证规则
    var validateCheckPassword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.form.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      // 表单数据
      form: {
        username: "",
        captcha: "",
        nickname: "",
        password: "",
        checkPassword: ""
      },
      // 表单规则
      rules: {
        username: [
          // validator:自定义校验函数
          { validator: validateUsername, trigger: "blur" }
        ],
        captcha: [
          { required: true, message: "验证码不能为空", trigger: "blur" }
        ],
        nickname: [
          { required: true, message: "昵称不能为空", trigger: "blur" }
        ],
        password: [{ validator: validatePassword, trigger: "blur" }],
        checkPassword: [{ validator: validateCheckPassword, trigger: "blur" }]
      }
    };
  },
  methods: {
    // 发送验证码
    handleSendCaptcha() {
        // 如果用户名为空，就不要发送请求
        if(this.form.username==''){
            return
        }
        // 调用store仓库中user模块下发送验证码的方法
        this.$store.dispatch('user/sendCaptcha',this.form.username).then(res=>{
            this.$message.success('验证码为：'+ res.data.code)
            // console.log(res);
        })
    },

    // 注册
    handleRegSubmit() {
    //   console.log(this.form);
    this.$refs.form.validate(valid => {
        // 如果验证成功
        if(valid){
            // 将form表单的数据中除了确认密码之外的所有数据都发送到服务器
            const { checkPassword, ...data } = this.form;
            // 调用store仓库中user模块下注册的方法
            this.$store.dispatch('user/register',data).then(res=>{
                console.log(res);
                this.$message.success('注册成功')
                // 跳转到首页
                this.$router.push('/')
            })
        }
    })
    }
  }
};
</script>

<style scoped lang="less">
.form {
  padding: 25px;
}

.form-item {
  margin-bottom: 20px;
}

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
</style>