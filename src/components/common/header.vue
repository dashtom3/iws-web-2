<template>
  <div class="vhead">
    <div class="headCon">
      <div class="headLeft">
        <span>欢迎来到舜禹水务</span>
      </div>
      <div class="headRight">
        <span v-if="isLogin" class="use">您好,{{username}}</span>
        <span v-if="isLogin" class="use" @click="exit">退出</span>
        <span class="about" @click="goToAboutUs" >关于我们 </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'vhead',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      isShow: true,
      isLogin: false
    }
  },
  created () {
    if (this.$global.getToken()) {
      this.isShow = false
      this.isLogin = true
      this.username = this.$global.getUser().username
    } else {
      this.isShow = true
      this.isLogin = false
    }
  },
  methods: {
    exit () {
      this.$global.success(this, '退出成功', '/login')
    },
    goToAboutUs(){
      this.$router.push({name:'user_about'})
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.vhead{
  /* background-color: rgb( 0, 0, 0 ); */
  background-color: #283040;
  height: 40px;
  line-height: 40px;
  min-width: 1150px;
}
.headCon{
  width: 100%;
  margin: 0 auto;
}
.headCon a{
  color: #fff;
}
.headLeft{
  float: left;
}
.headLeft span {
  color:#fff;
  margin-left: 15px;
}
.headRight{
  float: right;
  margin-right: 20px;
}
.about{
  margin-left: 50px;
  color: #fff;
  cursor: pointer;
}
.use{
  color: #fff;
  margin-right: 10px;
}
.use:hover{
  cursor: pointer;
}
</style>
