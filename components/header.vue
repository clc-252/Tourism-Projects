<template>
  <div class="header">
    <el-row type="flex" justify="space-between" align="middle" class="main">
      <!-- logo部分 -->
      <div class="logo">
        <img src="http://157.122.54.189:9093/images/logo.jpg" alt />
      </div>
      <!-- 菜单导航部分 -->
      <el-row type="flex" align="middle" class="navs">
        <nuxt-link to="/">首页</nuxt-link>
        <nuxt-link to="/post">旅游攻略</nuxt-link>
        <nuxt-link to="/hotel">酒店</nuxt-link>
        <nuxt-link to="/air">国内机票</nuxt-link>
      </el-row>
      <!-- 登陆注册部分 -->
      <div class="login">
        <nuxt-link to="/user/login">登陆 / 注册</nuxt-link>
      </div>
    </el-row>
  </div>
</template>

<script>
export default {};
</script>

<style lang='less' scoped>
.header {
  width: 1000px;
  height: 60px;
  margin: 0 auto;
  border-bottom: 1px #ddd solid;
  box-shadow: 0 2px 2px #f5f5f5;
  box-sizing: border-box;
  .main {
    height: 60px;
  }
  .logo img {
    width: 156px;
    height: 42px;
  }
  .navs {
    flex: 1;
    margin: 0 20px;
    .nuxt-link-exact-active {
      background-color: #409eff;
      color: #fff;
      &:hover {
        color: #fff !important;
      }
    }
    a {
      height: 60px;
      padding: 0 20px;
      line-height: 60px;
      &:hover {
        border-bottom: 4px solid #409eff;
        color: #409eff;
      }
    }
  }
  .login {
    color: #666;
    font-size: 14px;
    a:hover {
      color: #409eff;
      text-decoration: underline;
    }
  }
}
</style>