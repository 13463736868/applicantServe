import * as types from './mutations-types.js'

export default {
  // 大写
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
  },
  [types.SET_FILING] (state, obj) {
    state.caseInfo[obj.type] = obj.data
  },
  [types.SET_MYCASEID] (state, id) {
    state.myCaseId = id
  },
  [types.SET_MYCASEOLDID] (state, id) {
    state.myCaseOldId = id
  },
  [types.SET_MYCASESTATE] (state, obj) {
    state.myCaseState = obj
  },
  [types.SET_GOPAYMENTOLDID] (state, id) {
    state.goPaymentOldId = id
  },
  [types.SET_PAYMENTINFOID] (state, id) {
    state.paymentInfoId = id
  },
  [types.SET_USERSTATE] (state, obj) {
    state.userState = obj
  },
  [types.SET_MYCASESHOWBTN] (state, obj) {
    state.myCaseShowBtn = obj
  },
  [types.SET_MYCASEPARTIETYPE] (state, obj) {
    state.myCasePartieType = obj
  },
  [types.SET_MYCASECROSSE] (state, obj) {
    state.myCaseCrossE = obj
  }
}
