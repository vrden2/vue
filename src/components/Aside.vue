<template>
  <el-menu :default-openeds="['1', '3']" style="min-height: 100%; overflow-x: hidden"
           background-color=#EBEEF5
           text-color="#000"
           active-text-color="#ffd04b"
           :collapse-transition="false"
           :collapse="isCollapse"
           router
  >
    <div style="height: 60px; line-height: 60px; text-align: center">
      <img src="src/assets/image/logo.png" alt="" style="width: 20px; position: relative; top: 5px; margin-right: 5px">
      <b style="color: #000000" v-show="logoTextShow">老年人服务</b>
    </div>

    <el-menu-item index="/home">
      <i class="el-icon-house"></i>
      <span slot="title">主页</span>
    </el-menu-item>
    <el-submenu index="2">
      <template slot="title">
        <i class="el-icon-menu"></i>
        <span slot="title">用户管理</span>
      </template>
      <el-menu-item index="/elder">
        <i class="el-icon-s-custom"></i>
        <span slot="title">老人管理</span>
      </el-menu-item>
      <el-menu-item index="/volunteer">
        <i class="el-icon-user"></i>
        <span slot="title">志愿者管理</span>
      </el-menu-item>
      <el-menu-item index="/distribution">
        <i class="el-icon-set-up"></i>
        <span slot="title">分配设置</span>
      </el-menu-item>
    </el-submenu>
    <el-menu-item index="/activity">
      <i class="el-icon-document"></i>
      <span slot="title">新闻活动</span>
    </el-menu-item>
    <el-menu-item index="/article">
      <i class="el-icon-notebook-2"></i>
      <span slot="title">用户文章</span>
    </el-menu-item>
    <el-menu-item index="/about">
      <i class="el-icon-info"></i>
      <span slot="title">关于</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: "Aside",
  props: {
    isCollapse: Boolean,
    logoTextShow: Boolean
  },

  methods: {

  }
}
</script>

<style scoped>

</style>