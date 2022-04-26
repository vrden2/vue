<template>
  <div>
    <div style="margin-bottom: 10px;margin-left: 10px">文章：共 {{articleTotal}} 篇</div>
    <div style="margin-top: 10px; margin-bottom: 10px">
      <el-input style="width: 200px" placeholder="信息" suffix-icon="el-icon-search" v-model="searchArticleData"></el-input>
      <el-button style="margin-left: 5px" type="primary" @click="handleArticleSearch">搜索</el-button>
    </div>
    <div style="margin-top: 10px; margin-bottom: 10px">
      <el-button type="primary" style="margin-left: 10px" icon="el-icon-circle-plus-outline" @click="handleAddArticle">新建</el-button>
      <el-popconfirm
          style="margin-left: 10px"
          confirm-button-text='确定'
          cancel-button-text='我再想想'
          icon="el-icon-info"
          icon-color="red"
          title="您确定批量删除这些数据吗？"
          @confirm="delArticleBatch"
      >
        <el-button type="danger" slot="reference" icon="el-icon-delete">批量删除</el-button>
      </el-popconfirm>
    </div>
    <el-table :data="articleDatas" border stripe style="width: 1011px" @selection-change="handleArticleSelectionChange">
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column prop="id" label="ID" width="60"></el-table-column>
      <el-table-column prop="title" label="标题" width="150"></el-table-column>
      <el-table-column prop="author" label="作者" width="150"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="160"></el-table-column>
      <el-table-column prop="modifyTime" label="修改时间" width="160"></el-table-column>
      <el-table-column prop="visitedNumber" label="访问量" width="100"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="success" style="margin-left: 5px" icon="el-icon-edit" @click="handleEditArticle(scope.row)">编辑</el-button>
          <el-popconfirm
              style="margin-left: 10px"
              confirm-button-text='确定'
              cancel-button-text='我再想想'
              icon="el-icon-info"
              icon-color="red"
              title="确定删除此文章？"
              @confirm="handleArticleDelete(scope.row.id)"
          >
            <el-button type="danger" slot="reference" icon="el-icon-remove-outline">移除</el-button>
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
          :total="articleTotal">
      </el-pagination>
    </div>
    <!--    新增弹窗-->
    <el-dialog title="活动详情" :visible.sync="articleFormVisible" width="30%">
      <el-form label-width="80px" size="small">
        <el-form-item label="标题">
          <el-input v-model="articleForm.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="作者">
          <el-input v-model="articleForm.author" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item v-model="articleForm.mainText" autocomplete="off">
          <el-button type="success" icon="el-icon-edit" @click="handleArticleTextDrawerShow(articleForm.mainText)">编辑正文</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="actionFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveArticle">确 定</el-button>
      </div>
    </el-dialog>
    <!--编辑正文-->
    <el-drawer
        title="编辑正文"
        :visible.sync="articleTextDrawerShow"
        direction="rtl"
        :before-close="articleHandleClose">
      <div style="margin-left: 20px;">
        <el-button type="success" @click="articleHandleClose" style="margin-bottom:10px ;text-align: center">保存</el-button>
        <el-button type="danger" @click="setBlank" style="margin-bottom:10px ;text-align: center">清空内容</el-button>
        <el-input style="width: 90%; font-size: 14px" type="textarea" placeholder="请输入内容" v-model="textArea" maxlength="3000" show-word-limit></el-input>
      </div>
    </el-drawer>



  </div>
</template>

<script>
export default {
  name: "Article",
  data() {
    const article = {
      id: '1',
      title: '这是标题',
      author: '作者',
      createTime: '202202221222',
      modifyTime: '202202221222',
      visitedNumber: 105641
    };
    return {
      articleForm:[],
      textArea: "",
      isShow: true,
      articleTotal: 0,
      searchArticleData: "",
      articleTextDrawerShow: false,
      visitedNumber: 0,
      // articleDatas: [],
      articleDatas: Array(10).fill(article),
      pageSize: 10,
      pageNum: 1,
      articleFormVisible: false,
    }
  },
  created() {
    this.articleLoad()
  },
  methods: {
    articleLoad() {
      this.request.get("/article/page").then(res => {
        console.log(res.data)
        this.articleDatas = res.data.records
        this.articleTotal = res.data.total
      })
    },
    setBlank() {
      this.textArea = ""
    },
    handleSizeChange(pageSize){
      this.pageSize = pageSize
      this.articleLoad()
    },
    handleCurrentChange(pageNum){
      this.pageNum = pageNum
      this.articleLoad()
    },
    handleArticleSearch() {
      this.request.get("/article/search", {
        params: {
          data: this.searchArticleData
        }
      }).then(res => {
        console.log(res.data)
        this.articleDatas = res.data
        this.articleTotal = res.data.total
      })
    },
    saveArticle() {
      this.request.post("/article/save", this.articleForm).then(res => {
        if(res.data) {
          this.$message.success("保存成功")
          this.articleFormVisible = false
          this.articleLoad()
        } else {
          this.$message.error("保存失败")
        }
      })
    },
    handleAddArticle(){
      this.articleFormVisible = true
      this.articleForm = {}
    },
    articleHandleClose(done) {
      this.$confirm('确认保存？')
          .then(_ => {
            this.articleForm.mainText = this.textArea
            this.articleTextDrawerShow = false
            done();
          })
          .catch(_ => {});
    },
    handleArticleTextDrawerShow(text){
      this.textArea = text
      this.articleTextDrawerShow = true
    },
    handleEditArticle(row) {
      this.articleForm = Object.assign({},row)
      this.articleFormVisible = true
    },
    handleArticleSelectionChange(val) {
      this.articleMultipleSelection = val
    },
    handleArticleDelete(id) {
      this.request.delete("/article/del?id=" + id).then(res => {
        if(res.data) {
          this.$message.success("删除成功")
          this.articleLoad()
        } else {
          this.$message.error("删除失败")
        }
      })
    },
    delArticleBatch() {
      let ids = this.articleMultipleSelection.map(v => v.id)
      this.request.post("/article/delBatch?ids=" + ids).then(res => {
        if(res.data) {
          this.$message.success("批量删除成功")
          this.articleLoad()
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