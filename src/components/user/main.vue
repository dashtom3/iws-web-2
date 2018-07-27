<template>
  <div class="main">
    <div class="main-left">
      <div v-if="leftShow == true" class="main-left-tree">
        <el-tree :data="treeData" default-expand-all :props="defaultProps" @node-click="handleNodeClick"></el-tree>
      </div>
      <div class="main-left-show">
        <img src="../../assets/main_show.png" @click="showLeft" v-if="leftShow != true">
        <img src="../../assets/main_hide.png" @click="showLeft" v-else>
      </div>
    </div>
    <div class="main-right">
      <div id="demoComponent" class="demo-component indexMap">
        <el-amap vid="amap" :zoom="zoom" :center="center">
          <!-- <div v-for="sys in sysList"> -->
            <!-- <div v-for="location in sys.location"> -->
            <div v-for="marker in markers">
            <el-amap-marker
              v-for="markerInfo in marker" :position="markerInfo.position" :events="markerInfo.events" :visible="markerInfo.visible"
               :content="markerInfo.content" :draggable=false>
             </el-amap-marker>
            <!-- </div> -->
          </div>
        </el-amap>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      leftShow:false,
      sysList:null,
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      searchData:null,
      baseTreeData:[],
      zoom: 8,
      center: [116.5273285, 31.21515044],
      sysImg:[],
      markers:[],
    }
  },
  created(){
    this.setSysImg()
    this.getSystemList()
  },
  methods: {
    getSystemList(){
      this.$global.httpGet(this,'system/system/all').then(res=>{
        console.log(res)
        this.sysList = res.data.data
        this.addMarker()
        this.analyseRegion()
      })
    },
    handleNodeClick(val){
      console.log(val)
      if(!val.children) {
        this.center = [parseFloat(val.lat),parseFloat(val.lng)]
        this.zoom = 16
      }
    },
    showLeft(){
      this.leftShow = !this.leftShow
    },
    analyseRegion(){
      this.sysList.forEach(sys=>{
        if(sys.location){
          sys.children = sys.location
        }
      })
      this.baseTreeData = this.sysList
      this.treeData = this.baseTreeData
      console.log(this.treeData)
    },
    addMarker(){

      this.sysList.forEach((sys,index)=>{
        sys.location.forEach((location,index2)=>{
          const temp2 = require('../../assets/mapContent.png')
           var marker = [{
            // icon:this.sysImg[sys.pic],
            // '+this.sysImg[sys.pic]+'

            content: '<div style="width:28px;height:34px;text-align:center;"><img src="'+temp2+'" style="width:100%"><img src="'+this.sysImg[sys.pic]+'" style="position:absolute;width:80%;left:3px;top:3px;"></div>',
            position:[parseFloat(location.lat),parseFloat(location.lng)],
            events: {
              mouseover: () => {
                marker[1].visible = true
              },
              mouseout: () => {
                marker[1].visible = false
              },
              click: () => {
                // this.$router.push({name:"user_data",params:""})
                console.log(location)
                if(location.room.length > 0){
                  window.open("/#/user/realData/"+location._id,'_blank')
                }else {
                  this.$alert('该地点暂无泵房', '提示', {
                    confirmButtonText: '确定',
                  });
                }
              }
            },
            visible:true
          },{
            icon:null,
            position:[parseFloat(location.lat),parseFloat(location.lng)],
            content: '<div style="width:124px;min-height:70px;text-align:center;color:#fff;background-color:rgba(0,0,0,.4);border-radius:4px;position:absolute;z-index:-1;top:-52px;left:15px;"><p style="margin:12px 0 8px 0;color:#fff;font-size:14px;">' + sys.name + '</p>' + location.name + '</div>',
            events: {
              mouseover: () => {
                marker[1].visible = true
              },
              mouseout: () => {
                marker[1].visible = false
              },
              click: () => {
                // this.$router.push({name:"user_data",params:""})
                console.log(location)
                if(location.room.length > 0){
                  window.open("/#/user/realData/"+location._id,'_blank')
                }else {
                  this.$alert('该地点暂无泵房', '提示', {
                    confirmButtonText: '确定',
                  });
                }
              }
            },
            visible:false
          }]
          this.markers.push(marker)
          // location.markers = marker
        })
      })
      console.log("标记",this.sysList)
      var tempTrue = false
      for(var i = 0;i<this.sysList.length;i++){
        for(var j=0;j<this.sysList[i].location.length;j++){
          this.center = [parseFloat(this.sysList[i].location[0].lat),parseFloat(this.sysList[i].location[0].lng)]
          tempTrue = true
          break;
        }
        if(tempTrue == true){
          break;
        }
      }
    },
    //系统
    setSysImg(){
      this.sysImg = []
      for(var i=1;i<9;i++){
        var temp = require('../../assets/system/sys_'+i+'.png')
        this.sysImg.push(temp)
      }
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.leftTop {
  background-color: white
}
.main {
  height: 100%;
}
.main-left-tree {
  width: 200px;
  z-index: 99;
  top:0px;
  height: 100%;
  position:relative;
  background-color: #fff;
}
.main-left{
  /* width: 170px; */
  /* float:left; */
  /* position: absolute; */
  float: left;
  /* margin-top: 10px; */
  /* margin-left: 10px; */
  /* border: 1px solid #cccccc; */
  /* height: 850px; */
  overflow-y: scroll;
  /* background-color: #3387EE; */
  /* background-color: #CCDDFF; */
  /* transform: translateZ(0px); */
  /* transition:0.25s cubic-bezier(0,1,0.39,1); */
  -ms-scroll-chaining: chained;
    -ms-overflow-style: none;
    -ms-content-zooming: zoom;
    -ms-scroll-rails: none;
    -ms-content-zoom-limit-min: 100%;
    -ms-content-zoom-limit-max: 500%;
    -ms-scroll-snap-type: proximity;
    -ms-scroll-snap-points-x: snapList(100%, 200%, 300%, 400%, 500%);
    -ms-overflow-style: none;
  z-index: 99;
  height: 100%;

}
.main-left-show {
  float:right;
}
.main-left-show  img {
  position: absolute;
  width: 30px;
  top: 50%;
  z-index:99;
  cursor: pointer;
}
.main-left .el-tree-node__content {
  border-bottom:1px solid #cccccc;
  height: 34px;
  background-color: #283040;
  color:#ffffff;
}
.main-left .el-tree-node__content {
}
.main-left .el-tree-node:focus>.el-tree-node__content{
  background-color: #32ABEE;
}
.main-left .el-tree-node__content:hover{
  background-color: #32ABEE;
}
.main-left::-webkit-scrollbar {
    width:0px;
    height:0px;
}
.main-left::-webkit-scrollbar-button    {
    background-color:rgba(0,0,0,0);
}
.main-left::-webkit-scrollbar-track     {
    background-color:rgba(0,0,0,0);
}
.main-left::-webkit-scrollbar-track-piece {
    background-color:rgba(0,0,0,0);
}
.main-left::-webkit-scrollbar-thumb{
    background-color:rgba(0,0,0,0);
}
.main-left::-webkit-scrollbar-corner {
    background-color:rgba(0,0,0,0);
}
.main-left::-webkit-scrollbar-resizer  {
    background-color:rgba(0,0,0,0);
}
.main-left::-webkit-scrollbar {
    width:0px;
    height:0px;
}
.main-right {
  height: 100%;
  position:absolute;
  width: 100%;
}
#demoComponent{
  height: 100%;
}

</style>
