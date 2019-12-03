<template>
  <div class="groupAudit">
    <div class="_center pr">
      <spin-comp :spinShow="spinShow"></spin-comp>
      <Row class="pb20">
        <Col span="2">
          <label class="lh32 f16 fc6 fr mr15">条件选择</label>
        </Col>
        <Col span="3">
          <Select v-model="search.batchCondition" @on-change="resSearchList">
            <Option value="1" key="1">全部</Option>
            <Option value="5" key="5">批量同意/批量修订/批量退回</Option>
            <!-- <Option value="6" key="6">待(批量同意/批量修订(三个)/批量退回)</Option> -->
            <Option value="7" key="7" :style="{display: resBtnDis('GROUPAUDIT_BATCHAPPROVAL')}">批量保存组庭审批表</Option>
          </Select>
        </Col>
        <Col span="19">
          <div class="tr pr20">
            <Button class="ml20" type="primary" @click="resActionFind('resFind', null)" :style="{display: resBtnDis('GROUPAUDIT_QUERY')}">条件搜索</Button>
            <Button class="ml20" type="primary" @click="resAction('resBatchAgree', null)" :style="{display: resBtnDis('GROUPAUDIT_BATCHAGREE')}">批量同意</Button>
            <Button class="ml20" type="primary" @click="resAction('resBatchUpdate', null)" :style="{display: resBtnDis('GROUPAUDIT_BATCHUPDATE')}">批量修订</Button>
            <!-- <Button class="ml20" type="primary" @click="resBatch" :style="{display: resBtnDis('GROUPAUDIT_BATCHEAPP')}">批量指定仲裁员)</Button> -->
            <Button class="ml20" type="primary" @click="resAction('resBatchReject', null)" :style="{display: resBtnDis('GROUPAUDIT_BATCHREJECT')}">批量退回</Button>
            <Button class="ml20" type="primary" @click="resAction('resBatchSaveForm', null)" :style="{display: resBtnDis('GROUPAUDIT_BATCHAPPROVAL')}">批量保存审批表</Button>
          </div>
        </Col>
      </Row>
      <div class="_caseList clearfix">
        <Row>
          <Col span="24" class="pl20 pr20">
            <Table stripe border align="center" :loading="caseList.loading" :columns="caseList.header" :data="caseList.bodyList">
              <template slot-scope="{ row, index }" slot="approver">
                <div v-if="row.logicState === '19' || row.logicState === '20'">
                  <Button :style="{display: resBtnDis('GROUPAUDIT_APPARBITRATORS')}" type="primary" size="small" @click="resAction('groupPass', row)">同意</Button>
                  <Button :style="{display: resBtnDis('GROUPAUDIT_REVISE')}" type="primary" size="small" @click="resAction('resRevise', row)">修订</Button>
                  <Button :style="{display: resBtnDis('GROUPAUDIT_REJECT')}" type="primary" size="small" @click="resAction('resReject', row)">退回</Button>
                </div>
                <p v-if="row.approver !== ''" class="mr5" type="text" size="small">{{row.approver}}</p>
              </template>
              <template slot-scope="{ row, index }" slot="action">
                <Button :style="{display: resBtnDis('GROUPAUDIT_APPROVAL')}" type="primary" size="small" v-if="['19', '20', '21', '9', '7'].indexOf(row.logicState) !== -1 || row.passFlag === 3" @click="resAction('groupForm', row)">组庭审批表</Button>
                <Button :style="{display: resBtnDis('GROUPAUDIT_PASS')}" type="primary" size="small" v-if="row.passFlag === 2" @click="resAction('resPass', row)">通过</Button>
                <Button :style="{display: resBtnDis('GROUPAUDIT_REAPPOINTMENT')}" type="primary" size="small" v-if="row.passFlag === 3" @click="resAction('resRevise', row)">重新指定仲裁员</Button>
              </template>
            </Table>
          </Col>
        </Row>
      </div>
      <div class="_page clearfix">
        <Row>
          <Col span="12" offset="6" class="tc">
            <Page :total="pageObj.total" :current="pageObj.pageNum" :page-size="pageObj.pageSize" show-elevator show-total @on-change="reschangePage"></Page>
          </Col>
        </Row>
      </div>
    </div>
    <res-batch-save-form v-if="alertObj.batchSaveForm" :resIdsList="alertShow.idsList" @alertConfirm="alertSave('resBatchSaveForm')" @alertCancel="alertCanc('resBatchSaveForm')"></res-batch-save-form>
    <res-batch-update v-if="alertObj.batchUpdate" :resIdsList="alertShow.idsList" :resArbiNum="alertShow.arbiNum" @alertConfirm="alertSave('resBatchUpdate')" @alertCancel="alertCanc('resBatchUpdate')"></res-batch-update>
    <res-batch-agree v-if="alertObj.batchAgree" :resPropsData="alertShow.idsList" @alertConfirm="alertSave('resBatchAgree')" @alertCancel="alertCanc('resBatchAgree')"></res-batch-agree>
    <res-revise v-if="alertObj.revise" :resPropsData="alertObj.reviseData" @alertConfirm="alertSave('resRevise')" @alertCancel="alertCanc('resRevise')"></res-revise>
    <res-reject v-if="alertObj.reject" :resRejectData="alertObj.rejectData" @alertConfirm="alertSave('resReject')" @alertCancel="alertCanc('resReject')"></res-reject>
    <res-pass v-if="alertObj.pass" :resPassData="alertObj.passData" @alertConfirm="alertSave('resPass')" @alertCancel="alertCanc('resPass')"></res-pass>
    <res-group-pass v-if="alertObj.groupPass" :resGroupPassData="alertObj.groupPassData" @alertConfirm="alertSave('groupPass')" @alertCancel="alertCanc('groupPass')"></res-group-pass>
    <group-Appr-form v-if="formObj.filing" :caseId="formObj.caseId" @alertConfirm="alertSave('groupForm')" @alertCancel="alertCanc('groupForm')"></group-Appr-form>
    <res-find v-if="alertShow.find" @alertConfirm="alertSaveFind('find', ...arguments)" @alertCancel="alertCancFind('find')"></res-find>
  </div>
</template>

<script>
import axios from 'axios'
import {resMess, resBtn, resTimeOut, resSearFind} from '@/components/common/mixin.js'
import spinComp from '@/components/common/spin'
import resFind from '@/page/comm/resFind/resFind'
import alertBtnInfo from '@/components/common/alertBtnInfo'
import groupApprForm from '@/page/comm/apprForm/groupApprForm'
import resGroupPass from '@/page/arbitratComm/groupAudit/children/resGroupPass'
import resPass from '@/page/arbitratComm/groupAudit/children/resPass'
import resReject from '@/page/arbitratComm/groupAudit/children/resReject'
import resRevise from '@/page/arbitratComm/groupAudit/children/resRevise'
import resBatchAgree from '@/page/arbitratComm/groupAudit/children/resBatchAgree'
import resBatchUpdate from '@/page/arbitratComm/groupAudit/children/resBatchUpdate'
import resBatchSaveForm from '@/page/arbitratSecr/groupAppl/children/resBatchSaveForm'
import { caseInfo } from '@/config/common.js'

export default {
  name: 'group_audit',
  mixins: [resMess, resBtn, resTimeOut, resSearFind],
  components: { spinComp, resFind, alertBtnInfo, groupApprForm, resGroupPass, resPass, resReject, resRevise, resBatchAgree, resBatchUpdate, resBatchSaveForm },
  data () {
    return {
      spinShow: false,
      search: {
        batchCondition: '1',
        requestName: '',
        caseType: '',
        caseTypeList: {},
        requestNameList: []
      },
      caseList: {
        loading: false,
        header: [
          {
            title: '选择',
            key: 'id',
            width: 60,
            align: 'center',
            renderHeader: (h, params) => {
              return this.renderAllSele(h, params)
            },
            render: (h, params) => {
              return this.renderCheck(h, params)
            }
          },
          {
            title: '案号',
            key: 'code',
            align: 'center',
            render: (h, params) => {
              return h('a', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                style: {
                  color: '#2d8cf0'
                },
                on: {
                  click: () => {
                    this.goCaseInfo(params.index)
                  }
                }
              }, params.row.code)
            }
          },
          // {
          //   title: '案件编号',
          //   key: 'id',
          //   align: 'center'
          // },
          // {
          //   title: '案件类型',
          //   key: 'caseTypeName',
          //   align: 'center'
          // },
          {
            title: '案由',
            key: 'caseReson',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '申请人',
            key: 'applicantName',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '申请人选定仲裁员情况',
            key: 'applicantApprove',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '被申请人',
            key: 'respondentName',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '被申请人选定仲裁员情况',
            key: 'respondentApprove',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '办案处建议人选',
            key: 'recommArbitrators',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '主任审核',
            key: 'approver',
            tooltip: 'true',
            align: 'center',
            slot: 'approver'
          },
          {
            title: '组庭文书',
            key: 'id',
            minWidth: 30,
            align: 'center',
            slot: 'action'
          }
        ],
        bodyList: [],
        seleMap: {}
      },
      pageObj: {
        total: 0,
        pageNum: 1,
        pageSize: 10
      },
      alertShow: {
        idsList: [],
        ids: [],
        arbiNum: null,
        find: false
      },
      formObj: {
        caseId: null,
        filing: false
      },
      alertObj: {
        groupPass: false,
        groupPassData: null,
        pass: false,
        passData: null,
        reject: false,
        rejectData: null,
        revise: false,
        reviseData: null,
        batchAgree: false,
        batchUpdate: false,
        batchSaveForm: false
      }
    }
  },
  created () {
    this.resCaseList()
  },
  methods: {
    resCaseList () {
      this.spinShow = true
      axios.post('/approve/findGroupApproveList', {
        pageIndex: (this.pageObj.pageNum - 1) * this.pageObj.pageSize,
        pageSize: this.pageObj.pageSize,
        registerToken: this.search.requestName,
        caseTypeCode: this.search.caseType,
        groupApproveType: 'arbitrationCommission',
        batchCondition: this.search.batchCondition
      }).then(res => {
        let _data = res.data.data
        this.caseList.bodyList = _data.dataList === null ? [] : _data.dataList
        this.pageObj.total = _data.totalCount
        this.spinShow = false
      }).catch(e => {
        this.spinShow = false
        this.resMessage('error', '错误信息:' + e + ' 稍后再试')
      })
    },
    reschangePage (page) {
      this.pageObj.pageNum = page
      this.resCaseList()
    },
    goCaseInfo (index) {
      let obj = {}
      obj.caseId = this.caseList.bodyList[index].id
      obj.state = this.caseList.bodyList[index].state
      caseInfo(obj)
    },
    resSearchList () {
      this.search.requestName = ''
      this.search.caseType = ''
      this.alertCanc('clearIds')
      this.pageObj.pageNum = 1
      this.resCaseList()
    },
    renderAllSele (h, params) {
      return h('div', [
        h('span', {
          style: {
            cursor: 'pointer',
            userSelect: 'none'
          },
          on: {
            click: () => {
              this.resAllSele()
            }
          }
        }, '全选')
      ])
    },
    resAllSele () {
      if (this.caseList.seleMap[this.pageObj.pageNum] === undefined) {
        this.caseList.seleMap[this.pageObj.pageNum] = true
      } else {
        this.caseList.seleMap[this.pageObj.pageNum] = !this.caseList.seleMap[this.pageObj.pageNum]
      }
      this.caseList.bodyList.forEach((item, index) => {
        let _obj = item
        if (this.search.batchCondition !== '1' && (['19', '20', '21', '9', '7'].indexOf(_obj.logicState) !== -1 || _obj.passFlag === 3)) {
          this.seleArrChange(item, this.caseList.seleMap[this.pageObj.pageNum])
        }
      })
    },
    renderCheck (h, params) {
      let _obj = params.row
      if (this.search.batchCondition !== '1' && (['19', '20', '21', '9', '7'].indexOf(_obj.logicState) !== -1 || _obj.passFlag === 3)) {
        if (this.alertShow.ids.indexOf(_obj.id) === -1) {
          return h('div', [
            h('Icon', {
              props: {
                type: 'md-square-outline',
                size: '16'
              },
              style: {
                color: '#2d8cf0',
                cursor: 'pointer',
                verticalAlign: 'text-top'
              },
              on: {
                click: () => {
                  this.seleArrChange(_obj, true)
                }
              }
            })
          ])
        } else {
          return h('div', [
            h('Icon', {
              props: {
                type: 'md-checkbox',
                size: '16'
              },
              style: {
                color: '#2d8cf0',
                cursor: 'pointer',
                verticalAlign: 'text-top'
              },
              on: {
                click: () => {
                  this.seleArrChange(_obj, false)
                }
              }
            })
          ])
        }
      } else {
        return h('div', [
        ])
      }
    },
    seleArrChange (_data, bool) {
      let info = _data
      if (bool) {
        if (this.alertShow.ids.indexOf(info.id) === -1) {
          if (this.alertShow.ids.length >= 10) {
            this.resMessage('error', '最多只能选择十个案件')
            return false
          } else {
            let _o = {}
            if (this.search.batchCondition === '5' || this.search.batchCondition === '6') {
              _o.caseId = info.id
              _o.tribunalRequestId = info.tribunalRequestId
              _o.arbitratorIds = info.recommArbitratorIds
              _o.state = info.logicState
            } else if (this.search.batchCondition === '7') {
              _o.caseId = info.id
              _o.formType = 22
            }
            this.alertShow.idsList.push(_o)
            this.alertShow.ids.push(info.id)
          }
        }
      } else {
        if (this.alertShow.ids.indexOf(info.id) !== -1) {
          this.alertShow.idsList.splice(this.alertShow.ids.indexOf(info.id), 1)
          this.alertShow.ids.splice(this.alertShow.ids.indexOf(info.id), 1)
        }
      }
    },
    resAction (type, data) {
      switch (type) {
        case 'groupForm':
          this.formObj.caseId = data.id
          this.formObj.filing = true
          break
        case 'groupPass':
          this.alertObj.groupPassData = {
            resCaseId: data.id,
            resArbiId: data.recommArbitratorIds,
            resTribId: data.tribunalRequestId,
            logicState: data.logicState
          }
          this.alertObj.groupPass = true
          break
        case 'resPass':
          this.alertObj.passData = {
            caseId: data.id,
            tribunalRequestId: data.tribunalRequestId,
            arbitratorIds: data.approverId
          }
          this.alertObj.pass = true
          break
        case 'resReject':
          this.alertObj.rejectData = {
            caseIds: [data.id]
          }
          this.alertObj.reject = true
          break
        case 'resRevise':
          this.alertObj.reviseData = {
            caseId: data.id,
            logicState: data.logicState,
            arbiNum: data.arbitratorIdNum,
            resTribId: data.tribunalRequestId
          }
          this.alertObj.revise = true
          break
        case 'resBatchReject':
          if (this.search.batchCondition !== '5' && this.search.batchCondition !== '6') {
            this.resMessage('error', '请先条件选择 \'批量同意/批量修订/批量退回\'')
          } else if (this.alertShow.ids.length === 0) {
            this.resMessage('error', '请先选择一个案件')
          } else {
            this.alertObj.rejectData = {
              caseIds: this.alertShow.ids
            }
            this.alertObj.reject = true
          }
          break
        case 'resBatchAgree':
          if (this.search.batchCondition !== '5' && this.search.batchCondition !== '6') {
            this.resMessage('error', '请先条件选择 \'批量同意/批量修订/批量退回\'')
          } else if (this.alertShow.ids.length === 0) {
            this.resMessage('error', '请先选择一个案件')
          } else {
            this.alertObj.batchAgree = true
          }
          break
        case 'resBatchUpdate':
          if (this.search.batchCondition !== '5' && this.search.batchCondition !== '6') {
            this.resMessage('error', '请先条件选择 \'批量同意/批量修订/批量退回\'')
          } else if (this.alertShow.ids.length === 0) {
            this.resMessage('error', '请先选择一个案件')
          } else {
            this.alertShow.arbiNum = this.search.batchCondition === '5' ? 1 : 3
            this.alertObj.batchUpdate = true
          }
          break
        case 'resBatchSaveForm':
          if (this.search.batchCondition !== '7') {
            this.resMessage('error', '请先条件选择 \'批量保存组庭审批表\'')
          } else if (this.alertShow.ids.length === 0) {
            this.resMessage('error', '请先选择一个案件')
          } else {
            this.alertObj.batchSaveForm = true
          }
          break
      }
    },
    alertSave (type) {
      switch (type) {
        case 'groupForm':
          this.formObj.filing = false
          this.formObj.caseId = null
          this.resCaseList()
          break
        case 'groupPass':
          this.alertObj.groupPass = false
          this.alertObj.groupPassData = null
          this.pageObj.pageNum = 1
          this.resCaseList()
          break
        case 'resPass':
          this.alertObj.pass = false
          this.alertObj.passData = null
          this.pageObj.pageNum = 1
          this.resCaseList()
          break
        case 'resReject':
          this.alertObj.reject = false
          this.alertObj.rejectData = null
          this.pageObj.pageNum = 1
          this.alertCanc('clearIds')
          this.resCaseList()
          break
        case 'resRevise':
          this.alertObj.revise = false
          this.alertObj.reviseData = null
          this.alertCanc('clearIds')
          this.resCaseList()
          break
        case 'resBatchAgree':
          this.alertObj.batchAgree = false
          this.resSearchList()
          break
        case 'resBatchUpdate':
          this.alertObj.batchUpdate = false
          this.alertShow.arbiNum = null
          this.resSearchList()
          break
        case 'resBatchSaveForm':
          this.alertObj.batchSaveForm = false
          this.resSearchList()
          break
      }
    },
    alertCanc (type) {
      switch (type) {
        case 'groupForm':
          this.formObj.filing = false
          this.formObj.caseId = null
          break
        case 'groupPass':
          this.alertObj.groupPass = false
          this.alertObj.groupPassData = null
          break
        case 'resPass':
          this.alertObj.pass = false
          this.alertObj.passData = null
          break
        case 'clearIds':
          this.alertShow.idsList = []
          this.alertShow.ids = []
          this.caseList.seleMap = {}
          break
        case 'resReject':
          this.alertObj.reject = false
          this.alertObj.rejectData = null
          this.alertCanc('clearIds')
          break
        case 'resRevise':
          this.alertObj.revise = false
          this.alertObj.reviseData = null
          this.alertCanc('clearIds')
          break
        case 'resBatchAgree':
          this.alertObj.batchAgree = false
          this.alertCanc('clearIds')
          break
        case 'resBatchUpdate':
          this.alertObj.batchUpdate = false
          this.alertShow.arbiNum = null
          this.alertCanc('clearIds')
          break
        case 'resBatchSaveForm':
          this.alertObj.batchSaveForm = false
          this.alertCanc('clearIds')
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/style/mixin';
._center {
  background: transparent;
  width: 80%;
  @include mw(1180px);
  @include bc;
  padding-top: 40px;
  ._search {
    max-width: 450px;
    margin-bottom: 20px;
  }
  ._caseList {
    margin-bottom: 20px;
  }
}
._labelFor {
  margin-bottom: 10px;
  p {
    padding: 7px 0;
  }
  ._span {
    color: #ff7a7a;
    vertical-align: text-top;
  }
}
</style>
