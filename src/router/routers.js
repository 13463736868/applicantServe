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
    path: '/ruleMana',
    name: 'ruleMana',
    meta: {
      requireAuth: true
    },
    component: r => require.ensure([], () => r(require('@/page/admin/ruleMana/ruleMana.vue')))
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
    path: '/tempAudit',
    name: 'tempAudit',
    meta: {
      requireAuth: true
    },
    component: r => require.ensure([], () => r(require('@/page/arbitratComm/tempAudit/tempAudit.vue')))
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
    path: '/trialList',
    name: 'trialList',
    meta: {
      requireAuth: true
    },
    component: r => require.ensure([], () => r(require('@/page/arbitrator/trialList/trialList.vue')))
  },
  {
    path: '/stencilList',
    name: 'stencilList',
    meta: {
      requireAuth: true
    },
    component: r => require.ensure([], () => r(require('@/page/arbitrator/stencilList/stencilList.vue')))
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
    path: '/closeCase',
    name: 'closeCase',
    meta: {
      requireAuth: true
    },
    component: r => require.ensure([], () => r(require('@/page/arbitratSecr/closeCase/closeCase.vue')))
  },
  {
    path: '/sealCase',
    name: 'sealCase',
    meta: {
      requireAuth: true
    },
    component: r => require.ensure([], () => r(require('@/page/arbitratSecr/sealCase/sealCase.vue')))
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
    path: '/acceCaseM',
    name: 'acceCaseM',
    meta: {
      requireAuth: true
    },
    component: r => require.ensure([], () => r(require('@/page/filingMana/acceCaseM/acceCaseM.vue')))
  },
  {
    path: '/pendCaseM',
    name: 'pendCaseM',
    meta: {
      requireAuth: true
    },
    component: r => require.ensure([], () => r(require('@/page/filingMana/pendCaseM/pendCaseM.vue')))
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
  },
  {
    path: '/idenInfo',
    name: 'idenInfo',
    meta: {
      requireAuth: true
    },
    component: r => require.ensure([], () => r(require('@/page/filingSecr/idenCheck/idenInfo.vue')))
  },
  {
    path: '/paymentSlip',
    name: 'paymentSlip',
    meta: {
      requireAuth: true
    },
    component: r => require.ensure([], () => r(require('@/page/filingSecr/paymentSlip/paymentSlip.vue')))
  },
  {
    path: '/paymentInfo',
    name: 'paymentInfo',
    meta: {
      requireAuth: true
    },
    component: r => require.ensure([], () => r(require('@/page/filingSecr/paymentSlip/paymentInfo.vue')))
  },
  {
    path: '/onesInfo',
    name: 'onesInfo',
    meta: {
      requireAuth: true
    },
    component: r => require.ensure([], () => r(require('@/page/comm/onesInfo.vue')))
  },
  {
    path: '/meetList',
    name: 'meetList',
    meta: {
      requireAuth: true
    },
    component: r => require.ensure([], () => r(require('@/page/meetList/meetList.vue')))
  },
  {
    path: '/caseInfo',
    meta: {
      requireAuth: true
    },
    component: r => require.ensure([], () => r(require('@/page/comm/caseInfo.vue'))),
    children: [
      {
        path: '',
        redirect: '/caseInfo/basicInfo'
      },
      {
        path: 'basicInfo',
        name: 'basicInfo',
        meta: {
          requireAuth: true
        },
        component: r => require.ensure([], () => r(require('@/page/comm/children/basicInfo.vue')), 'basicInfo')
      },
      {
        path: 'proposerInfo',
        name: 'proposerInfo',
        meta: {
          requireAuth: true
        },
        component: r => require.ensure([], () => r(require('@/page/comm/children/proposerInfo.vue')), 'proposerInfo')
      },
      {
        path: 'respondentInfo',
        name: 'respondentInfo',
        meta: {
          requireAuth: true
        },
        component: r => require.ensure([], () => r(require('@/page/comm/children/respondentInfo.vue')), 'respondentInfo')
      },
      {
        path: 'claimItem',
        name: 'claimItem',
        meta: {
          requireAuth: true
        },
        component: r => require.ensure([], () => r(require('@/page/comm/children/claimItem.vue')), 'claimItem')
      },
      {
        path: 'revClaimItem',
        name: 'revClaimItem',
        meta: {
          requireAuth: true
        },
        component: r => require.ensure([], () => r(require('@/page/comm/children/revClaimItem.vue')), 'revClaimItem')
      },
      {
        path: 'evidencesInfo',
        name: 'evidencesInfo',
        meta: {
          requireAuth: true
        },
        component: r => require.ensure([], () => r(require('@/page/comm/children/evidencesInfo.vue')), 'evidencesInfo')
      },
      {
        path: 'sendInfo',
        name: 'sendInfo',
        meta: {
          requireAuth: true
        },
        component: r => require.ensure([], () => r(require('@/page/comm/children/sendInfo.vue')), 'sendInfo')
      },
      {
        path: 'endCaseInfo',
        name: 'endCaseInfo',
        meta: {
          requireAuth: true
        },
        component: r => require.ensure([], () => r(require('@/page/comm/children/endCaseInfo.vue')), 'endCaseInfo')
      }
    ]
  }
]

export const getRouter = (obj) => {
  let _a = obj.menu
  let _r = []
  let _l = 0
  _a.push('/onesInfo', '/caseInfo', '/idenInfo', '/paymentInfo', '/meetList')
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

export const getMenu = (obj) => {
  let _a = obj.menu
  let _t = obj.menuName
  let _m = []
  for (let k in _a) {
    let _o = {}
    _o.id = k
    _o.text = _t[k]
    _o.url = _a[k]
    _m.push(_o)
  }
  return _m
}
