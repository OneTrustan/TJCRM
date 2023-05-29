<template>
  <div>
    <el-card class="box-card">
      <div class="mod-role">
        <el-form :inline="true" :model="dataForm" class="demo-form-inline">
          <el-form-item>
            <el-input
                v-model="dataForm.userName"
                clearable
                placeholder="用户名">
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="getDataList">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="openDialog()">新增</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="dataList" border style="width: 100%">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="userId" label="ID" width="150"></el-table-column>
          <el-table-column prop="username" label="用户名" width="180"></el-table-column>
          <el-table-column prop="email" label="邮箱" width="280"></el-table-column>
          <el-table-column prop="mobile" label="电话" width="180"></el-table-column>
          <el-table-column prop="status" label="状态" width="180">
            <template slot-scope="scope" >
              <span>{{scope.row.status==1? '正常':'禁用'}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                  size="mini"
                  type="primary"
                  @click="handleEdit(scope.$index, scope.row)">编辑
              </el-button>
              <el-button
                  size="mini"
                  type="danger"
                  v-if="scope.row.status === 1"
                  @click="handleUpdateStatus(scope.$index, scope.row)">禁用
              </el-button>
              <el-button
                  size="mini"
                  type="success"
                  v-if="scope.row.status !== 1"
                  @click="handleUpdateStatus(scope.$index, scope.row)">激活
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="pageIndex"
            :page-sizes="[5, 10, 20, 50, 100]"
            :page-size="pageSize"
            :total="totalPage"
            layout="total, sizes, prev, pager, next, jumper"
            style="margin-top: 30px"></el-pagination>
      </div>
      <el-dialog @close="closeDialog()" :title="dataDialogForm.userId===0? '新增用户' : '更新用户'" width="35%" :visible.sync="dialogFormVisible">
        <el-form :model="dataDialogForm"  :rules="rules" ref="ruleForm">
          <el-form-item label="账号" label-width="120px" prop="username">
            <el-input :disabled="dataDialogForm.userId > 0" v-model="dataDialogForm.username" placeholder="账号" style="width: 300px"></el-input>
          </el-form-item>
          <el-form-item v-if="dataDialogForm.userId === 0" label="密码" label-width="120px" prop="password">
            <el-input type="password" v-model="dataDialogForm.password" style="width: 300px"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" label-width="120px" prop="email">
            <el-input  v-model="dataDialogForm.email" placeholder="邮箱" style="width: 300px"></el-input>
          </el-form-item>
          <el-form-item label="电话" label-width="120px" prop="mobile">
            <el-input placeholder="电话" v-model="dataDialogForm.mobile" style="width: 300px"></el-input>
          </el-form-item>
          <el-form-item label="状态" label-width="120px" prop="status">
            <el-select v-model="dataDialogForm.status" placeholder="状态">
              <el-option v-for="item in statusList" :label="item.label" :value="item.value" :key="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleSubmitFormData('ruleForm')">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "SysUser",

  data(){
    const checkuserName = (rule, value, callback) => {
      if(this.dataDialogForm.userId !==0){
        if (value === "") {
          callback(new Error("请输入用户名"));
        }
       callback();
      } else if(value === "") {
        callback(new Error("请输入账号"))
      }else {
        //调用后端接口
        this.$http.get("/sys/sysUser/checkUserName?username=" + value).then((res) => {
          if(res.data.data === "FAIL"){
            //说明角色名不存在可以使用
            callback();
          }else {
            callback(new Error("账号重复!"))
          }
        });
      }
    }
    const checkuserPassword =(rule, value, callback) => {
      if(this.dataDialogForm.userId !== 0){
        callback();
      } else {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          callback()
        }
      }
    }
    return{
      dataForm: {
        userName: "",
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 5,
      totalPage: 0,
      dataListLoading: false,
      dialogFormVisible:false,
      dialogFormSubmitVisible:false,
      statusList:[
        {
          label:'激活',
          value: 1
        },
        {
          label: '禁用',
          value: 0
        }
      ],
      dataDialogForm:{
        userId: 0,
        status:1
      },rules: {
         username:[
             {required: true, message:"请输入账号",trigger: "blur"},
             {validator:checkuserName,trigger:"blur"}],
         password:[{validator:checkuserPassword,trigger:"blur"}]
      }
    }
  },
  methods: {
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.getDataList();
    },
    currentChangeHandle(val) {
      this.pageIndex = val;
      this.getDataList();
    },
    getDataList() {
      if (this.dataListLoading) {
        return;
      }
      this.dataListLoading = true
      const params = {
        params: {
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          username: this.dataForm.username
        }
      }
      this.$http.get("/sys/sysUser/list?username=" + this.dataForm.userName, params).then((res) => {
        this.dataList = res.data.data.list
        this.totalPage = res.data.data.totalCount
        this.dataListLoading = false
      });
    },
    // eslint-disable-next-line no-unused-vars
    handleEdit(index, row) {
      this.$http.get("/sys/sysUser/queryUserById?userId="+row.userId).then((res) => {
        const user = res.data.data;
        this.dataDialogForm = {
          userId: user.userId,
          username: user.username,
          email: user.email,
          mobile: user.mobile,
          status: user.status
        }
        this.dialogFormVisible = true;
      });
    },
    openDialog(){
      //true
      this.dialogFormVisible = true
    },
    closeDialog(){
      this.dataDialogForm = {userId:0,status: 1}
      this.dialogFormVisible = false
    },
    handleSubmitFormData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(this.dialogFormSubmitVisible){
            return;
          }
          this.dialogFormVisible = true;
          this.$http.post('/sys/sysUser/save',this.dataDialogForm).then(() =>{
            this.dialogFormVisible = false;
            //清空数据的表单
            this.dataDialogForm = {userId:0};
            this.dialogFormVisible = false;
            //刷新数据
            this.getDataList();
          })
        } else {
          // console.log('error submit!!');
          return false;
        }
      });
    },
    handleUpdateStatus(index,row) {
      const msg = row.status === 1? "禁用":"激活"
      const userStatus = {
        userId:row.userId,
        status:row.status === 1 ? 0:1
      }
      this.$confirm("是否确认"+ msg +"?", '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if(this.dialogFormVisible){
          return;
        }
        this.$http.post('/sys/sysUser/updateStatus?status='+msg,userStatus).then(() => {
          this.dialogFormVisible = false;
          //清空数据的表单
          this.dataDialogForm = {userId: 0};
          this.dialogFormVisible = false;
          //刷新数据
          this.getDataList();
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'+msg
        });
      });

    }
  },
  mounted() {
    this.getDataList();
  }
}
</script>

<style scoped>

</style>