<template>
  <div style="padding: 0 0 20px 0;">
    <el-row> <!-- choose version number -->
      <el-col :span="24">
        <label>请选择版本号: </label>
        <el-select  clearable  placeholder="请选择版本号" v-model="selectedVersion" @change="retrieveVersionInfo">
          <el-option v-for="version in versions" :label="version" :value="version"></el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="14"> <!-- version issue list -->
        <el-table :data="tableData" border stripe height="600" v-loading="loading" element-loading-text="拼命加载中" style="width: 100%">
          <el-table-column property="code" label="CE编号" width="140">
            <template scope="scope"><a href="#">{{ scope.row.ce_code }}</a></template>
          </el-table-column>
          <el-table-column property="subject" label="标题" sortable="custom">
            <template scope="scope">{{ scope.row.subject }}</template>
          </el-table-column>
          <el-table-column property="report_project" width="100" label="项目" sortable="custom"/>
        </el-table>
      </el-col>
      <el-col :span="10"> <!-- version source files -->
        <el-table :data="sourceFiles" border stripe height="600" v-loading="loading" element-loading-text="拼命加载中" style="width: 100%">
          <el-table-column label="代码清单">
            <template scope="scope">{{ scope.row.file_name }}</template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import dao from '../common/restcall.js';
  
  export default {
    components: {
    },
    data () {
      return {
        loading: false, //loading 图标显示控制
        selectedVersion: '',
        versions: [],
        tableData: [], //表格数据
        sourceFiles: [] //core修改的源代码文件列表
      }
    },
    created(){
      this.getVersions();
    },
    mounted () {
    },
    methods: {
      getVersions : function() {
        dao.getRecordsMap('vc/versions', {}, (records) => {
          if(!records) return;
          let vers = [];
          records.forEach(function(item){
            vers.push(item.version);
          });

          this.versions = vers;

				});
			},
      retrieveVersionInfo: function(){
        this.loading = true;
        dao.getRecordsMap('vc/version/'+this.selectedVersion+'/issues', {}, (records, total) => {
          this.tableData = records;
          
          //get source files
          dao.getRecordsMap('vc/version/'+this.selectedVersion+'/sources', {}, (records, total) => {
            this.loading = false;
            this.sourceFiles = records;  
          }, error => {
            this.loading = false;
            alert(error);
          });
          
        }, error=> {
          this.loading = false;
          alert(error);
        });
      }
    }
  }
</script>

<style>
</style>