<template>
  <div style="padding: 0 20px 0 0;">
    <div>
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
        <pie-chart :chart-data="pieDataCollection" :options="lineChartOptions" :height="500"></pie-chart>
      </el-col>
      <el-col :span="2">
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import PieChart from '../components/PieChart.js';
  import dao from '../common/restcall.js';
  
  export default {
    components: {
      PieChart
    },
    data () {
      return {
        colors: ['#CC9999','#FF9966','#CC3333','#FF6666','#993333','#FF6666','#FFFF00','#CC9966'
          ,'#99CC00','#FFCCCC','#CCCC99','#FFCCCC','#003366','#0066CC','#003300','#CC0033','#CC9966'
          ,'#993333','#CC0033','#999933','#666666','#CCCC00','#333333','#333399','#993333','#CC9999'
          ,'#663366','#33CC33','#336633','#000000'
        ],
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
      this.refreshData();
    },
    mounted () {
      this.refreshData();
    },
    methods: {
      refreshData(){
        this.refreshCountProjects();
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