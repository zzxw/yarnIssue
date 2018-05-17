<template>
  <div style="padding: 0 20px 0 0;">
    <div>
      <label>项目名称</label>
      <el-select  clearable  placeholder="请选择项目" v-model="query.criteria.project" @change="refreshData">
        <el-option v-for="project in projects" :label="project" :value="project"></el-option>
      </el-select>
      <label>日期范围</label>
      <el-date-picker
        v-model="query.criteria.daterange"
        type="daterange" :picker-options="pickerOptions"
        placeholder="选择日期范围"  @change="refreshData">
      </el-date-picker>          
    </div>
    <el-row :gutter="8">
      <el-col :span="2">
      </el-col>
      <el-col :span="20">
        <div class="small">
          <line-chart :chart-data="lineDataCollection" :options="lineChartOptions" :height="500" @click="clickTrend"></line-chart>
        </div>
      </el-col>
      <el-col :span="2">
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import LineChart from '../components/LineChart.js';
  import dao from '../common/restcall.js';
  
  export default {
    components: {
      LineChart
    },
    data () {
      return {
        colors: ['#CC9999','#FF9966','#CC3333','#FF6666','#993333','#FF6666','#FFFF00','#CC9966'
          ,'#99CC00','#FFCCCC','#CCCC99','#FFCCCC','#003366','#0066CC','#003300','#CC0033','#CC9966'
          ,'#993333','#CC0033','#999933','#666666','#CCCC00','#333333','#333399','#993333','#CC9999'
          ,'#663366','#33CC33','#336633','#000000'
        ],
        lineDataCollection: null,
        lineChartOptions: {
          scaleLineWidth: 1,
          scaleLineColor: "rgba(0,0,0,.1)",
          responsive: true, 
          maintainAspectRatio: false,
          scaleShowLabels : true,
          scaleShowHorizontalLines: true,
          scaleShowVerticalLines: true
        },
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
        projects: [],
        query: {
          page: {
            currentPage: 1,
            size: 0
          },
          criteria: {
            project: '',  
            daterange: [] //日期范围
          },
          order: {
            by: '',
            type: ''
          }
        }
      }
    },
    created(){
      this.getProjects();
      this.refreshData();
      console.log(this.$refs.canvas);
    },
    mounted () {
      this.refreshData();
      console.log('canvas for linechart:' + this.$refs.canvas);
    },
    methods: {
      clickTrend(evt){
        console.log('click Trend: ' + evt);
      },
      getProjects(){
        let self = this;
        dao.getFirstColValues('vc/projects',{}, values => {
          self.projects = values;
//          values.forEach(function(item){
//            self.projects.push(item);
//          });
        });
      },
      refreshData(){
        this.refreshCountDays();
      },
      refreshCountDays(){
        dao.getRecordsByPost('vc/count/days',this.query, (records, total) => {
          let labels = [];
          let datas = [];
          records.forEach(function(item){
            let label = item.report_date;
            let lsize = label.length;
            if(lsize === 10){
            }else if(lsize === 6){
              label += '(星期)';
            }else{
              label += '(月份)';
            }
            
            labels.push(label);
            datas.push(parseInt(item.icount));
          });
          console.log('labels:' + JSON.stringify(labels));
          console.log('datas: ' + JSON.stringify(datas));
          this.lineDataCollection = {
            labels: labels,
            datasets: [
              {
                label: '一线报告问题',
                backgroundColor: 'rgba(65,184,131,0.5)',
                strokeColor: "rgba(220,220,220,1)",
                data: datas
              }
            ]
          };
        }, error=> {
          alert(error);
        });
      }
    }
  }
</script>

<style>
  .small {
    width: 100%;
    max-width: 100%;
    margin:  15px auto;
  }
</style>