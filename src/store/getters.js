import store from './index'
export default {
  buttonMap: state => state.buttonMap,
  menuArrObj: state => state.menuArrObj,
  usersInfo: state => state.usersInfo,
  menu: state => state.menu,
  router: state => state.router,
  caseId: state => state.caseId,
  caseState: state => state.caseState,
  archCaseObj: (state) => {
    if (!state.archCaseObj) {
      store.commit('SET_ARCHCASEOBJ', JSON.parse(window.localStorage.getItem('archCaseObj')))
      return JSON.parse(window.localStorage.getItem('archCaseObj'))
    } else {
      return state.archCaseObj
    }
  },
  idenCheckId: state => state.idenCheckId,
  idenCheckType: state => state.idenCheckType,
  idenCheckState: state => state.idenCheckState,
  paymentInfoId: state => state.paymentInfoId
}
