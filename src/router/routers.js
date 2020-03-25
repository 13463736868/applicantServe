'use strict'

const routerMap = [
  {
    path: '/userMana',
    name: 'userMana',
    meta: {
      requireAuth: true,
      title: '用户管理',
      keepAlive: true
    },
    component: r => require.ensure([], () => r(require('@/page/admin/userMana/userMana.vue')))
  },
  {
    path: '/depaMana',
    name: 'depaMana',
    meta: {
      requireAuth: true,
      title: '部门管理',
      keepAlive: true
    },
    component: r => require.ensure([], () => r(require('@/page/admin/depaMana/depaMana.vue')))
  },
  {
    path: '/postMana',
    name: 'postMana',
    meta: {
      requireAuth: true,
      title: '角色管理',
      keepAlive: true
    },
    component: r => require.ensure([], () => r(require('@/page/admin/postMana/postMana.vue')))
  },
  {
    path: '/ruleMana',
    name: 'ruleMana',
    meta: {
      requireAuth: true,
      title: '仲裁规则管理',
      keepAlive: true
    },
    component: r => require.ensure([], () => r(require('@/page/admin/ruleMana/ruleMana.vue')))
  },
  {
    path: '/modelList',
    name: 'modelList',
    meta: {
      requireAuth: true,
      title: '模型列表',
      keepAlive: true
    },
    component: r => require.ensure([], () => r(require('@/page/admin/modelList/modelList.vue')))
  },
  {
    path: '/arbiEvas',
    name: 'arbiEvas',
    meta: {
      requireAuth: true,
      title: '仲裁员回避',
      keepAlive: true
    },
    component: r => require.ensure([], () => r(require('@/page/arbitratComm/arbiEvas/arbiEvas.vue')))
  },
  {
    path: '/groupAudit',
    name: 'groupAudit',
    meta: {
      requireAuth: true,
      title: '组庭审核',
      keepAlive: true
    },
    component: r => require.ensure([], () => r(require('@/page/arbitratComm/groupAudit/groupAudit.vue')))
  },
  {
    path: '/applReissue',
    name: 'applReissue',
    meta: {
      requireAuth: true,
      title: '申请补正',
      keepAlive: true
    },
    component: r => require.ensure([], () => r(require('@/page/arbitratComm/applReissue/applReissue.vue')))
  },
  {
    path: '/poliProtest',
    name: 'poliProtest',
    meta: {
      requireAuth: true,
      title: '管辖权异议',
      keepAlive: true
    },
    component: r => require.ensure([], () => r(require('@/page/arbitratComm/poliProtest/poliProtest.vue')))
  },
  {
    path: '/tranRecoD',
    name: 'tranRecoD',
    meta: {
      requireAuth: true,
      title: '案件分配',
      keepAlive: true
    },
    component: r => require.ensure([], () => r(require('@/page/arbitratComm/tranReco/tranReco.vue')))
  },
  {
    path: '/tranForm',
    name: 'tranForm',
    meta: {
      requireAuth: true,
      title: '案件查询',
      keepAlive: true
    },
    component: r => require.ensure([], () => r(require('@/page/arbitratComm/tranForm/tranForm.vue')))
  },
  {
    path: '/docuAudit',
    name: 'docuAudit',
    meta: {
      requireAuth: true,
      title: '文书审核',
      keepAlive: true
    },
    component: r => require.ensure([], () => r(require('@/page/arbitratComm/docuAudit/docuAudit.vue')))
  },
  {
    path: '/tempAudit',
    name: 'tempAudit',
    meta: {
      requireAuth: true,
      title: '模版审核',
      keepAlive: true
    },
    component: r => require.ensure([], () => r(require('@/page/arbitratComm/tempAudit/tempAudit.vue')))
  },
  {
    path: '/groupCase',
    name: 'groupCase',
    meta: {
      requireAuth: true,
      title: '组庭案件',
      keepAlive: true
    },
    component: r => require.ensure([], () => r(require('@/page/arbitrator/groupCase/groupCase.vue')))
  },
  {
    path: '/trialList',
    name: 'trialList',
    meta: {
      requireAuth: true,
      title: '审核中列表',
      keepAlive: true
    },
    component: r => require.ensure([], () => r(require('@/page/arbitrator/trialList/trialList.vue')))
  },
  {
    path: '/stencilList',
    name: 'stencilList',
    meta: {
      requireAuth: true,
      title: '模版列表',
      keepAlive: true
    },
    component: r => require.ensure([], () => r(require('@/page/arbitrator/stencilList/stencilList.vue')))
  },
  {
    path: '/filingCase',
    name: 'filingCase',
    meta: {
      requireAuth: true,
      title: '已立案案件',
      keepAlive: true
    },
    component: r => require.ensure([], () => r(require('@/page/arbitratSecr/filingCase/filingCase.vue')))
  },
  {
    path: '/endCaseA',
    name: 'endCaseA',
    meta: {
      requireAuth: true,
      title: '已结束案件',
      keepAlive: true
    },
    component: r => require.ensure([], () => r(require('@/page/arbitratSecr/endCase/endCase.vue')))
  },
  {
    path: '/closeCase',
    name: 'closeCase',
    meta: {
      requireAuth: true,
      title: '已结案案件',
      keepAlive: true
    },
    component: r => require.ensure([], () => r(require('@/page/arbitratSecr/closeCase/closeCase.vue')))
  },
  {
    path: '/sealCase',
    name: 'sealCase',
    meta: {
      requireAuth: true,
      title: '已归档案件',
      keepAlive: true
    },
    component: r => require.ensure([], () => r(require('@/page/arbitratSecr/sealCase/sealCase.vue')))
  },
  {
    path: '/groupAppl',
    name: 'groupAppl',
    meta: {
      requireAuth: true,
      title: '组庭申请',
      keepAlive: true
    },
    component: r => require.ensure([], () => r(require('@/page/arbitratSecr/groupAppl/groupAppl.vue')))
  },
  {
    path: '/remuneAudit',
    name: 'remuneAudit',
    meta: {
      requireAuth: true,
      title: '组庭申请',
      keepAlive: true
    },
    component: r => require.ensure([], () => r(require('@/page/arbitratSecr/remuneAudit/remuneAudit.vue')))
  },
  {
    path: '/withdrawList',
    name: 'withdrawList',
    meta: {
      requireAuth: true,
      title: '已分配案件',
      keepAlive: true
    },
    component: r => require.ensure([], () => r(require('@/page/arbitratSecr/withdrawList/withdrawList.vue')))
  },
  {
    path: '/endCaseAudit',
    name: 'endCaseAudit',
    meta: {
      requireAuth: true,
      title: '组庭申请',
      keepAlive: true
    },
    component: r => require.ensure([], () => r(require('@/page/arbitratSecr/endCaseAudit/endCaseAudit.vue')))
  },
  {
    path: '/acceCase',
    name: 'acceCase',
    meta: {
      requireAuth: true,
      title: '待受理案件',
      keepAlive: true
    },
    component: r => require.ensure([], () => r(require('@/page/filingSecr/acceCase/acceCase.vue')))
  },
  {
    path: '/pendCase',
    name: 'pendCase',
    meta: {
      requireAuth: true,
      title: '待立案案件',
      keepAlive: true
    },
    component: r => require.ensure([], () => r(require('@/page/filingSecr/pendCase/pendCase.vue')))
  },
  {
    path: '/acceCaseM',
    name: 'acceCaseM',
    meta: {
      requireAuth: true,
      title: '受理审核案件',
      keepAlive: true
    },
    component: r => require.ensure([], () => r(require('@/page/filingMana/acceCaseM/acceCaseM.vue')))
  },
  {
    path: '/pendCaseM',
    name: 'pendCaseM',
    meta: {
      requireAuth: true,
      title: '立案审核案件',
      keepAlive: true
    },
    component: r => require.ensure([], () => r(require('@/page/filingMana/pendCaseM/pendCaseM.vue')))
  },
  {
    path: '/setAssignM',
    name: 'setAssignM',
    meta: {
      requireAuth: true,
      title: '自动分配仲裁员',
      keepAlive: true
    },
    component: r => require.ensure([], () => r(require('@/page/filingMana/setAssignM/setAssignM.vue')))
  },
  {
    path: '/succCase',
    name: 'succCase',
    meta: {
      requireAuth: true,
      title: '立案成功案件',
      keepAlive: true
    },
    component: r => require.ensure([], () => r(require('@/page/filingSecr/succCase/succCase.vue')))
  },
  {
    path: '/archiveCase',
    name: 'archiveCase',
    meta: {
      requireAuth: true,
      title: '线下案件',
      keepAlive: true
    },
    component: r => require.ensure([], () => r(require('@/page/filingSecr/archiveCase/archiveCase.vue')))
  },
  {
    path: '/tranRecoE',
    name: 'tranRecoE',
    meta: {
      requireAuth: true,
      title: '案件记录',
      keepAlive: true
    },
    component: r => require.ensure([], () => r(require('@/page/filingSecr/tranReco/tranReco.vue')))
  },
  {
    path: '/idenCheck',
    name: 'idenCheck',
    meta: {
      requireAuth: true,
      title: '身份审核',
      keepAlive: true
    },
    component: r => require.ensure([], () => r(require('@/page/filingSecr/idenCheck/idenCheck.vue')))
  },
  {
    path: '/idenInfo',
    name: 'idenInfo',
    meta: {
      requireAuth: true,
      title: '身份信息详情',
      keepAlive: true
    },
    component: r => require.ensure([], () => r(require('@/page/filingSecr/idenCheck/idenInfo.vue')))
  },
  {
    path: '/paymentSlip',
    name: 'paymentSlip',
    meta: {
      requireAuth: true,
      title: '缴费单审核',
      keepAlive: true
    },
    component: r => require.ensure([], () => r(require('@/page/filingSecr/paymentSlip/paymentSlip.vue')))
  },
  {
    path: '/paymentInfo',
    name: 'paymentInfo',
    meta: {
      requireAuth: true,
      title: '缴费单查询',
      keepAlive: true
    },
    component: r => require.ensure([], () => r(require('@/page/filingSecr/paymentSlip/paymentInfo.vue')))
  },
  {
    path: '/onesInfo',
    name: 'onesInfo',
    meta: {
      requireAuth: true,
      title: '个人信息',
      keepAlive: true
    },
    component: r => require.ensure([], () => r(require('@/page/comm/onesInfo.vue')))
  },
  {
    path: '/meetList',
    name: 'meetList',
    meta: {
      requireAuth: true,
      title: '视频会议',
      keepAlive: true
    },
    component: r => require.ensure([], () => r(require('@/page/meetList/meetList.vue')))
  },
  {
    path: '/caseInfo',
    meta: {
      requireAuth: true,
      keepAlive: true
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
          requireAuth: true,
          title: '案件详情',
          keepAlive: true
        },
        component: r => require.ensure([], () => r(require('@/page/comm/children/basicInfo.vue')), 'basicInfo')
      },
      {
        path: 'proposerInfo',
        name: 'proposerInfo',
        meta: {
          requireAuth: true,
          title: '案件详情',
          keepAlive: true
        },
        component: r => require.ensure([], () => r(require('@/page/comm/children/proposerInfo.vue')), 'proposerInfo')
      },
      {
        path: 'respondentInfo',
        name: 'respondentInfo',
        meta: {
          requireAuth: true,
          title: '案件详情',
          keepAlive: true
        },
        component: r => require.ensure([], () => r(require('@/page/comm/children/respondentInfo.vue')), 'respondentInfo')
      },
      {
        path: 'claimItem',
        name: 'claimItem',
        meta: {
          requireAuth: true,
          title: '案件详情',
          keepAlive: true
        },
        component: r => require.ensure([], () => r(require('@/page/comm/children/claimItem.vue')), 'claimItem')
      },
      {
        path: 'revClaimItem',
        name: 'revClaimItem',
        meta: {
          requireAuth: true,
          title: '案件详情',
          keepAlive: true
        },
        component: r => require.ensure([], () => r(require('@/page/comm/children/revClaimItem.vue')), 'revClaimItem')
      },
      {
        path: 'evidencesInfo',
        name: 'evidencesInfo',
        meta: {
          requireAuth: true,
          title: '案件详情',
          keepAlive: true
        },
        component: r => require.ensure([], () => r(require('@/page/comm/children/evidencesInfo.vue')), 'evidencesInfo')
      },
      {
        path: 'sendInfo',
        name: 'sendInfo',
        meta: {
          requireAuth: true,
          title: '案件详情',
          keepAlive: true
        },
        component: r => require.ensure([], () => r(require('@/page/comm/children/sendInfo.vue')), 'sendInfo')
      },
      {
        path: 'endCaseInfo',
        name: 'endCaseInfo',
        meta: {
          requireAuth: true,
          title: '案件详情',
          keepAlive: true
        },
        component: r => require.ensure([], () => r(require('@/page/comm/children/endCaseInfo.vue')), 'endCaseInfo')
      }
    ]
  },
  {
    path: '/archiveCaseInfo',
    meta: {
      requireAuth: true,
      keepAlive: true
    },
    component: r => require.ensure([], () => r(require('@/page/filingSecr/archiveCase/archiveCaseInfo/caseInfo.vue'))),
    children: [
      {
        path: '',
        redirect: '/archiveCaseInfo/basicInfoA'
      },
      {
        path: 'basicInfoA',
        name: 'basicInfoA',
        meta: {
          requireAuth: true,
          title: '案件详情',
          keepAlive: true
        },
        component: r => require.ensure([], () => r(require('@/page/filingSecr/archiveCase/archiveCaseInfo/children/basicInfo.vue')), 'basicInfoA')
      },
      {
        path: 'proposerInfoA',
        name: 'proposerInfoA',
        meta: {
          requireAuth: true,
          title: '案件详情',
          keepAlive: true
        },
        component: r => require.ensure([], () => r(require('@/page/filingSecr/archiveCase/archiveCaseInfo/children/proposerInfo.vue')), 'proposerInfoA')
      },
      {
        path: 'respondentInfoA',
        name: 'respondentInfoA',
        meta: {
          requireAuth: true,
          title: '案件详情',
          keepAlive: true
        },
        component: r => require.ensure([], () => r(require('@/page/filingSecr/archiveCase/archiveCaseInfo/children/respondentInfo.vue')), 'respondentInfoA')
      },
      {
        path: 'claimItemA',
        name: 'claimItemA',
        meta: {
          requireAuth: true,
          title: '案件详情',
          keepAlive: true
        },
        component: r => require.ensure([], () => r(require('@/page/filingSecr/archiveCase/archiveCaseInfo/children/claimItem.vue')), 'claimItemA')
      },
      {
        path: 'evidencesInfoA',
        name: 'evidencesInfoA',
        meta: {
          requireAuth: true,
          title: '案件详情',
          keepAlive: true
        },
        component: r => require.ensure([], () => r(require('@/page/filingSecr/archiveCase/archiveCaseInfo/children/evidencesInfo.vue')), 'evidencesInfoA')
      },
      {
        path: 'endCaseInfoA',
        name: 'endCaseInfoA',
        meta: {
          requireAuth: true,
          title: '案件详情',
          keepAlive: true
        },
        component: r => require.ensure([], () => r(require('@/page/filingSecr/archiveCase/archiveCaseInfo/children/endCaseInfo.vue')), 'endCaseInfoA')
      }
    ]
  }
]

export const getRouter = (obj) => {
  let _a = obj.menu
  let _r = []
  let _l = 0
  _a.push('/onesInfo', '/caseInfo', '/idenInfo', '/paymentInfo', '/meetList', '/archiveCaseInfo')
  _r.push({
    path: '/',
    component: r => require.ensure([], () => r(require('@/components/mains/mains.vue'))),
    children: [
      {
        path: '/',
        redirect: _a[0]
      }
    ]
  })
  for (let k in routerMap) {
    if (_a.indexOf(routerMap[k].path) !== -1) {
      if (obj.menuName[_a.indexOf(routerMap[k].path)]) {
        routerMap[k].meta.title = obj.menuName[_a.indexOf(routerMap[k].path)]
      }
      _l++
      _r[0].children.push(routerMap[k])
    }
    if (_a.length === _l) {
      _r[0].children.push({
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
