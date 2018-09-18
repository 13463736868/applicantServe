'use strict'
const routerMap = [
  {
    path: '/userMana',
    name: 'userMana',
    meta: {
      requireAuth: true
    },
    component: r => require.ensure([], () => r(require('@/page/admin/userMana/userMana.vue')))
  },
  {
    path: '/onesInfoA',
    name: 'onesInfoA',
    meta: {
      requireAuth: true
    },
    component: r => require.ensure([], () => r(require('@/page/admin/onesInfo/onesInfo.vue')))
  },
  {
    path: '/onesInfoB',
    name: 'onesInfoB',
    meta: {
      requireAuth: true
    },
    component: r => require.ensure([], () => r(require('@/page/arbitratComm/onesInfo/onesInfo.vue')))
  },
  {
    path: '/onesInfoC',
    name: 'onesInfoC',
    meta: {
      requireAuth: true
    },
    component: r => require.ensure([], () => r(require('@/page/arbitrator/onesInfo/onesInfo.vue')))
  },
  {
    path: '/onesInfoD',
    name: 'onesInfoD',
    meta: {
      requireAuth: true
    },
    component: r => require.ensure([], () => r(require('@/page/arbitratSecr/onesInfo/onesInfo.vue')))
  },
  {
    path: '/onesInfoE',
    name: 'onesInfoE',
    meta: {
      requireAuth: true
    },
    component: r => require.ensure([], () => r(require('@/page/filingSecr/onesInfo/onesInfo.vue')))
  }
]

export const getRouter = (type) => {
  let _a = []
  let _r = []
  let _l = 0
  if (type === 1) {
    _a = ['/userMana', '/onesInfoA']
  } else if (type === 2) {
    _a = ['/onesInfoB']
  } else if (type === 3) {
    _a = ['/onesInfoC']
  } else if (type === 4) {
    _a = ['/onesInfoD']
  } else if (type === 5) {
    _a = ['/onesInfoE']
  }
  _r.push({
    path: '/',
    redirect: _a[0]
  })
  for (let k in routerMap) {
    if (_a.indexOf(routerMap[k].path) !== -1) {
      _l++
      _r.push(routerMap[k])
    }
    if (_a.length === _l) {
      _r.push({
        path: '*',
        redirect: _a[0]
      })
      return _r
    }
  }
}

export const getMenu = (type) => {
  let _a = []
  let _t = []
  let _m = []
  if (type === 1) {
    _a = ['/userMana', '/onesInfoA']
    _t = ['用户管理', '个人信息']
  } else if (type === 2) {
    _a = ['/onesInfoB']
    _t = ['个人信息']
  } else if (type === 3) {
    _a = ['/onesInfoC']
    _t = ['个人信息']
  } else if (type === 4) {
    _a = ['/onesInfoD']
    _t = ['个人信息']
  } else if (type === 5) {
    _a = ['/onesInfoE']
    _t = ['个人信息']
  }
  for (let k in _a) {
    let _o = {}
    _o.id = k
    _o.text = _t[k]
    _o.url = _a[k]
    _m.push(_o)
  }
  return _m
}
