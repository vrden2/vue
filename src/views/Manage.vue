<template>
  <div class="home" style="height: 100%">
      <el-container style="height: 100vh;">
        <el-aside :width="sideWidth + 'px'" style="background-color: rgb(238, 241, 246); height: 100%; box-shadow: 2px 0 6px rgb(0 21 41 / 35%);">
          <Aside :isCollapse="isCollapse" :logoTextShow="logoTextShow" />
        </el-aside>

        <el-container>
          <!--line-height 属性设置行间的距离（行高）-->
          <el-header style="border-bottom: 1px solid #ccc; background-color: #F2F6FC">
            <Header :collapseBtnClass="collapseBtnClass" :collapse="collapse" />
          </el-header>

          <el-main>
            <router-view  />
          </el-main>

        </el-container>
      </el-container>
  </div>
</template>

<script>
// @ is an alias to /src
import Aside from "@/components/Aside";
import Header from "@/components/Header";

export default {
  name: 'HomeView',
  data() {
    const item = {
    };
    return {
      collapseBtnClass: 'el-icon-s-fold',
      isCollapse:false,
      sideWidth: 200,
      logoTextShow: true
    }
  },

  created() {

  },
  components: {
    Aside,
    Header
  },
  methods:{
    collapse(){
      this.isCollapse = !this.isCollapse
      this.logoTextShow = !this.isCollapse
      if(this.isCollapse) {
        this.sideWidth = 64
        this.collapseBtnClass = 'el-icon-s-unfold'
      }else{
        this.sideWidth = 200
        this.collapseBtnClass = 'el-icon-s-fold'
      }
    }
  }
}

</script>
