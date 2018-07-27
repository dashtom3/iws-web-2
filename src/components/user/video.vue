<template>
  <div class="videos">
    <div class="video-main">
      <div class="video-top">
        <h2>视频区</h2>
        <div class="vid-top-rig" @click="dialogEditVideo">
          <el-button type="primary" icon="el-icon-edit" circle></el-button>
        </div>
      </div>
      <div class="video-content">
        <div v-if="videoList == null || videoList.length == 0">
          <h1>暂无监控视频，请点击右上角添加</h1>
        </div>
        <div v-else style="text-align:left">
          <div v-for="item in videoList" class="video-blocktop">
            <iframe name="videoFrame" frameborder="no" border="0" marginwidth="0" marginheight="0" scrolling="no" allowtransparency="yes" src="/static/video.html" :id="item.cameraUuid" ></iframe>
            <div class="video-center">
              {{item.cameraName}}
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="选择监控" :visible.sync="isVideoEdit" class="video-edit">
      <div>
        <div>
          <h4>监控列表</h4>
        </div>
        <div>
          <div v-for="item in allVideoList" class="video-edit-che">
            <input type="checkbox"   v-model="item.checked"> {{item.cameraName}}
            <!-- <el-checkbox v-model="item.checked">{{item.cameraName}}</el-checkbox> -->
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isVideoEdit = false">取 消</el-button>
        <el-button type="primary" @click="editVideo">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'videolist',
  data () {
    return {
      videoList:null,
      allVideoList:null,
      isVideoEdit:false,
      object:null,
      videoEntity:[],
    }
  },
  created(){
    this.getMyVideoList()
  },
  methods: {
    getMyVideoList(){
      this.$global.httpGetWithToken(this,'video/my').then(res=>{
        console.log(res)
        this.videoList = res.data
        this.setVideoCheckBox()
        this.$nextTick(function () {
          this.videoList.forEach(item=>{
            document.getElementById(item.cameraUuid).src="/static/video.html";
          })
        })
      })
    },
    getVideoList(){
      if(this.allVideoList == null) {
        this.$global.httpGetWithToken(this,'video/all').then(res=>{
          console.log(res)
          this.allVideoList = res.data.list
          this.setVideoCheckBox()
          this.isVideoEdit = !this.isVideoEdit
        })
      } else {
        console.log(this.allVideoList)
        this.isVideoEdit = !this.isVideoEdit
      }
    },
    setVideoCheckBox(){
      if(this.allVideoList != null) {
        this.allVideoList.forEach(item=>{
          item.checked = false
          this.videoList.forEach(item2=>{
            if(item.cameraUuid == item2.cameraUuid){
              item.checked = true
            }
          })
        })
      }
    },
    dialogEditVideo(){
      this.getVideoList()
    },
    editVideo(){
      this.videoEntity = []
      this.allVideoList.forEach(item=>{
        if(item.checked == true){
          this.videoEntity.push({cameraName:item.cameraName,cameraUuid:item.cameraUuid})
        }
      })
      this.$global.httpPostWithToken(this,'video/update',{video:this.videoEntity}).then(res=>{
        this.$global.success(this,'更新成功','')
        this.getMyVideoList()
        this.isVideoEdit = !this.isVideoEdit
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.videos {
  width: 100%;min-height: 100%;
  background-color: #fff;
}
.video-main {
  text-align: left;
  width: 910px;
  margin: auto auto;
  padding-bottom: 20px
}
.video-top {
  padding-top: 10px;
}
.vid-top-rig {
  float: right;
  margin-top: -30px;
}
.video-content {
  min-height: 300px;
  margin-top: 20px;
  border: 1px solid #e6e6e6;
  text-align: center;
}
.video-content h1 {
  color: #969696;
  margin-top: 100px;
}
.video-edit {
  text-align: left;
}
.video-edit-che {
  cursor:default;
  display: inline-block;
  margin:2px;
  margin-right: 10px;
}
.video-blocktop{
  display: inline-block;
  height: 330px;
  border: 1px solid #d6d6d6;
}
.video-blocktop iframe {
  width: 300px;
  height: 300px;

}
.video-center {
  /* height: 60px; */
  text-align: center;
  /* background-color: #e6e6e6; */
  color:#000;

}
</style>
