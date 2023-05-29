<template>
  <div class="header-container">
    <div class="l-content">
      <el-button  icon="el-icon-menu" size="mini" style="margin-left: 20px" @click="handleMenu()"></el-button>
      <el-breadcrumb separator="/" style="padding-left: 20px">
        <el-breadcrumb-item v-for="item in tags" :key="item.path" :to="{path: item.path }">{{ item.label }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="r-content">
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
         <img class="user_img" src="@/assets/user.jpg"/>
        </span>
              <el-dropdown-menu slot="dropdown" >
                <el-dropdown-item command="a">个人信息</el-dropdown-item>
                <el-dropdown-item command="b">退出用户</el-dropdown-item>
              </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Header",
  data(){
    return{

    }
  },
  methods:{
    handleMenu(){
      //对菜单做缩放操作
      this.$store.commit('collapseChange')
    },
    handleCommand(command){
      if('b' === command){
        this.$confirm('是否确认退出登录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          sessionStorage.clear()//清除token信息
          this.$router.push("/Login")//路由到登录页面
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消注销'
          });
        });

      }
    }
  },
  computed:{
    ...mapState({
      tags:state => state.tab.tabsList
    })
  }
}
</script>

<style lang="less" scoped>
  .header-container{
    height: 60px;
    background-color: #242f42;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .firstPage{
      color: #fff;
      font-size: 16px;
      margin-left: 10px;
      cursor: pointer;
    }
    .r-content{
      padding-right: 20px;
      .user_img{
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }
    }
    .l-content{
      display: flex;
      align-items: center;
      /deep/.el-breadcrumb__item{
        .el-breadcrumb__inner{
          font-weight: normal;
          &.is-link{
            color: #666;
          }
        }
        &:last-child{
          .el-breadcrumb__inner{
            color: #fff;
          }
        }
      }
    }
  }

</style>