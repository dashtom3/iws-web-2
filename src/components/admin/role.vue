<template>
  <div>
    <div class="content">
      <el-table
      :data="roleList"
      border
      style="width: 100%;">
      <el-table-column
        prop="name"
        label="角色名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="权限级别"
        width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.type == 1">管理员</span>
          <span v-if="scope.row.type == 0">普通用户</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="权限">
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="创建日期"
        width="180">
      </el-table-column>
      <el-table-column
        label="操作"
        width="180">
        <template slot-scope="scope">
          <el-button @click="change(scope.row)" type="text" >修改</el-button>
          <el-button @click="delete(scope.row)" type="text" >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="btn-role">
      <el-button @click="addRole" type="text"  >添加角色</el-button>
    </div>
  </div>
    <!-- <div class="btm">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="args.totalPage">
      </el-pagination>
    </div> -->
  </div>
</template>

<script>


export default {
  name: 'role',
  data () {
    return {
      roleList:null,
      // args:{
      //   pageNum:1,
      //   pageSize:10,
      //   totalPage:1
      // }
    }
  },
  created(){
    this.getRoleList();
  },
  methods:{
    getRoleList(){
      this.$global.httpGetWithToken(this,'role/all').then(res=>{
        console.log(res)
        this.roleList = res.data.data.data
        // this.args = res.data.data.page
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
.btn-role {
  position:absolute;
  top: 10px;
  right: 20px;

}
</style>
