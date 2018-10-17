export default {
  //  小写
  setMenuArrObj ({commit, state}, obj) {
    commit('SET_MENUARROBJ', obj)
  },
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
  setCaseState ({commit, state}, obj) {
    commit('SET_CASESTATE', obj)
  },
  setIdenCheckId ({commit, state}, obj) {
    commit('SET_IDENCHECKID', obj)
  },
  setIdenCheckType ({commit, state}, obj) {
    commit('SET_IDENCHECKTYPE', obj)
  }
}
