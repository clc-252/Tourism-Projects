<template>
  <div class="tab">
    <div class="btn">
      <span v-for="(item,index) in ['新闻','娱乐','体育']" :key="index" @click="handleClick(index)" :class="{active:current===index}">{{item}}</span>
    </div>
    <ul v-if="current===0">
      <li>新闻</li>
      <li>新闻</li>
      <li>新闻</li>
    </ul>
    <ul v-if="current===1">
      <li>娱乐</li>
      <li>娱乐</li>
      <li>娱乐</li>
    </ul>
    <ul v-if="current===2">
      <li>体育</li>
      <li>体育</li>
      <li>体育</li>
    </ul>
  </div>
</template>

<script>
export default {
    data(){
        return {
            current:0
        }
    },
    methods:{
        handleClick(index){
            this.current=index
        }
    }
};
</script>

<style lang='less' scoped>
.btn span{
    cursor: pointer;
    padding-right: 20px;
}

.active{
    color: red;
}
</style>