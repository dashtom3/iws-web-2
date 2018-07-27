<template>
  <div class="login">
    <div class="loginCon" ref="contentHeight">
      <div class="h75">

      </div>
      <div class="loginMsg" v-show="msgLogin">
        <div class="w361">
          <div class="msgTitle">
            <h3>舜禹水务后台管理系统</h3>
          </div>
          <span class="w361_1">管理员帐号</span>
          <el-input v-model="userLoginMsg.username" placeholder="请输入账号"></el-input>
          <span class="w361_1">密码</span>
          <el-input v-model="userLoginMsg.password" placeholder="请输入密码" type="password" v-on:keyup.enter.native="login"></el-input>
          <el-button type="primary" style="width:100%;" v-on:click="login" class="login-btn">登录</el-button>
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
        this.$global.success(this,'登录成功',{name:'admin_user'})
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

<style scoped>
.el-form-item{
    margin: 0;
}
.login{
    height: 100vh;
    text-align: left;
}
.el-form-item__label {
  padding: 0px !important;
}

.loginCon{
  background-color: #3488FF;
  padding-top: 50px;
  /* padding-bottom: 20px; */
  height: 100%;
  width: 100%;
}
.h75{
  height: 30px;
}
.loginMsg{
  width: 500px;
  height: 500px;
  border-radius: 12px;
  background-color: rgb( 255, 255, 255 );
  opacity: 0.902;
  margin: 0 auto;
}
.w361{
  width: 361px;
  margin: 0px auto;
  padding-top: 50px;
}
.editloginMsg{
  width: 500px;
  height: 600px;
  border-radius: 12px;
  background-color: rgb( 255, 255, 255 );
  opacity: 0.902;
  margin: 0 auto;
  padding: 0;
}
.editdialog{
  width: 361px;
  margin: 0px auto;
  padding-top: 50px
}
.msgTitle{
  /* background: url('../../assets/loginTitle_03.png') no-repeat; */
  width: 288px;
  height: 60px;
  margin: 0px auto;
  text-align: center;
}
.editlogo{
  background: url('../../assets/loginTitle_03.png') no-repeat;
  width: 288px;
  height: 124px;
  margin: 0px auto;
}

.w361_1{
    float: left;
    display: block;
    margin: 20px 0 10px;
    font-size: 14px;
}
.goPhone{
  text-align: right;
}
.goRegister{
  text-align: right
}
.phoneLog{
  margin-top: 20px;
  width: 100%;
  margin-left: 0;
}
phoneLogButton{
  width: 100%;
}
a{
  color:#000;
}
.login-btn {
  margin-top: 30px;
}
</style>
