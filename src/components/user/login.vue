<template>
  <div class="login">
    <div class="loginCon" ref="contentHeight">
      <div class="h75"></div>
      <div class="loginMsg" v-show="msgLogin">
        <div class="w361">
          <div class="msgTitle"></div>
          <span class="w361_1">帐号</span>
          <el-input v-model="userLoginMsg.username" placeholder="请输入账号"></el-input>
          <span class="w361_1">密码</span>
          <el-input v-model="userLoginMsg.password" placeholder="请输入密码" type="password" v-on:keyup.enter.native="login"></el-input>
          <span class="goPhone"><a  v-on:click="goPhoneLogin" href="javascript:;">修改密码</a></span>
          <el-button type="primary" style="width:100%" v-on:click="login">登录</el-button>
          <span class="goRegister"><a href="javascript:;" v-on:click="goRegister">注册</a></span>
        </div>
      </div>
      <div class="editloginMsg" v-show="phoneLogin">
         <div class="editdialog">
          <div class="editlogo"></div>
          <el-form :label-position="labelPosition" label-width="80px" :rules="rules" ref="editMsg" :model="editMsg">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="editMsg.username"></el-input>
            </el-form-item>
            <el-form-item label="原密码" prop="oldpassword">
              <el-input v-model="editMsg.oldpassword"  placeholder="请输入验证码"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="password">
              <el-input v-model="editMsg.password" type="password"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="repassword">
              <el-input v-model="editMsg.repassword" type="password"></el-input>
            </el-form-item>
            <el-button type="primary" class="phoneLog" v-on:click="forgetPwd('editMsg')">确认</el-button>
            <!-- <p class="goRegister"><a href="javascript:;" v-on:click="goRegister">注册</a></p> -->
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import global from '../../global/global'
import axios from 'axios'
export default {
  data () {
    var username = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }
    var oldpassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入原密码'))
      } else {
        callback()
      }
    }
    var password = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.editMsg.repassword !== '') {
          this.$refs.editMsg.validateField('repassword')
        }
        callback()
      }
    }
    var repassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.editMsg.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      labelPosition: 'top',
      userLoginMsg: {
        username: '',
        password: ''
      },
      msgLogin: true,
      phoneLogin: false,
      editMsg: {
        username: '',
        oldpassword: '',
        password: '',
        repassword: ''
      },
      rules: {
        username: [{ validator: username, trigger: 'blur' }],
        oldpassword: [{ validator: oldpassword, trigger: 'blur' }],
        password: [{ validator: password, trigger: 'blur' }],
        repassword: [{ validator: repassword, trigger: 'blur' }]
      }
    }
  },
   mounted () {

  },
  methods: {
    goPhoneLogin: function () {
      this.msgLogin = false
      this.phoneLogin = true
    },
    goRegister: function () {
      this.$router.push({name:'register'})
    },
    // 登录发送请求
    login () {
      this.$global.httpPost(this,'user/login',this.userLoginMsg).then(res=>{
        // console.log(res)
        this.$global.setUser(res.data)
        // console.log(this.$global.getUser(),this.$global.getToken())
        this.$global.success(this,'登录成功',{name:'user_main'})
      })
    },
    // 忘记密码
    forgetPwd (formName) {
      this.$global.httpPost(this,'user/changePassword',this.editMsg).then(res=>{
        this.$global.success(this,'修改成功','')
        this.msgLogin = true
        this.phoneLogin = false
      })
    }
  },
  components: {

  }
}
</script>

<style>
.login .el-form-item{
    margin: 0;
}
.login{
    height: 100vh;
    text-align: left;
}
.login .el-form-item__label {
  padding: 0px !important;
}

.login .loginCon{
  background: url('../../assets/loginbg.png') no-repeat;
  background-size: cover;
  padding-top: 50px;
  /* padding-bottom: 20px; */
  height: 100%;
  width: 100%;
}
.login .h75{
  height: 30px;
}
.login .loginMsg{
  width: 500px;
  height: 600px;
  border-radius: 12px;
  background-color: rgb( 255, 255, 255 );
  opacity: 0.902;
  margin: 0 auto;
}
.login .w361{
  width: 361px;
  margin: 0px auto;
  padding-top: 50px;
}
.login .editloginMsg{
  width: 500px;
  height: 600px;
  border-radius: 12px;
  background-color: rgb( 255, 255, 255 );
  opacity: 0.902;
  margin: 0 auto;
  padding: 0;
}
.login .editdialog{
  width: 361px;
  margin: 0px auto;
  padding-top: 50px
}
.login .msgTitle{
  background: url('../../assets/loginTitle_03.png') no-repeat;
  width: 288px;
  height: 124px;
  margin: 0px auto;
}
.login .editlogo{
  background: url('../../assets/loginTitle_03.png') no-repeat;
  width: 288px;
  height: 124px;
  margin: 0px auto;
}
.login .w361>span{
  display: block;
  margin: 20px 0 10px;
  font-size: 14px;
}
.login .w361_1{
    float: left;
}
.login .goPhone{
  text-align: right;
}
.login .goRegister{
  text-align: right
}
.login .phoneLog{
  margin-top: 20px;
  width: 100%;
  margin-left: 0;
}
.login phoneLogButton{
  width: 100%;
}
.login a{
  color:#000;
}
</style>
