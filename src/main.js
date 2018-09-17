import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import './axios'
import iView from 'iview'
// import logic from './logic'
// import './mock'

Vue.config.productionTip = false

Vue.use(iView)

// router.beforeEach(logic.beforeEach)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
