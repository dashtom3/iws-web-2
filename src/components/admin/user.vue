<template>
  <div>
    <div class="content">
      <el-table
      :data="userList"
      border
      style="width: 100%;">
      <el-table-column
        prop="username"
        label="用户名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="realname"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="address"
        label="常用地址">
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="注册日期"
        width="180">
      </el-table-column>
      <el-table-column
        prop="role.name"
        label="角色"
        width="180">
      </el-table-column>
      <el-table-column
        label="操作"
        width="180">
        <template slot-scope="scope">
          <el-button @click="delete(scope.row)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
    <div class="btm">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="args.totalPage">
      </el-pagination>
    </div>
  </div>
</template>

<script>

export default {
  name: 'user',
  data () {
    return {
      userList:null,
      args:{
        pageNum:1,
        pageSize:10,
        totalPage:1
      }
    }
  },
  created(){
    this.getUserList();
  },
  methods:{
    getUserList(){
      this.$global.httpGetWithToken(this,'user/all',this.args).then(res=>{
        console.log(res)
        this.userList = res.data.data.data
        this.args = res.data.data.page
      })
    }
  }
}
</script>

<style>
.btm {
  position: absolute;
  right: 10px;
  bottom:10px;
}
.content {
  text-align: left;
  padding:5px;
  margin-bottom: 60px;
}

</style>
