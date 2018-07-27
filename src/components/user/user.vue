<template>
    <div class="personalMsg" ref="contentHeight">
      <div class="personalDiv">
        <el-row :gutter="20">
          <el-col :span="4"><span class="nameIcon"></span></el-col>
          <el-col :span="10"><span>{{user.username}}</span></el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="4"><span class="phoneIcon"></span></el-col>
          <el-col :span="20"><el-input v-model=user.phone placeholder="请输入内容" class="cw whiteCo"></el-input>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="4"><span class="addrIcon"></span></el-col>
          <el-col :span="20"><el-input v-model=user.address placeholder="请输入内容" class="cw whiteCo"></el-input>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="4"><span class="infoIcon"></span></el-col>
          <el-col :span="20"><el-input v-model=user.realName placeholder="请输入内容" class="cw whiteCo"></el-input>
          </el-col>
        </el-row>
        <div style="text-align:center">
          <el-button class="qr" v-on:click="update">确定</el-button>
        </div>
      </div>
    </div>
</template>

<script>
// import header from './common/header'
// import footer from './common/footer'
export default {
  name: 'index',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      user:null,
    }
  },
  created () {
    this.getUserInfo()
  },
  methods: {
    getUserInfo(){
      this.user = this.$global.getUser()
    },
    update () {
      this.$global.httpPostWithToken(this,'user/update/'+this.user._id,this.user).then(res=>{
        console.log(res)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.cw{
  color: #fff;
}
.indexLog{
  float: left;
}
.navbar li{
  float: right;
  font-size: 18px;
  width: 151px;
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
.personalMsg{
  background: url('../../assets/personal.png');
  background-size: 100% 100%;
  -moz-background-size:100% 100%;
  width: 100%;
  margin: 0 auto;
  height: 100%;
}
.personalDiv{
  width: 420px;
  margin: 0px auto;
  padding: 200px 0;
}
.nameIcon,.phoneIcon,.addrIcon,.infoIcon{
  display: block;
  width: 44px;
  height: 48px;
  float: left;
}
.nameIcon{
  background: url('../../assets/user/name.png') no-repeat;
}
.phoneIcon{
  background: url('../../assets/user/phone.png') no-repeat;
}
.addrIcon{
  background: url('../../assets/user/ip.png') no-repeat;
}
.infoIcon{
  background: url('../../assets/user/discribe.png') no-repeat;
}
.el-row{
  margin: 40px 0;
  line-height: 48px;
  font-size: 18px;
  color: #fff;
}
.qr{
  border-radius: 4px;
  background-color: rgb( 255, 255, 255 );
  opacity: 0.6;
  width: 130px;
  height: 39px;
  margin: 0 auto;
  text-align: center;
}
</style>
