<template>
  <div>

    <div style="margin: 10px 0">
      <el-input style="width: 200px" placeholder="信息" suffix-icon="el-icon-search" v-model="searchData"></el-input>
      <el-button style="margin-left: 5px" type="primary" @click="handleSearch">搜索</el-button>
      <el-button type="warning" @click="reset">重置</el-button>
    </div>

    <div style="margin: 10px 0">
      <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handleAdd">新增</el-button>
      <el-popconfirm
          style="margin-left: 10px"
          confirm-button-text='确定'
          cancel-button-text='我再想想'
          icon="el-icon-info"
          icon-color="red"
          title="您确定批量删除这些数据吗？"
          @confirm="delBatch"
      >
        <el-button type="danger" slot="reference" icon="el-icon-delete">批量删除</el-button>
      </el-popconfirm>
<!--      <el-upload action="http://localhost:9090/user/import" :show-file-list="false" accept="xlsx" :on-success="handleImportSuccess" style="display: inline-block">-->
<!--        <el-button type="primary" style="margin-left: 10px" icon="el-icon-top">导入</el-button>-->
<!--      </el-upload>-->
<!--      <el-button type="primary" icon="el-icon-bottom" style="margin-left: 10px" @click="handleExport">导出</el-button>-->
    </div>

    <el-table :data="tableData" border stripe @selection-change="handleSelectionChange" style="width: 1196px">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="id" label="ID" width="70"></el-table-column>
      <el-table-column prop="name" label="姓名" width="120"></el-table-column>
      <el-table-column prop="sex" label="性别" width="50"></el-table-column>
      <el-table-column prop="isAdmin" label="管理员" width="60"></el-table-column>
      <el-table-column prop="phone" label="电话" width="120"></el-table-column>
      <el-table-column prop="idNumber" label="身份证号" width="220"></el-table-column>
      <el-table-column prop="address" label="地址" width="300"></el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="success" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
          <el-popconfirm
              style="margin-left: 5px"
              confirm-button-text='确定'
              cancel-button-text='我再想想'
              icon="el-icon-info"
              icon-color="red"
              title="您确定删除吗？"
              @confirm="handleDelete(scope.row.id)"
          >
            <el-button type="danger" slot="reference" icon="el-icon-remove-outline">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div style="padding: 10px 0">
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-sizes="[10, 15, 20]"
          :page-size="5"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </div>

    <el-dialog title="志愿者信息" :visible.sync="dialogFormVisible" width="400px">
      <el-form label-width="80px" size="small">
        <el-form-item label="姓名">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <div style="margin-left: 20px">
            女<el-switch v-model="form.sex" active-value="男" inactive-value="女" style="margin-left: 20px;margin-right: 20px"></el-switch>男
          </div>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="form.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="身份证号">
          <el-input v-model="form.idNumber" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="form.address" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="管理员">
          <div style="margin-left: 20px">
          否<el-switch v-model="form.isAdmin" active-value="是" inactive-value="否" style="margin-left: 20px;margin-right: 20px"></el-switch>是
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "User",
  data() {
    const item = {
      id: '1',
      name: '王小虎',
      sex: '男',
      isAdmin: "是",
      phone: '16666666666',
      idNumber: '320101199912311234',
      address: '上海市普陀区金沙江路 1518 弄'
    };
    return {
      // tableData: [],
      tableData: Array(1).fill(item),
      total: 0,
      pageNum: 1,
      pageSize: 10,
      searchData: "",
      id: "",
      name: "",
      sex: "",
      idNumber: "",
      phone: "",
      address: "",
      isAdmin: "",
      form: {},
      dialogFormVisible: false,
      multipleSelection: []
    }
  },
  created() {
    this.load()
  },
  methods: {
    load(){
      this.request.get("/volunteer/page", {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        }
      }).then(res => {
        console.log(res.data)
        this.tableData = res.data.records
        this.total = res.data.total
      })
    },
    handleSearch(){
      this.request.get("/volunteer/search", {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          searchData: this.searchData
        }
      }).then(res => {
        console.log(res.data)
        this.tableData = res.data.records
        this.total = res.data.total
      })
    },
    save() {
      this.request.post("/volunteer/save", this.form).then(res => {
        if(res.data) {
          this.$message.success("保存成功")
          this.dialogFormVisible = false
          this.load()
        } else {
          this.$message.error("保存失败")
        }
      })
    },
    handleAdd(){
      this.dialogFormVisible = true
      this.form = {}
    },
    handleEdit(row) {
      this.form = Object.assign({},row)
      console.log(this.form)
      this.dialogFormVisible = true
    },
    handleDelete(id) {
      this.request.delete("/volunteer/del?id=" + id).then(res => {
        if(res.data) {
          this.$message.success("删除成功")
          this.load()
        } else {
          this.$message.error("删除失败")
        }
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    delBatch() {
      let ids = this.multipleSelection.map(v => v.id)
      this.request.post("/volunteer/delBatch?ids=", ids).then(res => {
        if(res.data) {
          this.$message.success("批量删除成功")
          this.load()
        } else {
          this.$message.error("批量删除失败")
        }
      })
    },
    reset(){
      this.searchData = ""
      this.load()
    },
    handleSizeChange(pageSize){
      this.pageSize = pageSize
      this.load()
    },
    handleCurrentChange(pageNum){
      this.pageNum = pageNum
      this.load()
    }
  }
}
</script>

<style scoped>

</style>