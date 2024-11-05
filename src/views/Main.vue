<template>
  <div class="common-layout">
    <el-container>
      <Aside class="aside" />
      <el-container>
        <el-header class="header"><Header /></el-header>
        <el-main style="padding: 10px"> <RouterView /></el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import Aside from '../components/Aside.vue'
import Header from '../components/navHeader.vue'
</script>

<style scoped lang="less">
.common-layout {
  height: 100%;
  // width: 100%;
  .el-container {
    height: 100%;
    // width: 100%;
  }
}
@media print {
  .aside,
  .header {
    display: none; /* 在打印时隐藏 Aside 和 Header */
  }
}
</style>
