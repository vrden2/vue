<template>
  <div>
    <div>
      <span>请输入用户ID：</span>
      <el-input style="width: 200px" placeholder="输入老人ID" suffix-icon="el-icon-search" v-model="userId"></el-input>
      <el-button type="primary" style="margin-left: 20px" @click="handleUserSearch">确定</el-button>
    </div>

    <div style="margin-top: 30px;margin-bottom: 10px;margin-left: 10px" v-show="isShow">用户信息</div>
    <el-table :data="userData" border stripe v-show="isShow" style="width: 801px">
      <el-table-column prop="id" label="ID" width="70"></el-table-column>
      <el-table-column prop="name" label="姓名" width="120"></el-table-column>
      <el-table-column prop="sex" label="性别" width="50"></el-table-column>
      <el-table-column prop="phone" label="电话" width="120"></el-table-column>
      <el-table-column prop="id_number" label="身份证号" width="220"></el-table-column>
      <el-table-column prop="address" label="地址" width="220"></el-table-column>
    </el-table>
    <div style="margin-top: 30px;margin-bottom: 10px;margin-left: 10px" v-show="isShow">文章：共 {{articleTotal}} 篇</div>
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
          <el-button type="success" style="margin-left: 5px" icon="el-icon-edit" @click="handleEditAction(scope.row)">编辑</el-button>
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
    const user = {
      id: '1',
      name: '王小虎',
      sex: '男',
      phone: '16666666666',
      id_number: '320101199912311234',
      address: '上海市普陀区金沙江路 1518 弄'
    };
    const article = {
      id: '1',
      title: '这是标题',
      createTime: '202202221222',
      modifyTime: '202202221222',
      visitedNumber: 105641
    };
    return {
      elderId: "",
      isShow: true,
      // elderData: [],
      elderData: Array(1).fill(user),
      articleTotal: 0,
      searchArticleData: "",
      // articleDatas: [],
      articleDatas: Array(10).fill(article),
    }
  },
  methods: {

  }
}
</script>

<style scoped>

</style>