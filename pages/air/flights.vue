<template>
  <section class="contianer">
    <el-row type="flex" justify="space-between">
      <!-- 顶部过滤列表 -->
      <div class="flights-content">
        <!-- 过滤条件 -->
        <FlightsFilters :data="cacheFlightsData" @getEligibleData="getEligibleData" />

        <!-- 航班头部布局 -->
        <FlightsListHead />

        <!-- 航班信息 -->
        <FlightsItem v-for="(item,index) in pageSizeList" :key="index" :data="item" />

        <!-- 分页组件 -->
        <!-- 
            size-change：切换每页显示数量列表时触发
            current-change：切换页码时触发
            current-page：当前页码
            page-sizes：每页显示的数量的列表
            page-size：每页显示的数量
            layout：分页的组成部分
            total：总数
        -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageIndex"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>

      <!-- 侧边栏 -->
      <div class="aside">
        <!-- 侧边栏组件 -->
      </div>
    </el-row>
  </section>
</template>

<script>
import FlightsListHead from "@/components/air/flightsListHead";
import FlightsItem from "@/components/air/flightsItem";
import FlightsFilters from "@/components/air/flightsFilters.vue";
export default {
  data() {
    return {
      // 机票列表的数据
      flightsData: {
        info: {},
        options: {},
        flightTimes: {},
        company: {}
      },
      // 当前页数
      pageIndex: 1,
      // 当前的条数
      pageSize: 5,
      // 总条数
      total: 0,
      // 需要进行数据的备份
      cacheFlightsData: {
        info: {},
        options: {},
        flightTimes: {},
        company: {}
      }
    };
  },
  components: {
    FlightsListHead,
    FlightsItem,
    FlightsFilters
  },
  mounted() {
    //   请求机票列表数据
    this.$axios({
      url: "/airs",
      params: this.$route.query
    }).then(res => {
      //   console.log(res);
      // 有flights、info、options、total属性
      this.flightsData = res.data;

      // 备份数组：不能直接=res.data,这样是引用类型的存储，一个发生变化，另一个也是变化了的
      this.cacheFlightsData={...res.data}

      // 修改总数
      this.total = this.flightsData.total;
    });
  },
  methods: {
    // 切换每页显示数量列表时触发
    handleSizeChange(index) {
      this.pageSize = index;
    },
    // 切换页码时触发
    handleCurrentChange(index) {
      this.pageIndex = index;
    },
    // 获取过滤子组件中过滤后的数据
    getEligibleData(newData) {
      this.flightsData.flights = newData;
      // 修改总数
      this.total = newData.length;
    }
  },
  computed: {
    pageSizeList() {
      // 判断flightsData有没有值
      if (!this.flightsData.flights) {
        return [];
      }
      const arr = this.flightsData.flights.slice(
        (this.pageIndex - 1) * this.pageSize,
        this.pageIndex * this.pageSize
      );
      return arr;
    }
  }
};
</script>

<style scoped lang="less">
.contianer {
  width: 1000px;
  margin: 20px auto;
}

.flights-content {
  width: 745px;
  font-size: 14px;
}

.aside {
  width: 240px;
}
</style>