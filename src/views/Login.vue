<template>
  <div class="wrapper">
    <div style="margin: 200px auto; background-color: #fff; width: 350px; height: 400px; padding: 20px; border-radius: 10px">
      <div style="margin: 20px 0; text-align: center; font-size: 24px"><b>登 录</b></div>
      <el-form :model="user" :rules="rules" ref="userForm">
        <el-form-item prop="username">
          <el-input placeholder="用户名" size="medium" style="margin: 10px 0;" prefix-icon="el-icon-user" v-model="user.name" clearable></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input placeholder="密码" size="medium" style="margin: 10px 0;" prefix-icon="el-icon-lock" show-password v-model="user.password" clearable></el-input>
        </el-form-item>
        <el-form-item prop="vfCode">
          <el-input placeholder="验证码" size="medium" style="margin: 10px 0; width: 150px" prefix-icon="el-icon-lock" show-password v-model="user.password" clearable></el-input>
          <span>
            <el-button style="">www</el-button>
          </span>
        </el-form-item>
        <el-form-item style="margin: 10px 0; text-align: center">
          <el-button type="primary" size="large" style="width: 300px" autocomplete="off" @click="handleLogin">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      user: {},
      rules: {
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 0, max: 16, message: '长度不超过 16 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleLogin() {
      this.$refs['userForm'].validate((valid) => {
        if (valid) {
          this.request.post("/volunteer/login", this.user).then(res => {
            if (res.code === 1) {
              sessionStorage.setItem("user", JSON.stringify(res.data))
              this.$router.push("/home")
              this.$message.success("登陆成功")
            } else {
              this.$message.error("用户名或密码错误")
            }
          })
        } else {
          return false
        }
      })
    }
    }
}
</script>

<style scoped>
  .wrapper {
    /*窗口高度*/
    height: 100vh;
    /*渐变色*/
    background-image: linear-gradient(to bottom right, #f0f0f0, #6BCBCA);
    overflow: hidden;
  }
</style>