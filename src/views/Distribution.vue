<template>
  <div>
    <div style="margin-bottom: 10px;">志愿者信息</div><div>
    <div style="margin-bottom: 10px">
      <span>查询：</span>
      <el-input style="width: 200px" placeholder="输入志愿者信息查询志愿者" suffix-icon="el-icon-search" v-model="searchVolunteer"></el-input>
      <el-button type="primary" style="margin-left: 20px" icon="el-icon-search" @click="handleVolunteerSearch">查询</el-button>
    </div>
  </div>
    <el-table :data="volunteerDatas" border stripe style="width: 901px">
      <el-table-column prop="id" label="ID" width="70"></el-table-column>
      <el-table-column prop="name" label="姓名" width="120"></el-table-column>
      <el-table-column prop="sex" label="性别" width="50"></el-table-column>
      <el-table-column prop="phone" label="电话" width="120"></el-table-column>
      <el-table-column prop="id_number" label="身份证号" width="220"></el-table-column>
      <el-table-column prop="address" label="地址" width="220"></el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="success" slot="reference" icon="el-icon-view" @click="loadElder(scope.row.id)">分配</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="padding: 10px 0">
      <el-pagination
          @size-change="handleVolunteerSizeChange"
          @current-change="handleVolunteerCurrentChange"
          :current-page="volunteerPageNum"
          :page-sizes="[10, 15, 20]"
          :page-size="5"
          layout="total, sizes, prev, pager, next, jumper"
          :total="volunteerTotal">
      </el-pagination>
    </div>

    <div v-show="isShow">
      <div style="margin-top: 30px;margin-bottom: 10px;">所负责的老人信息：共 {{elderTotal}} 条</div>
      <div style="margin-top: 10px; margin-bottom: 10px">
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
      <el-table :data="elderDatas" border stripe style="width: 941px" @selection-change="handleSelectionChange">
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
      <div style="padding: 10px 0">
        <el-pagination
            @size-change="handleElderSizeChange"
            @current-change="handleElderCurrentChange"
            :current-page="elderPageNum"
            :page-sizes="[10, 15, 20]"
            :page-size="5"
            layout="total, sizes, prev, pager, next, jumper"
            :total="elderTotal">
        </el-pagination>
      </div>
    </div>
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
      phone: '16666666666',
      id_number: '320101199912311234',
      address: '上海市普陀区金沙江路 1518 弄'
    };
    return {
      isShow: true,
      searchVolunteer: "",
      // volunteerData: [],
      volunteerDatas: Array(10).fill(volunteer),
      selectedVolunteer: 0,
      // elderDatas: [],
      elderDatas: Array(10).fill(elder),
      volunteerPageSize: 10,
      elderPageSize: 10,
      volunteerPageNum: 1,
      elderPageNum: 1,
      volunteerTotal: 0,
      elderTotal: 0,
      addElderID: "",
      multipleSelection: []
    }
  },
  created() {
    this.loadVolunteer()
  },
  methods: {
    loadVolunteer() {
      this.request.post("/volunteer/page", {
        params: {
          pageNum: this.volunteerPageNum,
          pageSize: this.volunteerPageSize,
          condition: this.searchVolunteer
        }}).then(res => {
        if (res) {
          console.log(res.data)
          this.volunteerDatas = res.data.records
          this.volunteerTotal = res.data.total
        } else
          this.$message.error("加载志愿者信息失败")
      })
    },
    loadElder(volunteerId) {
      this.request.post("/distribution/page", {
        params: {
          id: volunteerId,
          pageNum: this.elderPageNum,
          pageSize: this.elderPageSize,
        }}).then(res => {
        if (res) {
          console.log(res.data)
          this.volunteerDatas = res.data
          this.volunteerTotal = res.data.total
          this.selectedVolunteer = volunteerId
          this.isShow = true
        } else
          this.$message.error("加载老人信息失败")
      })
    },
    handleVolunteerSearch() {
      this.request.post("/volunteer/search", {
        params: {
          condition: this.searchVolunteer
        }}).then(res => {
        if (res) {
          console.log(res.data)
          this.volunteerData = res.data
          this.volunteerTotal = res.data.total
          // this.isShow = true
        } else
          this.$message.error("未找到此志愿者，请重新输入")
      })
    },
    handleVolunteerSizeChange(pageSize){
      this.volunteerPageSize = pageSize
      this.loadVolunteer()
    },
    handleVolunteerCurrentChange(pageNum){
      this.volunteerPageNum = pageNum
      this.loadVolunteer()
    },
    handleElderSizeChange(pageSize){
      this.elderPageSize = pageSize
      this.load()
    },
    handleElderCurrentChange(pageNum){
      this.elderPageNum = pageNum
      this.load()
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
      this.request.post("/distribution/del/batch", {
        params: {
          ids: ids,
          volunteerId: this.selectedVolunteer
        }
      }).then(res => {
        if(res.data) {
          this.$message.success("批量移除成功")
          this.handleSearch()
        } else {
          this.$message.error("批量移除失败")
        }
      })
    },
    handleDeleteFromVolunteerHelpers(id) {
      this.request.post("/distribution/del", {
        params: {
          id: id,
          volunteerId: this.selectedVolunteer
        }
      }).then(res => {
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