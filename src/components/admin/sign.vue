<template>
  <div class="sign">
    <div class="sign-btn">
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
      <el-button @click="exportData" class="sign-button" primary>导出数据</el-button>
    </div>
    <div class="content">
      <el-table
      :data="signList"
      border
      style="width:100%;">
      <el-table-column
        prop="userName"
        label="处理人">
      </el-table-column>
      <el-table-column
        prop="realAddress"
        label="手写地址">
      </el-table-column>
      <el-table-column
        prop="address"
        label="定位地址">
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="签到日期">
      </el-table-column>
      <el-table-column
        prop="problems"
        label="问题">
      </el-table-column>
      <el-table-column
        prop="teamwork"
        label="协调工作">
      </el-table-column>
      <el-table-column
        prop="detailMsg"
        label="描述">
      </el-table-column>
    </el-table>

  </div>
    <div class="btm">
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change = "pageChange"
        :current-page="parseInt(args.pageNum)"
        :page-count="args.totalPage">
      </el-pagination>
    </div>
  </div>
</template>

<script>

export default {
  name: 'user',
  data () {
    return {
      signList:null,
      args:{
        pageNum:1,
        pageSize:30,
        totalPage:1
      },
      timePicker:''
    }
  },
  created(){
    this.getSignList();
    // this.getRoleList();
  },
  methods:{
    getSignList(){
      if(this.timePicker != ''){
        this.args.fromDate = this.timePicker[0]
        this.args.toDate = this.timePicker[1]
      }
      this.$global.httpGetWithToken(this,'work/sign/all',this.args).then(res=>{
        console.log(res)
        this.signList = res.data.data
        this.args = res.data.page
      })
    },

    pageChange(val){
      this.args.pageNum = val
      this.getSignList()
    },
    timeChange(val){
      console.log(val)
      this.args.pageNum = 1;
      this.getSignList()
    },
    exportData(){

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
.sign-btn{
  text-align: left;
  padding-left: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e6e6e6;
}
.sign-button {
  float:right;
  margin-right: 10px;
}
</style>
