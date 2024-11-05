<template>
  <div class="dashboard">
    <!-- 轮播图 -->
    <el-carousel class="carousel" height="200px">
      <el-carousel-item v-for="(item, index) in imgItems" :key="index">
        <img :src="item.img" alt="轮播图" />
      </el-carousel-item>
    </el-carousel>
    <!-- 用户信息 -->
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card>
          <div class="header-container" v-if="userRole === 'doctor'">
            <el-image style="width: 150px; height: 150px" :src="userInfo.avatar" :fit="fit" />
            <div class="usermessage">
              <h2>{{ userInfo.name }}</h2>
              <p>{{ userInfo.duties }}</p>
            </div>
          </div>

          <!-- test -->
          <div class="header-container" v-if="userRole === 'admin'">
            <el-image style="width: 150px; height: 150px" :src="mangerInfo.avatar" :fit="fit" />
            <div class="usermessage">
              <h2>{{ mangerInfo.name }}</h2>
              <p>{{ mangerInfo.duties }}</p>
            </div>
          </div>

          <template #footer>
            <p style="font-size: small">{{ currentData }}</p>
          </template>
        </el-card>
      </el-col>
      <!-- 折线图 近一周 患者就诊人数分布图-->
      <el-col :span="16">
        <Chart />
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import Chart from './Chart.vue'

import { useStore } from 'vuex'
// 测验
const store = useStore()
const userRole = store.getters.getUserRole // 使用 getter 获取用户角色

const userInfo = reactive({
  name: 'Aurora',
  duties: '主任医生',
  avatar: '../../../public/默认头像.webp'
})

const mangerInfo = reactive({
  name: 'manager',
  duties: '管理员',
  avatar: '../../../public/管理员.webp'
})

const currentData = ref('')
onMounted(() => {
  const userInfoString = localStorage.getItem('pz_userInfo')
  if (userInfoString) {
    userInfo.value = JSON.parse(userInfoString) // 修正为 JSON.parse
  }
  const now = new Date()
  currentData.value = now.toLocaleString()

  // 测验
  const store = useStore()
  const userRole = store.getters.getUserRole // 使用 getter 获取用户角色
})
const imgItems = ref([
  { img: '../../../public/轮播图.jpg' },
  { img: '../../../public/轮播图2.webp' },
  { img: '../../../public/轮播图4.webp' }
])
</script>

<style lang="less" scoped>
.dashboard {
  padding: 1px;
  background-color: #f5f7fa;
}
.carousel {
  margin-bottom: 20px;
  height: 200px;
}
.carousel img {
  width: 100%;
  height: 100%;
  background-size: 100%;
}
.header-container {
  display: flex;
  .usermessage {
    margin-left: 40px;
    h2 {
      margin-top: 20px;
      font-size: 24px;
    }
    p {
      margin-top: 10px;
      color: #666;
    }
  }
}
</style>
