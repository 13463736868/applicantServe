import Vue from 'vue'
import axios from 'axios'
import router from '@/router'
import qs from 'qs'
import {removeToken} from '@/cookies'

Vue.config.productionTip = process.env.NODE_ENV === 'production'
// 在axios拦截器中判断当前环境，来决定是否增加前缀
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'
axios.defaults.timeout = 20000
axios.interceptors.request.use((config) => {
  if (config.method === 'post') {
    config.data = qs.stringify(config.data)
  }
  if (!Vue.config.productionTip) {
    config.url = '/api' + config.url
    // if (store.state.admin_token) {//如果不用cookie的话 给每个http header加token
    //   config.headers.Authorization = `token $(store.state.admin_token)`
    // }
  } else {
    config.url = '/api' + config.url
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

axios.interceptors.response.use((res) => {
  if (res.data.flag === true) {
    return res
  } else {
    switch (res.data.code) {
      case '000121':
        // 没有登录
        removeToken()
        // 如何跳转到登录页面
        if (router.currentRoute.path !== 'login') {
          router.replace({
            path: '/login',
            query: {redirect: router.currentRoute.fullpath}
          })
        }
        break
    }
    return Promise.reject(res.data.message)
  }
}, (error) => {
  switch (error.status) {
    case 401:
    case 403:
      removeToken()
      // 清除token store localStorage 等等
      router.replace({
        path: '/login',
        query: {redirect: router.currentRoute.fullpath}
      })
      break
  }
  return Promise.reject(error.message)
})

Vue.prototype.$http = axios
