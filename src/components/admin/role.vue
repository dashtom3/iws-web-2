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
        prop="isWrite"
        label="读写权限">
        <template slot-scope="scope">
          <span v-if="scope.row.isWrite == 1">读写</span>
          <span v-if="scope.row.isWrite == 0">可读</span>
        </template>
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
          <el-button @click="dialogDetailRole(scope.row)" type="text" >地点详情</el-button>
          <el-button @click="dialogUpdateRole(scope.row)" type="text" >修改</el-button>
          <el-button @click="dialogDeleteRole(scope.row)" type="text" >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="btn-role">
      <el-button @click="dialogAddRole" type="text"  >添加角色</el-button>
    </div>
  </div>
  <el-dialog title="添加角色" :visible.sync="isRoleAdd" class="role-add">
    <el-form :model="roleAdd" >
      <el-form-item label="角色名称">
        <el-input v-model="roleAdd.name" auto-complete="off" style="width:70%"></el-input>
      </el-form-item>
      <el-form-item label="角色类型">
        <el-select v-model="roleAdd.type">
          <el-option label="普通用户" :value="0" ></el-option>
          <el-option label="管理员" :value="1" ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="读写权限">
        <el-select v-model="roleAdd.isWrite">
          <el-option label="可读" :value="0" ></el-option>
          <el-option label="读写" :value="1" ></el-option>
        </el-select>
      </el-form-item>
      <div class="role-plc">
        <div class="role-tit">
          <span>地点选择</span>
        </div>
        <div>
          <div v-for="sys in sysList" >
            <div class="role-blo">
              <span>{{sys.name}}</span> <input type="checkbox" v-model="sys.check" @click="allCheck(sys)"> 全选,取消
            </div>
            <div class="role-che">
                <!-- <el-checkbox v-for="loc in sys.location" v-model="loc.check" :label="loc.name"></el-checkbox> -->
              <div v-for="loc in sys.location" class="role-check">
                <input type="checkbox"   v-model="loc.check"> {{loc.name}}
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="isRoleAdd = false">取 消</el-button>
      <el-button type="primary" @click="addRole">确 定</el-button>
    </div>
  </el-dialog>
  <el-dialog title="修改角色" :visible.sync="isRoleUpdate" class="role-add">
    <el-form :model="roleUpdate" v-if="roleUpdate != null">
      <el-form-item label="角色名称">
        <el-input v-model="roleUpdate.name" auto-complete="off" style="width:70%"></el-input>
      </el-form-item>
      <el-form-item label="角色类型">
        <el-select v-model="roleUpdate.type">
          <el-option label="普通用户" :value="0" ></el-option>
          <el-option label="管理员" :value="1" ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="读写权限">
        <el-select v-model="roleUpdate.isWrite">
          <el-option label="可读" :value="0" ></el-option>
          <el-option label="读写" :value="1" ></el-option>
        </el-select>
      </el-form-item>
      <div class="role-plc">
        <div class="role-tit">
          <span>地点选择</span>
        </div>
        <div>
          <div v-for="sys in sysList">
            <div class="role-blo">
              <span>{{sys.name}}</span> <input type="checkbox" v-model="sys.check" @click="allCheck(sys)"> 全选,取消
            </div>
            <div class="role-che">
                <!-- <el-checkbox v-for="loc in sys.location" v-model="loc.check" :label="loc.name"></el-checkbox> -->
              <div v-for="loc in sys.location" class="role-check">
                <input type="checkbox"   v-model="loc.check"> {{loc.name}}
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="isRoleUpdate = false">取 消</el-button>
      <el-button type="primary" @click="updateRole">确 定</el-button>
    </div>
  </el-dialog>
  <el-dialog title="角色详情" :visible.sync="isRoleDetail" class="role-add">
    <el-form :model="roleDetail" v-if="roleDetail != null">
      <div class="role-plc">
        <div class="role-tit">
          <span>地点详情</span>
        </div>
        <div>
          <div v-for="sys in sysList">
            <div class="role-blo">
              <span>{{sys.name}}</span>
            </div>
            <div class="role-che">
              <div v-for="loc_id in roleDetail.location" class="role-check">
                <template v-for="loc in sys.location" v-if="loc._id == loc_id">
                  {{loc.name}},&nbsp;&nbsp;
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="isRoleDetail = false">确 定</el-button>
    </div>
  </el-dialog>
  <el-dialog title="确定删除该角色么？" :visible.sync="isRoleDelete" class="sys-add">
    <div slot="footer" class="dialog-footer">
      <el-button @click="isRoleDelete = false">取 消</el-button>
      <el-button type="primary" @click="deleteRole">确 定</el-button>
    </div>
  </el-dialog>
  </div>
</template>

<script>


export default {
  name: 'role',
  data () {
    return {
      roleList:null,
      sysList:null,

      isRoleAdd:false,
      isRoleDelete:false,
      isRoleUpdate:false,
      isRoleDetail:false,
      roleAdd:{
        type:0,
        name:null,
        isWrite:0,
        location_ids:[]
      },
      roleDetail:null,
      roleUpdate:null,
      roleDelete:null
    }
  },
  created(){
    this.getRoleList();

  },
  mounted(){
    this.getSystemList();
  },
  methods:{
    getRoleList(){
      this.$global.httpGetWithToken(this,'role/all').then(res=>{
        console.log(res)
        this.roleList = res.data.data
        // this.args = res.data.data.page
      })
    },
    dialogAddRole(){
      this.initSysChecked()
      this.isRoleAdd = !this.isRoleAdd
    },
    dialogDetailRole(item){
      this.roleDetail = item
      this.isRoleDetail = !this.isRoleDetail
    },
    dialogUpdateRole(item){
      this.roleUpdate = item

      this.sysList.forEach(sys=>{
        sys.location.forEach(loc=>{
          this.roleUpdate.location.forEach(loc_id=>{
            if(loc._id == loc_id){
              loc.check = true
            }
          })
        })
      })
      this.isRoleUpdate = !this.isRoleUpdate
    },
    dialogDeleteRole(item){
      this.roleDelete = item
      this.isRoleDelete = !this.isRoleDelete
    },
    deleteRole(){
      this.$global.httpGetWithToken(this,'role/delete/'+this.roleDelete._id).then(res=>{
        console.log(res)
        this.isRoleDelete = !this.isRoleDelete
        this.$global.success(this,'删除成功')
        this.getRoleList()
      })
    },
    addRole(){
      this.roleAdd.location_ids = []
      this.sysList.forEach(sys=>{
        sys.location.forEach(loc=>{
          if(loc.check){
            if(loc.check == true){
              this.roleAdd.location_ids.push(loc._id)
            }
          }
        })
      })
      this.$global.httpPostWithToken(this,'role/add',this.roleAdd).then(res=>{
        console.log(res)
        this.isRoleAdd = !this.isRoleAdd
        this.$global.success(this,'添加成功')
        this.getRoleList()
      })
    },
    updateRole(){
      this.roleUpdate.location_ids = []
      this.sysList.forEach(sys=>{
        sys.location.forEach(loc=>{
          if(loc.check){
            if(loc.check == true){
              this.roleUpdate.location_ids.push(loc._id)
            }
          }
        })
      })
      delete this.roleUpdate.location
      this.$global.httpPostWithToken(this,'role/update',this.roleUpdate).then(res=>{
        console.log(res)
        this.isRoleUpdate = !this.isRoleUpdate
        this.$global.success(this,'修改成功')
        this.getRoleList()
      })
    },
    getSystemList(){
      this.$global.httpGetWithToken(this,'system/system/all').then(res=>{
        console.log(res)
        // this.roleList = res.data.data.data
        // this.args = res.data.data.page
        this.sysList = res.data.data
        this.initSysChecked()
      })
    },
    initSysChecked(){
        this.sysList.forEach(sys=>{
          sys.location.forEach(loc=>{
            loc.check = false
          })
        })
    },
    allCheck(sys){
      console.log(sys)
      sys.location.forEach(item=>{
        item.check = !sys.check
      })
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
}
.btn-role {
  position:absolute;
  top: 10px;
  right: 20px;

}
.role-add {
  text-align: left;
}
.role-plc {
  /* border:1px solid #e6e6e6; */
}
.role-tit {
  border-bottom: 1px solid #e6e6e6;
}
.role-blo {
  /* border-bottom: 1px solid #e6e6e6; */
}
.role-blo span {
  background-color: #00CCFF;
  margin-left: 5px;
}
.role-che {
  min-height: 80px;
  border: 1px solid #e6e6e6;
  padding:5px;
}
.role-check {
  cursor:default;
  display: inline-block;
  margin:2px;
}
</style>
