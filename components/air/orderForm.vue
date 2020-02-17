<template>
  <div class="main">
    <div class="air-column">
      <h2>乘机人</h2>
      <el-form class="member-info">
        <div class="member-info-item" v-for="(item,index) in form.users" :key="index">
          <el-form-item label="乘机人类型">
            <el-input placeholder="姓名" class="input-with-select" v-model="item.username">
              <el-select slot="prepend" value="1" placeholder="请选择">
                <el-option label="成人" value="1"></el-option>
              </el-select>
            </el-input>
          </el-form-item>

          <el-form-item label="证件类型">
            <el-input placeholder="证件号码" class="input-with-select" v-model="item.id">
              <el-select slot="prepend" value="1" placeholder="请选择">
                <el-option label="身份证" value="1" :checked="true"></el-option>
              </el-select>
            </el-input>
          </el-form-item>

          <span class="delete-user" @click="handleDeleteUser(index)">-</span>
        </div>
      </el-form>

      <el-button class="add-member" type="primary" @click="handleAddUsers">添加乘机人</el-button>
    </div>

    <div class="air-column">
      <h2>保险</h2>
      <div>
        <div class="insurance-item" v-for="(item,index) in infoData.insurances" :key="index">
          <el-checkbox
            :label="`${item.type}：￥${item.price}/份×1  最高赔付${item.compensation}`"
            border
            @change="handleInsurance(item.id)"
          ></el-checkbox>
        </div>
      </div>
    </div>

    <div class="air-column">
      <h2>联系人</h2>
      <div class="contact">
        <el-form label-width="60px">
          <el-form-item label="姓名">
            <el-input v-model="form.contactName"></el-input>
          </el-form-item>

          <el-form-item label="手机">
            <el-input placeholder="请输入内容" v-model="form.contactPhone">
              <template slot="append">
                <el-button @click="handleSendCaptcha">发送验证码</el-button>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="验证码">
            <el-input v-model="form.captcha"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="warning" class="submit" @click="handleSubmit">提交订单</el-button>
      </div>
    </div>
    <span>{{allPrice}}</span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        users: [
          {
            username: "",
            id: ""
          }
        ],
        insurances: [],
        contactName: "",
        contactPhone: "",
        captcha: "",
        invoice: false,
        seat_xid: this.$route.query.seat_xid,
        air: this.$route.query.id
      },
      // 机票订单的详细信息
      infoData: {}
    };
  },
  methods: {
    // 添加乘机人
    handleAddUsers() {
      this.form.users.push({
        username: "",
        id: ""
      });
    },

    // 移除乘机人
    handleDeleteUser(index) {
      this.form.users.splice(index, 1);
    },

    // 处理保险
    handleInsurance(id) {
      // 先判断数组中是否已经存在这个id，如果已经存在，说明这次操作是移出
      if (this.form.insurances.indexOf(id) !== -1) {
        // 删除该id
        this.form.insurances.splice(this.form.insurances.indexOf(id), 1);
      } else {
        // 新增
        this.form.insurances.push(id);
      }
    },

    // 发送手机验证码
    handleSendCaptcha() {
      // 如果没有输入手机号码就不发送请求
      if (!this.form.contactPhone) {
        this.$message.error("手机号码不能为空");
        return;
      }
      // 调用user.js中发送验证码的方法
      this.$store
        .dispatch("user/sendCaptcha", this.form.contactPhone)
        .then(res => {
          this.$message.success("验证码为：000000");
        });
    },

    // 提交订单
    handleSubmit() {
      // 设置验证表单的校验规则
      const rules = {
        // 验证乘机人信息
        users: {
          errMessage: "乘机人信息不能为空",
          // 自定义校验函数，该函数返回true说明验证通过，返回false说明验证失败
          validator: () => {
            let valid = true;
            this.form.users.forEach(v => {
              // 只要乘机人信息中有一项信息为空则验证不通过
              if (!v.username || !v.id) {
                valid = false;
              }
            });
            return valid;
          }
        },

        /* 
           将字符串转换成布尔类型：Boolean()  或者  ！！
            例如：var a=''
                 !!a - 结果为false
                 var a='123'
                 !!a - 结果为true
        */

        // 验证联系人
        contactName: {
          errMessage: "联系人姓名不能为空",
          validator: () => {
            return !!this.form.contactName;
          }
        },

        // 验证手机号码
        contactPhone: {
          errMessage: "手机号码不能为空",
          validator: () => {
            return !!this.form.contactPhone;
          }
        },

        // 验证验证码
        captcha: {
          errMessage: "验证码不能为空",
          validator: () => {
            return !!this.form.captcha;
          }
        }
      };

      // 假设所有验证都是通过的
      let valid = true;
      // object.keys()：遍历对象，返回一个以对象中的键(key)组成的数组
      Object.keys(rules).forEach(v => {
        // 如果已经有一个字段验证不通过，那么就停止验证，不需要继续往下进行验证
        if (!valid) {
          return;
        }
        const item = rules[v]; // 拿到验证规则中的每一个对象
        // 执行每个字段下的自定义验证函数(validator)
        valid = item.validator();

        if (!valid) {
          this.$message.error(item.errMessage);
        }
      });

      // 如果表单验证没有通过，就不发发送请求
      if (!valid) {
        return;
      }
      // 调用接口发送提交订单的请求
      this.$axios({
        url: "/airorders",
        method: "post",
        data: this.form,
        // 添加headers头信息
        headers: {
          Authorization: `Bearer ` + this.$store.state.user.userInfo.token
        }
      }).then(res => {
        // console.log(res);

        // 跳转到付款页
        setTimeout(()=>{
          this.$router.push({
            path:'/air/pay',
            query:{
              id:res.data.data.id  // 拿到订单的id
            }
          })
        },1500)
      });
    }
  },
  mounted() {
    // 请求机票详细信息
    const { id, seat_xid } = this.$route.query;
    this.$axios({
      url: `/airs/${id}`,
      params: {
        seat_xid
      }
    }).then(res => {
      // console.log(res);
      this.infoData = res.data;

      // 调用store中setOrderDetail方法，将数据存储到store中
      this.$store.commit("air/setOrderDetail", this.infoData);
    });
  },
  computed: {
    // 计算总价格
    allPrice() {
      // 如果seat_infos没有数据，就直接返回
      if(!this.infoData.seat_infos){
        return
      }
      let price = 0;
      // 计算单价
      price += this.infoData.seat_infos.org_settle_price;
      // 计算机建+燃油费
      price += this.infoData.airport_tax_audlet;
      // 计算保险费用
      this.infoData.insurances.forEach(v=>{
        // 如果选中的id数组中包含了当前的保险id，则需要加上所选保险的价格
        if(this.form.insurances.indexOf(v.id)!==-1){
          price+=v.price
        }
      })
      // 计算总价格
      price*=this.form.users.length

      // 将计算得到的总价格存到store中
      this.$store.commit('air/setAllPrice',price)
      return "";
    }
  }
};
</script>

<style scoped lang="less">
.air-column {
  border-bottom: 1px #ddd dashed;
  padding-bottom: 20px;
  margin-bottom: 20px;
}

.air-column h2 {
  margin-bottom: 20px;
  font-size: 22px;
  font-weight: normal;
}

/deep/ .el-select .el-input {
  width: 130px;
}

.input-with-select {
  width: 590px;
}

.input-with-select /deep/ .el-input-group__prepend {
  background-color: #fff;
}
.member-info /deep/ .el-form-item {
  margin-bottom: 0;
}

.member-info-item {
  border-bottom: 1px #eee dashed;
  padding-bottom: 20px;
  position: relative;

  &:first-child {
    .delete-user {
      display: none;
    }
  }
}

.add-member {
  margin-top: 20px;
}

.delete-user {
  display: block;
  background: #ddd;
  width: 16px;
  height: 16px;
  font-size: 14px;
  text-align: center;
  line-height: 16px;
  color: #fff;
  cursor: pointer;
  border-radius: 50px;
  position: absolute;
  right: -30px;
  top: 50%;
}

.insurance {
  > div {
    margin-top: 10px;
  }
}

.insurance-item {
  margin-bottom: 20px;
}

.contact {
  /deep/ .el-input {
    width: 50%;
  }
}

.submit {
  margin: 50px auto;
  display: block;
  width: 250px;
  height: 50px;
}
</style>