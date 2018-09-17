import Vue from 'vue'
import Router from 'vue-router'
import 'iview/dist/styles/iview.css'

const hellowWorld = r => require.ensure([], () => r(require('@/components/HelloWorld')), 'hellowWorld')

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'hellowWorld',
      component: hellowWorld
    }
  ]
})
