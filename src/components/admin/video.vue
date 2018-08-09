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
        label="监控列表">
        <template slot-scope="scope">
          <!-- <span v-if="scope.row.isWrite == 1">读写</span>
          <span v-if="scope.row.isWrite == 0">可读</span> -->
          <span v-for="video in scope.row.video">
            {{video.cameraName}},&nbsp;
          </span>
          <span v-if="scope.row.video == null || scope.row.video.length == 0">暂无监控</span>
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="create_time"
        label="创建日期"
        width="180">
      </el-table-column> -->
      <el-table-column
        label="操作"
        width="180">
        <template slot-scope="scope">
          <el-button @click="dialogUpdateVideo(scope.row)" type="text" >设置监控</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <el-dialog title="设置监控" :visible.sync="isVideoUpdate" class="role-add">
    <el-form :model="videoUpdate" v-if="videoUpdate != null">
      <el-form-item label="角色名称">
        <el-input v-model="videoUpdate.name" auto-complete="off" style="width:70%"></el-input>
      </el-form-item>
      <el-form-item label="角色类型">
        <el-select v-model="videoUpdate.type">
          <el-option label="普通用户" :value="0" ></el-option>
          <el-option label="管理员" :value="1" ></el-option>
        </el-select>
      </el-form-item>
      <div class="role-plc">
        <div class="role-tit">
          <span>监控选择</span>
        </div>
        <div>
          <div v-for="video in videoList" class="role-check">
                <input type="checkbox"   v-model="video.check"> {{video.cameraName}}
          </div>
        </div>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="isVideoUpdate = false">取 消</el-button>
      <el-button type="primary" @click="updateVideo">确 定</el-button>
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
      videoList:null,
      isVideoUpdate:false,
      videoUpdate:null
    }
  },
  created(){
    this.getVideoList();

  },
  methods:{
    getVideoList(){
      this.$global.httpGetWithToken(this,'video/all').then(res=>{
        console.log(res)
        this.videoList = res.data.list
        this.getRoleList();
        // this.args = res.data.data.page
      })
    },
    getRoleList(){
      this.$global.httpGetWithToken(this,'role/all').then(res=>{
        console.log(res)
        this.roleList = res.data.data
        // this.args = res.data.data.page
      })
    },
    dialogUpdateVideo(item){
      this.videoUpdate = item

      this.videoList.forEach(video=>{
          this.videoUpdate.video.forEach(video2=>{
            if(video2.cameraUuid == video.cameraUuid){
              video.check = true
            }
          })
      })
      this.isVideoUpdate = !this.isVideoUpdate
    },

    updateVideo(){
      var temp = []
      this.videoList.forEach(video=>{
          if(video.check){
            if(video.check == true){
              temp.push({cameraUuid:video.cameraUuid,cameraName:video.cameraName})
            }
          }
      })
      this.$global.httpPostWithToken(this,'video/updateByRole',{_id:this.videoUpdate._id,video:temp}).then(res=>{
        console.log(res)
        this.isVideoUpdate = !this.isVideoUpdate
        this.$global.success(this,'设置成功','')
        this.getRoleList()
      })
    },
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
