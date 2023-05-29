<template>
  <div class="hello">
    <el-container>
      <el-aside width="auto">
        <Aside></Aside>
      </el-aside>
      <el-container>
        <el-header>
          <Header></Header>
        </el-header>
          <CommonTab></CommonTab>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import Aside from "@/components/common/Aside.vue";
// eslint-disable-next-line no-unused-vars
import Header from "@/components/common/Header.vue";
import CommonTab from "@/components/common/CommonTab.vue";
export default {
  name: 'HelloWorld',
  data(){
    return{
      msg:"欢迎来到TJisCRM"
    }
  },
  components:{
    CommonTab,
    // eslint-disable-next-line vue/no-unused-components
    Aside,
    Header
  }
}
</script>

<style scoped>
.el-header{
  padding: 0;
}

</style>
