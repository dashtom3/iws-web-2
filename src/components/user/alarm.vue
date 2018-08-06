<template>
  <div class="main">
    <div class="alarm-container">
      <div class="right-content">
        <!-- <div style="height:100%"> -->
          <div class="right-btn">
            <el-tabs v-model="isRealAlarm" @tab-click="changeAlarmType" >
              <el-tab-pane label="实时报警" name="实时报警">实时报警</el-tab-pane>
              <el-tab-pane label="历史报警" name="历史报警">历史报警</el-tab-pane>
            </el-tabs>
            <!-- <el-button type="primary" size="small" @click="selectAlarm"></el-button> -->
            <!-- <el-button type="primary" size="small" @click="selectAlarm"></el-button> -->
          </div>
          <div>
            <div class="right-btn" v-if="userInfo.role.type == 0">
              <el-radio-group v-model="isAllTask" @change="taskChange">
                <el-radio-button label="全部" name="0"></el-radio-button>
                <el-radio-button label="我的任务" name="1"></el-radio-button>
              </el-radio-group>
            </div>
            <div class="right-btn" v-if="isRealAlarm != '实时报警'">
              <span class="demonstration">选择时间段：</span>
              <el-date-picker
                v-model="timePicker"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                @change="timeChange">
              </el-date-picker>
            </div>
            <!-- <div class="right-export" v-if="isRealAlarm != '实时报警'">
              <el-button type="primary" size="small">导出excel</el-button>
            </div> -->
            <div class="alarm-right-tab">
              <table v-if="isRealAlarm =='实时报警'">
                <thead>
                  <tr>
                    <td class="alarm-tab-head">报警开始时间</td>
                    <td class="alarm-tab-data">系统</td>
                    <td class="alarm-tab-data">地点信息</td>
                    <td class="alarm-tab-data">设备信息</td>
                    <td class="alarm-tab-data">报警信息</td>
                    <td class="alarm-tab-data">其他信息</td>
                    <td class="alarm-tab-data">负责人员</td>
                    <td class="alarm-tab-data">分配时间</td>
                    <td class="alarm-tab-data">完成时间</td>
                  </tr>
                </thead>
                <tbody >
                  <tr v-for="item in realAlarmList">
                    <td class="alarm-tab-head">{{item.alarmData.create_time}}</td>
                    <td >{{item.sysInfo}}</td>
                    <td >{{item.locInfo}}</td>
                    <td >{{item.devInfo}}</td>
                    <td >{{item.alarmData.info}}</td>
                    <td ><b>传感器信息:</b>{{item.ip}}:{{item.zhan}}</td>
                    <template v-if="userInfo.role.type == 0">
                      <td v-if="item.alarmData.worker">{{item.alarmData.worker.realName}},{{item.alarmData.worker.phone}}</td>
                      <td v-else>尚未分配</td>
                    </template>
                    <template v-else>
                      <td style="width:100px;padding:5px;">
                        <el-select v-model="item.workertemp"  size="mini" @change="changeWorker(item)">
                          <el-option label="暂无" :value="-1" key="-1"></el-option>
                          <el-option :label="user.realName+':'+user.phone" :value="user._id" :key="user._id" v-for="user in userList"></el-option>
                        </el-select>
                      </td>
                    </template>
                    <td v-if="item.alarmData.worker_time" class="alarm-tab-head">{{item.alarmData.worker_time}}</td>
                    <td v-else>暂无</td>
                    <td v-if="item.alarmData.finish_time" class="alarm-tab-head">{{item.alarmData.finish_time}}</td>
                    <td v-else>暂无</td>
                  </tr>
                </tbody>
              </table>
              <table v-else>
                <thead>
                  <tr>
                    <td class="alarm-tab-head">报警开始时间</td>
                    <td class="alarm-tab-head">报警结束时间</td>
                    <td class="alarm-tab-data">系统</td>
                    <td class="alarm-tab-data">地点信息</td>
                    <td class="alarm-tab-data">设备信息</td>
                    <td class="alarm-tab-data">报警信息</td>
                    <td class="alarm-tab-data">其他信息</td>
                    <td class="alarm-tab-data">负责人员</td>
                    <td class="alarm-tab-data">分配时间</td>
                    <td class="alarm-tab-data">完成时间</td>
                  </tr>
                </thead>
                <tbody >
                  <tr v-for="item in realAlarmList">
                    <td class="alarm-tab-head">{{item.oldAlarmData.create_time}}</td>
                    <td class="alarm-tab-head">{{item.oldAlarmData.stop_time}}</td>
                    <td >{{item.sysInfo}}</td>
                    <td >{{item.locInfo}}</td>
                    <td >{{item.devInfo}}</td>
                    <td >{{item.oldAlarmData.info}}</td>
                    <td ><b>传感器信息:</b>{{item.ip}}:{{item.zhan}}</td>
                    <template v-if="userInfo.role.type == 0">
                      <td v-if="item.workerEntity">{{item.workerEntity.realName}},{{item.workerEntity.phone}}</td>
                      <td v-else>尚未分配</td>
                    </template>
                    <template v-else>
                      <td style="width:100px;padding:5px;">
                        <el-select v-model="item.workertemp"  size="mini" @change="changeWorker(item)">
                          <el-option label="暂无" :value="-1" key="-1"></el-option>
                          <el-option :label="user.realName+':'+user.phone" :value="user._id" :key="user._id" v-for="user in userList"></el-option>
                        </el-select>
                      </td>
                    </template>
                    <td v-if="item.oldAlarmData.worker_time" class="alarm-tab-head">{{item.oldAlarmData.worker_time}}</td>
                    <td v-else>暂无</td>
                    <td v-if="item.oldAlarmData.finish_time" class="alarm-tab-head">{{item.oldAlarmData.finish_time}}</td>
                    <td v-else>暂无</td>
                  </tr>
                </tbody>
              </table>
              <div class="rig-pag" v-if="isRealAlarm != '实时报警'" >
                <el-pagination
                  background
                  layout="total, prev, pager, next"
                  @current-change = "pageChange"
                  :current-page.sync="historyAlarmArgs.pageNum"
                  :page-count="historyAlarmArgs.totalPage"
                >
                </el-pagination>
              </div>
            </div>
          </div>
          <!-- <div v-else>
            <div class="alarm-left">
              <div class="alarm-leftTop">
              </div>
              <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
            </div>
            <div class="alarm-right">
              <div class="right-btn">
                <el-radio-group v-model="isAllTaskHistory" @change="taskChangeHistory">
                  <el-radio-button label="全部" name="0"></el-radio-button>
                  <el-radio-button label="我的任务" name="1"></el-radio-button>
                </el-radio-group>
              </div>
              <div class="right-btn">
                <span class="demonstration">选择时间段：</span>
                {{timePicker}}
                <el-date-picker
                  v-model="timePicker"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd"
                  @change="timeChange">
                </el-date-picker>
              </div>
              <div class="right-export">
                <el-button type="primary" size="small">导出excel</el-button>
              </div>
              <div class="right-tab">

              </div>
            </div> -->
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
      userInfo:null,
      isRealAlarm: "实时报警",
      alarmEnums:['实时报警','历史报警'],
      isAllTask:"全部",
      isAllTaskHistory:"全部",
      realAlarmList:null,
      // hisAlarmList:null,
      realAlarmArgs:{
        isMe:"0",
      },
      userList:null,
      historyAlarmArgs:{
        pageSize:30,
        pageNum:1,
        totalPage:1,
        isMe:"0"
      },
      timePicker:''
    }
  },
  created(){
    this.getSystemList()
    // console.log(this.$global.getUser())
    this.getUserInfo()

  },
  methods: {
    getUserInfo(){
      this.userInfo = this.$global.getUser()
      console.log(this.userInfo)
      this.getUserList()
    },
    // handleNodeClick(val){
    //   if(!val.children) {
    //     this.deviceSel = val
    //     if(this.deviceSel.sensor.length > 0) {
    //       // this.getHistoryAlarmData()
    //     }
    //   }
    // },
    changeAlarmType(){
      console.log(this.isRealAlarm)
      if(this.isRealAlarm == this.alarmEnums[0]){
        this.getRealAlarmData()
      }else {
        this.getHistoryAlarmData()
      }
    },
    getUserList(){
      this.$global.httpGetWithToken(this,'user/all',{pageNum:1,pageSize:100000}).then(res=>{
        console.log(res)
        this.userList = res.data.data
      })
    },
    getSystemList(){
      this.$global.httpGetWithToken(this,'system/system/all').then(res=>{
        // console.log(res)
        this.sysList = res.data.data
        this.analyseRegion()
        this.getRealAlarmData()
      })
    },
    taskChange(val) {
      // console.log(val)
      this.realAlarmArgs.isMe = val == "全部"? 0:1
      this.historyAlarmArgs.isMe = val == "全部"? 0:1
      if(this.isRealAlarm == this.alarmEnums[0]){
        this.getRealAlarmData()
      }else {
        this.getHistoryAlarmData()
      }

    },
    getRealAlarmData(){
      this.realAlarmList = []
      this.$global.httpGetWithToken(this,'data/realAlarmData',this.realAlarmArgs).then(res=>{
        console.log(res)
        this.realAlarmData = []
        this.realAlarmList = res.data
        this.analyseSensor()
      })
    },
    analyseSensor(){
      this.realAlarmList.forEach(sensor=>{
        if(!sensor.sysInfo){
          this.sysList.forEach(sys=>{
            sys.location.forEach(loc=>{
              loc.room.forEach(room=>{
                room.device.forEach(dev=>{
                  dev.sensor.forEach(sensor2=>{
                    if(sensor2._id == sensor._id){
                      // console.log(sensor)
                      sensor.sysInfo = sys.name
                      sensor.locInfo = loc.name+':'+room.name
                      sensor.devInfo = dev.name
                      if(this.isRealAlarm == this.alarmEnums[0]){
                        if(sensor.alarmData.worker){
                          sensor.workertemp = sensor.alarmData.worker._id
                        } else {
                            sensor.workertemp = -1
                        }
                      }else {
                        if(sensor.oldAlarmData.worker){
                          this.userList.forEach(item=>{
                            if(item._id == sensor.oldAlarmData.worker){
                              // console.log(item)
                              sensor.workerEntity = item
                              sensor.workertemp = item._id
                            }
                          })
                        } else {
                          sensor.workertemp = -1
                        }
                      }
                    }
                  })
                })
              })
            })
          })
        }
      })
    },
    changeWorker(item){
      console.log(item)
      if(item.workertemp != -1){
        const temp = this.isRealAlarm == this.alarmEnums[0] ? {userId:item.workertemp,dataId:item.alarmData._id} : {userId:item.workertemp,dataId:item.oldAlarmData._id}
        this.$global.httpGetWithToken(this,'work/changeWorker/'+item._id,temp).then(res=>{
          // console.log(res)
          this.$global.success(this,'修改成功')
          if(this.isRealAlarm == this.alarmEnums[0]){
            this.getRealAlarmData()
          }else {
            this.getHistoryAlarmData()
          }
        })
      }
    },
    getHistoryAlarmData(){
      this.realAlarmList = []
      if(this.timePicker != ''){
        this.historyAlarmArgs.fromDate = this.timePicker[0]
        this.historyAlarmArgs.toDate = this.timePicker[1]
      }
      // console.log(this.realAlarmArgs.isMe)
      // this.historyAlarmArgs.isMe = this.realAlarmArgs.isMe
      this.$global.httpGetWithToken(this,'data/historyAlarmData',this.historyAlarmArgs).then(res=>{
        console.log(res)
        this.realAlarmList = res.data.data
        this.historyAlarmArgs.totalPage = res.data.page.totalPage
        this.historyAlarmArgs.pageNum = res.data.page.pageNum
        this.analyseSensor()
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
      this.historyAlarmArgs.pageNum = val;
      this.getHistoryAlarmData()
    },
    timeChange(val){
      console.log(val)
      this.getHistoryAlarmData()
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
/* .alarm-left{
  border: 1px solid #cccccc;
  height: auto;
  float:left;
  width:15%;

  overflow-y: scroll;
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
.alarm-leftTop .el-input {
  background-color: #283040;
}
.el-tree {
  width:100%;
}
.el-tree-node__content {
  border-bottom:1px solid #cccccc;
  height: 34px;
  background-color: #283040;
  color:#ffffff;
}
.el-tree-node__content {
}
.el-tree-node:focus>.el-tree-node__content{
  background-color: #32ABEE;
}
.el-tree-node__content:hover{
  background-color: #32ABEE;
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
    width:0px;
    height:0px;
} */
.alarm-container {
  height: 100%;
  text-align: left;
  float:left;
  width:100%;
  /* background-color: #fff; */
  position:relative;
  /* padding:10px; */
  padding-bottom: 0px;
}
.right-content {
  background-color:#fff;
  padding:10px;
  /* border: 1px solid #e6e6e6; */
  min-height: 100%;
  position:relative;
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
.alarm-right-tab {
  /* overflow:auto; */
  overflow-x: auto;
  /* overflow-y: auto; */
  display:block;
  height: 70%;
  margin-bottom: 50px;
}
.alarm-right-tab table,.alarm-right-tab table tr th,.alarm-right-tab table tr td { border:1px solid #0094ff; }
.alarm-right-tab table {
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
.alarm-tab-head{
  min-width:100px;
  font-size: 13px;
}
.alarm-tab-data {
  min-width:70px;
  font-size: 13px;
}



.tab-col {
  width:100px;
}
.rig-pag {
  position: absolute;
  bottom:20px;
  right: 40px;
}
.alarm-right {
  height: 100%;
  text-align: left;
  float:left;
  width:85%;
  background-color: transparent;
  position:relative;
  padding:10px;
  padding-bottom: 0px;
}
</style>
