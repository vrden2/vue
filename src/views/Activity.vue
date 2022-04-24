<template>
  <div>
<!--    新闻模块-->
    <div>
      <div style="margin-top: 30px;margin-bottom: 10px;margin-left: 10px">新闻：共 {{newsTotal}} 条</div>
      <div style="margin-top: 10px; margin-bottom: 10px">
        <el-input style="width: 200px" placeholder="输入关键词" suffix-icon="el-icon-search" v-model="newsSearchData"></el-input>
        <el-button style="margin-left: 5px" type="primary" @click="handleNewsSearch">搜索</el-button>
      </div>
      <div style="margin-top: 10px; margin-bottom: 10px">
        <el-button type="primary" style="margin-left: 20px" icon="el-icon-circle-plus-outline" @click="handleAddNews">新建</el-button>
        <el-popconfirm
            style="margin-left: 10px"
            confirm-button-text='确定'
            cancel-button-text='我再想想'
            icon="el-icon-info"
            icon-color="red"
            title="您确定批量删除这些数据吗？"
            @confirm="delNewsBatch"
        >
          <el-button type="danger" slot="reference" icon="el-icon-delete">批量删除</el-button>
        </el-popconfirm>
      </div>
      <el-table :data="newsDatas" border stripe style="width: 1001px" @selection-change="handleNewsSelectionChange">
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column prop="id" label="ID" width="60"></el-table-column>
        <el-table-column prop="title" label="标题" width="150"></el-table-column>
        <el-table-column prop="author" label="作者" width="120"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="220"></el-table-column>
        <el-table-column prop="modifyTime" label="修改时间" width="220"></el-table-column>
        <el-table-column label="操作" width="190">
          <template slot-scope="scope">
            <el-button type="success" style="margin-left: 5px" icon="el-icon-edit" @click="handleEditNews(scope.row)">编辑</el-button>
            <el-popconfirm
                style="margin-left: 10px"
                confirm-button-text='确定'
                cancel-button-text='我再想想'
                icon="el-icon-info"
                icon-color="red"
                title="确定删除这条新闻？"
                @confirm="handleDeleteNews(scope.row.id)"
            >
              <el-button type="danger" slot="reference" icon="el-icon-remove-outline">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
<!--    活动模块-->
    <div>
      <div style="margin-top: 30px;margin-bottom: 10px;margin-left: 10px">活动：共 {{actionTotal}} 条</div>
      <div style="margin-top: 10px; margin-bottom: 10px">
        <el-input style="width: 200px" placeholder="输入关键词" suffix-icon="el-icon-search" v-model="actionSearchData"></el-input>
        <el-button style="margin-left: 5px" type="primary" @click="handleActionSearch">搜索</el-button>
      </div>
      <div style="margin-top: 10px; margin-bottom: 10px">
        <el-button type="primary" style="margin-left: 20px" icon="el-icon-circle-plus-outline" @click="handleAddAction">新建</el-button>
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
      <el-table :data="actionDatas" border stripe style="width: 1001px" @selection-change="handleActionSelectionChange">
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column prop="id" label="ID" width="60"></el-table-column>
        <el-table-column prop="title" label="标题" width="150"></el-table-column>
        <el-table-column prop="manager" label="发起人" width="120"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="220"></el-table-column>
        <el-table-column prop="modifyTime" label="修改时间" width="220"></el-table-column>
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
    </div>
<!--    新增弹窗-->
    <el-dialog title="新闻细节" :visible.sync="newsFormVisible" width="30%">
      <el-form label-width="80px" size="small">
        <el-form-item label="标题">
          <el-input v-model="newsForm.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="作者">
          <el-input v-model="newsForm.author" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item v-model="newsForm.mainText" autocomplete="off">
          <el-button type="success" icon="el-icon-edit" @click="handleNewsTextDrawerShow(actionForm.mainText)">编辑正文</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="newsFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveNews">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="活动详情" :visible.sync="actionFormVisible" width="30%">
      <el-form label-width="80px" size="small">
        <el-form-item label="标题">
          <el-input v-model="actionForm.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="发起人">
          <el-input v-model="actionForm.manager" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item v-model="actionForm.mainText" autocomplete="off">
          <el-button type="success" icon="el-icon-edit" @click="handleActionTextDrawerShow(actionForm.mainText)">编辑正文</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="actionFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveAction">确 定</el-button>
      </div>
    </el-dialog>
    <el-drawer
        title="编辑正文"
        :visible.sync="newsTextDrawerShow"
        direction="rtl"
        :before-close="newsHandleClose">
      <el-input style="margin-left: 20px; width: 90%" type="textarea" placeholder="请输入内容" v-model="textArea" maxlength="3000" show-word-limit></el-input>
    </el-drawer>
    <el-drawer
        title="编辑正文"
        :visible.sync="actionTextDrawerShow"
        direction="rtl"
        :before-close="actionHandleClose">
      <el-input style="margin-left: 20px; width: 90%" type="textarea" placeholder="请输入内容" v-model="textArea" maxlength="3000" show-word-limit></el-input>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "Activity",
  data() {
    const news = {
      id: '1',
      title: '标题标题标题',
      author: 'admin',
      createTime: '202204241222',
      modifyTime: '202204241222',
      mainText: '这是一段测试文本这是一段测试文本这是一段测试文本这是一段测试文本这是一段测试文本这是一段测试文本'
    };
    const action = {
      id: '1',
      title: '标题标题标题',
      manager: 'admin',
      createTime: '202204241222',
      modifyTime: '202204241222',
      mainText: '这是一段测试文本这是一段测试文本这是一段测试文本这是一段测试文本这是一段测试文本这是一段测试文本'
    };
    return {
      // newsDatas: [],
      newsDatas: Array(2).fill(news),
      // actionDatas: [],
      actionDatas: Array(2).fill(action),
      newsTotal: 0,
      actionTotal: 0,
      newsSearchData: "",
      actionSearchData: "",
      newsFormVisible: false,
      actionFormVisible: false,
      newsTextDrawerShow: false,
      actionTextDrawerShow: false,
      newsForm: [],
      actionForm: [],
      textArea: "",
      newsMultipleSelection: "",
      actionMultipleSelection: "",
    }
  },
  created() {
    this.newsLoad()
    this.actionLoad()
  },
  methods: {
    newsLoad() {
      this.request.get("/activity/news").then(res => {
        console.log(res.data)
        this.newsDatas = res.data.records
        this.newsTotal = res.data.total
      })
    },
    actionLoad() {
      this.request.get("/activity/action").then(res => {
        console.log(res.data)
        this.actionDatas = res.data.records
        this.actionTotal = res.data.total
      })
    },
    handleNewsSearch() {
      this.request.get("/activity/news/search", {
        params: {
          searchData: this.newsSearchData
        }
      }).then(res => {
        console.log(res.data)
        this.newsDatas = res.data.records
        this.newsTotal = res.data.total
      })
    },
    handleActionSearch() {
      this.request.get("/activity/news/search", {
        params: {
          actionData: this.actionSearchData
        }
      }).then(res => {
        console.log(res.data)
        this.actionDatas = res.data.records
        this.actionTotal = res.data.total
      })
    },
    saveNews() {
      this.request.post("/activity/news/save", this.newsForm).then(res => {
        if(res.data) {
          this.$message.success("保存成功")
          this.newsFormVisible = false
          this.newsLoad()
        } else {
          this.$message.error("保存失败")
        }
      })
    },
    saveAction() {
      this.request.post("/activity/action/save", this.actionForm).then(res => {
        if(res.data) {
          this.$message.success("保存成功")
          this.actionFormVisible = false
          this.actionLoad()
        } else {
          this.$message.error("保存失败")
        }
      })
    },
    handleAddNews(){
      this.newsFormVisible = true
      this.newsForm = {}
    },
    handleAddAction(){
      this.actionFormVisible = true
      this.actionForm = {}
    },
    newsHandleClose(done) {
      this.$confirm('确认保存？')
          .then(_ => {
            this.newsForm.mainText = this.textArea
            done();
          })
          .catch(_ => {});
    },
    actionHandleClose(done) {
      this.$confirm('确认保存？')
          .then(_ => {
            this.actionForm.mainText = this.textArea
            done();
          })
          .catch(_ => {});
    },
    handleNewsTextDrawerShow(text){
      this.textArea = text
      this.newsTextDrawerShow = true
    },
    handleActionTextDrawerShow(text){
      this.textArea = text
      this.actionTextDrawerShow = true
    },
    handleEditNews(row) {
        this.newsForm = Object.assign({},row)
        this.newsFormVisible = true
    },
    handleEditAction(row) {
      this.actionForm = Object.assign({},row)
      this.newsFormVisible = true
    },
    handleNewsSelectionChange(val) {
      this.newsMultipleSelection = val
    },
    handleActionSelectionChange(val) {
      this.actionMultipleSelection = val
    },
    handleDeleteNews(id) {
      this.request.delete("/activity/news/del" + id).then(res => {
        if(res.data) {
          this.$message.success("删除成功")
          this.newsLoad()
        } else {
          this.$message.error("删除失败")
        }
      })
    },
    handleDeleteAction(id) {
      this.request.delete("/activity/action/del" + id).then(res => {
        if(res.data) {
          this.$message.success("删除成功")
          this.actionLoad()
        } else {
          this.$message.error("删除失败")
        }
      })
    },
    delNewsBatch() {
      let ids = this.newsMultipleSelection.map(v => v.id)
      this.request.post("/activity/news/del/batch", ids).then(res => {
        if(res.data) {
          this.$message.success("批量删除成功")
          this.newsLoad()
        } else {
          this.$message.error("批量删除失败")
        }
      })
    },
    delActionBatch() {
      let ids = this.actionMultipleSelection.map(v => v.id)
      this.request.post("/activity/news/del/batch", ids).then(res => {
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