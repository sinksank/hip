// import router from '@/router';
import axios from 'axios'

import { ElMessage } from 'element-plus'
const http = axios.create({
  baseURL: '', //'http://localhost:5173/',
  timeout: 10000
})

const router =
  // 添加请求拦截器
  http.interceptors.request.use(
    function (config) {
      // 在发送请求之前做些什么
      const token = localStorage.getItem('pz_token') //获取了之后我们需要再请求头里面给他添加
      //不需要添加token的api    //并不是所有的接口都需要token的数据
      const whiteURL = ['/login']
      if (token && !whiteURL.includes(config.url)) {
        config.headers['x-token'] = token
      }
      return config
    },
    function (error) {
      // 对请求错误做些什么
      return Promise.reject(error)
    }
  )

// 添加响应拦截器
http.interceptors.response.use(
  function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    //对接口异常的数据，给用户提示
    if (response.data.code === -1) {
      ElMessage.warning(response.data.message)
    }
    if (response.data.code === -2) {
      localStorage.removeItem('pz_token')
      localStorage.removeItem('pz_userInfo')
      // router.push('/login')
      window.location.href = window.location.origin
      //window.location.origin可获取到当前页面的路由
    }
    return response
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error)
  }
)

export default http
