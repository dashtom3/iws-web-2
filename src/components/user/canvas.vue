<template>
  <div class="canvas">
    <div class="canvas-main" v-if="curRoom != null">
    <div class="canvas-left">
      <el-tree
        :data="treeData"
        :props="defaultProps"
        node-key="_id"
        :default-expanded-keys=[curRoom._id]
        @node-click="handleNodeClick">
      </el-tree>
    </div>
    <div v-bind:class="[{'canvas-content':!sysType},{'canvas-content-ws':sysType}]" v-if="basicData!=null" v-loading="loading">
      <div class="name">
        <h1 v-if="curRoom != null">{{curRoom.name}}</h1>
      </div>
      <div class="prop1" v-if="!sysType">
        <h4>部分监控参数</h4>
        <div>
          <div v-for="value,key,index in basicData" v-if="index <= 2">
            <div class="block1" v-for="item in prop1Title">
                <div>{{index+1}}#{{item[0]}}</div>
                <div class="blo1data">&nbsp;{{basicData[key][item[1]]}}&nbsp;</div>
            </div>
          </div>
        </div>
      </div>
      <div class="prop2" v-if="!sysType">
        <div class="prop2-1">
          <h4>进出水参数</h4>
          <!-- <div class="block1" v-for="item in prop2Title"> -->
          <div v-for="value,key,index in basicData" v-if="index <= 2">
          <div class="block1" v-for="item,index2 in prop2Title[index]">
              <div>{{item[0]}}</div>
              <div class="blo1data">&nbsp;{{basicData[key][item[1]]}}&nbsp;</div>
          </div>
          </div>
            <div class="block1" v-for="value,key,index in basicData" v-if="index <= 2">
                <div>{{prop4Title[index][0]}}</div>
                <div class="blo1data">&nbsp;{{basicData[key][prop4Title[index][1]]}}&nbsp;</div>
            </div>
        </div>
        <div class="prop2-2">
          <h4>水箱液位</h4>
          <div class="block1" v-for="value,key,index in basicData" v-if="index <= 4">
              <div>{{prop3Title[index][0]}}</div>
              <div class="blo1data">&nbsp;{{basicData[key][prop3Title[index][1]]}}&nbsp;</div>
          </div>
        </div>
      </div>
      <canvas id="myCanvas" width="1300" height="850" @click="clickCanvas">
      </canvas>
      <el-dialog
        :title="showParamKey+'参数监控'"
        :visible.sync="showParams"
        width="800px"
        :before-close="paramClose">
        <div class="prop4">
          <div class="canvas-control" v-for="value,key in basicData[showParamKey]">
            <!-- <div v-for="key,value in item"> -->
              <div>{{key}}</div>
              <div class="blo2data">&nbsp;<b>{{value}}</b>&nbsp;</div>
              <!-- <div style="display:inline-block;">{{value}}</div> -->
          </div>
        </div>
      </el-dialog>
    </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      sysList:null,
      baseTreeData:[],
      curLoc:null,
      curRoom:null,
      sysType: false, //true 污水  false 其他系统
      showParams:false,
      showParamKey:null,
      loading:false,
      basicData:null,
      ctx:null,
      image:[{src:"static/bengzu.png"},{src:"static/beng_new.png"},{src:"static/ra.png"}
    ,{src:"static/al.png"},{src:"static/b_y.png"},{src:"static/b_r.png"},{src:"static/b_g.png"},{src:"static/beng_s.png"},{src:"static/bengzu_ws.png"}],
        prop1Title:[['电机电压Ua','电机电压Ua'],['电机电压Ub','电机电压Ua'],['电机电压Uc','电机电压Uc'],
        ['电机电流Ia','电机电流Ia'],['电机电流Ib','电机电流Ib'],['电机电流Ic','电机电流Ic']],
        prop2Title:[[['1#泵前压力','泵前压力'],['1#泵后压力','泵后压力']],[['2#泵前压力','泵前压力'],['2#泵后压力','泵后压力']]],
        prop4Title:[['1#出口流量','出口流量'],['2#出口流量','出口流量']],
        prop3Title:[['1#水箱水位','水箱水位'],['2#水箱水位','水箱水位'],['3#水箱水位','水箱水位'],['4#水箱水位','水箱水位']]
    }
  },
  created(){

  },
  mounted(){
    // this.promiseLoadImage()
    this.loading = true;
    this.getSystemList()

  },
  watch: {
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
      this.$global.httpGetWithToken(this,'system/system/all').then(res=>{
        console.log(res)
        this.sysList = res.data.data
        this.analyseRegion()
        this.getCurrentRoom()
        this.promiseLoadImage()
      })
    },
    handleNodeClick(val){
      // console.log(val)
      if(!val.children) {
          // this.$router.push({name:'user_canvas',params:{_id:val._id}})
        this.curRoom = val
        this.getRealData()
      }
    },
    getCurrentRoom(){
      const temp = this.$route.params._id

      this.sysList.forEach(sys=>{
        sys.location.forEach(loc=>{
          if(temp == loc._id){
            this.curLoc = loc
            if(loc.room.length >0) {
              this.curRoom = loc.room[0]
              console.log(loc)
            } else {
              this.$router.go(-1)
            }
          }
        })
      })
    },
    analyseRegion(){
      this.sysList.forEach(sys=>{
        if(sys.location){
          sys.children = sys.location
          sys.children.forEach(loc =>{
            if(loc.room) {
              loc.children = loc.room
            }
          })
        }
      })
      this.baseTreeData = this.sysList
      this.treeData = this.baseTreeData
      console.log(this.treeData)
    },
    videoChange(val){
      console.log(val)
      this.$nextTick(function () {
        document.getElementById(val).src="/static/video.html";
      })
    },
    clickCanvas(item){
      var cvs = document.getElementById("myCanvas");
      var x = item.offsetX;
      var y = item.offsetY;
      if(this.sysType == true){
        var i = 0;
        if(x>= 1046 && x<=1111){
          console.log(y)
          for(var j in this.basicData){
            if(y>=(558+i*195) && y<=(578+i*195)){

              this.showParamTable(j)
            }
            i++;
          }
        }
      }else {
        var i = 0;
        if(x>= 1046 && x<=1111){
          console.log(y)
          for(var j in this.basicData){
            if(y>=(182+i*195) && y<=(202+i*195)){
              this.showParamTable(j)
            }
            i++;
          }
        }
      }

    },
    selectTableRow(){
      return "tablerow"
    },
    paramClose(){
      this.showParams = !this.showParams;
    },
    showParamTable(key){
      this.showParamKey = key
      this.showParams = !this.showParams;
    },
    promiseLoadImage(){
      var self = this
      let arrPromise = []
      for(let i = 0; i < this.image.length; i++){
        var p = new Promise((resolve, reject) => {
          self.image[i].data = new Image()
          self.image[i].data.src = self.image[i].src
          self.image[i].data.onload = function(){
            resolve()
          }
        });
        arrPromise.push(p)
      }
      Promise.all(arrPromise).then(() => {
        this.getRealData()
      });

    },
    timeAdd(data){
      // console.log(data,data.length)
      return data > 9 ? data : "0"+data
    },

    getRealData(){
      this.$global.httpGetWithToken(this,"data/realData/"+this.curRoom._id).then(res=>{
        console.log(res)
        this.basicData = res.data
        this.sysType = this.judgeSystem()
        // this.analyseData(res)
        this.$nextTick(function(){
          var cvs = document.getElementById("myCanvas");
          if(cvs){
            this.ctx = cvs.getContext('2d');
            this.ctx.clearRect(0,0,cvs.width,cvs.height);
            this.draw()
            // setTimeout(()=>{
            //   self.getRegionInfo(self.selectPlace)
            // },5000)
          }
        })
      }).catch((item)=>{
        console.log(item)
      })
    },
    // true 污水 false 其余系统
    judgeSystem(){
      for(var i in this.basicData){
        for(var j in this.basicData[i]){
          if( j.indexOf('风机') != -1) {
            return true
          }
        }
      }
      return false
    },
    draw(){
      if(this.sysType == true) {
        var k=0
        for(var i in this.basicData){
           k++
           this.drawGroupWS(i,k);
        }
      }else {
        var k=0
        for(var i in this.basicData){
           k++
           this.drawGroup(i,k);
        }
        this.drawWaterBox()
        this.drawBlock()
      }

      //
      // this.drawWaterPull()

      // this.drawWaterTap()
      // this.drawAlarm()
      this.loading = false;
    },
    drawGroupWS(key,num){

      this.ctx.drawImage(this.image[8].data,100,55+(num+1)*195)
      //几区
      this.drawText(key,1061,145+(num+1)*195,"black","18px")

      this.drawText("参数监控",1051,180+(num+1)*195,"black","14px")
      this.drawStrokeRect(1046,165+(num+1)*195,65,20,{color:"gray"})

      var temp = ['MBR泵','化粪池泵','反洗泵','反洗泵','回流泵','提升泵','污泥泵','风机']
      var k=0;
      var i=1;
      var tempWhile = true
      while(tempWhile == true){
        var temptrue = false
        temp.forEach(item=>{
          if(this.basicData[key][i+'#'+item+'运行信号']){
            temptrue = true
            if(k<11){
              this.drawSingleWS(key,i+'#'+item,100+85*k,118+(num+1)*195)
            }
            k++;
          }
        })
        if(temptrue == false){
          tempWhile = false
        }else {
          i++
        }
      }
    },
    //单个泵信息
    drawSingleWS(key,name,x,y){
      this.ctx.drawImage(this.image[1].data,x,y)
      this.drawText(name,x+10,y+154)
      if(this.basicData[key][name+'故障信号'] == "是"){
        this.ctx.drawImage(this.image[4].data,x+26,y+26)
        this.drawText("故障",x+31,y+129)
      }else if(this.basicData[key][name+"运行信号"] == "是"){
        this.ctx.drawImage(this.image[6].data,x+26,y+26)
        this.drawText("运行",x+31,y+129)
      } else {
        this.ctx.drawImage(this.image[5].data,x+26,y+26)
        this.drawText("休息",x+31,y+129)
      }
    },
    drawGroup(key,num){

      this.ctx.drawImage(this.image[0].data,420,55+(num-1)*195)
      //几区

      this.drawText(key,1030,145+(num-1)*195,"black","18px")


      this.drawText(this.basicData[key]["泵后压力"],1025,85+(num-1)*195)
      this.drawText(this.basicData[key]["泵前压力"],510,105+(num-1)*195)
      //TODO 控制模式
      if(this.basicData[key]["远程切换自动/手动"] == "手动"){
          this.drawText("控制模式 手动",1020,165+(num-1)*195,"black","14px")
      } else {
          this.drawText("控制模式 自动",1020,165+(num-1)*195,"black","14px")
      }
      this.drawText("参数监控",1051,195+(num-1)*195,"black","14px")
      this.drawStrokeRect(1046,180+(num-1)*195,65,20,{color:"gray"})
      //超压报警
      if(this.basicData[key]["其他信号故障"] == "出口超压"){
        this.drawText("超压报警",1055,110+(num-1)*195,"red","14px")
      }
      //泵信息
      for(var i=1;i<100;i++){
        if(this.basicData[key][i+"#泵状态"] == "无"){
          break;
        }
        this.drawSingle(key,i+"#",419+85*(i-1),118+(num-1)*195)
      }
    },
    //单个泵信息
    drawSingle(key,name,x,y){
      this.ctx.drawImage(this.image[1].data,x,y)
      var temp = this.basicData[key][name+"变频器频率"] ? this.basicData[key][name+"变频器频率"] : "0Hz"
      this.drawText(temp,x+31,y+129)
      this.drawText(name+"泵:"+this.basicData[key][name+"泵状态"],x+15,y+154)
      if(this.basicData[key][name+"泵状态"] == "变频" || this.basicData[key][name+"泵状态"] == "工频"){
        this.ctx.drawImage(this.image[6].data,x+26,y+26)
      } else if(this.basicData[key][name+"泵状态"] == "休息"){
        this.ctx.drawImage(this.image[5].data,x+26,y+26)
      }else {
        this.ctx.drawImage(this.image[4].data,x+26,y+26)
      }
    },
    //辅泵信息
    drawSmSingle(groupN,x,y){
      console.log("变频器运行："+this.basicData["泵组"+groupN+"区辅泵变频器运行"])
      this.ctx.drawImage(this.image[7].data,x,y)
      this.drawText(parseFloat(this.basicData["泵组"+groupN+"区辅泵变频器运行频率"]?this.basicData["泵组"+groupN+"区辅泵变频器运行频率"]:"0.0").toFixed(2),x+31,y+129)
      this.drawText(parseFloat(this.basicData["泵组"+groupN+"区辅泵变频器运行电流"]?this.basicData["泵组"+groupN+"区辅泵变频器运行电流"]:"0.0").toFixed(2),x+31,y+154)
      if(this.basicData["泵组"+groupN+"区辅泵变频器运行"] == "true"){
        this.ctx.drawImage(this.image[6].data,x+29,y+42,16,16)
      } else {
        this.ctx.drawImage(this.image[5].data,x+29,y+42,16,16)
      }
    },
    //烟雾报警 地面积水
    drawBlock(){
      for(var j in this.basicData){
        if(this.basicData[j]["其他信号故障"] == "门禁报警"){
          this.ctx.drawImage(this.image[3].data,21,474)
        }
        if(this.basicData[j]["其他信号故障"] == "地面积水信号"){
          this.ctx.drawImage(this.image[3].data,21,514)
        }
      }
    },
    //水箱液位
    drawWaterBox(){
      var i = 0;
      for(var j in this.basicData){
        if(this.basicData[j]["水箱水位"]){
          this.drawText("------水箱液位:"+this.basicData[j]["水箱水位"]+"------",185,600+i*25,"black","16px")
        }
        if(this.basicData[j]["其他信号故障"] == "无水故障") {
          this.drawText("无水故障",320,700,"red","13px")
        }
        if(this.basicData[j]["其他信号故障"] == "高水信号"){
          this.drawText("超高液位",320,595,"red","13px")
        }
        i++;
      }

    },
    drawText(content,x,y,color,size){
      this.ctx.font= (size?size:"12px") + " Helvetica";
      this.ctx.fillStyle = color?color:"#09EE03";
      this.ctx.fillText(content,x,y);
    },
    drawStrokeRect(x,y,width,height,params){
      this.ctx.beginPath();
      this.ctx.lineWidth=params.line ? params.line:"1";
      this.ctx.strokeStyle=params.color? params.color:"gray";
      this.ctx.rect(x,y,width,height);
      this.ctx.stroke();
    },
    drawFillRect(x,y,width,height,params){
      this.ctx.beginPath();
      this.ctx.fillStyle=params.color? params.color:"gray";
      this.ctx.rect(x,y,width,height);
      this.ctx.fill();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style>
.canvas {
  width: 100%;
  /* min-width: 1500px; */
  height: 100%;
  background-color: #B8D0F9;
  overflow-x: scroll;
}
.canvas-main {

  width: 1500px;
}
.canvas-left{
  border: 1px solid #cccccc;
  height: auto;
  /* padding:5px; */
  float:left;
  width:200px;
  /* margin-top: 10px; */
  /* margin-left: 10px; */
  /* border: 1px solid #cccccc; */
  /* height: 850px; */
  overflow-y: scroll;
  /* background-color: #32ABEE; */
  /* background-color: #CCDDFF; */
  background-color: #fff;
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
.leftTop .el-input {
  background-color: #283040;
}
.canvas-left .el-tree {
  /* background-color: #32ABEE; */
  /* color:#fff; */
  /* color:#303133; */
  width: 100%;
  /* border:1px solid #e6e6e6; */
}
.canvas-left .el-tree-node__content {
  border-bottom:1px solid #cccccc;
  height: 34px;
  background-color: #283040;
  color:#ffffff;
}
.canvas-left .el-tree-node__content {
}
.canvas-left .el-tree-node:focus>.el-tree-node__content{
  background-color: #32ABEE;
}
.canvas-left .el-tree-node__content:hover{
  background-color: #32ABEE;
}

.canvas-left::-webkit-scrollbar {
    width:0px;
    height:0px;
}
.canvas-left::-webkit-scrollbar-button    {
    background-color:rgba(0,0,0,0);
}
.canvas-left::-webkit-scrollbar-track     {
    background-color:rgba(0,0,0,0);
}
.canvas-left::-webkit-scrollbar-track-piece {
    background-color:rgba(0,0,0,0);
}
.canvas-left::-webkit-scrollbar-thumb{
    background-color:rgba(0,0,0,0);
}
.canvas-left::-webkit-scrollbar-corner {
    background-color:rgba(0,0,0,0);
}
.canvas-left::-webkit-scrollbar-resizer  {
    background-color:rgba(0,0,0,0);
}
.canvas-left::-webkit-scrollbar {
    width:0px;
    height:0px;
}

.canvas-content{
  width: 1300px;
  /* width: 100%; */
  float: left;
  padding: 5px;
  /* background-color: #CCDDFF; */
  height: 850px;
  background: url('/static/all.jpg') no-repeat;
}
.canvas-content-ws{
  width: 1300px;
  float: left;
  padding: 5px;
  /* background-color: #CCDDFF; */
  height: 850px;
  background: url('/static/all_ws.jpg') no-repeat;
}
.name {
  text-align: center;
  width: 310px;
  background-color:#DDEEFE;
}
.name h1 {
  margin-bottom: 0px;
}

.canvas-content .prop1,.canvas-content-ws .prop1 {
  text-align: center;
  width: 305px;
  border: 1px solid #333333;
  height: 215px;
  padding-left: 15px;
  padding-right: 15px;
}
.prop4{
  text-align: center;
  /* height: 210px; */
}
.canvas-content h4 {
  margin: 5px;
}
.prop1 h5 {
  margin: 0px;
}
.canvas-content .block1,.canvas-content-ws .block1 {
  float: left;
  border: 1px solid #97BAE5;
  background-color:#DDEEFE;
  width: 90px;
  font-size: 12px;
}
.canvas-control {
  display: inline-block;
  border: 1px solid #97BAE5;
  background-color:#DDEEFE;
  width: 140px;
  font-size: 12px;
}
/* .block1 span {
  font-size: 12px;
} */
.canvas-content .blo1data,.canvas-content-ws .blo1data {
  background-color:#000000;
  color: #09BE03;
  border-radius: 4px;
  display: inline-block;
  margin-bottom: 2px;
  /* width: 80%; */
  /* margin-left: 10px;
  margin-right: 20px; */
}
.canvas-content .blo2data,.canvas-content-ws .blo2data {
  background-color:#000000;
  color: #09BE03;
  border-radius: 4px;
  display: inline-block;
  margin-bottom: 2px;
  width: 80%;
}
.canvas-content .prop2,.canvas-content-ws .prop2{
  width: 410px;
  border: 1px solid #333333;
  padding-left: 5px;
  padding-right: 5px;
  height:160px;
  text-align: center;
  font-size: 12px;
  z-index:99999 ;
}
.prop2-1 {
  width: 195px;
  float: left;
}
.prop2-2 {
  width: 195px;
    float: left;
}
.canvas-content .video ,.canvas-content-ws .video{
  /* position: fixed; */
  /* top: 0; */
  float: right;
  margin-top: -425px;
  width: 390px;
  height:865px;
}
.video-top {
  text-align: center;
  height: 460px;
  border: 1px solid #333333;
}
.video-bottom {
  text-align: center;
  /* height: 335px; */
  border: 1px solid #333333;
  margin-top: -1px;
}
#myCanvas{
  margin-top:-420px;
  z-index:-1;
  /* background-color: #eeeeee; */
}
.canvas-content iframe ,.canvas-content-ws iframe{
  /* border: 1px solid #333333; */
  width: 100%;
  height: 340px;
}
.blocktop{

    /* margin-left: 10px; */

    overflow-x: none;
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
  .blocktop::-webkit-scrollbar {
  width:0px;
  height:0px;
  }
  .blocktop::-webkit-scrollbar-button    {
      background-color:rgba(0,0,0,0);
  }
  .blocktop::-webkit-scrollbar-track     {
      background-color:rgba(0,0,0,0);
  }
  .blocktop::-webkit-scrollbar-track-piece {
      background-color:rgba(0,0,0,0);
  }
  .blocktop::-webkit-scrollbar-thumb{
      background-color:rgba(0,0,0,0);
  }
  .blocktop::-webkit-scrollbar-corner {
      background-color:rgba(0,0,0,0);
  }
  .blocktop::-webkit-scrollbar-resizer  {
      background-color:rgba(0,0,0,0);
  }
.canvas-content  .el-table .tablerow,.canvas-content-ws .el-table .tablerow{
    background:#CCDDFF;
  }
.canvas-content  .el-table,.canvas-content-ws .el-table{
    background:#CCDDFF;
  }
.canvas-content  h3 ,.canvas-content-ws h3{
    margin:0;
    padding:15px 0px;
    background:#DDEEFE;
  }
.canvas-content  thead ,.canvas-content-ws thead{
    color:#2c3e50 !important;
  }
.canvas-content  .el-table th,.canvas-content  .el-table tr, .canvas-content-ws .el-table th, .canvas-content-ws .el-table tr{
    background:#CCDDFF !important;
  }
.canvas-content  th, .canvas-content td , .canvas-content-ws th, .canvas-content-ws td{
    border-right:1px solid #333333 !important;
    border-bottom:1px solid #333333 !important;
  }
.canvas-content  .el-table--border , .canvas-content-ws .el-table--border{
    border:1px solid #333333 !important;
  }
</style>
