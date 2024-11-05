<template>
  <div class="bd">
    <!-- 上下内容垂直居中   水平方向居中justify="center"    垂直方向居中:align="'middle'"-->
    <el-row class="login-container" justify="center" :align="'middle'">
      <el-card style="width: 400px">
        <el-form
          :model="loginFrom"
          style="max-width: 480px; padding-top: 20px; opacity: 1"
          class="demo-ruleFrom"
          :rules="rules"
          :ref="loginFormRef"
        >
          <el-form-item prop="userName">
            <el-input
              v-model="loginFrom.userName"
              placeholder="手机号"
              :prefix-icon="UserFilled"
            ></el-input>
          </el-form-item>
          <el-form-item prop="passWord">
            <el-input
              v-model="loginFrom.passWord"
              type="password"
              placeholder="密码"
              :prefix-icon="Lock"
            ></el-input>
          </el-form-item>
          <el-form-item prop="roleCode">
            <el-select v-model="loginFrom.roleCode" placeholder="下拉选择角色">
              <el-option label="医生" value="医生" />
              <el-option label="管理员" value="管理员" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :style="{ width: '100%' }" @click="submitForm(loginFormRef)"
              >登录</el-button
            >
          </el-form-item>
        </el-form>
      </el-card>
    </el-row>
  </div>
</template>

<script setup>
//创建响应式变量，两种方法 ref reactive
import { ref, reactive } from 'vue'
import { getLogin, addVisitRecord } from '../../api'
import { UserFilled, Lock } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { avatarEmits } from 'element-plus'
import { log } from 'handlebars'
const loginFormRef = ref()
const imgUrl = new URL('../../../public/login-head.png', import.meta.url).href

const fromType = ref(0)
//表单的初始值
const loginFrom = reactive({
  userName: '',
  passWord: '',
  roleCode: ''
})

//账号校验规则
const validateUser = (rule, value, callback) => {
  //不能为空
  if (value === '') {
    callback(new Error('请输入账号'))
  } else {
    const phoneReg = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
    phoneReg.test(value) ? callback() : callback(new Error('手机格式不对，请输入正确手机号'))
  }
}
//密码校验
const validatePass = (rule, value, callback) => {
  //不能为空
  if (value === '') {
    callback(new Error('请输入密码'))
  } else {
    const reg = /^[a-zA-Z0-9_-]{4,16}$/
    reg.test(value) ? callback() : callback(new Error('密码格式不对，需要4-16位字符,请确定格式'))
  }
}

//角色检验医生或者管理员必选一个

const validateRole = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请选择角色'))
  } else {
    callback() // 验证通过
  }
}
//表单校验
const rules = reactive({
  userName: [{ validator: validateUser, trigger: 'blur' }],
  passWord: [{ validator: validatePass, trigger: 'blur' }],
  // roleCode: [{ required: true, message: '请选择角色', trigger: 'change' }]
  roleCode: [{ validator: validateRole, trigger: 'blur' }]
})

const countdownChange = () => {
  //判断手机号是否正确
  const phoneReg = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
  if (!loginFrom.userName || !phoneReg.test(loginFrom.userName)) {
    return ElMessage({
      message: '请检查手机号是否正确',
      type: 'warning'
    })
  }
}
const userRole = ref('')
const router = useRouter()
const userInfo = ref({
  name: '',
  mobile: '',
  roleCode: '', // 用户角色  （"医生"或者"管理员"）
  department: '',
  sex: '',
  duties: '',
  age: '',
  avatar: ''
}) // 创建一个响应式对象来存储用户信息
const now = new Date()
//存储日志访问信息
const logData = ref({
  avatar: '',
  name: '',
  role: '',
  time: now.toLocaleString()
})
//表单提交
const submitForm = async (formEl) => {
  if (!formEl) return

  // 手动校验
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      console.log(loginFrom, 'submit!')

      try {
        const { data } = await getLogin(loginFrom) // 使用 async/await
        if (data.code === 200) {
          ElMessage.success('登录成功')
          console.log(data)

          // 将 token 和用户信息缓存到浏览器
          localStorage.setItem('pz_token', data.data.token)
          localStorage.setItem('pz_userInfo', JSON.stringify(data.data.userInfo))

          // 解析用户信息
          const storedUserInfo = JSON.parse(localStorage.getItem('pz_userInfo'))
          userInfo.value = storedUserInfo

          // 准备日志数据
          logData.value = {
            avatar: userInfo.value.avatar,
            name: userInfo.value.name,
            role: userInfo.value.role,
            time: new Date().toLocaleString() // 更新为当前时间
          }

          // 添加访问记录
          await addVisitRecord(logData)
          console.log('访问记录添加成功')

          // 更新 Vuex 中的用户角色
          const role = userInfo.value.roleCode
          await store.dispatch('updateUserRole', role)
          userRole.value = role // 可选

          // 跳转到菜单
          router.push('/')
        } else {
          ElMessage.error('登录失败，请重新登录！')
          console.log('error submit!', fields)
        }
      } catch (error) {
        console.error('登录请求失败', error)
        ElMessage.error('登录请求失败，请稍后重试')
      }
    }
  })
}
</script>

<style lang="less" scoped>
.login-container {
  height: 100%;
  // width:500px
}
.bd {
  height: 100%;
  width: 100%;
  background-image: url(https://img0.baidu.com/it/u=2963730830,468580020&fm=253&fmt=auto&app=120&f=JPEG?w=1038&h=600);
  background-repeat: no-repeat;
  background-size: cover;
  opacity: 0.8;
}
</style>
