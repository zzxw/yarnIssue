<template>
  <div class="mail-content" style="background-color: lightblue;">
    <div class="mail-search">
      <el-popover ref="popover1" placement="top-start" title="高级搜索" width="400" trigger="click" :offset="-600">
        <div>
          <label>邮件状态</label>
          <el-select v-model="query.criteria.status" clearable placeholder="状态选择" @change="retrieveTableData">
            <el-option v-for="(k,v) in status" :label="k" :value="v"></el-option>
          </el-select>   
          <br>
          <label>日期范围</label>
          <el-date-picker
            v-model="query.criteria.daterange"
            type="daterange" :picker-options="pickerOptions"
            placeholder="选择日期范围"  @change="retrieveTableData">
          </el-date-picker>          
        </div>
      </el-popover>
  
      <div style="padding: 5px 10px 0 0;">
        <el-row>
          <el-col :span="18">
            <div @keyup.enter="retrieveTableData">
              <el-input v-model="query.criteria.subject" placeholder="模糊查询" style="width:500px;" >
                <i class="el-icon-search" slot="prepend"></i>
                <el-button type="primary" :icon="advanceSearch? 'arrow-up':'arrow-down'" @click="onAdvanceSearch"  v-popover:popover1 slot="append"/>
              </el-input>
              <el-button type="primary" icon="search" @click="onSubmit"></el-button>
              <el-button type="primary" icon="close" @click="onReset"></el-button>
  
            </div>
          </el-col>
          <el-col :span="6">
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="mail-list">
      <div class="mail-side-left">
        <div>
          <el-pagination style="float: right;"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="query.page.currentPage"
            layout="total, prev, next"
            :total="totalRecords">
          </el-pagination>
        </div>
        <div style="flex: 1; overflow: auto;">
          <el-table ref="mails" :data="tableData" border v-loading="loading" @row-click="retrieveMailContent" 
            highlight-current-row 
            element-loading-text="拼命加载中" :show-header="false" style="width: 100%">
            <el-table-column property="subject" label="标题" :show-overflow-tooltip="false">
              <template scope="scope">
                <i>{{scope.row.from_address}}</i><br>
                <b>{{scope.row.subject}}</b>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <iframe class="mail-side-right" :src="mailUrl"></iframe>
      <!--
      <div class="mail-side-right">
        <div class="his-msg" v-if="mail.html" v-html="mail.html"></div>
        <div class="his-msg" v-else>{{mail.text}}</div>
      </div>
      -->
    </div>  
  </div>
</template>
<script>
  import dao from '../common/restcall.js';
  import ops from '../common/options.js';
  
  export default {
    data: function(){
      return {
        pickerOptions: { //日期范围组件定制选项
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近30天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 29);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近90天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 89);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近1年',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 364);
              picker.$emit('pick', [start, end]);
            }
          }]
        },        
        loading: false, //loading 图标显示控制
        advanceSearch: false, //显示高级搜索控制
        tableData: [], //表格数据
        status: [], //issue状态清单
        totalRecords: 0,  //记录总数
        mailUrl: '',
        query: {
          page: {
            currentPage: 1,
            size: 10
          },
          criteria: {
            subject: '',
            status: '',
            daterange: '' //日期范围
          },
          order: {
            by: '',
            type: ''
          }
        }
      }
    },
    created: function(){ //组件初始化事件
      console.log('issues created.');
      let self = this;
      
      //retrieve first page issues without condition
      self.retrieveTableData();
      
      self.status = ops.getOptions('mail_status');

    },
    methods: {
      onAdvanceSearch: function(){
        this.advanceSearch = !this.advanceSearch;
//      if(!this.advanceSearch){
//        this.query.criteria.status = '';
//        this.query.criteria.daterange = '';
//        this.retrieveTableData();
//      }
      },
      openIssue: function(row){
        let issue = row;

        this.$store.dispatch('openIssue', issue);  
      },
      onSubmit: function(){
        this.query.page.currentPage = 1;
        this.retrieveTableData();
      },
      onReset: function(){
        this.query.criteria.subject = '';
        this.query.criteria.status = '';
        this.query.criteria.daterange = '';
        this.query.order.by = '';
        this.query.order.type = '';
        this.retrieveTableData();
      },
      handleSizeChange: function(val){
        console.log('page size:' + val);
        this.query.page.size = val;
        this.retrieveTableData();
      },
      handleCurrentChange: function(val){
        console.log('current page:' + val);
        this.query.page.currentPage = val;
        this.retrieveTableData();
      },
      filterStatus: function(value, row){
      },
      retrieveMailContent: function(row, event, column){
        const mailid = row.id;
        
        this.mailUrl = dao.baseurl + 'vc/mail/' + mailid;
      },
      retrieveTableData: function(){
        this.loading = true;
        dao.getRecordsByPost('vc/mails',this.query, (records, total) => {
          this.loading = false;
          let cats = [];
          var record = {}; //{"id":"5120","ce_code":"","gdb_code":"RFACE1701002179","rm_code":"#46800","subject":"xxxx","report_project":"MIZUHO BANK","report_time":"2017-03-24 07:00:31.0","report_version":"CEV3.1.0","status":"P"}
          records.forEach(function(item){
            let cat = item;
            cats.push(cat);
          });
          this.tableData = cats;
          this.totalRecords = total;
          
          console.log('Table Columns:' + JSON.stringify(this.$refs.mails.columns));
        }, error=> {
          this.loading = false;
          alert(error);
        });
      },
      formatter: function(row, column){
        if(column.property === 'status'){
          return ops.getOptionLabel('issue_status', row.status);
        }else if(column.property === 'report_time'){
          if(row.report_time && row.report_time.length >= 10){
            return row.report_time.substring(0,10);
          }else{
            return row.report_time;
          }
        }
      }
    },
    components: {
    }
  }

</script>
<style>
  .advanceSearch{
    background-color: grey;
    position:absolute;
    left:0px;
    top:35px;
    z-index: 100
  }
  label {
    font-size: 14px;
  }
  .mail-content {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .mail-list {
    display: flex;
    flex-direction: row;
    flex: 1;
  }
  .mail-side-left {
    width: 300px;
    display: flex;
    flex-direction: column;
  }
  .mail-side-right {
    flex: 1;
    overflow: auto;
  }
</style>