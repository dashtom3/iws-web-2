<template>
  <div class="vfooter">
    <div class="footerCon">
      <span>Copyright&copy;2013-2014安徽舜禹水务股份有限公司版权所有</span>
      <span style="margin:0 50px;">皖ICP备10202683号</span>
      <span>传真：0551-66318181</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'vfooter',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.vfooter{
  position:fixed;
  bottom:0px;
  background: #000;
  height: 40px;
  line-height: 40px;
  width: 100%;
}
.footerCon{
  /* width: 1280px; */
  margin: 0 auto;
  text-align: center;
}
.footerCon span{
  color: #fff;
}
</style>
