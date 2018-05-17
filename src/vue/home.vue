<template>
  <div>
    <div align="center">
    <h2>CE问题追踪系统集编码管理，智能搜索，统计报表，版控辅助于一身</h2>
    </div>
  <el-row :gutter="10">
    <el-col :span="8">
      <el-card :body-style="{ padding: '20px' }">
        <img src="../img/category2.jpg" class="image" @click="handleSelect('issue-category')">
        <div style="padding: 14px;" align="center">
          <span>编码管理</span>
        </div>
      </el-card>
    </el-col>
    <el-col :span="8">
      <el-card :body-style="{ padding: '20px' }">
        <img src="../img/search1.jpg" class="image" @click="handleSelect('issue-trace')">
        <div style="padding: 14px;" align="center">
          <span>问题追踪</span>
        </div>
      </el-card>
    </el-col>
    <el-col :span="8">
      <el-card :body-style="{ padding: '20px' }">
        <img src="../img/count2.jpg" class="image" @click="handleSelect('issue-count')">
        <div style="padding: 14px;" align="center">
          <span>统计信息</span>
        </div>
      </el-card>
    </el-col>
  </el-row>
  </div>
</template>
<script>
	export default {
    data() {
      return {
        currentDate: new Date()
      };
    },
    methods: {
      handleSelect(key) {
        switch(key){
        case 'issue-category':
          this.$router.push('/issue/category');
          break;
        case 'issue-count':
          this.$router.push('/issue/count');
          break;
        case 'issue-trace':
          this.$router.push('/issue/trace');
          break;
        default:
          this.$router.push('/');
        }
        console.log(key, keyPath);
      }
    },
		mounted : function() {
		}
	}
</script>

<style>
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
  .image {
    width: 100%;
    display: block;
    cursor: pointer;
  }
</style>