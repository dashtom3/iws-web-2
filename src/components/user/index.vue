<template>
  <div class="hello">
      <v-header></v-header>
      <div class="index">
        <div class="indexHeader">
          <div class="indexLog">
            <a href="/index"><img src="../../assets/logo.png" alt=""></a>
          </div>
          <div class="indexNav">
            <el-menu :default-active="activeIndex" class="el-menu-demo navbar" mode="horizontal" router>
              <el-menu-item v-for="item in data" :index="item[1]">{{item[0]}}</el-menu-item>
            </el-menu>
          </div>
        </div>
        <div class="main-view">
          <router-view></router-view>
        </div>
      </div>
      <v-footer class="vfooter"></v-footer>
  </div>
</template>

<script>
import header from '../common/header'
import footer from '../common/footer'
export default {
  name: 'app',
  data () {
    return {
      activeIndex: this.$route.path,
      data:[['首页','/user/main'],['数据查看','/user/data'],['报警信息','/user/alarm'],['视频监控','/user/video'],['个人中心','/user/user']]
    }
  },

  created(){
    var self = this
    this.$nextTick(function () {
      self.activeIndex = self.$route.path
    })
  },
  methods: {

  },
  components: {
    'v-header': header,
    'v-footer': footer
  }
}
</script>

<style>
.hello {
  width: 100%;
}
.indexHeader{
  width:100%;
  height: 71px;
  margin: 0 auto 10px;
  background-color: white;
  border-bottom: 1px solid #e6e6e6;
}
.indexLog{
  float: left;
  margin-left: 20px;
}
.indexLog img {
  height: 60px;
}
.leftNav{
  width: 320px;
  margin-right: 10px;
  float: left;
}
.navbar{
  background-color: #fff!important;
  float: right;
  height: 71px;
  line-height: 71px;
}
.navbar li{
  float: right;
  font-size: 18px;
  width: 120px;
  text-align: center;
  margin:0 40px;
}
.navbar li:hover{
  cursor: pointer;
}
.navbar li.active{
  color: rgb(20,135,202);
  border-bottom: 4px solid;
}
.el-menu--horizontal .el-menu-item{
  height: 71px!important;
  line-height: 71px!important;
}
.el-menu-item.is-active{
  border-bottom: 4px solid rgb( 20, 135, 202 );
  color:rgb(20,135,202);
}
.el-menu-item:hover{
  border-bottom: 4px solid rgb( 20, 135, 202 )!important;
  background-color: none!important;
}
.main-view {
  position:absolute;
  width: 100%;
  top:110px;
  bottom:40px;
}
</style>
