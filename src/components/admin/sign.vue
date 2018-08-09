<template>
  <div class="sign" v-loading="loading" element-loading-text="导出excel中">
    <div class="sign-btn">
      <span>选择时间段：</span>
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
      <el-button @click="exportData" class="sign-button" type="primary">导出数据</el-button>
    </div>
    <div class="sign-btn2">
      <el-row>
        <el-col :span="2"><span class="demonstration">姓名：</span></el-col>
        <el-col :span="4"><el-input v-model="args.realnamelike" placeholder="请输入内容" size="mini"></el-input></el-col>
        <el-col :span="2"><span class="demonstration">地点：</span></el-col>
        <el-col :span="4"><el-input v-model="args.addresslike" placeholder="请输入内容" size="mini"></el-input></el-col>
        <el-col :span="4"> <el-button @click="searchData" class="sign-button" type="primary" size="mini">查找</el-button></el-col>
      </el-row>




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
    <!-- <el-dialog
    title="数据导出"
    :visible.sync="exportVisible"
    width="30%">
      <div >
        <el-button type="primary" @click="downloadExcel">下载excel</el-button>-->
        <!-- <a :href="'#/file/excel/'+excelSrc" :download="excelSrc">下载excel</a> -->
      <!-- </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="exportVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog> -->
  </div>

</template>

<script>

export default {
  name: 'user',
  data () {
    return {
      signList:null,
      exportVisible:false,
      loading:false,
      args:{
        pageNum:1,
        pageSize:30,
        totalPage:1,
        realnamelike:null,
        addresslike:null,
      },
      timePicker:'',
      excelSrc:null,
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
        this.args.pageNum = res.data.page.pageNum
        this.args.totalPage = res.data.page.totalPage
        this.args.pageSize = res.data.page.pageSize
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
    searchData(){
      this.getSignList()
    },
    // downloadExcel(){
    //   window.open(this.$global.baseUrl+'file/excel/'+this.excelSrc)
    // },
    exportData(){
      this.excelSrc = null
      if(this.timePicker != ''){
        this.args.fromDate = this.timePicker[0]
        this.args.toDate = this.timePicker[1]
      }
      // this.exportVisible = true
      this.loading = true
      this.$global.httpGetWithToken(this,'work/sign/export',this.args).then(res=>{
        this.loading = false
        // console.log(res)
        if(res.src){
          this.excelSrc = res.src
          window.open(this.$global.baseUrl+'file/excel/'+this.excelSrc)
        }
        // this.signList = res.data.data
      }).catch(()=>{
        this.loading = false
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
.sign-btn{
  text-align: left;
  padding-left: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e6e6e6;
}
.sign-btn2{
  text-align: left;
  padding-left: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e6e6e6;
}
.sign-btn2 span{
  /* display:inline-block; */
  margin-left: 10px;
  /* padding-top: 20px; */
}
.sign-button {
  float:right;
  margin-right: 10px;
}
</style>
