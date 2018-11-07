import * as cookies from '@/cookies'
import store from '@/store'
import router from '@/router'
import {getRouter, getMenu} from '@/router/routers.js'

const beforeEach = (to, from, next) => {
  let loc = null
  if (window.localStorage) {
    loc = window.localStorage
  }
  if (to.path !== '/login') {
    if (cookies.getToken() && loc !== null && loc.getItem('usersInfo') !== null) {
      if (store.state.menuArrObj === null) {
        store.commit('SET_MENUARROBJ', JSON.parse(loc.getItem('menuArrObj')))
      }
      if (store.state.menu === null) {
        store.commit('SET_MENU', getMenu(JSON.parse(loc.getItem('menuArrObj'))))
      }
      if (store.state.router === null) {
        let _gRouter = getRouter(JSON.parse(loc.getItem('menuArrObj')))
        store.commit('SET_ROUTER', _gRouter)
        router.addRoutes(_gRouter)
        next({...to, replace: true})
      }
    }
  }
  if (to.meta.requireAuth) {
    if (cookies.getToken() && loc !== null && loc.getItem('usersInfo') !== null) {
      if (store.state.usersInfo === null) {
        if (loc.getItem('usersInfo')) {
          store.commit('SET_USERSINFO', JSON.parse(loc.getItem('usersInfo')))
        }
      }
      if (store.state.router === null) {
        store.commit('SET_ROUTER', getRouter(store.state.menuArrObj))
      }
      if (store.state.menu === null) {
        store.commit('SET_MENU', getMenu(store.state.menuArrObj))
      }
      if (to.fullPath.indexOf('caseInfo') === -1) {
        loc.removeItem('caseId')
        loc.removeItem('caseState')
        store.commit('SET_CASEID', '')
        store.commit('SET_CASESTATE', null)
      } else {
        if (store.state.caseId === '') {
          if (loc.getItem('caseId')) {
            store.commit('SET_CASEID', loc.getItem('caseId'))
          }
        }
        if (store.state.caseState === null) {
          if (loc.getItem('caseState')) {
            store.commit('SET_CASESTATE', loc.getItem('caseState'))
          }
        }
      }
      if (to.fullPath.indexOf('idenInfo') === -1) {
        loc.removeItem('idenCheckId')
        loc.removeItem('idenCheckType')
        store.commit('SET_IDENCHECKID', '')
        store.commit('SET_IDENCHECKTYPE', '')
      } else {
        if (store.state.idenCheckId === null) {
          if (loc.getItem('idenCheckId')) {
            store.commit('SET_IDENCHECKID', loc.getItem('idenCheckId'))
          }
        }
        if (store.state.idenCheckType === null) {
          if (loc.getItem('idenCheckType')) {
            store.commit('SET_IDENCHECKTYPE', loc.getItem('idenCheckType'))
          }
        }
      }
      next()
    } else {
      next({
        path: '/login',
        query: {redirect: to.fullPath}
      })
    }
  } else {
    if (to.path === '/login') {
      if (cookies.getToken() && loc !== null && loc.getItem('usersInfo') !== null) {
        if (store.state.router === null) {
          next()
        } else {
          let redirect = decodeURIComponent(to.query.redirect || '/')
          next({
            path: redirect
          })
        }
      } else {
        next()
      }
    } else {
      if (store.state.router === null) {
        next({
          path: '/login'
        })
      } else {
        next()
      }
    }
  }
  // iView.LoadingBar.start()
}

export default {
  beforeEach
}
