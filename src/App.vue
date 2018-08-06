<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
  height: 100vh;
  /* position:relative; */
}
* { padding: 0; margin: 0; outline: 0; }
body {
  background-color: #e6e6e6;
}
.el-tree-node__content {
  border-bottom:1px solid #cccccc;
  height: 34px;
  background-color: #283040;
  color:#ffffff;
}
.el-tree-node__content {
}
.el-tree-node:focus>.el-tree-node__content{
  background-color: #32ABEE !important;
}
.el-tree-node__content:hover{
  background-color: #32ABEE !important;
}
</style>
