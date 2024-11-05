<template>
  <div class="header-container">
    <!-- Header -->
    <div class="header-left flex_box">
      <el-icon class="icon" size="20" @click="store.commit('collapseMenu')">
        <Fold />
      </el-icon>
      <!-- :class根据条件动态地为元素添加或移除类名 -->
      <ul class="flex_box">
        <li
          v-for="(item, index) in selectMenu"
          :key="item.path"
          :class="{ selected: route.path === item.path }"
          class="tab flex_box"
        >
          <el-icon size="15"><component :is="item.icon" /></el-icon>
          <router-link class="text flex-box" :to="{ path: item.path }">
            {{ item.name }}
          </router-link>
          <el-icon size="15" class="close" @click="closeTab(item, index)"><Close /></el-icon>
        </li>
      </ul>
    </div>
    <div class="header-right" v-if="userRole === 'doctor'">
      <el-dropdown @command="handleClick">
        <div class="el-dropdown-link flex_box">
          <!-- 这里的头像是如下的.jpg/.png/网址 -->
          <!-- <el-avatar
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
            /> -->
          <el-avatar :src="userInfo.avatar" />
          <!-- <p class="user-name">admin</p> -->
          <p class="user-name">{{ userInfo.name }}</p>
        </div>
        <template #dropdown>
          <el-dropdown-item command="cancle">退出</el-dropdown-item>
        </template>
      </el-dropdown>
    </div>
    <!-- 测试 -->
    <div class="header-right" v-if="userRole === 'admin'">
      <el-dropdown @command="handleClick">
        <div class="el-dropdown-link flex_box">
          <!-- 这里的头像是如下的.jpg/.png/网址 -->
          <!-- <el-avatar
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
            /> -->
          <el-avatar :src="mangerInfo.avatar" />
          <!-- <p class="user-name">admin</p> -->
          <p class="user-name">{{ mangerInfo.name }}</p>
        </div>
        <template #dropdown>
          <el-dropdown-item command="cancle">退出</el-dropdown-item>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { computed, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const userInfo = reactive({
  name: 'Aurora',
  avatar: '../../../public/默认头像.webp'
})
// 测试
//拿到store的实例
const store = useStore() //是一个对象，内部便有一些实例方法T
// Test
const userRole = store.getters.getUserRole
const mangerInfo = reactive({
  name: 'manager',
  avatar: '../../../public/管理员.webp'
})

onMounted(() => {
  const userInfoString = localStorage.getItem('pz_userInfo')
  if (userInfoString) {
    userInfo.value = JSON.parse(userInfoString) // 修正为 JSON.parse
  }
})

//拿到当前的路由对象
const route = useRoute()
const router = useRouter()
// const router2=useRouter()
const selectMenu = computed(() => store.state.menu.selectMenu) //拿到tag数据 计算属性相当于ref,用.value访问
//点击关闭tag
const closeTab = (item, index) => {
  store.commit('closeMenu', item)
  //删除的非当前页tag
  if (route.path !== item.path) {
    return
  }
  //删除指定项，当前选中的
  const selectMenuData = selectMenu.value
  //如果删除最后一项
  if (index === selectMenuData.length) {
    //如果只有一个tag
    if (!selectMenuData.length) {
      router.push('/')
    } else {
      router.push({
        path: selectMenuData[index - 1].path
      })
    }
  } else {
    //如果删除的是中间位置的tag
    router.push({
      path: selectMenuData[index + 1].path
    })
  }
}
const handleClick = (command) => {
  if (command === 'cancle') {
    localStorage.removeItem('pz_token')
    localStorage.removeItem('pz_userInfo')
    //路由跳转
    // window.location.href=window.location.origin
    router.push({ path: '/login' })
  }
}
</script>

<style lang="less" scoped>
.flex_box {
  display: flex;
  align-content: center;
  height: 100%;
}

.el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
.header-container {
  // 设置为弹性容器
  display: flex;
  /* 上下 */
  justify-content: space-between;
  // 假设你有一个弹性容器，其中有3个项目。使用 justify-content: space-between; 后，第一个项目会紧贴容器的起始边缘，最后一个项目会紧贴容器的结束边缘，而中间的项目则会位于第一个和最后一个项目的正中间。
  /* 左右靠边 */
  align-items: center;
  /* 垂直方向居中 ，当设置为 center 时，项目将在其容器的交叉轴上居中对齐。*/
  height: 100%;
  background-color: #fff;
  padding-right: 25px;

  .header-left {
    height: 100%;

    .icon {
      width: 45px;
      height: 100%;
    }

    .icon:hover {
      background-color: #f5f5f5;
      cursor: pointer;
    }
    .tab {
      padding: 13px 5px 0px 10px;
      height: 100%;
      .text {
        // padding-top: 5px;
        margin: 0 5px;
      }
      .close {
        visibility: hidden;
      }
      &.selected {
        //less语法中&表示
        a {
          color: #409eff;
        }
        i {
          color: #409eff;
        }
        background-color: #f5f5f5;
      }
    }
    .tab:hover {
      background-color: #f5f5f5;
      .close {
        visibility: inherit;
        cursor: pointer;
        color: #000;
      }
    }
  }

  .header-right {
    .user-name {
      margin-left: 10px;
      padding-top: 20px;
      padding-right: 20px;
    }
  }
  a {
    height: 100%;
    color: #333;
    font-size: 13px;
  }
}
</style>
