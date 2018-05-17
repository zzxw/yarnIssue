<template>
  <div>
    <el-collapse v-model="activeNames">
      <el-collapse-item name="summary">
        <template slot="title">
          <b>{{issueFrom.subject}}</b>
        </template>
        <el-row>
          <el-col :span="16">
            <p>Status: {{issueFrom.status}}</p>
          </el-col>
          <el-col :span="8">
            <issue-doc :issueFrom="issueFrom"></issue-doc>
          </el-col>
        </el-row>
      </el-collapse-item>
      
      <!-- 描述：原先用 v-html="" 来展示mail内容，但因为样式会互相冲突，故改成iframe -->
      <!--
      <el-collapse-item v-for="(log, index) in logs"  :name="index+''">
        <template slot="title">
          <i class="el-icon-message"></i><b>{{log.subject | slim(100)}}</b> <i>{{log.time}} from: {{log.by}}</i>
        </template>
        <iframe :src = "baseurl+'vc/issuelog/'+log.id" style="width:100%; height: 500px"></iframe>
      </el-collapse-item>
      -->
    </el-collapse>
    <el-row>
      <el-col :span="8">
    <el-table :data="logs" border @row-click="changeUrl" 
      highlight-current-row height="500" max-height="500"
      :show-header="false" style="width: 100%">
      <el-table-column property="subject" label="标题" :show-overflow-tooltip="false">
        <template scope="scope">
          <div>
          <div width="100%">
            <i>{{scope.row.by}}</i>
            <i style="float: right;">{{scope.row.time}}</i>
          </div>
          <div width="100%"><b>{{scope.row.subject}}</b></div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    </el-col>
    <el-col :span="16">
      <iframe :src="activeUrl" width="100%" height="400px"></iframe>
    </el-col>
    </el-row>
  </div>
</template>
<script>
  import dao from '../common/restcall.js';
  import issueDoc from './issue-docs.vue';
  
  export default {
    props: ['issueFrom'],
    data: function(){
      return {
        logs: [],
        activeNames: [],
        activeUrl: ''
      }
    },
    created: function(){
      console.log('issue code:' + this.issueFrom.id);
      let self = this;
      var loges = []
      dao.getRecordsMap('vc/issue/' + this.issueFrom.id,{}, records => {
        records.forEach( record => {
          var log = {};
          log.id = record.id;
          log.subject = record.subject;
          log.by = record.log_by;
          log.time = record.log_time;
          self.logs.push(log);
        });
      }); 
    },
    computed: {
      baseurl: function(){
        return dao.baseurl;  
      }
    },
    methods: {
      changeUrl: function(row, event, column){
        this.activeUrl = dao.baseurl + 'vc/issuelog/' + row.id;
      }
    },
    components: {
      issueDoc
    }
  }

</script>
<style>
  pre {
    white-space: pre-wrap;
    word-wrap: break-word;
    background-color: lightgrey;
  }
  
  .his-msg {
    border: 1;
    margin: 20px;
  }
</style>