<template>
  <div class="issues-container">
    <el-row>
      <el-col :span="15">
        <div @keyup.enter="retrieveTableData">
          <el-input v-model="query.criteria.search.value" placeholder="模糊查询" style="width:500px;" >
            <i class="el-icon-search" slot="prepend"></i>
            <el-checkbox slot="append" v-model="query.criteria.search.isRegexp">正则</el-checkbox>
          </el-input>
          <el-button type="primary" icon="search" @click="onSubmit"></el-button>
          <el-button type="primary" icon="close" @click="onReset"></el-button>
          <el-button type="primary" :icon="advanceSearch? 'arrow-up':'arrow-down'" @click="onAdvanceSearch">高级搜索</el-button>
        </div>
      </el-col>
      <el-col :span="9">
        <div>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="query.page.currentPage"
            :page-sizes="[10, 20, 30, 40, 50]"
            :page-size="query.page.size"
            layout="total, sizes, prev, pager, next"
            :total="totalRecords">
          </el-pagination>
        </div>
        
      </el-col>
    </el-row>
    <el-row v-show="advanceSearch">
      <el-col>
        <div>
          <label>项目名称</label>
          <el-select  clearable  placeholder="请选择项目" v-model="query.criteria.project" @change="retrieveTableData">
            <el-option v-for="project in projects" :label="project" :value="project"></el-option>
          </el-select>
          <label>问题状态</label>
          <el-select v-model="query.criteria.status" multiple placeholder="状态选择" @change="retrieveTableData">
            <el-option v-for="(k,v) in status" :label="k" :value="v"></el-option>
          </el-select>   
          <label>日期范围</label>
          <el-date-picker
            v-model="query.criteria.daterange"
            type="daterange" :picker-options="pickerOptions"
            placeholder="选择日期范围"  @change="retrieveTableData">
          </el-date-picker>          
        </div>
      </el-col>
    </el-row>
    <div class="issues-table">
      <el-table :data="tableData" border stripe height="600" v-loading="loading" @sort-change="sortChanged" element-loading-text="拼命加载中" style="width: 100%">
        <el-table-column property="code" label="编号" width="180">
          <template scope="scope"><a href="#" @click="openIssue(scope.row)">{{ scope.row.codes }}</a></template>
        </el-table-column>
        <el-table-column property="subject" label="标题" sortable="custom">
          <template scope="scope"><i class="icono-paperClip"></i>{{ scope.row.subject }}</template>
        </el-table-column>
        <el-table-column property="priority" label="优先级" width="100" sortable="custom">
          <template scope="scope">{{ scope.row.priority | priority }}</template>
        </el-table-column>
        <el-table-column property="report_project" width="100" label="项目" sortable="custom"/>
        <el-table-column property="report_version" width="150" label="版本" sortable="custom"/>
        <el-table-column property="report_time" width="120" :formatter="formatter" label="时间" sortable="custom"/>
        <el-table-column property="status" width="100" :formatter="formatter" label="状态" sortable="custom"/>
      </el-table>
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
        projects: [], //系统项目清单
        totalRecords: 0,  //记录总数
        query: {
          page: {
            currentPage: 1,
            size: 10
          },
          criteria: {
            search: {value: '', isRegexp: false},
            status: [],
            project: '',  
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
      //get project list
      dao.getFirstColValues('vc/projects',{}, values => {
        values.forEach(function(item){
          self.projects.push(item);
        });
      });
      
      //retrieve first page issues without condition
      self.retrieveTableData();
      
      self.status = ops.getOptions('issue_status');

    },
    methods: {
      sortChanged: function(column, prop, order){
        console.log('sort changed:' + JSON.stringify(column));
        if(column){
          this.query.order.by = column.prop;
          this.query.order.type = column.order;
        }else{
          this.query.order.by = '';
          this.query.order.type = '';
        }
        console.log('sort changed:' + JSON.stringify(this.query.order));
        this.retrieveTableData();
      },
      onAdvanceSearch: function(){
        this.advanceSearch = !this.advanceSearch;
        if(!this.advanceSearch){
          this.query.criteria.status = [];
          this.query.criteria.project = '';
          this.query.criteria.daterange = '';
          this.retrieveTableData();
        }
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
        this.query.criteria.search.value = '';
        this.query.criteria.search.isRegexp = false;
        this.query.criteria.status = [];
        this.query.criteria.project = '';
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
      retrieveTableData: function(){
        this.loading = true;
        dao.getRecordsByPost('vc/search',this.query, (records, total) => {
          this.loading = false;
          let cats = [];
          var record = {}; //{"id":"5120","ce_code":"","gdb_code":"RFACE1701002179","rm_code":"#46800","subject":"xxxx","report_project":"MIZUHO BANK","report_time":"2017-03-24 07:00:31.0","report_version":"CEV3.1.0","status":"P"}
          records.forEach(function(item){
            let cat = item;
            cat.codes = item.ce_code + '/' + item.gdb_code + '/' + item.rm_code;
            cat.code = item.ce_code===''? (item.gdb_code===''? item.rm_code: item.gdb_code) : item.ce_code;
            cats.push(cat);
          });
          this.tableData = cats;
          this.totalRecords = total;
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
  .issues-container {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .issues-table {
    flex: 1;
    overflow: auto;
  }
</style>