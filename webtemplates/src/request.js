import axois from 'axios'
import { Message } from 'element-ui'
import { getToken } from './utils/cookie'

// 创建axios实例
const service = axois.create({
  baseURL: process.env.VUE_APP_BASE_API, // api 的 base_url
  timeout: 120000 // 请求超时时间
})


if (process.env.NODE_ENV === 'production') {
  var API='/'
}else{
  var API="/api/"
}

// request拦截器设置
service.interceptors.request.use(
  config => {
    config.baseURL = API
    config.headers['Content-Type'] = 'application/json' // 请求的数据格式为 json
    return config
  },
  error => {
    console.log(error)
    Promise.reject(error)
  }
)

// response 拦截器设置
service.interceptors.response.use(
  response => {
    const data = response.data
    const code = data.code
    const message = data.msg
    if(data.status==403){
      // return this.$router.push('/error-page/page-401')
      window.location.href="/#/error-page/page-401"
      return {
        status:403
      }
    }
    if(data.status==404){
      // return this.$router.push('/error-page/page-404')
      window.location.href="/#/error-page/page-404"
      return {
        status:404
      }
    }
    // if (code === 0) {
      return data
    // } else {
    //   Message({
    //     type: 'error',
    //     message
    //   })
    //   return Promise.reject('error')
    // }
  },
  error => {
    const code = error.response.data.status
    if (!code) {
      Message({
        type: 'error',
        message: '接口请求失败'
      })
    }
    return Promise.reject(error)
  }
)

export default service
