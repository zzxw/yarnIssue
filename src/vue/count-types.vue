<template>
  <div style="padding: 0 20px 0 0;">
    <div>
      <label>项目名称</label>
      <el-select  clearable  placeholder="请选择项目" v-model="query.criteria.project" @change="refreshData">
        <el-option v-for="project in projects" :label="project" :value="project"></el-option>
      </el-select>
      <label>日期范围</label>
      <date-range>
      </date-range>          
    </div>
    <el-row :gutter="8">
      <el-col :span="16">
        <div class="small">
          <line-chart :chart-data="lineDataCollection" :options="lineChartOptions" :height="500"></line-chart>
        </div>
      </el-col>
      <el-col :span="8">
        <pie-chart :chart-data="pieDataCollection" :options="lineChartOptions" :height="500"></pie-chart>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import dateRange from '../components/date-range-picker.vue';
  import LineChart from '../components/LineChart.js';
  import PieChart from '../components/PieChart.js';

  import dao from '../common/restcall.js';
  
  export default {
    components: {
      PieChart,
      LineChart,
      dateRange
    },
    data () {
      return {
        colors: ['#CC9999','#FF9966','#CC3333','#FF6666','#993333','#FF6666','#FFFF00','#CC9966'
          ,'#99CC00','#FFCCCC','#CCCC99','#FFCCCC','#003366','#0066CC','#003300','#CC0033','#CC9966'
          ,'#993333','#CC0033','#999933','#666666','#CCCC00','#333333','#333399','#993333','#CC9999'
          ,'#663366','#33CC33','#336633','#000000'
        ],
        lineDataCollection: null,
        pieDataCollection: null,
        lineChartOptions: {
          scaleLineWidth: 1,
          scaleLineColor: "rgba(0,0,0,.1)",
          responsive: true, 
          maintainAspectRatio: false,
          scaleShowLabels : true,
          scaleShowHorizontalLines: true,
          scaleShowVerticalLines: true
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
//    this.getProjects();
//    this.refreshData();
    },
    mounted () {
//    this.refreshData();
    },
    methods: {
      getProjects(){
        let self = this;
        dao.getFirstColValues('vc/projects',{}, values => {
          self.projects = values;
        });
      },
      refreshData(){
        this.refreshCountProjects();
        this.refreshCountDays();
      },
      refreshCountProjects(){
        dao.getRecordsByPost('vc/count/projects',this.query, (records, total) => {
          const displayCount = 6;
          let colors = total > displayCount? this.colors.slice(0, displayCount) : this.colors.slice(0, total);
          let labels = [];
          let datas = [];
          records.forEach(function(item){
            let project = item.project === ''? '<unknown>': item.project;
            labels.push(project);
            datas.push(parseInt(item.icount));
          });
          //calculate others information.
          if(total > displayCount){
            labels.splice(displayCount, total-displayCount);
            labels[displayCount-1]='Others';
            for(var i=displayCount;i<(total - displayCount);i++){
              datas[displayCount-1] += datas[i];
            }
            datas.splice(displayCount, total-displayCount);
          }
          this.pieDataCollection = {
            labels: labels,
            datasets: [
              {
                backgroundColor: colors,
                data: datas
              }
            ]
          };
        }, error=> {
          alert(error);
        });
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