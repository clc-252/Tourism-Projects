<template>
  <div class="flight-item">
    <div @click="isShow=!isShow">
      <!-- 显示的机票信息 -->
      <el-row type="flex" align="middle" class="flight-info">
        <el-col :span="6">
          <span>{{data.airline_name}}</span>
          {{data.flight_no}}
        </el-col>
        <el-col :span="12">
          <el-row type="flex" justify="space-between" class="flight-info-center">
            <el-col :span="8" class="flight-airport">
              <strong>{{data.dep_time}}</strong>
              <span>{{data.org_airport_name}}{{data.org_airport_quay}}</span>
            </el-col>
            <el-col :span="8" class="flight-time">
              <span>{{rankTime}}</span>
            </el-col>
            <el-col :span="8" class="flight-airport">
              <strong>{{data.arr_time}}</strong>
              <span>{{data.dst_airport_name}}{{data.dst_airport_quay}}</span>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="6" class="flight-info-right">
          ￥
          <span class="sell-price">{{data.base_price/2}}</span>起
        </el-col>
      </el-row>
    </div>
    <div class="flight-recommend" v-if="isShow">
      <!-- 隐藏的座位信息列表 -->
      <el-row type="flex" justify="space-between" align="middle">
        <el-col :span="4">低价推荐</el-col>
        <el-col :span="20">
          <el-row
            type="flex"
            justify="space-between"
            align="middle"
            class="flight-sell"
            v-for="(item,index) in data.seat_infos"
            :key="index"
          >
            <el-col :span="16" class="flight-sell-left">
              <span>{{item.group_name}}</span>
              | {{item.supplierName}}
            </el-col>
            <el-col :span="5" class="price">￥{{item.settle_price}}</el-col>
            <el-col :span="3" class="choose-button">
              <el-button type="warning" size="mini" @click="handleToOrder(item)">选定</el-button>
              <p>剩余：{{item.discount}}</p>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  // props:['data']
  props: {
    // 数据
    data: {
      type: Object, // 声明data属性的类型
      // 设置data的默认值
      default: {}
    }
  },
  data(){
      return{
        // 控制座位信息列表的展示或隐藏
        isShow:false
      }
  },
  computed: {
    // 计算时间差
    rankTime() {
      // 将20：30这样格式的时间通过：分割开
      const depart_time = this.data.dep_time.split(":"); // 出发时间
      const dest_time = this.data.arr_time.split(":"); // 到达时间

      // 计算分钟数
      let departMin = depart_time[0] * 60 + Number(depart_time[1]); // 出发的分钟数
      let destMin = dest_time[0] * 60 + Number(dest_time[1]); // 到达的分钟数

      // 如果到达时间小于出发时间，说明飞行时间是从今天到明天，要将到达的时间再加上24小时（没有考虑跨越两天以上时间航班飞行时间计算）
      if (destMin < departMin) {
        destMin += 24 * 60;
      }

      // 计算时间差分钟数
      const distance = destMin - departMin;

      // 再将得到的时间差的分钟数转换为20：30这样的时间格式
      // 小时
      const hours = Math.floor(distance / 60);
      // 分钟
      const min = distance % 60;

      // 拼接
      return `${hours}小时${min}分`;
    }
  },
  methods:{
    // 跳转到订单页
    handleToOrder(item){
      console.log(item);
      // 需要获得航班的id和座位id
      this.$router.push({
        path:'/air/order',
        query:{
          id:this.data.id,
          seat_xid:item.seat_xid
        }
      })
    }
  }
};
</script>

<style scoped lang="less">
.flight-item {
  border: 1px #ddd solid;
  margin-bottom: 10px;

  .flight-info {
    padding: 15px;
    cursor: pointer;

    > div {
      &:first-child,
      &:last-child {
        text-align: center;
      }
    }
  }

  .flight-info-center {
    padding: 0 30px;
    text-align: center;

    .flight-airport {
      strong {
        display: block;
        font-size: 24px;
        font-weight: normal;
      }
      span {
        font-size: 12px;
        color: #999;
      }
    }

    .flight-time {
      span {
        display: inline-block;
        padding: 10px 0;
        border-bottom: 1px #eee solid;
        color: #999;
      }
    }
  }

  .flight-info-right {
    .sell-price {
      font-size: 24px;
      color: orange;
      margin: 0 2px;
    }
  }
}

.flight-recommend {
  background: #f6f6f6;
  border-top: 1px #eee solid;
  padding: 0 20px;

  .flight-sell {
    border-bottom: 1px #eee solid;
    padding: 10px 0;

    &:last-child {
      border-bottom: none;
    }

    .flight-sell-left {
      font-size: 12px;
      span {
        color: green;
      }
    }

    .price {
      font-size: 20px;
      color: orange;
    }

    .choose-button {
      text-align: center;
      color: #666;
      button {
        display: block;
        width: 100%;
        margin-bottom: 5px;
      }
    }
  }
}
</style>