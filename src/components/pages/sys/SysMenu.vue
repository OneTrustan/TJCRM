<template>
  <div>
    <el-card class="box-card">
      <div class="mod-role">
        <el-form :inline="true" :model="dataForm" class="demo-form-inline">
          <el-form-item>
            <el-input
                v-model="dataForm.label"
                clearable
                placeholder="菜单名称">
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="getDataList">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="openDialog()">新增</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="dataList" border style="width: 100%" row-key="menuId"
                  :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="menuId" label="ID" width="150"></el-table-column>
          <el-table-column prop="name" label="菜单名称" width="180"></el-table-column>
          <el-table-column prop="url" label="路由地址" width="280"></el-table-column>
          <el-table-column prop="icon" label="图标" width="180"></el-table-column>
          <el-table-column prop="parentId" label="父菜单编号" width="180"></el-table-column>
          <el-table-column prop="orderNum" label="序号" width="180"></el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="scope" >
              <el-button
                  size="mini"
                  type="primary"
                  @click="handleEdit(scope.$index, scope.row)">编辑
              </el-button>
              <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index,scope.row)">删除
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
      <el-dialog @close="closeDialog()" :title="dataDialogForm.menuId===0? '新增菜单' : '更新菜单'" width="35%" :visible.sync="dialogFormVisible">
        <el-form :model="dataDialogForm"  :rules="rules" ref="ruleForm">
          <el-form-item label="菜单名称" label-width="120px" prop="name">
            <el-input v-model="dataDialogForm.name" placeholder="菜单名称" style="width: 300px"></el-input>
          </el-form-item>
          <el-form-item label="路由地址" label-width="120px" prop="url">
            <el-input v-model="dataDialogForm.url" placeholder="路由地址" style="width: 300px"></el-input>
          </el-form-item>
          <el-form-item label="图标" label-width="120px" prop="icon">
            <el-input v-model="dataDialogForm.icon" placeholder="图标名称" style="width: 300px"></el-input>
          </el-form-item>
          <el-form-item label="序号" label-width="120px" prop="orderNum">
            <el-input type="number" v-model="dataDialogForm.orderNum" placeholder="序号" style="width: 300px"></el-input>
          </el-form-item>
          <el-form-item label="父菜单" label-width="120px" prop="parentId">
              <el-select v-model="dataDialogForm.parentId" placeholder="请选择父菜单序号-默认为父菜单" clearable>
                <el-option
                    v-for="item in options"
                    :key="item.menuId"
                    :label="item.label"
                    :value="item.menuId"
                >
                </el-option>
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
  name: "SysMenu",
  data(){
    return{
      dataForm: {
        label: "",
      },
      rules:{
        label: [{required:true,message:"请输入菜单名称",trigger:"blur"}],
        orderNum: [{required:true,message:"请输入排序数",trigger:"blur"}],
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 5,
      totalPage: 0,
      dataListLoading: false,
      dialogFormVisible:false,
      dialogFormSubmitVisible:false,
      dataDialogForm:{
        menuId: 0,
      }, options: []
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
          label: this.dataForm.label
        }
      }
      this.$http.get("/sys/sysMenu/list", params).then((res) => {
        this.dataList = res.data.data.list
        this.totalPage = res.data.data.totalCount
        this.dataListLoading = false
      });
    },
    // eslint-disable-next-line no-unused-vars
    handleEdit(index, row) {
      this.$http.get("/sys/sysMenu/queryMenuById?menuId="+row.menuId).then((res) => {
        const menu = res.data.data.menu
        this.options = res.data.data.parents
        this.dataDialogForm = {
          menuId: menu.menuId,
          name:menu.name,
          url:menu.url,
          icon:menu.icon,
          orderNum:menu.orderNum,
          parentId:menu.parentId
        }
        this.dialogFormVisible = true;
      });
    },
    // eslint-disable-next-line no-unused-vars
    handleDelete(index,row){
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.dialogFormSubmitVisible) {
          return
        }
        this.dialogFormSubmitVisible = true
        this.$http.get("/sys/sysMenu/deleteMenu?menuId=" + row.menuId).then((res) => {
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
    openDialog() {
     //获取所有的父菜单数据
      this.$http.get("/sys/sysMenu/listParent").then((res) => {
        this.options = res.data.data
        this.dialogFormVisible = true
      });
    },
    closeDialog() {
      this.dataDialogForm = {menuId:0}
      this.dialogFormVisible = false
    },
    handleSubmitFormData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.dialogFormSubmitVisible) {
            return;
          }
          this.dialogFormVisible = true;
          this.$http.post('/sys/sysMenu/save', this.dataDialogForm).then(() => {
            this.dialogFormVisible = false;
            //清空数据的表单
            this.dataDialogForm = {menuId: 0};
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
  },
  mounted() {
    this.getDataList();
  }
}
</script>

<style scoped>

</style>