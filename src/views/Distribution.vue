<template>
  <div>
    <div>
      <span>请输入志愿者ID：</span>
      <el-input style="width: 200px" placeholder="输入志愿者ID" suffix-icon="el-icon-search" v-model="volunteerId"></el-input>
      <el-button type="primary" style="margin-left: 20px" @click="handleSearch">确定</el-button>
    </div>

    <div style="margin-top: 30px;margin-bottom: 10px;margin-left: 10px" v-show="isShow">志愿者信息</div>
    <el-table :data="volunteerData" border stripe v-show="isShow" style="width: 801px">
      <el-table-column prop="id" label="ID" width="70"></el-table-column>
      <el-table-column prop="name" label="姓名" width="120"></el-table-column>
      <el-table-column prop="sex" label="性别" width="50"></el-table-column>
      <el-table-column prop="phone" label="电话" width="120"></el-table-column>
      <el-table-column prop="id_number" label="身份证号" width="220"></el-table-column>
      <el-table-column prop="address" label="地址" width="220"></el-table-column>
    </el-table>

    <div style="margin-top: 30px;margin-bottom: 10px;margin-left: 10px" v-show="isShow">所负责的老人信息：共 {{elderTotal}} 条</div>
    <div style="margin-top: 10px; margin-bottom: 10px" v-show="isShow">
      <el-input style="width: 200px" placeholder="输入老人ID" suffix-icon="el-icon-search" v-model="addElderID"></el-input>
      <el-button type="primary" style="margin-left: 20px" icon="el-icon-circle-plus-outline" @click="handleAddElderID">添加</el-button>
      <el-popconfirm
          style="margin-left: 10px"
          confirm-button-text='确定'
          cancel-button-text='我再想想'
          icon="el-icon-info"
          icon-color="red"
          title="确定进行批量移除？"
          @confirm="delBatch"
      >
        <el-button type="danger" slot="reference" icon="el-icon-delete">批量移除</el-button>
      </el-popconfirm>
    </div>
    <el-table :data="elderDatas" border stripe v-show="isShow" style="width: 941px" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column prop="id" label="ID" width="70"></el-table-column>
      <el-table-column prop="name" label="姓名" width="120"></el-table-column>
      <el-table-column prop="sex" label="性别" width="50"></el-table-column>
      <el-table-column prop="phone" label="电话" width="120"></el-table-column>
      <el-table-column prop="id_number" label="身份证号" width="220"></el-table-column>
      <el-table-column prop="address" label="地址" width="220"></el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-popconfirm
              style="margin-left: 5px"
              confirm-button-text='确定'
              cancel-button-text='我再想想'
              icon="el-icon-info"
              icon-color="red"
              title="确定将其从此管理员负责名单中移除？"
              @confirm="handleDeleteFromVolunteerHelpers(scope.row.id)"
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
  name: "Distribution",
  data() {
    const volunteer = {
      id: '1',
      name: '王小虎',
      sex: '男',
      isAdmin: '是',
      phone: '16666666666',
      id_number: '320101199912311234',
      address: '上海市普陀区金沙江路 1518 弄'
    };
    const elder = {
      id: '1',
      name: '王小虎',
      sex: '男',
      isAdmin: '是',
      phone: '16666666666',
      id_number: '320101199912311234',
      address: '上海市普陀区金沙江路 1518 弄'
    };
    return {
      isShow: true,
      volunteerId: "",
      // volunteerData: [],
      volunteerData: Array(1).fill(volunteer),
      // elderDatas: [],
      elderDatas: Array(10).fill(elder),
      elderTotal: 0,
      addElderID: "",
      multipleSelection: []
    }
  },
  methods: {
    handleSearch() {
      this.request.post("/distribution/search", {
        params: {
          volunteerId: this.volunteerId
        }}).then(res => {
        if (res) {
          console.log(res.data)
          this.volunteerData = res.data.volunteerData
          this.elderDatas = res.data.elderDatas
          this.isShow = true
        } else
          this.$message.error("未找到此志愿者，请重新输入ID")
      })
    },
    handleAddElderID() {
      this.request.post("/distribution/add", {
        params: {
          volunteerId: this.volunteerData.volunteerId,
          addElderID: this.addElderID
        }}).then(res => {
          if (res) {
            console.log(res.data)
            this.elderDatas = res.data.elderDatas
          } else this.$message.error("未找到对应老人，请重新输入ID")
        })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    delBatch() {
      let ids = this.multipleSelection.map(v => v.id)
      this.request.post("/distribution/del/batch", ids).then(res => {
        if(res.data) {
          this.$message.success("批量移除成功")
          this.handleSearch()
        } else {
          this.$message.error("批量移除失败")
        }
      })
    },
    handleDeleteFromVolunteerHelpers(id) {
      this.request.post("/distribution/del", id).then(res => {
        if(res.data) {
          this.$message.success("移除成功")
          this.handleSearch()
        } else {
          this.$message.error("移除失败")
        }
      })
    }
  }
}
</script>

<style scoped>

</style>