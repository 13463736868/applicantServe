<template>
  <div class="pendCase">
    <div class="_center pr">
      <spin-comp :spinShow="spinShow"></spin-comp>
      <Row>
        <Col span="1">
          <label class="lh32 f16 fc6 fr mr5">搜索</label>
        </Col>
        <Col span="4">
          <Input v-model="search.text" icon="ios-search" class="_search hand" @on-click="resSearch" @keyup.enter.native="resSearch" placeholder="案号 / 案件编号 / 申请人 / 被申请人 / 代理人 / 年限"></Input>
        </Col>
        <Col span="2">
          <label class="lh32 f16 fc6 fr mr5">条件选择</label>
        </Col>
        <Col span="3">
          <Select v-model="search.batchCondition" @on-change="resSearch">
            <Option value="1" key="1">全部</Option>
            <Option :style="{display: resBtnDis('PENDCASE_CONFIRMTYPE_BATCH')}" value="2" key="2">批量确认案由</Option>
            <Option :style="{display: resBtnDis('PENDCASE_SAVEAPPROVAL_BATCH')}" value="3" key="3">批量保存审批表</Option>
            <Option :style="{display: resBtnDis('PENDCASE_BATCHFILING')}" value="4" key="4">批量立案</Option>
            <Option :style="{display: resBtnDis('PENDCASE_REJECT_BATCH')}" value="5" key="5">批量退回</Option>
            <Option :style="{display: resBtnDis('PENDCASE_UPDATETYPE_BATCH')}" value="6" key="6">批量修订案由</Option>
            <Option :style="{display: resBtnDis('PENDCASE_RESUBMIT_BATCH')}" value="7" key="7">批量重新提交</Option>
          </Select>
        </Col>
        <Col span="14">
          <div class="tr pr20">
            <!-- <Button class="ml20" type="primary" @click="resActionFind('resFind', null)" :style="{display: resBtnDis('PENDCASE_QUERY')}">条件搜索</Button> -->
            <Button class="ml5" type="primary" @click="resAction('resPassTypeBatch', null)" :style="{display: resBtnDis('PENDCASE_CONFIRMTYPE_BATCH')}">批量确认案由</Button>
            <Button class="ml5" type="primary" @click="resAction('resUpdateTypeBatch', null)" :style="{display: resBtnDis('PENDCASE_UPDATETYPE_BATCH')}">批量修订案由</Button>
            <Button class="ml5" type="primary" @click="resAction('resBatchSaveForm', null)" :style="{display: resBtnDis('PENDCASE_SAVEAPPROVAL_BATCH')}">批量保存审批表</Button>
            <Button class="ml5" type="primary" @click="resAction('resRejectBatch', null)" :style="{display: resBtnDis('PENDCASE_REJECT_BATCH')}">批量退回</Button>
            <Button class="ml5" type="primary" @click="resAction('resBatchFiling', null)" :style="{display: resBtnDis('PENDCASE_BATCHFILING')}">批量立案</Button>
            <Button class="ml5" type="primary" @click="resAction('resResubmitBatch', null)" :style="{display: resBtnDis('PENDCASE_RESUBMIT_BATCH')}">批量重新提交</Button>
          </div>
        </Col>
      </Row>
      <div class="_caseList clearfix">
        <Row>
          <Col span="24" class="pl20 pr20">
            <Table stripe border align="center" :loading="caseList.loading" :columns="caseList.header" :data="caseList.bodyList">
              <template slot-scope="{ row, index }" slot="check">
                <div v-if="search.batchCondition !== '1' && ['1', '2'].indexOf(row.pendBtnStatus) !== -1">
                  <Icon v-if="alertShow.ids.indexOf(row.caseId) === -1" class="hand vtt" type="md-square-outline" size="16" color="#2d8cf0" @click="seleArrChange(row, true)"></Icon>
                  <Icon v-else class="hand vtt" type="md-checkbox" size="16" color="#2d8cf0" @click="seleArrChange(row, false)"></Icon>
                </div>
              </template>
              <template slot-scope="{ row, index }" slot="caseCause">
                <Button :style="{display: resBtnDis('PENDCASE_CONFIRMTYPE')}" class="mr5" type="primary" size="small" v-if="row.caseReson === null" @click="resAction('caseCause', row)">确认案由</Button>
                <span class="mr5 mt1" type="text" size="small" v-else="">{{row.caseReson}}</span>
              </template>
              <template slot-scope="{ row, index }" slot="seeFileL">
                <Button :style="{display: resBtnDis('PENDCASE_FILEDETAIL')}" class="mr5" type="primary" size="small" @click="resAction('seeFile', row)">查看文件</Button>
              </template>
              <template slot-scope="{ row, index }" slot="action">
                <Button :style="{display: resBtnDis('PENDCASE_CONFIRMFILING')}" class="mr5 mt1" type="primary" size="small" v-if="row.pendBtnStatus === '1'" @click="resAction('resConfCase', row)">确认立案</Button>
                <Button :style="{display: resBtnDis('PENDCASE_RESUBMIT')}" class="mr5 mt1" type="primary" size="small" v-if="row.pendBtnStatus === '2'" @click="resAction('resConfCase', row)">重新提交</Button>
                <Button :style="{display: resBtnDis('PENDCASE_APPROVAL')}" class="mr5 mt1" type="primary" size="small" v-if="row.pendBtnStatus === '1' || row.pendBtnStatus === '2'" @click="resAction('pendForm', row)">立案审批表</Button>
                <Button :style="{display: resBtnDis('PENDCASE_UPDATETYPE')}" class="mr5 mt1" type="primary" size="small" v-if="row.pendBtnStatus === '2'" @click="resAction('caseCause', row)">修订案由</Button>
                <Button :style="{display: resBtnDis('PENDCASE_REJECT')}" class="mr5 mt1" type="primary" size="small" v-if="row.pendBtnStatus === '1'" @click="resAction('backCase', row)">退回</Button>
                <span style="color: #2d8cf0" class="mr5 mt1" type="text" size="small" v-if="row.pendBtnStatus === '3'">立案审核中</span>
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
    <alert-btn-info :alertShow="alertShow.conf" @alertConfirm="alertSave('conf')" @alertCancel="alertCanc('conf')" alertTitle="确认立案">
      <p v-if="dataObj.type === '1'">要确认立案吗？</p>
      <p v-if="dataObj.type === '2'">要确定重新提交立案吗？</p>
    </alert-btn-info>
    <res-update-type-batch v-if="alertObj.updateTypeBatch" :resPropsData="alertShow.idsList" @alertConfirm="alertSave('resUpdateTypeBatch')" @alertCancel="alertCanc('resUpdateTypeBatch')"></res-update-type-batch>
    <res-reject-batch  v-if="alertObj.rejectBatch" :resPropsData="alertShow.idsList" @alertConfirm="alertSave('resRejectBatch')" @alertCancel="alertCanc('resRejectBatch')"></res-reject-batch>
    <res-batch-save-form v-if="alertObj.batchSaveForm" :resIdsList="alertShow.idsList" @alertConfirm="alertSave('resBatchSaveForm')" @alertCancel="alertCanc('resBatchSaveForm')"></res-batch-save-form>
    <res-batch-filing v-if="alertObj.batchFiling" :resPropsData="alertObj.batchFilingData" @alertConfirm="alertSave('resBatchFiling')" @alertCancel="alertCanc('resBatchFiling')"></res-batch-filing>
    <res-find v-if="alertShow.find" @alertConfirm="alertSaveFind('find', ...arguments)" @alertCancel="alertCancFind('find')"></res-find>
    <filing-case-form v-if="formObj.filing" :caseId="formObj.caseId" @alertConfirm="alertSave('pendForm')" @alertCancel="alertCanc('pendForm')"></filing-case-form>
    <res-see-file v-if="alertObj.seeFile" :resCaseId="alertObj.caseId" @alertConfirm="alertSave('seeFile')" @alertCancel="alertCanc('seeFile')"></res-see-file>
    <res-update-pendcase v-if="alertShow.caseCause" :caseId="alertShow.caseId" :resCaseType="alertShow.resCaseType" @alertConfirm="alertSave('caseCause')" @alertCancel="alertCanc('caseCause')"></res-update-pendcase>
    <res-back-case  v-if="alertShow.backCase" :caseId="alertShow.caseId" @alertConfirm="alertSave('backCase')" @alertCancel="alertCanc('backCase')"></res-back-case>
  </div>
</template>

<script>
import axios from 'axios'
import {resMess, resBtn, resSearFind} from '@/components/common/mixin.js'
import spinComp from '@/components/common/spin'
import alertBtnInfo from '@/components/common/alertBtnInfo'
import resFind from '@/page/comm/resFind/resFind'
import filingCaseForm from '@/page/comm/apprForm/filingCaseForm'
import resSeeFile from '@/page/filingSecr/pendCase/children/resSeeFile'
import resUpdatePendcase from '@/page/filingSecr/pendCase/children/resUpdatePendcase'
import resBackCase from '@/page/filingSecr/pendCase/children/resBackCase'
import resBatchFiling from '@/page/filingSecr/pendCase/children/resBatchFiling'
import resBatchSaveForm from '@/page/comm/apprForm/resBatchSaveForm'
import resRejectBatch from '@/page/filingSecr/pendCase/children/resRejectBatch'
import resUpdateTypeBatch from '@/page/filingSecr/pendCase/children/resUpdateTypeBatch'
import { caseInfo } from '@/config/common.js'

export default {
  name: 'pend_case',
  mixins: [resMess, resBtn, resSearFind],
  components: { spinComp, alertBtnInfo, resFind, filingCaseForm, resSeeFile, resUpdatePendcase, resBackCase, resBatchFiling, resBatchSaveForm, resRejectBatch, resUpdateTypeBatch },
  data () {
    return {
      spinShow: false,
      search: {
        batchCondition: '1',
        text: '',
        requestName: '',
        caseType: ''
      },
      caseList: {
        loading: false,
        header: [
          {
            title: '选择',
            key: 'caseId',
            width: 60,
            align: 'center',
            slot: 'check',
            renderHeader: (h, params) => {
              return this.renderAllSele(h, params)
            }
          },
          {
            title: '案件编号',
            key: 'caseId',
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
              }, params.row.caseId)
            }
          },
          {
            title: '案件类型',
            key: 'caseTypeName',
            align: 'center'
          },
          {
            title: '案由',
            key: 'caseReson',
            tooltip: 'true',
            align: 'center',
            slot: 'caseCause'
          },
          {
            title: '申请人',
            key: 'partyName',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '代理人',
            key: 'proxyName',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '被申请人',
            key: 'defendantName',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '提交时间',
            key: 'createTime',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '受理时间',
            key: 'acceptTime',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '待送达材料',
            key: 'caseId',
            align: 'center',
            slot: 'seeFileL'
          },
          {
            title: '操作',
            key: 'caseId',
            align: 'center',
            slot: 'action',
            width: 200
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
        conf: false,
        idsList: [],
        ids: [],
        find: false,
        caseCause: false,
        caseId: null,
        backCase: false,
        resCaseType: null
      },
      dataObj: {
        confCaseId: null,
        confCosts: null,
        confType: null,
        type: null
      },
      formObj: {
        caseId: null,
        filing: false
      },
      alertObj: {
        seeFile: false,
        caseId: null,
        batchFiling: false,
        batchFilingData: null,
        batchSaveForm: false,
        rejectBatch: false,
        updateTypeBatch: false
      }
    }
  },
  created () {
    this.resCaseList()
  },
  methods: {
    resCaseList () {
      this.spinShow = true
      axios.post('/case/findRegisterCaseList', {
        startIndex: (this.pageObj.pageNum - 1) * this.pageObj.pageSize,
        pageSize: this.pageObj.pageSize,
        keyword: this.search.text,
        registerToken: this.search.requestName,
        caseTypeCode: this.search.caseType,
        batchCondition: this.search.batchCondition,
        state: 12,
        caseListType: 2
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
    resSearch () {
      this.search.requestName = ''
      this.search.caseType = ''
      this.alertCanc('clearIds')
      this.pageObj.pageNum = 1
      this.resCaseList()
    },
    reschangePage (page) {
      this.pageObj.pageNum = page
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
        if (this.search.batchCondition !== '1' && ['1', '2'].indexOf(_obj.pendBtnStatus) !== -1) {
          this.seleArrChange(item, this.caseList.seleMap[this.pageObj.pageNum])
        }
      })
    },
    seleArrChange (_data, bool) {
      let info = _data
      if (bool) {
        if (this.alertShow.ids.indexOf(info.caseId) === -1) {
          if (this.alertShow.ids.length >= 10) {
            this.resMessage('error', '最多只能选择十个案件')
            return false
          } else {
            let _o = {}
            if (this.search.batchCondition === '3') {
              _o.caseId = info.caseId
              _o.formType = 21
            } else if (this.search.batchCondition === '4' || this.search.batchCondition === '7') {
              _o.caseId = info.caseId
              _o.costs = info.cost
            } else if (this.search.batchCondition === '5') {
              _o.caseId = info.caseId
            } else if (this.search.batchCondition === '2' || this.search.batchCondition === '6') {
              _o.caseId = info.caseId
            }
            this.alertShow.idsList.push(_o)
            this.alertShow.ids.push(info.caseId)
          }
        }
      } else {
        if (this.alertShow.ids.indexOf(info.caseId) !== -1) {
          this.alertShow.idsList.splice(this.alertShow.ids.indexOf(info.caseId), 1)
          this.alertShow.ids.splice(this.alertShow.ids.indexOf(info.caseId), 1)
        }
      }
    },
    resAction (type, data) {
      switch (type) {
        case 'pendForm':
          this.formObj.caseId = data.caseId
          this.formObj.filing = true
          break
        case 'seeFile':
          this.alertObj.caseId = data.caseId
          this.alertObj.seeFile = true
          break
        case 'caseCause':
          this.alertShow.resCaseType = data.resCaseType
          this.alertShow.caseId = data.caseId
          this.alertShow.caseCause = true
          break
        case 'backCase':
          this.alertShow.caseId = data.caseId
          this.alertShow.backCase = true
          break
        case 'resConfCase':
          this.dataObj.confType = data.caseType
          this.dataObj.confCaseId = data.caseId
          this.dataObj.confCosts = data.cost
          this.dataObj.type = data.pendBtnStatus
          this.alertShow.conf = true
          break
        case 'resResubmitBatch':
        case 'resBatchFiling':
          if ((type === 'resBatchFiling' && this.search.batchCondition !== '4') || (type === 'resResubmitBatch' && this.search.batchCondition !== '7')) {
            this.resMessage('error', type === 'resBatchFiling' ? '请先条件选择 \'批量立案\'' : '请先条件选择 \'批量重新提交\'')
          } else if (this.alertShow.ids.length === 0) {
            this.resMessage('error', '请先选择一个案件')
          } else {
            this.alertObj.batchFilingData = {
              caseIds: this.alertShow.idsList,
              type: type
            }
            this.alertObj.batchFiling = true
          }
          break
        case 'resBatchSaveForm':
          if (this.search.batchCondition !== '3') {
            this.resMessage('error', '请先条件选择 \'批量保存审批表\'')
          } else if (this.alertShow.ids.length === 0) {
            this.resMessage('error', '请先选择一个案件')
          } else {
            this.alertObj.batchSaveForm = true
          }
          break
        case 'resRejectBatch':
          if (this.search.batchCondition !== '5') {
            this.resMessage('error', '请先条件选择 \'批量退回\'')
          } else if (this.alertShow.ids.length === 0) {
            this.resMessage('error', '请先选择一个案件')
          } else {
            this.alertObj.rejectBatch = true
          }
          break
        case 'resPassTypeBatch':
        case 'resUpdateTypeBatch':
          if ((type === 'resPassTypeBatch' && this.search.batchCondition !== '2') || (type === 'resUpdateTypeBatch' && this.search.batchCondition !== '6')) {
            this.resMessage('error', type === 'resPassTypeBatch' ? '请先条件选择 \'批量确认案由\'' : '请先条件选择 \'批量修订案由\'')
          } else if (this.alertShow.ids.length === 0) {
            this.resMessage('error', '请先选择一个案件')
          } else {
            this.alertObj.updateTypeBatch = true
          }
          break
      }
    },
    alertSave (type, data) {
      switch (type) {
        case 'conf':
          this.alertShow.conf = false
          axios.post('/case/updateCaseStateAndType', {
            caseId: this.dataObj.confCaseId,
            caseType: this.dataObj.confType,
            costs: this.dataObj.confCosts
          }).then(res => {
            this.alertCanc('conf')
            this.resMessage('success', '操作成功')
            this.resSearch()
          }).catch(e => {
            this.resMessage('error', '错误信息:' + e + ' 稍后再试')
          })
          break
        case 'pendForm':
          this.formObj.filing = false
          this.formObj.caseId = null
          this.resCaseList()
          break
        case 'seeFile':
          this.alertObj.seeFile = false
          this.alertObj.caseId = null
          break
        case 'backCase':
          this.alertShow.backCase = false
          this.alertShow.caseId = null
          this.resCaseList()
          break
        case 'caseCause':
          this.alertShow.resCaseType = null
          this.alertShow.caseId = null
          this.alertShow.caseCause = false
          this.resCaseList()
          break
        case 'resBatchFiling':
          this.alertObj.batchFiling = false
          this.alertObj.batchFilingData = null
          this.resSearch()
          break
        case 'resBatchSaveForm':
          this.alertObj.batchSaveForm = false
          this.resSearch()
          break
        case 'resRejectBatch':
          this.alertObj.rejectBatch = false
          this.resSearch()
          break
        case 'resUpdateTypeBatch':
          this.alertObj.updateTypeBatch = false
          this.resSearch()
          break
      }
    },
    alertCanc (type) {
      switch (type) {
        case 'conf':
          this.alertShow.conf = false
          this.dataObj.confCaseId = null
          this.dataObj.confCosts = null
          this.dataObj.confType = null
          this.dataObj.type = null
          break
        case 'resBatchFiling':
          this.alertObj.batchFiling = false
          this.alertObj.batchFilingData = null
          this.alertCanc('clearIds')
          break
        case 'clearIds':
          this.alertShow.idsList = []
          this.alertShow.ids = []
          this.caseList.seleMap = {}
          break
        case 'pendForm':
          this.formObj.filing = false
          this.formObj.caseId = null
          break
        case 'seeFile':
          this.alertObj.seeFile = false
          this.alertObj.caseId = null
          break
        case 'backCase':
          this.alertShow.backCase = false
          this.alertShow.caseId = null
          break
        case 'caseCause':
          this.alertShow.caseCause = false
          this.alertShow.resCaseType = null
          this.alertShow.caseId = null
          break
        case 'resBatchSaveForm':
          this.alertObj.batchSaveForm = false
          this.alertCanc('clearIds')
          break
        case 'resRejectBatch':
          this.alertObj.rejectBatch = false
          this.alertCanc('clearIds')
          break
        case 'resUpdateTypeBatch':
          this.alertObj.updateTypeBatch = false
          this.alertCanc('clearIds')
          break
      }
    },
    goCaseInfo (index) {
      let obj = {}
      obj.caseId = this.caseList.bodyList[index].caseId
      obj.state = this.caseList.bodyList[index].state
      caseInfo(obj)
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
  ._label {
    padding: 7px 0;
  }
}
</style>
