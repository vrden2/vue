<template>
  <div>
<!--    活动模块-->
    <div>
      <div style="margin-top: 10px;margin-bottom: 10px;margin-left: 10px">活动：共 {{actionTotal}} 条</div>
      <div style="margin-top: 10px; margin-bottom: 10px">
        <el-input style="width: 200px" placeholder="输入关键词" suffix-icon="el-icon-search" v-model="actionSearchData"></el-input>
        <el-button style="margin-left: 5px" type="primary" @click="handleActionSearch">搜索</el-button>
      </div>
      <div style="margin-top: 10px; margin-bottom: 10px">
        <el-button type="primary" style="margin-left: 10px" icon="el-icon-circle-plus-outline" @click="handleAddAction">新建</el-button>
        <el-popconfirm
            style="margin-left: 10px"
            confirm-button-text='确定'
            cancel-button-text='我再想想'
            icon="el-icon-info"
            icon-color="red"
            title="您确定批量删除这些数据吗？"
            @confirm="delActionBatch"
        >
          <el-button type="danger" slot="reference" icon="el-icon-delete">批量删除</el-button>
        </el-popconfirm>
      </div>
      <el-table :data="actionDatas" border stripe style="width: 1041px" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column prop="id" label="ID" width="60"></el-table-column>
        <el-table-column prop="title" label="标题" width="150"></el-table-column>
        <el-table-column prop="manager" label="发起人" width="120"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="120"></el-table-column>
        <el-table-column prop="modifyTime" label="修改时间" width="120"></el-table-column>
        <el-table-column prop="startTime" label="开始时间" width="120"></el-table-column>
        <el-table-column prop="endTime" label="结束时间" width="120"></el-table-column>
        <el-table-column label="操作" width="190">
          <template slot-scope="scope">
            <el-button type="success" style="margin-left: 5px" icon="el-icon-edit" @click="handleEditAction(scope.row)">编辑</el-button>
            <el-popconfirm
                style="margin-left: 10px"
                confirm-button-text='确定'
                cancel-button-text='我再想想'
                icon="el-icon-info"
                icon-color="red"
                title="确定删除此活动？"
                @confirm="handleDeleteAction(scope.row.id)"
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
            :total="actionTotal">
        </el-pagination>
      </div>
    </div>
<!--    新增弹窗-->
    <el-dialog title="活动详情" :visible.sync="actionFormVisible" width="30%">
      <el-form label-width="80px" size="small">
        <el-form-item label="标题">
          <el-input v-model="actionForm.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="发起人">
          <el-input v-model="actionForm.manager" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="开始于">
<!--          <el-input v-model="actionForm.startTime" autocomplete="off"></el-input>-->
          <div class="block">
            <el-date-picker
                v-model="actionForm.startTime"
                type="date"
                placeholder="选择日期"
                :picker-options="pickerStartOptions">
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="结束于">
<!--          <el-input v-model="actionForm.endTime" autocomplete="off"></el-input>-->
          <div class="block">
            <el-date-picker
                v-model="actionForm.endTime"
                type="date"
                placeholder="选择日期"
                :picker-options="pickerEndOptions">
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item v-model="actionForm.mainText" autocomplete="off">
          <el-button type="success" icon="el-icon-edit" @click="handleActionTextDrawerShow(actionForm.mainText)">编辑活动内容</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="actionFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveAction">确 定</el-button>
      </div>
    </el-dialog>
<!--编辑正文-->
    <el-drawer
        title="编辑正文"
        :visible.sync="actionTextDrawerShow"
        direction="rtl"
        :before-close="actionHandleClose">
      <div style="margin-left: 20px;">
        <el-button type="success" @click="actionHandleClose" style="margin-bottom:10px ;text-align: center">保存</el-button>
        <el-button type="danger" @click="setBlank" style="margin-bottom:10px ;text-align: center">清空内容</el-button>
        <el-input style="width: 90%; font-size: 14px" type="textarea" placeholder="请输入内容" v-model="textArea" maxlength="3000" show-word-limit></el-input>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "Activity",
  data() {
    const action = {
      id: '1',
      title: '标题标题标题',
      manager: 'admin',
      createTime: '202204241222',
      modifyTime: '202204241222',
      mainText: '这是一段测试文本这是一段测试文本这是一段测试文本这是一段测试文本这是一段测试文本这是一段测试文本'
    };
    return {
      // actionDatas: [],
      actionDatas: Array(2).fill(action),
      pageNum: 0,
      pageSize: 10,
      actionTotal: 0,
      actionSearchData: "",
      actionFormVisible: false,
      actionTextDrawerShow: false,
      actionForm: [],
      textArea: "",
      actionMultipleSelection: "",
      pickerStartOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date());
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', date);
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', date);
          }
        }]
      },
      pickerEndOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [{
          text: '明天',
          onClick(picker) {
            date.setTime(date.getTime() + 3600 * 1000 * 24);
            picker.$emit('pick', date);
          }
        }, {
          text: '后天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() + 3600 * 1000 * 48);
            picker.$emit('pick', date);
          }
        }, {
          text: '一周后',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
            picker.$emit('pick', date);
          }
        }]
      },
    }
  },
  created() {
    this.actionLoad()
  },
  methods: {
    actionLoad() {
      this.request.get("/activity/page").then(res => {
        console.log(res.data)
        this.actionDatas = res.data.records
        this.actionTotal = res.data.total
      })
    },
    setBlank() {
      this.textArea = ""
    },
    handleSizeChange(pageSize){
      this.pageSize = pageSize
      this.actionLoad()
    },
    handleCurrentChange(pageNum){
      this.pageNum = pageNum
      this.actionLoad()
    },
    handleActionSearch() {
      this.request.get("/activity/search", {
        params: {
          actionData: this.actionSearchData
        }
      }).then(res => {
        console.log(res.data)
        this.actionDatas = res.data
        this.actionTotal = res.data.total
      })
    },
    saveAction() {
      this.request.post("/activity/save", this.actionForm).then(res => {
        if(res.data) {
          this.$message.success("保存成功")
          this.actionFormVisible = false
          this.actionLoad()
        } else {
          this.$message.error("保存失败")
        }
      })
    },
    handleAddAction(){
      this.actionFormVisible = true
      this.actionForm = {}
    },
    actionHandleClose(done) {
      this.$confirm('确认保存？')
          .then(_ => {
            this.actionForm.mainText = this.textArea
            this.actionTextDrawerShow = false
            done();
          })
          .catch(_ => {});
    },
    handleActionTextDrawerShow(text){
      this.textArea = text
      this.actionTextDrawerShow = true
    },
    handleEditAction(row) {
      this.actionForm = Object.assign({},row)
      this.actionFormVisible = true
    },
    handleSelectionChange(val) {
      this.actionMultipleSelection = val
    },
    handleDeleteAction(id) {
      this.request.delete("/activity/del" + id).then(res => {
        if(res.data) {
          this.$message.success("删除成功")
          this.actionLoad()
        } else {
          this.$message.error("删除失败")
        }
      })
    },
    delActionBatch() {
      let ids = this.actionMultipleSelection.map(v => v.id)
      this.request.post("/activity/del/batch", ids).then(res => {
        if(res.data) {
          this.$message.success("批量删除成功")
          this.actionLoad()
        } else {
          this.$message.error("批量删除失败")
        }
      })
    },
  }
}
</script>

<style scoped>

</style>