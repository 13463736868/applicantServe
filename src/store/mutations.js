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
  [types.SET_CASEINFO] (state, obj) {
    state.caseInfo = obj
  }
}
