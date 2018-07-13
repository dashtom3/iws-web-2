<template>
  <div class="main">
    <!-- <div class="left">
      <div class="leftTop">
        <el-input size="mini" placeholder="模糊查询" v-model="searchData">
          <el-button size="mini" slot="prepend" icon="el-icon-search"></el-button>
        </el-input>
      </div>
      <el-tree :data="treeData" default-expand-all :props="defaultProps" @node-click="handleNodeClick"></el-tree>
    </div> -->
    <div class="right">
      <div id="demoComponent" class="demo-component indexMap">
        <el-amap vid="amap" :zoom="zoom" :center="center">
          <div v-for="item in markers">
            <el-amap-marker
              v-for="markerInfo in item" :position="markerInfo.position" :events="markerInfo.events" :visible="markerInfo.visible"
              :icon="markerInfo.icon" :content="markerInfo.content" draggable=false></el-amap-marker>
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
      sysList:null,
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      searchData:null,
      baseTreeData:[],
      zoom: 5,
      center: [121.5273285, 31.21515044],
      sysImg:[],
      markers:[],
    }
  },
  created(){
    this.setSysImg()
    this.getSystemList()
  },

  watch: {
    // '$route' (to, from) {
    //   // react to route changes...
    //   this.selectPlace = to.params.id
    //   this.videos = this.allvideos[this.selectPlace]
    //   this.loading = true;
    //   this.promiseLoadImage()
    // },
    searchData(cul,old){
      console.log(cul,old)

      if(cul == "" || cul == null) {
        this.treeData = this.baseTreeData
      } else {
        var temp = []
        this.baseTreeData.forEach(function(item){
          if(item.label.indexOf(cul)==-1){// 一级不存在该子串
            var tempChildren = []
            item.children.forEach(function(item2){
              if(item2.label.indexOf(cul) != -1) {
                tempChildren.push(item2)
              }
            })
            temp.push({label:item.label,children:tempChildren})
          } else {
            temp.push(item)
          }
        })
        this.treeData = temp;
      }
    }
  },
  methods: {
    getSystemList(){
      this.$global.httpGet(this,'system/system/all').then(res=>{
        console.log(res)
        this.sysList = res.data.data
        this.addMarker()
      })
      // axios.get("../static/place.json").then((res)=>{
      //   self.treeData = self.analyseRegion(res.data)
      //   self.baseTreeData = self.treeData
      //   self.getAlertInfo()
      // })
    },
    addMarker(){
      this.sysList.forEach((sys,index)=>{
        sys.location.forEach((location,index2)=>{
           var marker = [{
            icon:this.sysImg[sys.pic],
            position:[parseFloat(location.lat),parseFloat(location.lng)],
            events: {
              mouseover: () => {
                console.log(marker)
                // arr[1].visible = true
                this.sysList[index].location[index2].markers[1].visible = true
              },
              mouseout: () => {
                console.log(marker)
                // arr[1].visible = true
                this.sysList[index].location[index2].markers[1].visible = false
              }
            },
          },{
            icon:null,
            position:[parseFloat(location.lat),parseFloat(location.lng)],
            content: '<div style="width:124px;min-height:70px;text-align:center;color:#fff;background-color:rgba(0,0,0,.4);border-radius:4px;position:absolute;z-index:-1;top:-52px;left:15px;"><p style="margin:12px 0 8px 0;color:#fff;font-size:14px;">' + sys.name + '</p>' + location.name + '</div>',
            events: {
              mouseover: () => {
                console.log(marker)
                // arr[1].visible = true
                this.sysList[index].location[index2].markers[1].visible = true
              },
              mouseout: () => {
                console.log(index,index2)
                // arr[1].visible = true
                this.sysList[index].location[index2].markers[1].visible = false
              },
              click: () => {
                console.log(123)
                console.log(index,index2)
              }
            },
          }]
          this.markers.push(marker)
        })
      })
      console.log(this.sysList)
      console.log(this.markers)
    },
    //系统
    setSysImg(){
      this.sysImg = []
      for(var i=1;i<9;i++){
        var temp = require('../../assets/system/sys_'+i+'.png')
        this.sysImg.push(temp)
      }
    },
    analyseRegion(data){
      var res = [];
      var temp = data.split(';')
      temp.forEach(function(item){
        var areaname = item.split(':')
        var temp1 = areaname[1].split(',')
        var temp2 = []
        temp1.forEach(function(item1){
          temp2.push({label:item1})
        })
        res.push({label:areaname[0],children:temp2})
      })
      return res

    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

.leftTop {
  background-color: white
}
.main {
  height: 100%;
}
.left{
  width: 170px;
  float:left;
  /* margin-top: 10px; */
  /* margin-left: 10px; */
  /* border: 1px solid #cccccc; */
  /* height: 850px; */
  overflow-y: scroll;
  /* background-color: #3387EE; */
  /* background-color: #CCDDFF; */

  -ms-scroll-chaining: chained;
    -ms-overflow-style: none;
    -ms-content-zooming: zoom;
    -ms-scroll-rails: none;
    -ms-content-zoom-limit-min: 100%;
    -ms-content-zoom-limit-max: 500%;
    -ms-scroll-snap-type: proximity;
    -ms-scroll-snap-points-x: snapList(100%, 200%, 300%, 400%, 500%);
    -ms-overflow-style: none;
}
.left::-webkit-scrollbar {
    width:0px;
    height:0px;
}
.left::-webkit-scrollbar-button    {
    background-color:rgba(0,0,0,0);
}
.left::-webkit-scrollbar-track     {
    background-color:rgba(0,0,0,0);
}
.left::-webkit-scrollbar-track-piece {
    background-color:rgba(0,0,0,0);
}
.left::-webkit-scrollbar-thumb{
    background-color:rgba(0,0,0,0);
}
.left::-webkit-scrollbar-corner {
    background-color:rgba(0,0,0,0);
}
.left::-webkit-scrollbar-resizer  {
    background-color:rgba(0,0,0,0);
}
.left::-webkit-scrollbar {
    width:10px;
    height:10px;
}
.right {
  height: 100%;
}
#demoComponent{
  height: 100%;
}
</style>
