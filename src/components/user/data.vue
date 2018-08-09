<template>
  <div class="main" v-loading="loading" element-loading-text="数据加载中">
    <div class="data-left">
      <div class="leftTop">
        <!-- <el-input size="mini" placeholder="模糊查询" v-model="searchData">
          <el-button size="mini" slot="prepend" icon="el-icon-search"></el-button>
        </el-input> -->
      </div>
      <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
    </div>
    <div class="data-right">
      <div class="data-right-content">
        <div v-if="deviceSel != null" style="height:100%">
          <div class="right-tit">
            <h3>{{deviceSel.name}}</h3>
          </div>
          <div class="right-btn">
            <span>选择传感器：</span><el-button type="primary" size="small" v-for="item,index in deviceSel.sensor" @click="selectSensor(item,index)">{{item.ip}}:{{item.zhan}}</el-button>
          </div>
          <div class="right-btn">
            <span class="demonstration">选择时间段：</span>
            <!-- {{timePicker}} -->
            <el-date-picker
              v-model="timePicker"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              @change="timeChange">
            </el-date-picker>
            <!-- <el-date-picker
              v-model="timePicker"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期" @change="timeChange">
            </el-date-picker> -->
          </div>
          <!-- <div class="right-export">
            <el-button type="primary" size="small" @click="exportExcel">导出excel</el-button>
          </div> -->
          <div class="right-tab">
            <table v-if="sensorInfo != null">
              <thead>
                <tr>
                  <td class="tab-head">时间</td>
                  <td class="tab-data" v-for="item in sensorInfo.point.pointEnum">{{item.name}}</td>
                </tr>
              </thead>
              <tbody v-if="sensorInfo.data != null">
                <tr v-for="sensorData in sensorInfo.data">
                  <td class="tab-head">{{sensorData.create_time}}</td>
                  <td class="tab-data" v-for="data in sensorData.data">{{data}}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="data-rig-pag">
            <el-pagination
              background
              layout="prev, pager, next"
              @current-change = "pageChange"
              :current-page="dataArgs.pageNum"
              :page-count="dataArgs.totalPage">
            </el-pagination>
          </div>
        </div>
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
      searchData:null,
      baseTreeData:[],
      sysImg:[],

      sysList:null,
      deviceSel:null,
      sensorSel:-1,
      sensorInfo:null,
      dataArgs:{
        pageSize:30,
        pageNum:1,
        totalPage:1,
      },
      loading:false,
      timePicker:[]
    }
  },
  created(){
    this.setSysImg()
    this.getSystemList()
    this.timePicker = [this.$dtime(new Date().getTime()-1000*60*60*24).format('YYYY-MM-DD'),this.$dtime().format('YYYY-MM-DD')]
  },
  methods: {
    getSystemList(){
      this.$global.httpGetWithToken(this,'system/system/allByRole').then(res=>{
        console.log(res)
        this.sysList = res.data.data
        this.analyseRegion()
      })
    },
    handleNodeClick(val){
      // console.log(val)
      if(!val.children) {
        this.deviceSel = val
        if(this.deviceSel.sensor.length > 0) {
          this.getSensorData(this.deviceSel.sensor[0]._id,0)
          this.sensorSel = 0
        }
      }
    },
    exportExcel(){
      const _id = this.deviceSel.sensor[this.sensorSel]._id
      // this.sensorSel
      if(this.timePicker != ''){
        // this.dataArgs.fromDate = this.timePicker[0]
        // this.dataArgs.toDate = this.timePicker[1]
        this.dataArgs.toDate = this.$dtime(parseInt(this.$dtime(this.timePicker).format('x'))+1000*60*60*24).format('YYYY-MM-DD')
        console.log(this.dataArgs.toDate)
      }
      this.$global.httpGetWithToken(this,'data/exportHistoryData/'+_id,this.dataArgs).then(res=>{
        console.log(res)
        // this.sensorSel = num
        // this.sensorInfo = res.data.data
        // this.dataArgs = res.data.page
      })
    },
    getSensorData(_id,num){
      // console.log(this.timePicker,parseInt(this.$dtime(this.timePicker).format('x'))+1000*60*60*24)
      if(this.timePicker != ''){
        this.dataArgs.fromDate = this.timePicker[0]
        this.dataArgs.toDate = this.timePicker[1]
        console.log(this.dataArgs.toDate)
      }
      this.loading = true
      this.$global.httpGetWithToken(this,'data/historyData/'+_id,this.dataArgs).then(res=>{
        this.loading = false
        console.log(res)
        this.sensorSel = num
        this.sensorInfo = res.data.data
        this.dataArgs = res.data.page
      }).catch(()=>{
        this.loading = false
      })
    },
    //系统
    setSysImg(){
      this.sysImg = []
      for(var i=1;i<9;i++){
        var temp = require('../../assets/system/sys_'+i+'.png')
        this.sysImg.push(temp)
      }
    },
    selectSensor(item,index){
      this.dataArgs.pageNum = 1;
      this.getSensorData(item._id,index)
    },
    pageChange(val){
      console.log(val)
      this.dataArgs.pageNum = val;

      this.getSensorData(this.deviceSel.sensor[this.sensorSel]._id,this.sensorSel)
    },
    timeChange(val){
      console.log(val)
      this.dataArgs.pageNum = 1;
      console.log(this.deviceSel,this.sensorSel)
      this.getSensorData(this.deviceSel.sensor[this.sensorSel]._id,this.sensorSel)
    },
    analyseRegion(){
      this.sysList.forEach(sys=>{
        if(sys.location){
          sys.children = sys.location
          sys.children.forEach(loc =>{
            if(loc.room) {
              loc.children = loc.room
              loc.children.forEach(room=>{
                if(room.device) {
                  room.children = room.device
                }
              })
            }
          })
        }
      })
      this.baseTreeData = this.sysList
      this.treeData = this.baseTreeData
      console.log(this.treeData)
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
.data-left{
  border: 1px solid #cccccc;
  height: auto;
  /* padding:5px; */
  float:left;
  width:15%;
  /* margin-top: 10px; */
  /* margin-left: 10px; */
  /* border: 1px solid #cccccc; */
  /* height: 850px; */
  overflow-y: scroll;
  /* background-color: #32ABEE; */
  /* background-color: #CCDDFF; */
  background-color: #283040;
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
.data-left .el-tree {
  /* background-color: #32ABEE; */
  /* color:#fff; */
  /* color:#303133; */
  width: 100%;
  /* border:1px solid #e6e6e6; */
}
.data-left .el-tree-node__content {
  border-bottom:1px solid #cccccc;
  height: 34px;
  background-color: #283040;
  color:#ffffff;
}
.data-left .el-tree-node__content {
}
.data-left .el-tree-node:focus>.el-tree-node__content{
  background-color: #32ABEE;
}
.data-left .el-tree-node__content:hover{
  background-color: #32ABEE;
}

.data-left::-webkit-scrollbar {
    width:0px;
    height:0px;
}
.data-left::-webkit-scrollbar-button    {
    background-color:rgba(0,0,0,0);
}
.data-left::-webkit-scrollbar-track     {
    background-color:rgba(0,0,0,0);
}
.data-left::-webkit-scrollbar-track-piece {
    background-color:rgba(0,0,0,0);
}
.data-left::-webkit-scrollbar-thumb{
    background-color:rgba(0,0,0,0);
}
.data-left::-webkit-scrollbar-corner {
    background-color:rgba(0,0,0,0);
}
.data-left::-webkit-scrollbar-resizer  {
    background-color:rgba(0,0,0,0);
}
.data-left::-webkit-scrollbar {
    width:0px;
    height:0px;
}
.data-right {
  height: 100%;
  text-align: left;
  float:left;
  width:83%;
  background-color: transparent;
  position:relative;
  padding:10px;
  padding-bottom: 0px;
}
.data-right-content {
  background-color:#fff;
  padding:10px;
  border: 1px solid #e6e6e6;
  min-height: 100%;
}
.right-tit {
  border-bottom:1px solid #e6e6e6;
  height: 35px;
}
.right-btn {
  border-bottom:1px solid #e6e6e6;
  /* height: 35px; */
  padding: 5px;
  margin-bottom: 5px;
}
.right-export {
  padding: 5px;
  margin-bottom: 5px;
}
.right-tab {
  /* overflow:auto; */
  overflow-x: auto;
  /* overflow-y: auto; */
  display:block;
  /* position:absolute; */
  /* height: 70%; */
  margin-bottom: 10px;
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
.right-tab::-webkit-scrollbar-button    {
    background-color:rgba(0,0,0,0);
}
.right-tab::-webkit-scrollbar-track     {
    background-color:rgba(0,0,0,0);
}
.right-tab::-webkit-scrollbar-track-piece {
    background-color:rgba(0,0,0,0);
}
.right-tab::-webkit-scrollbar-thumb{
    background-color:rgba(0,0,0,0);
}
.right-tab::-webkit-scrollbar-corner {
    background-color:rgba(0,0,0,0);
}
.right-tab::-webkit-scrollbar-resizer  {
    background-color:rgba(0,0,0,0);
}
.right-tab::-webkit-scrollbar {
    width:0px;
    height:0px;
}
.right-tab table,.right-tab table tr th,.right-tab table tr td { border:1px solid #0094ff; }
.right-tab table {
  width: 100%;
  height: 100%;
  line-height: 25px;
  text-align: center;
  border-collapse: collapse;
}
/* .right-tab table td {
  min-width:50px;
  font-size: 13px;
} */
.tab-head{
  min-width:100px;
  font-size: 13px;
}
.tab-data {
  min-width:50px;
  font-size: 13px;
}



.tab-col {
  width:100px;
}
.data-rig-pag {
  /* position: absolute; */
  /* bottom:10px;
  right: 40px; */
  text-align: right;
}
</style>
