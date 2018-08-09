<template>
  <div>
    <div class="content">
      <!-- 系统列表页面 -->
      <div class="system" v-if="!sysDetail">
        <div class="btn-role">
          <el-button @click="dialogAddSys" type="primary" round>添加系统</el-button>
        </div>
        <div>
          <div v-for="item in sysList" class="sys" @click="goToSysDetail(item)">
            <div class="systemImg">
              <img v-bind:src="item.pic | imageSrc" alt="">
            </div>
            <div class="systemIntr">
              <p class="systemTitle">{{item.name}}</p>
              <p class="systemCreat">创建于{{item.create_time}}</p>
            </div>
            <div class="delicon" v-on:click="dialogDeleteSys(item)">
              <img src="../../assets/del.png">
            </div>
          </div>
        </div>
      </div>
      <!-- 地点列表页面 -->
      <div class="location" v-if="sysDetail">
        <div class="loc-tit">
          <span class="loc-tit-sp1">系统名称:{{sysDetail.name}}</span>
          <span class="loc-tit-sp2">创建时间:{{sysDetail.create_time}}</span>
          <el-button @click="backSys" type="text" class="btn-loc">返回系统</el-button>
          <el-button @click="dialogAddLoc" type="text" class="btn-loc">添加地点</el-button>
        </div>
        <div v-for="item in sysDetail.location" class="loc">
          <div class="loc-list">
              <span><b>{{item.name}}</b></span>
              <span>创建时间:{{item.create_time}}</span>
              <span>地址:{{item.address}}({{item.lat}},{{item.lng}})</span>
            <div class="loc-list-btn">
              <el-button @click="dialogAddRoom(item)" type="text" >添加泵房</el-button>
              <el-button @click="dialogUpdateLoc(item)" type="text" >修改地点</el-button>
              <el-button @click="dialogDeleteLoc(item)" type="text" >删除地点</el-button>
            </div>
          </div>
          <div class="loc-roo">
            <div v-for="room,index in item.room" class="room">
              <el-row>
                <el-col :span="6">
                  <div class="room-tit">
                    <span>{{room.name}}</span>
                    <img src="../../assets/edit.png" @click="dialogUpdateRoom(room)">
                    <img src="../../assets/del.png" @click="dialogDeleteRoom(room)">
                  </div>
                  <el-button @click="dialogAddDevice(room)" type="text" >添加设备</el-button>
                </el-col>
                <el-col :span="18">
                  <el-row v-for="device in room.device" class="device">
                    <div>
                      <span>{{device.name}}:{{device.sensor[0].ip}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
                      <span style="font-size:12px">{{device.create_time}}&nbsp;&nbsp;</span>
                    </div>
                      <el-button @click="dialogStartDevice(device)" type="text" style="color:red" v-if="device.sensor[0].isStart == true">&nbsp;&nbsp;已开启</el-button>
                      <el-button @click="dialogStartDevice(device)" type="text" style="color:red" v-if="device.sensor[0].isStart == false">&nbsp;&nbsp;已关闭</el-button>
                      <el-button @click="dialogDeleteDevice(device)" type="text" >删除</el-button>
                      <el-button @click="dialogUpdateDevice(device)" type="text" >修改</el-button>
                      <el-button @click="dialogDeviceDetail(device)" type="text" >查看</el-button>
                  </el-row>
                </el-col>
                <!-- <el-col :span="6">
                  <el-button @click="getDeviceList(room)" type="text" >查看设备</el-button>

                </el-col> -->
              </el-row>
            </div>
            <div v-if="item.room.length==0" class="roo-list">
              暂无泵房
            </div>
          </div>
        </div>
      </div>

    </div>
    <!-- 弹出框 -->
    <!-- 系统 -->
    <el-dialog title="添加系统" :visible.sync="isSysAdd" class="sys-add">
      <el-form :model="sysAdd">
        <el-form-item label="系统名称">
          <el-input v-model="sysAdd.name" auto-complete="off" style="width:100%"></el-input>
        </el-form-item>
        <span>系统图标（即该图标在地图上显示的图标）</span><br>
        <div class="change">
          <ul class="s">
            <li v-for="(systemImg, index) in sysImg" :class="{'active': sysAdd.pic == index+1 }" v-on:click="changeSysImg(index+1)">
              <img :src=systemImg alt="">
              <span class="systemSelect"></span>
            </li>
          </ul>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isSysAdd = false">取 消</el-button>
        <el-button type="primary" @click="addSys">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="确定删除该系统么？" :visible.sync="isSysDelete" class="sys-add">
      <span style="color:red">删除系统前请关闭所有设备</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isSysDelete = false">取 消</el-button>
        <el-button type="primary" @click="deleteSys">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 地点 -->
    <el-dialog title="添加地点" :visible.sync="isLocAdd" class="sys-add">
      <el-form :model="locAdd">
        <el-form-item label="地点名称">
          <el-input v-model="locAdd.name" auto-complete="off" style="width:100%"></el-input>
        </el-form-item>
        <el-form-item label="具体地址">
          <el-input v-model="locAdd.address" auto-complete="off" style="width:100%">
            <el-button slot="append" @click="locateMap(locAdd)">定位</el-button>
          </el-input>
        </el-form-item>
        <el-form-item>
          <span v-if="locAdd.lat != null">
            经纬度:{{locAdd.lat}},{{locAdd.lng}}
          </span>
          <span v-if="locAdd.lat == null">
            请点击定位按钮确定定位
          </span>
        </el-form-item>
        <div id="demoComponent" class="demo-component">
          <el-amap vid="amap2" :zoom="zoom" :center=center>
            <el-amap-marker :position=center></el-amap-marker>
          </el-amap>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isLocAdd = false">取 消</el-button>
        <el-button type="primary" @click="addLoc">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改地点" :visible.sync="isLocUpdate" class="sys-add">
      <el-form :model="locUpdate">
        <el-form-item label="地点名称">
          <el-input v-model="locUpdate.name" auto-complete="off" style="width:100%"></el-input>
        </el-form-item>
        <el-form-item label="具体地址">
          <el-input v-model="locUpdate.address" auto-complete="off" style="width:100%">
            <el-button slot="append" @click="locateMap(locUpdate)">定位</el-button>
          </el-input>
        </el-form-item>
        <el-form-item>
          <span v-if="locUpdate.lat != null">
            经纬度:{{locUpdate.lat}},{{locUpdate.lng}}
          </span>
          <span v-if="locUpdate.lat == null">
            请点击定位按钮确定定位
          </span>
        </el-form-item>
        <div id="demoComponent" class="demo-component">
          <el-amap vid="amap2" :zoom="zoom" :center=center>
            <el-amap-marker :position=center></el-amap-marker>
          </el-amap>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isLocUpdate = false">取 消</el-button>
        <el-button type="primary" @click="updateLoc">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="确定删除该地点么？" :visible.sync="isLocDelete" class="sys-add">
      <span style="color:red">删除地点前请关闭所有设备</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isLocDelete = false">取 消</el-button>
        <el-button type="primary" @click="deleteLoc">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 房间 -->
    <el-dialog title="添加泵房" :visible.sync="isRoomAdd" class="sys-add">
      <el-form :model="roomAdd">
        <el-form-item label="泵房名称">
          <el-input v-model="roomAdd.name" auto-complete="off" style="width:100%"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isRoomAdd = false">取 消</el-button>
        <el-button type="primary" @click="addRoom">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改泵房" :visible.sync="isRoomUpdate" class="sys-add">
      <el-form :model="roomUpdate">
        <el-form-item label="泵房名称">
          <el-input v-model="roomUpdate.name" auto-complete="off" style="width:100%"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isRoomUpdate = false">取 消</el-button>
        <el-button type="primary" @click="updateRoom">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="确定删除该泵房么？" :visible.sync="isRoomDelete" class="sys-add">
      <span style="color:red">删除泵房前请关闭所有设备</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isRoomDelete = false">取 消</el-button>
        <el-button type="primary" @click="deleteRoom">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 设备 -->
    <el-dialog title="添加设备" :visible.sync="isDeviceAdd" class="sys-add" width="70%">
      <el-form :model="deviceAdd">
        <el-form-item label="设备名称">
          <el-input v-model="deviceAdd.name" auto-complete="off" style="width:70%"></el-input>
        </el-form-item>
        <el-form-item label="通讯协议">
          <el-radio-group v-model="transfer_type">
            <el-radio-button label="Modbus"></el-radio-button>
            <el-radio-button label="TCP S7"></el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="IP地址">
          &nbsp;&nbsp;&nbsp;
          <el-input v-model="deviceAdd.ip" auto-complete="off" style="width:70%"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addSensor(deviceAdd)">添加传感器</el-button>
        </el-form-item>
        <el-form-item v-for="item,index in deviceAdd.sensor">
          <span>点表</span>
          <el-select v-model="item.point" @change="changeSensorPoint(item)">
            <el-option :label="point.name" :value="point._id" :key="point._id" v-for="point in pointList"></el-option>
          </el-select>
          <span>站号/端口号</span>
          <el-input v-model="item.zhan" auto-complete="off" style="width:10%"></el-input>
          <el-button type="text" @click="setAlarm(item)">设置报警(不设置则为默认)</el-button>
          <el-button type="text" @click="deleteSensor(deviceAdd.sensor,index)">删除</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isDeviceAdd = false">取 消</el-button>
        <el-button type="primary" @click="addDevice">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改设备" :visible.sync="isDeviceUpdate" class="sys-add" width="70%">
      <el-form :model="deviceUpdate">
        <el-form-item label="设备名称">
          <el-input v-model="deviceUpdate.name" auto-complete="off" style="width:70%"></el-input>
        </el-form-item>
        <el-form-item label="通讯协议">
          <el-radio-group v-model="transfer_type">
            <el-radio-button label="Modbus"></el-radio-button>
            <el-radio-button label="TCP S7"></el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="IP地址">
          &nbsp;&nbsp;&nbsp;
          <el-input v-model="deviceUpdate.ip" auto-complete="off" style="width:70%"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addSensor(deviceUpdate)">添加传感器</el-button>
        </el-form-item>
        <el-form-item v-for="item,index in deviceUpdate.sensor">
          <span>点表</span>
          <el-select v-model="item.point" @change="changeSensorPoint(item)">
            <el-option :label="point.name" :value="point._id" :key="point._id" v-for="point in pointList"></el-option>
          </el-select>
          <span>站号/端口号</span>
          <el-input v-model="item.zhan" auto-complete="off" style="width:10%"></el-input>
          <el-button type="text" @click="setAlarm(item)">设置报警(不设置则为默认)</el-button>
          <el-button type="text" @click="deleteSensor(deviceUpdate.sensor,index)">删除</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isDeviceUpdate = false">取 消</el-button>
        <el-button type="primary" @click="updateDevice">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="设备详情" :visible.sync="isDeviceDetail" class="device-detail">
      <el-form :model="deviceDetail" v-if="deviceDetail != null">
        <el-form-item label="设备名称">
          <span>{{deviceDetail.name}}</span>
        </el-form-item>
        <el-form-item label="通讯协议">
          <span>{{deviceDetail.sensor[0].transfer_type | transferTypeFilter}}</span>
        </el-form-item>
        <el-form-item label="IP地址">
          &nbsp;&nbsp;&nbsp;
          <span>{{deviceDetail.sensor[0].ip}}</span>
        </el-form-item>
        <el-form-item label="点表" v-for="sensor,index in deviceDetail.sensor">
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <span>{{sensor.point.name}}</span>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <span>站号/端口号:{{sensor.zhan}}</span>
          <el-button type="text" @click="showSensor(sensor)">查看点表及报警</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="isDeviceDetail = false">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="确定删除该设备么？" :visible.sync="isDeviceDelete" class="sys-add">
      <span style="color:red">删除设备前请关闭该设备</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isDeviceDelete = false">取 消</el-button>
        <el-button type="primary" @click="deleteDevice">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="设置报警" :visible.sync="isAlarmSet" class="poi-add" width="95%">
      <table class="poi-tab"  v-if="pointAlarm!=null">
        <thead>
          <tr>
            <th>序号</th>
            <th>名称</th>
            <th>类型</th>
            <th>地址位</th>
            <th>长度</th>
            <th>单位</th>
            <th>小数位</th>
            <th>倍数</th>
            <th>是否报警</th>
            <th>报警上下限</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item,index in pointAlarm.pointEnum">
            <td>{{item.number}}</td>
            <td>{{item.name}}</td>
            <td>{{item.type | pointTypeFilter}}</td>
            <td>{{item.place}}</td>
            <td>{{item.placeLength}}</td>
            <td>{{item.unit}}</td>
            <td>{{item.floatNum}}</td>
            <td>{{item.times}}</td>
            <td>
              <el-select v-model="pointAlarm.alarm.alarmEnum[index].isAlarm" style="width:60px">
                <el-option label="是" :value=true></el-option>
                <el-option label="否" :value=false></el-option>
              </el-select>
            </td>
            <td>
              <el-input v-model="pointAlarm.alarm.alarmEnum[index].low" auto-complete="off" style="width:80px"></el-input>
              <el-input v-model="pointAlarm.alarm.alarmEnum[index].high" auto-complete="off" style="width:80px"></el-input>
            </td>
          </tr>
        </tbody>
      </table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isAlarmSet = false">取 消</el-button>
        <el-button type="primary" @click="updateAlarm">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="点表详情" :visible.sync="isSensorDetail" class="poi-add" width="80%">
      <table class="poi-tab"  v-if="sensorDetail!=null">
        <thead>
          <tr>
            <th>序号</th>
            <th>名称</th>
            <th>类型</th>
            <th>地址位</th>
            <th>长度</th>
            <th>单位</th>
            <th>小数位</th>
            <th>倍数</th>
            <th>是否报警</th>
            <th>报警上下限</th>

          </tr>
        </thead>
        <tbody>
          <tr v-for="item,index in sensorDetail.point.pointEnum">
            <td>{{item.number}}</td>
            <td>{{item.name}}</td>
            <td>{{item.type | pointTypeFilter}}</td>
            <td>{{item.place}}</td>
            <td>{{item.placeLength}}</td>
            <td>{{item.unit}}</td>
            <td>{{item.floatNum}}</td>
            <td>{{item.times}}</td>
            <td>{{sensorDetail.alarm.alarmEnum[index].isAlarm | isTrueFilter}} </td>
            <td>{{sensorDetail.alarm.alarmEnum[index].low}}~{{sensorDetail.alarm.alarmEnum[index].high}}</td>
          </tr>
        </tbody>
      </table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="isSensorDetail = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>


export default {
  name: 'system',
  data () {
    return {
      transferList:[{name:'Modbus',value:'0000000'},{name:'TCP S7',value:'0000001'}],
      pointList:null,
      //系统
      sysList:null,
      sysImg:[],
      sysAdd:{
        name:null,
        pic:null
      },
      isSysAdd:false,
      sysDelete:null,
      isSysDelete:false,
      //地点
      center:[116.404,39.915],
      sysDetail:null,
      zoom:14,
      isLocAdd:false,
      locAdd:{
        name:null,
        lat:null,
        lng:null,
        address:null
      },
      isLocUpdate:null,
      locUpdate:{
        _id:null,
        name:null,
        lat:null,
        lng:null,
        address:null
      },
      isLocDelete:false,
      locDelete:null,
      //房间
      locDetail:null,
      isRoomAdd:false,
      roomAdd:{
        name:null,
      },
      isRoomUpdate:false,
      roomUpdate:{
        name:null,
      },
      isRoomDelete:false,
      roomDelete:null,

      //设备
      transfer_type:'Modbus',
      roomDetail:null,
      deviceDetail:null,
      isDeviceDetail:false,
      isDeviceAdd:false,
      deviceAdd:{
        name:null,
        ip:null,
        transfer_type:null,
        sensor:[],
      },
      isDeviceUpdate:false,
      deviceUpdate:{
        name:null,
        transfer_type:null,
        ip:null,
        sensor:[],
      },
      isDeviceDelete:false,
      deviceDelete:null,

      isAlarmSet: false,
      pointAlarm:null, //
      pointAlarmCompare:null, // 用来比较默认的报警是否修改。如果没有那么就传一个alarm id,有就要传报警的所有字段
      sensorAlarm:null,

      isSensorDetail:false,
      sensorDetail:null,
    }
  },
  created(){
    this.getSysList();
    this.setSysImg();
    this.getPointList();
  },
  filters: {
  imageSrc: function (value) {
      if (!value) return ''
      return require('../../assets/system/sys_'+value+'.png')
    }
  },
  methods:{
    //获取点表
    getPointList(){
      this.$global.httpGetWithToken(this,'sensor/point/all').then(res=>{
        console.log(res)
        this.pointList = res.data.data
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
    getSysList(){
      this.$global.httpGetWithToken(this,'system/system/all',{hasPoint:1}).then(res=>{
        this.sysList = res.data.data
        if(this.sysDetail){
            this.sysList.forEach((item)=>{
              if(this.sysDetail._id == item._id){
                this.sysDetail = item
              }
            })
        }
        // this.args = res.data.data.page
      })
    },
    changeSysImg(item){
      this.sysAdd.pic = item
    },
    dialogAddSys(){
      this.isSysAdd = !this.isSysAdd
    },
    addSys(){
      this.$global.httpPostWithToken(this,'system/system/add',this.sysAdd).then((res)=>{
        this.$global.success(this,'添加成功','')
        this.isSysAdd = !this.isSysAdd
        this.getSysList();
      })
    },
    goToSysDetail(item){
      if(this.isSysDelete != true){
        this.sysDetail = item
      }
    },
    backSys(){
      this.sysDetail = null
    },
    dialogDeleteSys(item){
      this.sysDelete = item
      this.isSysDelete = !this.isSysDelete
    },
    deleteSys(){
      this.$global.httpGetWithToken(this,'system/system/delete/'+this.sysDelete._id).then(res=>{
        this.$global.success(this,'删除成功','')
        this.isSysDelete = !this.isSysDelete
        this.getSysList();
      })
    },

    //地点
    dialogAddLoc(){
      this.isLocAdd = !this.isLocAdd
    },
    dialogUpdateLoc(item){
      this.locUpdate = JSON.parse(JSON.stringify(item))
      this.locateMap(this.locUpdate)
      this.isLocUpdate = !this.isLocUpdate
    },
    dialogDeleteLoc(item){
      this.locDelete = item
      this.isLocDelete = !this.isLocDelete
    },
    addLoc(){
      this.locAdd._id = this.sysDetail._id
      this.$global.httpPostWithToken(this,'system/location/add',this.locAdd).then((res)=>{
        this.$global.success(this,'添加成功','')
        this.isLocAdd = !this.isLocAdd
        this.getSysList();
      })
    },
    updateLoc(){
      this.$global.httpPostWithToken(this,'system/location/update',this.locUpdate).then((res)=>{
        this.$global.success(this,'修改成功','')
        this.isLocUpdate = !this.isLocUpdate
        this.getSysList();
      })
    },
    deleteLoc(){
      this.$global.httpGetWithToken(this,'system/location/delete/'+this.locDelete._id).then(res=>{
        this.$global.success(this,'删除成功','')
        this.isLocDelete = !this.isLocDelete
        this.getSysList();
      })
    },
    locateMap(data){
      this.$global.mapGet(this,{address:data.address,output:'JSON'}).then((res) => {
        console.log(res)
        var temp = res.data.geocodes[0].location.split(',')
        data.lat = parseFloat(temp[0])
        data.lng = parseFloat(temp[1])
        this.center = [data.lat,data.lng]
      })
    },

    //房间
    dialogAddRoom(item){
      this.locDetail = item
      this.isRoomAdd = !this.isRoomAdd
    },
    dialogUpdateRoom(item){
      this.roomUpdate = JSON.parse(JSON.stringify(item))
      this.isRoomUpdate = !this.isRoomUpdate
    },
    dialogDeleteRoom(item){
      this.roomDelete = item
      this.isRoomDelete = !this.isRoomDelete
    },
    addRoom(){
      this.roomAdd._id = this.locDetail._id
      this.$global.httpPostWithToken(this,'system/room/add',this.roomAdd).then((res)=>{
        this.$global.success(this,'添加成功','')
        this.isRoomAdd = !this.isRoomAdd
        this.getSysList();
      })
    },
    updateRoom(){
      this.$global.httpPostWithToken(this,'system/room/update',this.roomUpdate).then((res)=>{
        this.$global.success(this,'修改成功','')
        this.isRoomUpdate = !this.isRoomUpdate
        this.getSysList();
      })
    },
    deleteRoom(){
      this.$global.httpGetWithToken(this,'system/room/delete/'+this.roomDelete._id).then(res=>{
        this.$global.success(this,'删除成功','')
        this.isRoomDelete = !this.isRoomDelete
        this.getSysList();
      })
    },

    //设备
    addSensor(item){
      item.sensor.push({point:null,zhan:null})
    },
    dialogAddDevice(item){
      this.roomDetail = item
      this.isDeviceAdd = !this.isDeviceAdd
    },
    dialogUpdateDevice(item){
      this.deviceUpdate = JSON.parse(JSON.stringify(item))

      this.deviceUpdate.sensor.forEach(function(item){
        item.point = item.point._id
      })

      this.deviceUpdate.ip = this.deviceUpdate.sensor[0] == null? "":this.deviceUpdate.sensor[0].ip
      this.transfer_type = this.deviceUpdate.sensor[0] == null? 'Modbus':(this.deviceUpdate.sensor[0].transfer_type == 0?'Modbus':'TCP S7')
      this.isDeviceUpdate = !this.isDeviceUpdate
    },
    dialogDeleteDevice(item){
      this.deviceDelete = item
      this.isDeviceDelete = !this.isDeviceDelete
    },
    dialogDeviceDetail(item){
      console.log(item)
      this.deviceDetail = item
      this.isDeviceDetail = !this.isDeviceDetail
    },
    deleteSensor(list,index){
      list.splice(index,1)
    },
    addDevice(){
      this.deviceAdd._id = this.roomDetail._id
      this.deviceAdd.transfer_type = this.transfer_type == 'Modbus'? 0:1
      this.$global.httpPostWithToken(this,'system/device/add',this.deviceAdd).then((res)=>{
        this.$global.success(this,'添加成功','')
        this.isDeviceAdd = !this.isDeviceAdd
        this.getSysList();
      })
    },
    updateDevice(){
      this.deviceUpdate.transfer_type = this.transfer_type == 'Modbus'? 0:1
      console.log(this.deviceUpdate)
      this.$global.httpPostWithToken(this,'system/device/update',this.deviceUpdate).then((res)=>{
        this.$global.success(this,'修改成功','')
        this.isDeviceUpdate = !this.isDeviceUpdate
        this.getSysList();
      })
    },
    deleteDevice(item){
      this.$global.httpGetWithToken(this,'system/device/delete/'+this.deviceDelete._id).then(res=>{
        this.$global.success(this,'删除成功','')
        this.isDeviceDelete = !this.isDeviceDelete
        this.getSysList();
      })
    },
    deviceUpdateChange(item){
      console.log(item)
      this.deviceUpdate.transfer_type = item+""
    },
    setAlarm(item) {
      console.log(item)
      if(item.point != null) {
        this.pointList.forEach(point=>{
          if(point._id == item.point){

            this.pointAlarm = JSON.parse(JSON.stringify(point))
            this.pointAlarmCompare = point
            if(item.alarm != null){
              this.pointAlarm.alarm = JSON.parse(JSON.stringify(item.alarm))
              this.pointAlarmCompare.alarm = item.alarm
            }
          }
        })
        this.sensorAlarm = item
        this.isAlarmSet = !this.isAlarmSet
      } else {
        this.$global.error(this,'请选择点表','')
      }
    },
    changeSensorPoint(item){
      console.log(item)
      this.pointList.forEach(point=>{
        if(point._id == item.point){
          item.alarm = point.alarm
        }
      })
    },
    updateAlarm(){
      console.log(this.pointAlarm,this.pointAlarmCompare)
      //点击设置报警，里面却没有改变任何内容时相等
      if(JSON.stringify(this.pointAlarm) != JSON.stringify(this.pointAlarmCompare)){
        this.sensorAlarm.alarm = this.pointAlarm.alarm
        delete this.sensorAlarm.alarm._id
      }
      this.isAlarmSet = !this.isAlarmSet
      console.log(this.deviceUpdate)
    },
    showSensor(sensor){
      console.log(sensor)
      this.isSensorDetail = !this.isSensorDetail
      this.sensorDetail = sensor
    },
    dialogStartDevice(item){
      this.$global.httpGetWithToken(this,'data/start/'+item._id).then(res=>{
        this.$global.success(this,'开启成功','')
        this.getSysList();
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
  margin-bottom: 60px;
}
.sys {
  float: left;
  border-radius: 4px;
  background-color: rgb( 255, 255, 255 );
  box-shadow: 0.5px 0.866px 5px 0px rgb( 174, 174, 174 );
  width: 45%;
  height: 201px;
  margin: 0 40px 40px 0;
  position: relative;
}
.sys:before{
  content: '';
  display: block;
  text-align: center;
  margin: 0 auto;
  background-color: rgb( 20, 135, 202 );
  box-shadow: 0.5px 0.866px 5px 0px rgb( 174, 174, 174 );
  width: 60px;
  height: 12px;
}
.sys:hover{
  cursor: pointer;
}
.systemImg{
  float: left;
  margin-right: 20px;
}
.systemTitle{
  margin-bottom: 5px;
}
.systemImg,.systemIntr{
  position: relative;
  top: 65px;
  left: 65px;
}
.delicon{
  width: 26px;
  height: 26px;
  /* background: url('../../images/del.jpg')no-repeat; */
  position: absolute;
  right: 10px;
  bottom: 10px;
  /* z-index: 9999; */
}
.sys-add {
  text-align: left;
}
.loc {
  /* min-height: 200px; */
  border:1px solid #E0E0E0;
  margin-bottom: 20px;
}
.loc-list {
  /* height: 26px; */
  /* color: white; */
  padding:10px;
  background-color: #00CCFF;
  font-size: 15px;
}
.loc-list>span {
  margin-right: 10px;
  font-size: 13px;
}
.loc-list-btn {
  float: right;
}
.loc-list-btn .el-button {
  color: #2c3e50;
  margin-top: -8px;
}
.room {
  min-height: 50px;
  /* padding: 10px; */
  border-bottom: 1px solid #E0E0E0;
  margin-bottom: -1px;
  text-align: center;
}
.room .el-col {
  padding: 5px;
  border-right: 1px solid #E0E0E0;
  margin-right: -1px;
}

.btn-role {
  text-align: right;
  margin-bottom: 5px;
}

.s{
  border-radius: 5px;
  background-color: rgb( 249, 249, 249 );
  box-shadow: 0.5px 0.866px 5px 0px rgb( 174, 174, 174 );
  margin-top: 20px;
}
.s li{
  /*float: left;*/
  display: inline-block;
  margin: 20px 30px;
}
.s li:hover{
  cursor: pointer;
}
.s li img{
  float: left;
}
.systemSelect{
  display: inline-block;
  border-width: 1px;
  /*border-color: rgb( 20, 135, 202 );*/
  border-style: solid;
  border-radius: 4px;
  width: 27px;
  height: 27px;
  /*line-height: 27px;*/
  position: relative;
  left: 20px;
  top: 8px;
}
.s li.active .systemSelect{
  border-color: rgb( 20, 135, 202 );
}
.s li.active .systemSelect:after{
  content: "";
  border: 2px solid rgb( 20, 135, 202 );
  border-left: 0;
  border-top: 0;
  height: 20px;
  width: 10px;
  transform: rotate(45deg);
  left: 7px;
  position: absolute;
  /*top: 1px;*/
}
.btn-loc {
  float: right;
  width: 70px;
}
.loc-tit {
  /* height: 30px; */
  padding: 10px;
  border-bottom: 1px solid #E0E0E0;
  margin-bottom: 10px;
}
.loc-tit-sp1 {
  margin-right: 20px;
  font-size: 20px;
}
.loc-tit-sp2 {
  font-size: 13px;
}
#demoComponent{
  height: 300px;
  width: 100%;
}
.roo-list {
  height: 50px;
  text-align: center;
  padding-top: 20px;
}
.room-tit img{
  width: 15px;
  height:15px;
  margin-left: 5px;
  cursor: pointer;
}
.device {
  border-bottom: 1px solid #E0E0E0;
  text-align: left;
  /* padding-top: 10px; */
}
.device .el-button {
  float: right;
  margin-top: -30px;
}
.device-detail .el-form-item{
  border-bottom: 1px solid #E0E0E0;
  text-align: left;
}
.poi-tab {
  width: 100%;
  border-collapse: collapse;
}
table,table tr th, table tr td { border:1px solid #E0E0E0; }
th,td{
  height: 40px;
  padding-left: 5px;
}
</style>
