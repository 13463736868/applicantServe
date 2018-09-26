'use strict'
const roleArr = [1, 10, 7, 8, 9]

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
    path: '/depaMana',
    name: 'depaMana',
    meta: {
      requireAuth: true
    },
    component: r => require.ensure([], () => r(require('@/page/admin/depaMana/depaMana.vue')))
  },
  {
    path: '/postMana',
    name: 'postMana',
    meta: {
      requireAuth: true
    },
    component: r => require.ensure([], () => r(require('@/page/admin/postMana/postMana.vue')))
  },
  {
    path: '/arbiEvas',
    name: 'arbiEvas',
    meta: {
      requireAuth: true
    },
    component: r => require.ensure([], () => r(require('@/page/arbitratComm/arbiEvas/arbiEvas.vue')))
  },
  {
    path: '/groupAudit',
    name: 'groupAudit',
    meta: {
      requireAuth: true
    },
    component: r => require.ensure([], () => r(require('@/page/arbitratComm/groupAudit/groupAudit.vue')))
  },
  {
    path: '/applReissue',
    name: 'applReissue',
    meta: {
      requireAuth: true
    },
    component: r => require.ensure([], () => r(require('@/page/arbitratComm/applReissue/applReissue.vue')))
  },
  {
    path: '/poliProtest',
    name: 'poliProtest',
    meta: {
      requireAuth: true
    },
    component: r => require.ensure([], () => r(require('@/page/arbitratComm/poliProtest/poliProtest.vue')))
  },
  {
    path: '/tranRecoD',
    name: 'tranRecoD',
    meta: {
      requireAuth: true
    },
    component: r => require.ensure([], () => r(require('@/page/arbitratComm/tranReco/tranReco.vue')))
  },
  {
    path: '/docuAudit',
    name: 'docuAudit',
    meta: {
      requireAuth: true
    },
    component: r => require.ensure([], () => r(require('@/page/arbitratComm/docuAudit/docuAudit.vue')))
  },
  {
    path: '/endCaseB',
    name: 'endCaseB',
    meta: {
      requireAuth: true
    },
    component: r => require.ensure([], () => r(require('@/page/arbitrator/endCase/endCase.vue')))
  },
  {
    path: '/groupCase',
    name: 'groupCase',
    meta: {
      requireAuth: true
    },
    component: r => require.ensure([], () => r(require('@/page/arbitrator/groupCase/groupCase.vue')))
  },
  {
    path: '/filingCase',
    name: 'filingCase',
    meta: {
      requireAuth: true
    },
    component: r => require.ensure([], () => r(require('@/page/arbitratSecr/filingCase/filingCase.vue')))
  },
  {
    path: '/endCaseA',
    name: 'endCaseA',
    meta: {
      requireAuth: true
    },
    component: r => require.ensure([], () => r(require('@/page/arbitratSecr/endCase/endCase.vue')))
  },
  {
    path: '/groupAppl',
    name: 'groupAppl',
    meta: {
      requireAuth: true
    },
    component: r => require.ensure([], () => r(require('@/page/arbitratSecr/groupAppl/groupAppl.vue')))
  },
  {
    path: '/acceCase',
    name: 'acceCase',
    meta: {
      requireAuth: true
    },
    component: r => require.ensure([], () => r(require('@/page/filingSecr/acceCase/acceCase.vue')))
  },
  {
    path: '/pendCase',
    name: 'pendCase',
    meta: {
      requireAuth: true
    },
    component: r => require.ensure([], () => r(require('@/page/filingSecr/pendCase/pendCase.vue')))
  },
  {
    path: '/succCase',
    name: 'succCase',
    meta: {
      requireAuth: true
    },
    component: r => require.ensure([], () => r(require('@/page/filingSecr/succCase/succCase.vue')))
  },
  {
    path: '/tranRecoE',
    name: 'tranRecoE',
    meta: {
      requireAuth: true
    },
    component: r => require.ensure([], () => r(require('@/page/filingSecr/tranReco/tranReco.vue')))
  },
  {
    path: '/idenCheck',
    name: 'idenCheck',
    meta: {
      requireAuth: true
    },
    component: r => require.ensure([], () => r(require('@/page/filingSecr/idenCheck/idenCheck.vue')))
  }
]

export const getRouter = (type) => {
  let _a = []
  let _r = []
  let _l = 0
  if (type === roleArr[0]) {
    _a = ['/userMana', '/postMana', '/depaMana']
  } else if (type === roleArr[1]) {
    _a = ['/arbiEvas', '/groupAudit', '/applReissue', '/poliProtest', '/tranRecoD', '/docuAudit']
  } else if (type === roleArr[2]) {
    _a = ['/endCaseB', '/groupCase']
  } else if (type === roleArr[3]) {
    _a = ['/filingCase', '/endCaseA', '/groupAppl']
  } else if (type === roleArr[4]) {
    _a = ['/acceCase', '/pendCase', '/succCase', '/tranRecoE', '/idenCheck']
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
  if (type === roleArr[0]) {
    _a = ['/userMana', '/postMana', '/depaMana']
    _t = ['用户管理', '角色管理', '部门管理']
  } else if (type === roleArr[1]) {
    _a = ['/arbiEvas', '/groupAudit', '/applReissue', '/poliProtest', '/tranRecoD', '/docuAudit']
    _t = ['仲裁员回避', '组庭审核', '申请补证', '管辖权异议', '交易记录', '文书审核']
  } else if (type === roleArr[2]) {
    _a = ['/endCaseB', '/groupCase']
    _t = ['已结束案件', '组庭案件']
  } else if (type === roleArr[3]) {
    _a = ['/filingCase', '/endCaseA', '/groupAppl']
    _t = ['已立案案件', '已结束案件', '组庭申请']
  } else if (type === roleArr[4]) {
    _a = ['/acceCase', '/pendCase', '/succCase', '/tranRecoE', '/idenCheck']
    _t = ['待受理案件', '待立案案件', '立案成功案件', '交易记录', '身份审核']
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
