<template>
  <div class="index">
    <div class="top">
      <div>
        <h3>舜禹水务后台管理系统</h3>
      </div>
      <div v-if="user!=null" class="top-right">
        <span>您好,{{user.realName}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <el-button type="text" @click="logout">退出</el-button>
      </div>
    </div>
    <div class="admin-container">
      <div class="admin-left">
        <el-menu
          border
          default-active="1"
          class="el-menu-vertical-demo">
          <el-menu-item :index="index+1+''" v-for="item,index in data" @click="clickDocker(item,index)">
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
      data:[['用户管理','admin_user'],['角色管理','admin_role'],['系统管理','admin_system'],['点表管理','admin_point'],['签到管理','admin_sign'],['跳转主页','user/main'],['历史数据','user/data'],['报警管理','user/alarm']],
      title:0,
      user:null,
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
    this.getAdminInfo()
  },
  methods: {
    getAdminInfo(){
      this.user = this.$global.getUser()
      if(this.user){
        if(this.user.role.type != 1){
          this.$global.error(this,'权限不足','/admin_login')
        }
      }else {
        this.$global.error(this,'权限不足','/admin_login')
      }
    },
    logout(){
      this.$router.push({name:'admin_login'})
    },
    clickDocker(val,index){
      console.log(val)
      if(index >= 5){
        window.open("/#/"+val[1],'_blank')
      } else {
        this.$router.push({name:val[1]})
      }

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

<style type="text/css" scoped>
.admin-container {
  width: 1200px;
  /* width:100%; */
  margin:0px auto;
  position:absolute;
  bottom:10px;
  top: 60px;
  left: 50%;
  margin-left: -600px;
}
.top-right {
  float: right;
  margin-right: 10px;
  margin-top: -30px;
}
.top-right .el-button {
  color:#b6b6b6;
}
.top-right span{
  color: #fff;
}
.admin-left {
  margin: 10px;
  width:15%;
  border:1px solid #E0E0E0;
  float: left;
}
.top {
  width: 100%;
  height: 50px;
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
  width: 70%;
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
