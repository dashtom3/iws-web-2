<template>
  <div class="index">
    <div class="top">
      <h3>舜禹水务后台管理系统</h3>
    </div>
    <div class="container">
      <div class="left">
        <el-menu
          border
          default-active="1"
          class="el-menu-vertical-demo">
          <el-menu-item :index="index+1+''" v-for="item,index in data" @click="clickDocker(item)">
            <!-- <i class="el-icon-menu"></i> -->
            <span slot="title">{{item[0]}}</span>
          </el-menu-item>
        </el-menu>
      </div>
      <div class="title">
        <span>{{data[title][0]}}</span>
      </div>
      <div class="right">
        <router-view/>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'app',
  data () {
    return {
      data:[['用户管理','admin_user'],['角色管理','admin_role'],['系统管理','admin_system'],['点表管理','admin_point'],['用户管理','admin_user'],['用户管理','admin_user'],['用户管理','admin_user']],
      title:0,
    }
  },
  watch: {
    '$route': function () {
      // this.pathName = this.$route.name
      this.setDocker()
    }
  },
  created(){
    // this.$router.push({name:this.data[0][1]})
    this.setDocker()
  },
  methods: {
    clickDocker(val){
      console.log(val)
      this.$router.push({name:val[1]})
    },
    setDocker(){
      this.data.forEach((item,index)=>{
        if(item[1] == this.$route.name){
          this.title = index
        }
      })
    }
  }
}
</script>

<style>
body {
  background-color: #F0F0F0;
}
.container {
  width: 1200px;
  margin:0px auto;
  position:absolute;
  bottom:10px;
  top: 60px;
  left: 50%;
  margin-left: -600px;
}
.left {
  margin: 10px;
  width:200px;
  border:1px solid #E0E0E0;
  float: left;
}
.top {
  width: 100%;
  height: 60px;
  background-color: #3488FF;
  text-align: left;
}
.top h3 {
  color: white;
  padding-left: 10px;
  padding-top: 10px;
  /* padding-bottom: 10px; */
}
.title {
  padding-top: 20px;
  text-align: left;
  margin-left: 230px;
  height: 40px;
}
.title span{
  font-size: 24px;
}
.right {
  min-height: 90%;
  width: 900px;
  margin-top: 10px;
  float:left;
  background-color: #fff;
  position: relative;
}
thead {
  color: #000000 !important;
}
.el-table{
  color: #000000 !important;
}
</style>
