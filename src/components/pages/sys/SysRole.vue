<template>
  <el-card class="box-card">
    <div class="mod-role">
      <el-form :inline="true" :model="dataForm" class="demo-form-inline">
        <el-form-item>
          <el-input
              v-model="dataForm.roleName"
              clearable
              placeholder="角色名称">
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
        <el-table-column prop="roleId" label="ID" width="150"></el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="180"></el-table-column>
        <el-table-column prop="remark" label="备注" width="280"></el-table-column>
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
                @click="handleDelete(scope.$index, scope.row)">删除
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
      <el-dialog @close="closeDialog()" :title="dataDialogForm.roleId===0? '新增角色' : '更新角色'" width="35%" :visible.sync="dialogFormVisible">
        <el-form :model="dataDialogForm" :rules="rules"  ref="ruleForm">
          <el-form-item label="角色名称" label-width="120px" prop="roleName">
            <el-input v-model="dataDialogForm.roleName" placeholder="角色名称" style="width: 300px"></el-input>
          </el-form-item>
          <el-form-item label="描述信息" label-width="120px" prop="remark">
            <el-input type="textarea" v-model="dataDialogForm.remark" style="width: 300px"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleSubmitFormData('ruleForm')">确 定</el-button>
        </div>
      </el-dialog>
  </el-card>
</template>

<script>

export default {
  name: "SysRole",
  data() {
    const checkRoleName = (rule, value, callback) => {
      if(this.dataDialogForm.roleId !== 0){
         if (value === '') {
           callback(new Error('请输入角色名称'));
         }
      } else if(value === ""){
           callback(new Error("请输入角色名称"))
      } else {
        //调用后端接口
        this.$http.get("/sys/sysRole/checkRoleName?roleName = " + value).then((res) => {
          if(res.data.data === 'FAIL'){
            //说明角色名不存在可以使用
            callback();
          }else {
            callback(new Error('角色名称重复！请重新添加！'))
          }
        });
      }
    }
    return {
      dataForm: {
        roleName: "",
      },
      dataDialogForm: {roleId:0,roleName:"",remark: ''},
      dataList: [],
      pageIndex: 1,
      pageSize: 5,
      totalPage: 0,
      dataListLoading: false,
      dialogFormVisible: false,
      dialogFormSubmitVisible: false,
      rules: {
        roleName: [
          //{required: true, message: '请输入角色名称', trigger: 'blur'},
          {validator:checkRoleName, trigger: 'blur'}
        ],
        remark: [
          {required: true, message: '请输入描述信息', trigger: 'blur'}
        ]
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
          roleName: this.dataForm.roleName
        }
      }
      this.$http.get("/sys/sysRole/list",params).then((res) => {
        this.dataList = res.data.data.list
        this.totalPage = res.data.data.totalCount
        this.dataListLoading = false
      });
    },
    // eslint-disable-next-line no-unused-vars

    // eslint-disable-next-line no-unused-vars
    handleDelete(index, item) {
      //删除角色信息
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.dialogFormSubmitVisible) {
          return
        }
        this.dialogFormSubmitVisible = true
        this.$http.get("/sys/sysRole/deleteRole?roleId=" + item.roleId).then((res) => {
          if(res.data.data === '0'){
            this.$message({
              type: 'warning',
              message: '删除失败!该条记录不允许删除!'
            });
          }else {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }
          this.dialogFormSubmitVisible = false
          this.getDataList();
        });

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    handleEdit(index, item) {
        // 打开更新的窗口
      this.dialogFormVisible = true
      this.dataDialogForm.roleId = item.roleId
      this.dataDialogForm.roleName = item.roleName
      this.dataDialogForm.remark = item.remark
    },

    openDialog(){
      //打开窗口
      this.dialogFormVisible = true
      this.dataDialogForm.roleId = 0
      this.dataDialogForm.roleName = ''
      this.dataDialogForm.remark = ''

    },
    closeDialog(){
      this.dataDialogForm = {roleId:0,roleName:"",remark: ''}
      this.dialogFormVisible = false
    },
    handleSubmitFormData(formName){
      this.updateRole(formName)
    },
    updateRole(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.dialogFormSubmitVisible){
              return
            }
            this.dialogFormVisible = true
            this.$http.post('/sys/sysRole/save',this.dataDialogForm).then(() =>{
              //清空数据的表单
             this.dataDialogForm = {roleId:0,roleName:"",remark: ''}
             this.dialogFormVisible = false
            })
            //刷新数据
            this.getDataList()
          } else {
           // console.log('error submit!!');
            return false;
          }
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