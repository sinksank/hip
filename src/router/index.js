import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/login/index.vue'
import Layout from '../views/Main.vue'
import Control from '@/views/control/menu.vue'
import Register from '../views/Auth/register.vue'
import Simplified from '../views/Auth/simplified.vue'
import Depart from '../views/manger/depart.vue'
import Docter from '../views/manger/docter.vue'
import Log from '../views/manger/log.vue'
import MedicalRecord from '../views/Auth/medicalRecord.vue'

import { ElMessage } from 'element-plus'
import stores from '@/stores'
import { useStore } from 'vuex'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Layout,
      name: 'main',
      children: [
        {
          path: 'menu',
          meta: {
            id: '1',
            name: '控制台',
            icon: 'Platform',
            path: '/menu',
            roles: ['admin', 'doctor']
          },
          component: Control
        },
        {
          path: 'register', //患者挂号
          meta: {
            id: '2',
            name: '患者问诊',
            icon: 'PhoneFilled',
            path: '/register',
            roles: ['admin', 'doctor']
          },
          component: Register
        },
        {
          path: 'simplified', //预问诊病例
          meta: {
            id: '3',
            name: '门诊就诊',
            icon: 'BellFilled',
            path: '/simplified',
            roles: ['admin', 'doctor']
          },
          component: Simplified
        },
        {
          path: 'medicalRecord',
          meta: {
            id: '7',
            name: '病例管理',
            icon: 'Management',
            path: '/medicalRecord',
            roles: ['admin', 'doctor']
          },
          component: MedicalRecord
        },
        {
          path: 'depart', //科室信息
          meta: {
            id: '4',
            name: '科室信息',
            icon: 'Promotion',
            path: '/depart',
            roles: ['admin'] // 仅管理员访问
          },
          component: Depart
        },
        {
          path: 'docter', //医生信息
          meta: {
            id: '5',
            name: '医生管理',
            icon: 'Avatar',
            path: '/docter',
            roles: ['admin'] // 仅管理员访问
          },
          component: Docter
        },
        {
          path: 'log', //系统日志
          meta: {
            id: '6',
            name: '系统日志',
            icon: 'List',
            path: '/log',
            roles: ['admin', 'doctor']
          },
          component: Log
        }
      ]
    },
    {
      path: '/login',
      component: Login
    }
  ]
})

// router.beforeEach((to, from, next) => {
//   // 获取 Vuex store 实例
//   const store = useStore()
//   const userRole = store.state.userRole
//   const requiredRoles = to.meta.roles || []

//   console.log(`User Role: ${userRole}, Required Roles: ${requiredRoles}`)

//   if (requiredRoles.length === 0 || requiredRoles.includes(userRole)) {
//     next()
//   } else {
//     ElMessage.error('您没有权限访问该页面')
//     next('/') // 或者重定向到登录页
//   }
// })

router.beforeEach((to, from, next) => {
  const store = useStore()
  const userRole = store.getters.getUserRole // 使用 getter 获取用户角色
  const requiredRoles = to.meta.roles || []

  console.log(`User Role: ${userRole}, Required Roles: ${requiredRoles}`)

  if (requiredRoles.length === 0 || requiredRoles.includes(userRole)) {
    next()
  } else {
    ElMessage.error('您没有权限访问该页面')
    next('/') // 或者重定向到登录页
  }
})

export default router
