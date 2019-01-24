import Vue from 'vue'
import Router from 'vue-router'
import 'iview/dist/styles/iview.css'

const login = r => require.ensure([], () => r(require('@/page/login/login.vue')), 'login')

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: '/judge/',
  routes: [
    {
      path: '/login',
      name: 'login',
      component: login
    }
  ]
})
