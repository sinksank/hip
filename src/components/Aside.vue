<template>
  <el-menu
    :style="{ width: !isCollapse ? '230px' : '64px' }"
    active-text-color="#ffd04b"
    background-color="#545c64"
    class="aside-container"
    text-color="#fff"
    @open="handleOpen"
    @close="handleClose"
    :collapse="isCollapse"
    :default-active="active"
  >
    <p class="logo-lg">{{ isCollapse ? 'MDMD' : 'MDMD管理' }}</p>
    <TreeMenu :index="1" :menuData="menuData" />
  </el-menu>
</template>

<script setup>
import { reactive, computed } from 'vue'
import TreeMenu from './treeMenu.vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
const router = useRouter()
// console.log(router,'router')
const menuData = reactive(router.options.routes[0].children)
const store = useStore()
const isCollapse = computed(() => store.state.menu.isCollapse)
const handleOpen = () => {}
const handleClose = () => {}
const active = computed(() => store.state.menu.menuActive)
</script>

<style lang="less" scoped>
.aside-container {
  // 高度继承父亲
  height: 100%;
  .logo-lg {
    font-size: 20px;
    text-align: center;
    height: 50px;
    line-height: 50px;
    color: #fff;
  }
}
</style>
