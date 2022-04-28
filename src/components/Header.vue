<template>
  <div style="font-size: 12px; line-height: 60px; display: flex">

    <div style="flex: 1; font-size: 20px;">
      <span :class="collapseBtnClass" style="cursor: pointer" @click="collapse"></span>

      <el-breadcrumb separator="/" style="display: inline-block; margin-left: 20px;">
        <el-breadcrumb-item :to="{ path: '/'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{ currentPathName }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-dropdown size="medium" style="text-align: right; cursor: pointer; margin-right: 10px">
      <div>
        <i class="el-icon-user"></i><span>{{ user.name }}</span><i class="el-icon-arrow-down" style="margin-left: 5px"></i>
      </div>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>
          <span style="text-decoration: none" @click="handleLogout">退出</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

  </div>
</template>
<script>
export default {
  name: "Header",
  props: {
    collapseBtnClass: String,
    collapse: Function,
  },
  created() {
    this.currentPathName = localStorage.getItem("currentPathName")
    this.juaew()
  },
  watch: {
    '$route': function () {
      this.currentPathName = localStorage.getItem("currentPathName")
    }
  },
  data() {
    return {
      currentPathName:"首页",
      user: sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user")) : {}
    }
  },
  methods: {
    juaew() {
      if (this.user == null) {
        this.$router.push("/login")
      }
    },
    handleLogout() {
      this.$router.push("/login")
      sessionStorage.removeItem("user")
      this.$message.success("退出成功")
    }
  }
}
</script>

<style scoped>

</style>