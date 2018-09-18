export default {
  //  小写
  setUsersInfo ({commit, state}, obj) {
    commit('SET_USERSINFO', obj)
  },
  setMenu ({commit, state}, obj) {
    commit('SET_MENU', obj)
  },
  setRouter ({commit, state}, obj) {
    commit('SET_ROUTER', obj)
  },
  setCaseId ({commit, state}, id) {
    commit('SET_CASEID', id)
  },
  setCaseInfo ({commit, state}, obj) {
    commit('SET_CASEINFO', obj)
  },
  setFiling ({commit, state}, obj) {
    commit('SET_FILING', obj)
  },
  setMyCaseId ({commit, state}, id) {
    commit('SET_MYCASEID', id)
  },
  setMyCaseOldId ({commit, state}, id) {
    commit('SET_MYCASEOLDID', id)
  },
  setMyCaseState ({commit, state}, obj) {
    commit('SET_MYCASESTATE', obj)
  },
  setGoPaymentOldId ({commit, state}, id) {
    commit('SET_GOPAYMENTOLDID', id)
  },
  setPaymentInfoId ({commit, state}, id) {
    commit('SET_PAYMENTINFOID', id)
  },
  setUserState ({commit, state}, obj) {
    commit('SET_USERSTATE', obj)
  },
  setMyCaseShowBtn ({commit, state}, obj) {
    commit('SET_MYCASESHOWBTN', obj)
  },
  setMyCasePartieType ({commit, state}, obj) {
    commit('SET_MYCASEPARTIETYPE', obj)
  },
  setMyCaseCrossE ({commit, state}, obj) {
    commit('SET_MYCASECROSSE', obj)
  }
}
