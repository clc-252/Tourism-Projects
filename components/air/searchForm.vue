<template>
  <div class="search-form">
    <!-- 头部tab切换 -->
    <el-row type="flex" class="search-tab">
      <span
        v-for="(item, index) in tabs"
        :key="index"
        @click="handleSearchTab(item, index)"
        :class="{active: index === currentTab}"
      >
        <i :class="item.icon"></i>
        {{item.name}}
      </span>
    </el-row>

    <el-form class="search-form-content" ref="form" label-width="80px">
      <el-form-item label="出发城市">
        <!-- fetch-suggestions：可以监听输入框的输入，可以在这个事件中请求API，当请求成功的时候返回输入的建议 -->
        <!-- select：点击建议列表项时触发 -->
        <el-autocomplete
          v-model="form.departCity"
          :fetch-suggestions="queryDepartSearch"
          placeholder="请搜索出发城市"
          @select="handleDepartSelect"
          @blur="handleDepartBlur"
          class="el-autocomplete"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="到达城市">
        <el-autocomplete
          v-model="form.destCity"
          :fetch-suggestions="queryDestSearch"
          placeholder="请搜索到达城市"
          @select="handleDestSelect"
          @blur="handleDestBlur"
          class="el-autocomplete"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="出发时间">
        <!-- change 用户确认选择日期时触发 -->
        <!-- picker-options：当前时间日期选择器特有的选择项
        pickerOptions：disabledDate - 设置禁用状态-->
        <el-date-picker
          v-model="form.departDate"
          type="date"
          placeholder="请选择日期"
          style="width: 100%;"
          @change="handleDate"
          :picker-options="pickerOptions"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label>
        <el-button style="width:100%;" type="primary" icon="el-icon-search" @click="handleSubmit">搜索</el-button>
      </el-form-item>
      <div class="reverse">
        <span @click="handleReverse">换</span>
      </div>
    </el-form>
  </div>
</template>

<script>
// 引入moment
import moment from "moment";
export default {
  data() {
    return {
      tabs: [
        { icon: "iconfont icondancheng", name: "单程" },
        { icon: "iconfont iconshuangxiang", name: "往返" }
      ],
      currentTab: 0,
      //  搜索表单的数据字段
      form: {
        departCity: "", // 出发城市
        departCode: "", // 出发城市简写代码
        destCity: "", // 到达城市
        destCode: "", // 到达城市简写代码
        departDate: "" // 出发时间
      },
      // 出发城市数据列表
      departData: [],
      // 到达城市数据列表
      destData: [],
      // 设置日期选择器的禁用状态配置
      pickerOptions: {
        disabledDate(time) {
          // 当天也会被禁用，所以需要将当前的天数解禁，加上一天：3600 * 1000 * 24（毫秒）
          return time.getTime() + 3600 * 1000 * 24 < Date.now();
        }
      }
    };
  },
  methods: {
    // tab切换时触发
    handleSearchTab(item, index) {
      // 切换到往返时进行提示
      if (index == 1) {
        this.$alert("目前暂不支持往返，请使用单程选票！", "提示", {
          confirmButtonText: "确定",
          type: "warning"
        });
      }
    },

    // 封装出发城市和到达城市的事件
    querySearch(value) {
      // 根据value请求出发城市列表
      return this.$axios({
        url: "/airs/city",
        // axios的get请求的参数使用params，post请求才使用data
        params: {
          name: value
        }
      }).then(res => {
        // 由于res中的数据没有value值，所以需要进行数据改造，为返回的res中的数据添加value属性，才能进行建议项的展示
        const { data } = res.data;
        // 给data中的数据添加value
        const cityData = data.map(v => {
          v.value = v.name.replace("市", "");
          return v;
        });
        return cityData;
      });
    },

    // 监听出发城市输入框的事件
    // value 是选中的值，cb是回调函数callback，接收要展示的列表并通过调用cb可将数组列表展示出来
    queryDepartSearch(value, cb) {
      //   console.log(value);

      //  如果没有值，就不发送请求
      if (!value) {
        // 如果没有值，还要将数组清空，否则会出现输入失焦之后再删除输入再失焦时，输入框会重新选中数组中第一个数据的问题
        this.departData = [];
        // 在没有数据的时候不要显示建议项列表
        cb([]);
        return;
      }

      // 调用封装的函数
      this.querySearch(value).then(cityData => {
        // console.log(cityData);
        this.departData = cityData;
        cb(this.departData);
      });

      //  没有封装之前的请求代码
      /*  // 根据value请求出发城市列表
      this.$axios({
        url: "/airs/city",
        // axios的get请求的参数使用params，post请求才使用data
        params: {
          name: value
        }
      }).then(res => {
        console.log(res);
        // 由于res中的数据没有value值，所以需要进行数据改造，为返回的res中的数据添加value属性，才能进行建议项的展示
        const { data } = res.data;
        // 给data中的数据添加value
        this.departData = data.map(v => {
          v.value = v.name.replace("市", "");
          return v;
        });
        // cb把数组展示到建议项列表中
        cb(this.departData);
      }); */

      /* // 模拟接口请求成功返回数据，这个数组中的每一项必须是对象，对象中必须有value属性
      const arr = [
        { value: "广州", sort: "CAN" },
        { value: "广元", sort: "YUAN" },
        { value: "广安", sort: "AN" }
      ];
      cb(arr); */
    },

    // 监听目标城市输入框的事件
    // value 是选中的值，cb是回调函数，接收要展示的列表
    queryDestSearch(value, cb) {
      //  如果没有值，就不发送请求
      if (!value) {
        this.destData = [];
        cb([]);
        return;
      }

      // 调用封装的函数
      this.querySearch(value).then(cityData => {
        this.destData = cityData;
        cb(this.destData);
      });

      // 封装之前的请求代码
      /*  //  根据value值发送请求
      this.$axios({
        url: "/airs/city",
        params: {
          name: value
        }
      }).then(res => {
        const { data } = res.data;
        this.destData = data.map(v => {
          v.value = v.name.replace("市", "");
          return v;
        });
        cb(this.destData);
      }); */
    },

    // 点击出发城市下拉建议列表项时触发
    // item是点击的建议项对象的数据
    handleDepartSelect(item) {
      //   console.log(item);
      this.form.departCity = item.value;
      this.form.departCode = item.sort;
    },

    // 点击目标城市下拉选择时触发
    handleDestSelect(item) {
      this.form.destCity = item.value;
      this.form.destCode = item.sort;
    },

    // 出发城市输入框失焦时触发
    handleDepartBlur() {
      // 如果用户不点击建议项，直接自己输入，默认点击第一个
      if (this.departData.length === 0) {
        return;
      }
      // 默认点击第一个
      this.form.departCity = this.departData[0].value;
      this.form.departCode = this.departData[0].sort;
    },

    // 目的城市输入框失焦时触发
    handleDestBlur() {
      // 如果用户不点击建议项，直接自己输入，默认点击第一个
      if (this.destData.length === 0) {
        return;
      }
      // 默认点击第一个
      this.form.destCity = this.destData[0].value;
      this.form.destCode = this.destData[0].sort;
    },

    // 确认选择日期时触发
    handleDate(value) {
      // 修改日期时间的格式
      this.form.departDate = moment(value).format("YYYY-MM-DD");
    },

    // 触发和目标城市切换时触发
    handleReverse() {
      // 将出发城市和到达城市的数据交换过来就可以了
      const { departCity, departCode, destCity, destCode } = this.form;

      this.form.departCity = destCity;
      this.form.departCode = destCode;

      this.form.destCity = departCity;
      this.form.destCode = departCode;
    },

    // 提交表单是触发
    handleSubmit() {
      //   console.log(this.form);

      // 如果用户没有输入要进行提示
      if (!this.form.departCity) {
        this.$message.console.error("请输入出发城市");
        return;
      }
      if (!this.form.destCity) {
        this.$message.console.error("请输入到达城市");
        return;
      }
      if (!this.form.departDate) {
        this.$message.console.error("请选择时间");
        return;
      }

      // 点击提交表单，实现页面的跳转，并确保url中带有所需的五个参数
      this.$router.push({
        path: "/air/flights",
        query: this.form
      });
    }
  },
  mounted() {}
};
</script>

<style scoped lang="less">
.search-form {
  border: 1px #ddd solid;
  border-top: none;
  width: 360px;
  height: 350px;
  box-sizing: border-box;
}

.search-tab {
  span {
    display: block;
    flex: 1;
    text-align: center;
    height: 48px;
    line-height: 42px;
    box-sizing: border-box;
    border-top: 3px #eee solid;
    background: #eee;
  }

  .active {
    border-top-color: orange;
    background: #fff;
  }

  i {
    margin-right: 5px;
    font-size: 18px;

    &:first-child {
      font-size: 16px;
    }
  }
}

.search-form-content {
  padding: 15px 50px 15px 15px;
  position: relative;

  .el-autocomplete {
    width: 100%;
  }
}

.reverse {
  position: absolute;
  top: 35px;
  right: 15px;

  &:after,
  &:before {
    display: block;
    content: "";
    position: absolute;
    left: -35px;
    width: 25px;
    height: 1px;
    background: #ccc;
  }

  &:after {
    top: 0;
  }

  &:before {
    top: 60px;
  }

  span {
    display: block;
    position: absolute;
    top: 20px;
    right: 0;
    font-size: 12px;
    background: #999;
    color: #fff;
    width: 20px;
    height: 20px;
    line-height: 18px;
    text-align: center;
    border-radius: 2px;
    cursor: pointer;

    &:after,
    &:before {
      display: block;
      content: "";
      position: absolute;
      left: 10px;
      width: 1px;
      height: 20px;
      background: #ccc;
    }

    &:after {
      top: -20px;
    }

    &:before {
      top: 20px;
    }
  }
}
</style>