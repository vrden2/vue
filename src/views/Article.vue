<template>
  <div>
    <div style="margin-bottom: 10px;margin-left: 10px" v-show="isShow">文章：共 {{articleTotal}} 篇</div>
    <div style="margin-top: 10px; margin-bottom: 10px" v-show="isShow">
      <el-input style="width: 200px" placeholder="信息" suffix-icon="el-icon-search" v-model="searchArticleData"></el-input>
      <el-button style="margin-left: 5px" type="primary" @click="handleArticleSearch">搜索</el-button>
      <el-popconfirm
          style="margin-left: 10px"
          confirm-button-text='确定'
          cancel-button-text='我再想想'
          icon="el-icon-info"
          icon-color="red"
          title="确定进行批量删除？"
          @confirm="delArticleBatch"
      >
        <el-button type="danger" slot="reference" icon="el-icon-delete">批量删除</el-button>
      </el-popconfirm>
    </div>
    <el-table :data="articleDatas" border stripe v-show="isShow" style="width: 861px" @selection-change="handleArticleSelectionChange">
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column prop="id" label="ID" width="60"></el-table-column>
      <el-table-column prop="title" label="标题" width="150"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="160"></el-table-column>
      <el-table-column prop="modifyTime" label="修改时间" width="160"></el-table-column>
      <el-table-column prop="visitedNumber" label="访问量" width="100"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="success" style="margin-left: 5px" icon="el-icon-edit" @click="handleEditarticle(scope.row)">编辑</el-button>
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



  </div>
</template>

<script>
export default {
  name: "Article",
  data() {
    const article = {
      id: '1',
      title: '这是标题',
      createTime: '202202221222',
      modifyTime: '202202221222',
      visitedNumber: 105641
    };
    return {
      isShow: true,
      articleTotal: 0,
      searchArticleData: "",
      visitedNumber: 0,
      // articleDatas: [],
      articleDatas: Array(10).fill(article),
      pageSize: 10,
    }
  },
  created() {
    this.articleLoad()
  },
  methods: {
    articleLoad() {
      this.request.get("/article/page").then(res => {
        console.log(res.data)
        this.articleDatas = res.data
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
      this.request.get("/activity/search", {
        params: {
          articleData: this.articleSearchData
        }
      }).then(res => {
        console.log(res.data)
        this.articleDatas = res.data
        this.articleTotal = res.data.total
      })
    },
    saveArticle() {
      this.request.post("/activity/save", this.articleForm).then(res => {
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
    handleEditarticle(row) {
      this.articleForm = Object.assign({},row)
      this.articleFormVisible = true
    },
    handleSelectionChange(val) {
      this.articleMultipleSelection = val
    },
    handleDeleteArticle(id) {
      this.request.delete("/activity/del" + id).then(res => {
        if(res.data) {
          this.$message.success("删除成功")
          this.articleLoad()
        } else {
          this.$message.error("删除失败")
        }
      })
    },
    delarticleBatch() {
      let ids = this.articleMultipleSelection.map(v => v.id)
      this.request.post("/activity/del/batch", ids).then(res => {
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