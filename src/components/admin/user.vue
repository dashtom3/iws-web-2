<template>
  <div>
    <div class="content">
      <el-table
      :data="userList"
      border
      style="width:100%;">
      <el-table-column
        prop="username"
        label="用户名">
      </el-table-column>
      <el-table-column
        prop="realName"
        label="姓名">
      </el-table-column>
      <el-table-column
        prop="phone"
        label="手机号">
      </el-table-column>
      <el-table-column
        prop="address"
        label="常用地址">
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="注册日期">
      </el-table-column>
      <el-table-column
        label="角色">
        <template slot-scope="scope">
          <el-select v-model="scope.row.role" @change="changeRole(scope.row)">
            <el-option :label="roler.name" :value="roler._id" :key="roler._id" v-for="roler in roleList"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button @click="dialogUserDelete(scope.row)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="btn-role">
      <el-button @click="dialogAddUser" type="text"  >添加用户</el-button>
    </div>
  </div>
  <el-dialog title="添加用户" :visible.sync="isUserAdd" class="role-add">
    <el-form :model="userAdd" >
      <el-form-item label="用户名">
        <el-input v-model="userAdd.username" auto-complete="off" style="width:70%"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="userAdd.password" auto-complete="off" style="width:70%"></el-input>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="userAdd.realName" auto-complete="off" style="width:70%"></el-input>
      </el-form-item>
      <el-form-item label="手机号码">
        <el-input v-model="userAdd.phone" auto-complete="off" style="width:70%"></el-input>
      </el-form-item>
      <el-form-item label="地址">
        <el-input v-model="userAdd.address" auto-complete="off" style="width:70%"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="isUserAdd = false">取 消</el-button>
      <el-button type="primary" @click="addUser">确 定</el-button>
    </div>
  </el-dialog>
  <el-dialog title="确定删除该用户么？" :visible.sync="isUserDelete" class="sys-add">
    <div slot="footer" class="dialog-footer">
      <el-button @click="isUserDelete = false">取 消</el-button>
      <el-button type="primary" @click="deleteUser">确 定</el-button>
    </div>
  </el-dialog>
    <div class="btm">
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change = "pageChange"
        :current-page="parseInt(args.pageNum)"
        :page-count="args.totalPage">
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
      },
      userAdd:{
        username:null,
        password:null,
        realName:null,
        phone:null,
        address:null,
      },
      isUserDelete:false,
      isUserAdd:false,
      userDelete:null,
    }
  },
  created(){
    this.getUserList();
    this.getRoleList();
  },
  methods:{
    dialogUserDelete(item){
      this.userDelete = item
      this.isUserDelete = !this.isUserDelete
    },
    deleteUser(){
      this.$global.httpGetWithToken(this,'user/delete/'+this.userDelete._id).then(res=>{
        this.$global.success(this,'删除成功','')
        this.isUserDelete = !this.isUserDelete
        this.getUserList();
      })
    },
    getUserList(){
      this.$global.httpGetWithToken(this,'user/all',this.args).then(res=>{
        console.log(res)
        this.userList = res.data.data
        this.args = res.data.page
      })
    },
    getRoleList(){
      this.$global.httpGetWithToken(this,'role/all').then(res=>{
        console.log(res)
        this.roleList = res.data.data
        // this.args = res.data.data.page
      })
    },
    dialogAddUser(){
      this.isUserAdd = !this.isUserAdd
    },
    addUser(){
      this.$global.httpPost(this,'user/register',this.userAdd).then(res=>{
        console.log(res)
        this.isUserAdd = !this.isUserAdd
        this.getUserList()
        this.$global.success(this,'添加成功','')
      })
    },
    changeRole(item){
      console.log(item)
      this.$global.httpGetWithToken(this,'user/updateRole/'+item._id,{roleId:item.role}).then(res=>{
        console.log(res)
        this.$global.success(this,'修改成功','')
      }).catch(()=>{
        this.$global.error(this,'修改失败','')
        this.getUserList()
      })
    },
    pageChange(val){
      this.args.pageNum = val
      this.getUserList()
    }
  }
}
</script>

<style scoped>
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
