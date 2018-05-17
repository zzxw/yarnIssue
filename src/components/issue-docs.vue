<template>
  <div>
    <p>documents:</p>
    <ul>
      <li v-for="doc in docs"><a :href="docUrl + doc.id">{{ doc.name }}</a></li>
    </ul>
  </div>
</template>
<script>
  import dao from '../common/restcall.js';
    
  export default {
    props: ['issueFrom'],
    data: function(){
      return {
        docs: [],
      }
    },
    computed: {
      docUrl: function(){
        return dao.baseurl + 'vc/download/';
      }
    },
    created: function(){
      console.log('issue code:' + this.issueFrom.id);
      let self = this;
      
      var docs = [];
      dao.getRecordSet('vc/docs/' + this.issueFrom.id,{}, records => {
        records.forEach( record => {
          var doc = {};
          doc.id = record.values[0];
          doc.name = record.values[1];
          doc.type = record.values[2];
          doc.description = record.values[3];
          self.docs.push(doc);
        });
      });

    },
    methods: {
      openDoc: function(docid){
        console.log('open doc: ' + docid);
      }
    },
    components: {
      dao
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