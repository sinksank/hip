<template>
  <div>
    <template v-for="(item, index) in filteredMenuData" :key="`${props.index}-${item.meta.id}`">
      <el-menu-item
        @click="handleClick(item, `${props.index}-${item.meta.id}`)"
        :index="`${props.index}-${item.meta.id}`"
      >
        <el-tooltip v-if="isCollapse" :content="item.meta.name" placement="right">
          <el-icon size="20">
            <component :is="item.meta.icon"></component>
          </el-icon>
        </el-tooltip>
        <el-icon v-else size="20">
          <component :is="item.meta.icon"></component>
        </el-icon>
        <span v-show="!isCollapse">{{ item.meta.name }}</span>
      </el-menu-item>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
const store = useStore()
const props = defineProps(['menuData', 'index'])
const router = useRouter()
const isCollapse = computed(() => store.state.menu.isCollapse)
const userRole = computed(() => store.state.menu.userRole)

// 过滤菜单数据
const filteredMenuData = computed(() => {
  // return props.menuData.filter((item) => {
  // return (
  //   (userRole.value === '医生' && item.meta.role === '医生') ||
  //   (userRole.value === '管理员' && item.meta.role === '管理员')
  // )
  // })
  return props.menuData
})
console.log(props.menuData)
// 点击菜单跳转（路由）
const handleClick = (item) => {
  router.push(item.meta.path)
  store.commit('addMenu', item.meta)
  //  store.commit('updateMenuActive',active)
}
</script>

<style scoped lang="less"></style>
