<template>
  <div class="container">
    <div class="main">
      <div class="pay-title">
        支付总金额
        <span class="pay-price">￥ {{orderDetail.price}}</span>
      </div>
      <div class="pay-main">
        <h4>微信支付</h4>
        <el-row type="flex" justify="space-between" align="middle" class="pay-qrcode">
          <div class="qrcode">
            <!-- 二维码 -->
            <canvas id="qrcode-stage"></canvas>
            <p>请使用微信扫一扫</p>
            <p>扫描二维码支付</p>
          </div>
          <div class="pay-example">
            <img src="http://157.122.54.189:9093/images/wx-sweep2.jpg" alt />
          </div>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
// 引入二维码插件
import QRCode from "qrcode";
/*  
    toCanvas(canvas, text, [options], [cb(error)])
     - canvas：传递当前要展示二维码的dom节点
     - text：生成二维码的字符串
     - options：选项，比如：大小、颜色等
     - cb(error)
*/
export default {
  data() {
    return {
      // 订单详情的数据
      orderDetail: {},
      // 定时器
      timer: ""
    };
  },
  mounted() {
    // 一开始无法拿到token，因为先组件加载再加载store仓库中的数据，而mounted是在页面一加载完成之后便执行，先于仓库的加载，所以需要添加定时器推迟请求的执行，定时器的时间可以为0，因为定时器会等待之前的内容执行完毕之后再执行
    setTimeout(() => {
      // 请求订单详情
      this.$axios({
        url: `/airorders/${this.$route.query.id}`,
        // 添加headers头信息
        headers: {
          Authorization: `Bearer ` + this.$store.state.user.userInfo.token
        }
      }).then(res => {
        // console.log(res);
        this.orderDetail = res.data;

        // 二维码
        const { code_url } = this.orderDetail.payInfo;
        // 获取要展示二维码的dom节点
        const canvas = document.getElementById("qrcode-stage");
        // 展示
        QRCode.toCanvas(canvas, code_url, {
          width: 200
        });

        // 请求成功之后查询订单的状态：支付结果轮询
        this.timer = setInterval(() => {
          this.isPay();
        }, 3000);
      });
    }, 0);
  },
  methods: {
    // 查询是否支付成功
    isPay() {
      // 拿到所需要的数据
      const { id, price, orderNo } = this.orderDetail;
      this.$axios({
        url: "/airorders/checkpay",
        method: "post",
        data: {
          id,
          nonce_str: price, // 支付接口返回的订单金额
          out_trade_no: orderNo // 订单编号
        },
        // 添加headers头信息
        headers: {
          Authorization: `Bearer ` + this.$store.state.user.userInfo.token
        }
      }).then(res => {
        // console.log(res);
        if (res.data.statusTxt == "支付完成") {
          // 停止定时器
          clearInterval(this.timer);

          // 成功支付之后提醒用户支付成功
          this.$alert("支付成功", "支付状态提示", {
            confirmButtonText: "确定",
            type: "success"
          });
        }
      });
    }
  },
  // 在组件销毁的时候触发
  destroyed() {
    // 停止定时器
    clearInterval(this.timer);
  }
};
</script>

<style scoped lang="less">
.container {
  background: #f5f5f5;
  padding: 30px 0;

  .main {
    width: 1000px;
    margin: 0 auto;

    .pay-title {
      text-align: right;
      span {
        font-size: 28px;
        color: orangered;
      }
    }

    .pay-main {
      background: #fff;
      margin-top: 10px;
      border-top: 5px orange solid;
      padding: 30px;

      h4 {
        font-size: 28px;
        font-weight: normal;
        margin-bottom: 10px;
      }

      .pay-qrcode {
        padding: 0 80px;
      }

      .qrcode {
        border: 1px #ddd solid;
        padding: 15px;
        height: fit-content;

        #qrcode-stage {
          width: 200px;
          height: 200px;
          margin-bottom: 10px;
        }

        p {
          line-height: 2;
          text-align: center;
        }
      }
    }
  }
}
</style>