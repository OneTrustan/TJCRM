<template>
  <div class="login_container">
    <div class="login_form">
      <p class="login_title">TJ客户管理系统</p>
    <el-form ref="formName" :model="form" :rules="rules" status-icon label-width="100px" class="demo-ruleForm">
      <el-form-item label="账号" prop="username">
       <el-input v-model="form.username" placeholder="请输入账号"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="form.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item >
        <el-button type="primary" size="medium" @click="submitFormData">登录</el-button>
      </el-form-item>
    </el-form>
    </div>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Login",
  data() {
    return {
      form: {
        username: "",
        password: "",
      },
      rules:{
        username:[{required: true, message: '请输入账号', trigger: 'blur'}],
        password: [{required: true, message: '请输入账号', trigger: 'blur'}]
      }
    }
  },
  methods:{
    submitFormData(){
      this.$refs['formName'].validate((valid) => {
        if (valid) {
          this.$http.post('/login', this.form).then((res) => {
            if (res.data.code === 200) {
              //存储相关的token信息
              sessionStorage.setItem("token", res.headers.authorization)
              sessionStorage.setItem("username", this.form.username)
              //路由到主页面
              this.$router.push("/")
            } else {
              this.$message.error(res.data.msg)
            }
          })
        }else {
          return false;
        }
      });
    }
  }
}
</script>

<style lang="less" scoped>
  .login_container{
    width: 100%;
    height: 100vh;
    background-image: url("../../assets/Login.jpg");;
    background-color: rgba(242, 242, 242, 1);
    background-position: center bottom;
    background-repeat: no-repeat;
    background-attachment: scroll;
    //background-size: 1278px 559px;
    background-origin: border-box;
    border: none;
    border-radius: 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    .login_form{
      width: 510px;
      margin: 0px auto;
      padding: 0 55px 15px 35px;
      background-color: #fff;
      border: none;
      border-radius: 5px;
      //添加阴影效果
      box-shadow: 0 0 25px #cac6c6;
      .login_title{
        font-family: '微软雅黑 Bold','微软雅黑';
        font-weight: 700;
        text-decoration: none;
        color: rgb(0, 121, 254);
        font-size: 32px;
        margin-top: 50px;
        margin-bottom: 30px;
        text-align: center;
      }
    }
  }
</style>