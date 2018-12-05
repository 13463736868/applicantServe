'use strict'
import router from '@/router'
import store from '@/store'

export const caseInfo = (obj) => {
  let loc = null
  if (window.localStorage) {
    loc = window.localStorage
    loc.setItem('caseId', obj.caseId)
    loc.setItem('caseState', obj.state)
  }
  store.commit('SET_CASEID', obj.caseId)
  store.commit('SET_CASESTATE', obj.state)
  if (obj.path) {
    router.push({
      path: obj.path
    })
  } else {
    router.push({
      path: '/caseInfo'
    })
  }
}
