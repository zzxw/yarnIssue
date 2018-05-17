<template>
  <el-menu theme="dark" :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
    <el-menu-item index="home">首页</el-menu-item>
    <el-menu-item index="issue-mail">邮件管理</el-menu-item>
    <el-menu-item index="issue-category">编码管理</el-menu-item>
    <el-menu-item index="issue-trace">问题追踪</el-menu-item>
    <el-menu-item index="issue-version">版本控制</el-menu-item>
    <el-submenu index="count">
      <template slot="title">统计信息</template>
      <el-menu-item index="count-trend">问题趋势</el-menu-item>
      <el-menu-item index="count-projects">项目占比</el-menu-item>
      <el-menu-item index="count-types">分类占比</el-menu-item>      
    </el-submenu>
    <el-submenu index="help">
      <template slot="title">帮助</template>
      <el-menu-item index="help-search">问题搜索说明</el-menu-item>
      <el-menu-item index="help-about">关于</el-menu-item>
    </el-submenu>
  </el-menu>
</template>
<script>
  export default {
    data() {
      return {
        activeIndex: '1',
        activeIndex2: '1'
      };
    },
    methods: {
      handleSelect(key, keyPath) {
        switch(key){
        case 'home':
          this.$router.push({name: 'home'});
          break;
        case 'help-about':
          this.$router.push({name: 'about'});
          break;
        case 'help-search':
          this.$router.push({name: 'helpSearch'});
          break;
        case 'issue-mail':
          this.$router.push({name: 'issueMail'});
          break;
        case 'issue-category':
          this.$router.push({name: 'issueCategory'});
          break;
        case 'count-trend':
          this.$router.push({name: 'countTrend'});
          break;
        case 'count-projects':
          this.$router.push({name: 'countProjects'});
          break;
        case 'count-types':
          this.$router.push({name: 'countTypes'});
          break;
        case 'issue-trace':
          this.$router.push({name: 'issueTrace'});
          break;
        case 'issue-version':
          this.$router.push({name: 'issueVersion'});
          break;
        default:
          this.$router.push({name: 'home'});
        }
        console.log(key, keyPath);
      }
    }
  }
</script>
<style>
</style>