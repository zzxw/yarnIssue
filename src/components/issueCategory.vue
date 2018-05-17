<template>
  <div class="category-container">
    <div>
      <el-form label-position="left">
        <el-form-item label="编号类别:">
          <el-select v-model="value" clearable remote :remote-mothod="getCategory" @change="handleCategoryChange" placeholder="请选择">
            <el-option
              v-for="item in options"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div class="category-table">
      <el-table :data="tableData" border highlight-current-row height="600" @current-change="handleTableSelection" style="width: 100%">
        <el-table-column type="index" width="100"/>
        <el-table-column property="code" label="编号" width="180"/>
        <el-table-column property="desc" label="描述"/>
        <el-table-column property="maxcode" label="最大编号" width="200"/>
        <el-table-column property="nextcode" label="新编号" width="200"/>
      </el-table>
    </div>
  </div>
</template>
<script>
  import dao from '../common/restcall.js';
  
  export default {
    data: function(){
      return {
        value: '',
        options: [
        ],
        tableData: [
        ]
      }
    },
    created: function(){
      console.log('issuecategory created.. event called.');
      this.getCategory();
    },
    methods: {
      getCategory : function() {
				dao.getRecordSet('vc/categories',{}, records => {
          if(!records) return;
          let cats = [];
          var record = {};
          records.forEach(function(item){
            let cat = {};
            let value = item.values[1];
            let label = value + ' ' + item.values[3];
            cat.value = item.values[0];
            cat.label = label;
            cats.push(cat);
          });

          this.options = cats;

				});
			},
      
      handleTableSelection: function(val){
        if(val === null || val === undefined){
          return;
        }
        dao.getOneField('vc/subcategory/'+val.code+'/maxcode', {}, maxcode => {
            let nextcode = '';
            if(maxcode === null || maxcode === undefined || maxcode === ''){
              maxcode = '<none>';
              nextcode = val.code + '-01';
            }else{
              let codes = maxcode.split('-');
              let last = codes[codes.length-1];
              let next = (parseInt(last)+1)+'';
              codes[codes.length-1]=next;
              nextcode = codes.join('-');
            }
            val.maxcode = maxcode;
            val.nextcode = nextcode;
            if(window.clipboardData){
              window.clipboardData.setData('Text', nextcode);
              console.log('copy data:' + nextcode);
            }else{
              console.log('do not support clipboard');
            }
            
        });
      },
      
      handleCategoryChange: function(){
        dao.getRecordSet('vc/category/'+this.value+'/list',{}, records => {
          let cats = [];
          var record = {};
          records.forEach(function(item){
            let cat = {};
            cat.id = item.values[0];
            cat.code = item.values[2];
            cat.desc = item.values[3];
            cat.maxcode = '';
            cat.nextcode = '';
            cats.push(cat);
          });
          this.tableData = cats;
				});
      }
    },
    components: {
    }
  }

</script>
<style>
.category-container {
  display: flex;
  flex-direction: column;
}

.category-table {
  flex: 1;
  overflow: auto;
}
</style>