<template>
  <div class="tabs">
    <el-tag
        v-for="(item,index) in tags"
        :key="item.path"
        :effect="$route.name === item.name ? 'dark':'plain'"
        @click="changeMenu(item)"
        :closable="item.name !== 'firstPage'"
        @close="handleClose(item,index)"
    >
      {{ item.label }}
    </el-tag>
  </div>
</template>

<script>
import {mapState,mapMutations} from "vuex";

export default {
  name: "CommonTab",
  data(){
    return{

    }
  },
  methods:{
    ...mapMutations(['closeTag']),
    changeMenu(item){
      //点击tab标签需要动态的路由
      this.$router.push(item.path)
    },
    handleClose(item,index){
      //关闭菜单
      this.closeTag(item)
      //动态处理路由
      if(this.$route.name !== item.name){
        return
      }
      this.$router.push(this.tags[index-1])
    }
  },
  computed:{
    ...mapState({
      tags:state => state.tab.tabsList
    }),
  }
}
</script>

<style lang="less" scoped>
  .tabs{
    position: relative;
    overflow: hidden;
    background: #fff;
    box-shadow: 0 5px 10px #ddd;
    padding-bottom: 5px;
    padding-top: 5px;
    padding-left: 10px;
    .el-tag{
      margin-right: 15px;
      cursor: pointer;
    }
  }
</style>