<template>
  <el-date-picker
    type="daterange" :picker-options="pickerOptions"
    @change="rangeChanged"
    v-model="range"
    placeholder="选择日期范围">
  </el-date-picker>          
</template>
<script>
  export default {
    data: function(){
      return {
        range: null,
        pickerOptions: { //日期范围组件定制选项
          shortcuts: [{
            text: '最近1周',
            onClick(picker) {
              console.log('week click.');
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
              picker.$emit('change', [start, end]);
            }
          }, {
            text: '最近30天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 29);
              picker.$emit('change', [start, end]);
            }
          }, {
            text: '最近90天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 89);
              picker.$emit('change', [start, end]);
            }
          }, {
            text: '最近1年',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 364);
              picker.$emit('change', [start, end]);
            }
          }]
        }
      };
    },
    created: function(){ //组件初始化事件
      console.log('calendar initialized.');
    },
    methods: {
//    updateValue: function(value){
//      console.log('calendar update value is called, value is:' + value);
//    },
      rangeChanged: function(value){
        console.log('range value is changed.'+typeof(value)+',' + this.range);
      }
    },
    components: {
    }
  }
</script>
<style>
</style>