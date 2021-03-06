import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters.js'
import actions from './actions.js'
import mutations from './mutations.js'

Vue.use(Vuex)

const state = {
  menuArrObj: null,
  usersInfo: null,
  menu: null,
  router: null,
  caseId: '',
  caseState: null,
  idenCheckId: null,
  idenCheckType: null,
  idenCheckState: null,
  paymentInfoId: ''
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
