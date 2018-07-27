<template>
  <div>
    <div class="content">
      <table class="poi-tab">
        <thead>
          <tr>
            <th>点表名称</th>
            <th>创建日期</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in pointList">
            <td>{{item.name}}</td>
            <td>{{item.create_time}}</td>
            <td>
              <el-button @click="dialogPointDetail(item)" type="text" >详情</el-button>
              <el-button @click="dialogPointUpdate(item)" type="text" >修改</el-button>
              <el-button @click="dialogPointDelete(item)" type="text" >删除</el-button>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="btn-role">
        <el-button @click="dialogPointAdd" type="text" >新建点表</el-button>
      </div>
    </div>
    <el-dialog title="点表详情" :visible.sync="isPointDetail" class="poi-add" width="80%">
      <table class="poi-tab"  v-if="pointDetail!=null">
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
          <tr v-for="item,index in pointDetail.pointEnum">
            <td>{{item.number}}</td>
            <td>{{item.name}}</td>
            <td>{{item.type | pointTypeFilter}}</td>
            <td>{{item.place}}</td>
            <td>{{item.placeLength}}</td>
            <td>{{item.unit}}</td>
            <td>{{item.floatNum}}</td>
            <td>{{item.times}}</td>
            <td>{{pointDetail.alarm.alarmEnum[index].isAlarm | isTrueFilter}} </td>
            <td>{{pointDetail.alarm.alarmEnum[index].low}}~{{pointDetail.alarm.alarmEnum[index].high}}</td>
          </tr>
        </tbody>
      </table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="isPointDetail = false">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改点表" :visible.sync="isPointUpdate" class="poi-add" width="95%">
      <el-form :model="pointUpdate" v-if="pointUpdate != null">
        <el-form-item label="点表名称">
          <el-input v-model="pointUpdate.name" auto-complete="off" style="width:70%"></el-input>
        </el-form-item>
      </el-form>
      <table class="poi-tab"  v-if="pointUpdate!=null">
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
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item,index in pointUpdate.pointEnum">
            <td>{{((item.number = index+1)+(pointUpdate.alarm.alarmEnum[index].number = index+1))/2}}</td>
            <td>
              <el-input v-model="item.name" auto-complete="off" style="width:100px"></el-input>
            </td>
            <td>
              <el-select v-model="item.type" >
                <el-option :label="type" :value="index" :key="index" v-for="type,index in pointType"></el-option>
              </el-select>
            </td>
            <td>
              <el-input v-model="item.place" auto-complete="off" style="width:80px"></el-input>
            </td>
            <td>
              <el-input v-model="item.placeLength" auto-complete="off" style="width:60px"></el-input>
            </td>
            <td>
              <el-input v-model="item.unit" auto-complete="off" style="width:80px"></el-input>
            </td>
            <td>
              <el-input v-model="item.floatNum" auto-complete="off" style="width:80px"></el-input>
            </td>
            <td>
              <el-input v-model="item.times" type="number" auto-complete="off" style="width:80px"></el-input>
            </td>
            <td>
              <el-select v-model="pointUpdate.alarm.alarmEnum[index].isAlarm" style="width:60px">
                <el-option label="是" :value=true></el-option>
                <el-option label="否" :value=false></el-option>
              </el-select>
            </td>
            <td>
              <el-input v-model="pointUpdate.alarm.alarmEnum[index].low" auto-complete="off" style="width:80px"></el-input>
              <el-input v-model="pointUpdate.alarm.alarmEnum[index].high" auto-complete="off" style="width:80px"></el-input>
            </td>
            <td>
              <el-button type="text" @click="updateInsert(index)">插入</el-button>
              <el-button type="text" @click="updateDelete(index)">删除</el-button>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="poi-ins">
        <el-button type="text" @click="updateInsert(pointUpdate.pointEnum.length)">插入最后</el-button>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isPointUpdate = false">取 消</el-button>
        <el-button type="primary" @click="updatePoint">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="添加点表" :visible.sync="isPointAdd" class="poi-add" width="95%">
      <el-form :model="pointAdd" v-if="pointAdd != null">
        <el-form-item label="选择模版">
          <el-select v-model="pointAdd" value-key>
            <el-option :label="pointSimple.name" :value="pointSimple" :key="pointSimple._id" v-for="pointSimple in pointList"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="点表名称">
          <el-input v-model="pointAdd.name" auto-complete="off" style="width:70%"></el-input>
        </el-form-item>
      </el-form>
      <table class="poi-tab">
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
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item,index in pointAdd.pointEnum">
            <td>{{((item.number = index+1)+(pointAdd.alarm.alarmEnum[index].number = index+1))/2}}</td>
            <td>
              <el-input v-model="item.name" auto-complete="off" style="width:100px"></el-input>
            </td>
            <td>
              <el-select v-model="item.type" >
                <el-option :label="type" :value="index" :key="index" v-for="type,index in pointType"></el-option>
              </el-select>
            </td>
            <td>
              <el-input v-model="item.place" auto-complete="off" style="width:80px"></el-input>
            </td>
            <td>
              <el-input v-model="item.placeLength" auto-complete="off" style="width:60px"></el-input>
            </td>
            <td>
              <el-input v-model="item.unit" auto-complete="off" style="width:80px"></el-input>
            </td>
            <td>
              <el-input v-model="item.floatNum" auto-complete="off" style="width:80px"></el-input>
            </td>
            <td>
              <el-input v-model="item.times" type="number" auto-complete="off" style="width:80px"></el-input>
            </td>
            <td>
              <el-select v-model="pointAdd.alarm.alarmEnum[index].isAlarm" style="width:60px">
                <el-option label="是" :value=true></el-option>
                <el-option label="否" :value=false></el-option>
              </el-select>
            </td>
            <td>
              <el-input v-model="pointAdd.alarm.alarmEnum[index].low" auto-complete="off" style="width:80px"></el-input>
              <el-input v-model="pointAdd.alarm.alarmEnum[index].high" auto-complete="off" style="width:80px"></el-input>
            </td>
            <td>
              <el-button type="text" @click="addInsert(index)">插入</el-button>
              <el-button type="text" @click="addDelete(index)">删除</el-button>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="poi-ins">
        <el-button type="text" @click="addInsert(pointAdd.pointEnum.length)">插入最后</el-button>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogPointAddClose">取 消</el-button>
        <el-button type="primary" @click="addPoint">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="确定删除该点表么？" :visible.sync="isPointDelete" class="sys-add">
      <div slot="footer" class="dialog-footer">
        <el-button @click="isPointDelete = false">取 消</el-button>
        <el-button type="primary" @click="deletePoint">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>


export default {
  name: 'role',
  data () {
    return {
      isPointAdd:false,
      pointAdd:{
        alarm:{
          alarmEnum:[]
        },
        pointEnum:[],
        name:null,
      },
      pointType:['实际值*倍数','变频9 工频17 休息2 热继故障36 空开跳闸68 变频故障132',
      '无水故障 1 高水信号2 地面积水信号4 相序故障8 出口超压16 门禁报警32','自动0 手动1','开启1 关闭0','是1 否0'],
      pointList:null,
      isPointDetail:false,
      pointDetail:null,
      isPointUpdate:false,
      pointUpdate:null,
      updateSelect:[-1,-1],
      isPointDelete:false,
      pointDelete:null,
    }
  },
  created(){
    this.getPointList();
  },
  methods:{
    getPointList(){
      this.$global.httpGetWithToken(this,'sensor/point/all').then(res=>{
        console.log(res)
        this.pointList = res.data.data
      })
    },
    //TODO pointAdd 里面的alarm 记得要去掉id，要么就默认给加上了。
    dialogPointAdd(){
      this.isPointAdd = !this.isPointAdd
    },
    dialogPointAddClose(){
      this.isPointAdd = !this.isPointAdd
      this.pointAdd = {
        alarm:{
          alarmEnum:[]
        },
        pointEnum:[],
        name:null,
      }
    },
    dialogPointDetail(item){
      this.pointDetail = item
      this.isPointDetail = !this.isPointDetail
    },
    dialogPointUpdate(item){
      this.pointUpdate = JSON.parse(JSON.stringify(item))
      console.log(this.pointUpdate)
      this.isPointUpdate = !this.isPointUpdate
    },
    dialogPointDelete(item){
      this.pointDelete =  item
      this.isPointDelete = !this.isPointDelete
    },
    addInsert(index){
      this.pointAdd.pointEnum.splice(index,0,{number:index+1,name:"",place:0,placeLength:0,type:0,times:1,unit:"",floatNum:0,isWrite:0})
      this.pointAdd.alarm.alarmEnum.splice(index,0,{isAlarm:false,low:10,high:200})
    },
    addDelete(index){
      this.pointAdd.pointEnum.splice(index,1)
      this.pointAdd.alarm.alarmEnum.splice(index,1)
    },
    addPoint(){
      console.log(this.pointAdd)
      this.$global.httpPostWithToken(this,'sensor/point/add',this.pointAdd).then((res)=>{
        this.$global.success(this,'添加成功','')
        this.isPointAdd = !this.isPointAdd
        this.getPointList();
      })
    },
    updateInsert(index){
      this.pointUpdate.pointEnum.splice(index,0,{number:index+1,name:"",place:0,placeLength:0,type:0,times:1,unit:"",floatNum:0,isWrite:0})
      this.pointUpdate.alarm.alarmEnum.splice(index,0,{isAlarm:false,low:10,high:200})
    },
    updateDelete(index){
      this.pointUpdate.pointEnum.splice(index,1)
      this.pointUpdate.alarm.alarmEnum.splice(index,1)
    },
    updatePoint(){
      // console.log(this.pointUpdate)
      this.$global.httpPostWithToken(this,'sensor/point/update',this.pointUpdate).then((res)=>{
        this.$global.success(this,'修改成功','')
        this.isPointUpdate = !this.isPointUpdate
        this.getPointList();
      })
    },
    deletePoint(){
      this.$global.httpGetWithToken(this,'sensor/point/delete/'+this.pointDelete._id).then((res)=>{
        this.$global.success(this,'删除成功','')
        this.isPointDelete = !this.isPointDelete
        this.getPointList();
      })
    }
  }
}
</script>

<style scoped>
.content {
  text-align: left;
  padding:5px;
  margin-bottom: 60px;
}
.btn-role {
  position:absolute;
  top: 5px;
  right: 20px;
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
.poi-add {
  text-align: left;
}
</style>
