import * as types from './mutations-types.js'

export default {
  // 大写
  [types.SET_MENUARROBJ] (state, obj) {
    state.menuArrObj = obj
  },
  [types.SET_USERSINFO] (state, obj) {
    state.usersInfo = obj
  },
  [types.SET_MENU] (state, obj) {
    state.menu = obj
  },
  [types.SET_ROUTER] (state, obj) {
    state.router = obj
  },
  [types.SET_CASEID] (state, id) {
    state.caseId = id
  },
  [types.SET_CASESTATE] (state, obj) {
    state.caseState = obj
  },
  [types.SET_IDENCHECKID] (state, obj) {
    state.idenCheckId = obj
  },
  [types.SET_IDENCHECKTYPE] (state, obj) {
    state.idenCheckType = obj
  },
  [types.SET_IDENCHECKSTATE] (state, obj) {
    state.idenCheckState = obj
  },
  [types.SET_PAYMENTINFOID] (state, id) {
    state.paymentInfoId = id
  }
}
