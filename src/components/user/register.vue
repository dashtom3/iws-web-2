<template>
  <div class="register">
    <div class="registerdCon" ref="contentHeight">
      <div class="h75"></div>
      <div class="registerMsg">
         <div class="registerdialog">
          <div class="registertlogo"></div>
          <el-form :label-position="labelPosition" label-width="80px" :rules="rules" ref="registerMsg" :model="registerMsg" v-show="prev">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="registerMsg.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="registerMsg.password" type="password"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="repassword">
              <el-input v-model="registerMsg.repassword" type="password"></el-input>
            </el-form-item>
            <el-button type="primary" class="phoneLog" v-on:click="nextStep('registerMsg')">下一步</el-button>
          </el-form>
          <el-form :label-position="labelPosition" label-width="80px" :rules="rules" :model="registerMsg" v-show="next">
            <el-form-item label="手机号码">
              <el-input v-model="registerMsg.phone"></el-input>
            </el-form-item>
            <el-form-item label="地址">
              <el-input v-model="registerMsg.address"></el-input>
            </el-form-item>
            <el-form-item label="描述">
              <el-input v-model="registerMsg.describe"></el-input>
            </el-form-item>
            <el-button type="primary" class="registerbutton" style="width:100%" @click="register">注册</el-button>
            <p class="goRegister"><a href="javascript:;" v-on:click="goLogin">登录</a></p>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import global from '../../global/global'
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
    var phone = (rule, value, callback) => {
      if (value === '') {
        callback()
      } else if (!(/^1[34578]\d{9}$/.test(value))) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    var password = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.registerMsg.repassword !== '') {
          this.$refs.registerMsg.validateField('repassword')
        }
        callback()
      }
    }
    var repassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.registerMsg.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      prev: true,
      next: false,
      labelPosition: 'top',
      registerMsg: {
        username: '',
        oldpassword: '',
        password: '',
        repassword: '',
        phone:'',
        address:'',
        describe:''
      },
      rules: {
        username: [{ validator: username, trigger: 'blur' }],
        phone: [{ validator: phone, trigger: 'blur' }],
        password: [{ validator: password, trigger: 'blur' }],
        repassword: [{ validator: repassword, trigger: 'blur' }]
      }
    }
  },
   mounted () {

  },
  methods: {
    goRegister: function () {
      this.$router.push('/user/register')
    },
    register(){

    },
    goLogin(){

    },
    // 注册下一步
    nextStep (formName) {
     this.$refs[formName].validate((valid) => {
        if (valid) {
          this.prev = false
          this.next = true
        } else {
          return false
        }
      })
    }
  },
  components: {

  }
}
</script>

<style>
.el-form-item{
    margin: 0;
    padding-bottom: 10px;
}
.register{
    height: 100vh;
    text-align: left;
}
.el-form-item__label {
  padding: 0px !important;
}
.registerdCon{
  background: url('../../assets/loginbg.png') no-repeat;
  background-size: cover;
  padding-top: 50px;
  height: 100%;
  width: 100%;
}
.h75{
  height: 75px;
}
.registerMsg{
  width: 500px;
  height: 550px;
  border-radius: 12px;
  background-color: rgb( 255, 255, 255 );
  opacity: 0.902;
  margin: 0 auto;
  padding: 0;
}
.registerdialog{
  width: 361px;
  margin: 0px auto;
  padding-top: 50px
}
.registertlogo{
  background: url('../../assets/loginTitle_03.png') no-repeat;
  width: 288px;
  height: 124px;
  margin: 0px auto;
}

.goRegister{
  padding-top: 15px;
  text-align: right
}
.registerbutton{
  margin-top: 20px
}
.phoneLog{
  margin-top: 20px;
  width: 100%;
  margin-left: 0;
}
a{
  color:#000;
}
</style>
