<template>
  <el-tabs class="tabs-container" :value="activeName" type="card" @tab-click="handleClick" @tab-remove="removeTab" @edit="handleEdit">
    <el-tab-pane label="问题跟踪" name="second" class="tab-detail"><issues/></el-tab-pane>
    <el-tab-pane class="tab-detail"
      v-for="(item, index) in issues"
      :label="item.code"
      :name="item.id"
      closable
    >
      <issue :issueFrom="item"></issue>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
  import issues from './issues.vue';
  import issue from './issue.vue';
  
  export default{
    data(){
      return{
        issues: this.$store.getters.getOpenIssues
      }
    },
    computed: {
      activeName(){
        return this.$store.getters.getActiveName;
      }
    },
    methods: {
      handleEdit(targetName, action) {
        console.log('tabs edit:' + targetName + ',' + action);
      },
      handleClick(tab, event){
        console.log(tab);
      },
      removeTab(targetName) {
        console.log('remove tab: ' + targetName);
        this.$store.dispatch('closeIssue', targetName);  
      }
    },
    components: {
      issues,
      issue
    }
  }
</script>
<style lang="sass">
  .tabs-container {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .tab-detail {
    flex: 1;
  }
</style>