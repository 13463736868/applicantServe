<template>
  <div class="pendCase">
    <div class="_center pr">
      <spin-comp :spinShow="spinShow"></spin-comp>
      <Row>
        <Col span="2">
          <label class="lh32 f16 fc6 fr mr15">搜索</label>
        </Col>
        <Col span="5">
          <Input v-model="search.text" icon="ios-search" class="_search hand" @on-click="resSearch" @keyup.enter.native="resSearch" placeholder="案号 / 案件编号 / 申请人 / 被申请人 / 代理人 / 年限"></Input>
        </Col>
        <Col span="2">
          <label class="lh32 f16 fc6 fr mr15">条件选择</label>
        </Col>
        <Col span="3">
          <Select v-model="search.batchCondition" @on-change="resSearch">
            <Option value="1" key="1">全部</Option>
            <Option :style="{display: resBtnDis('PENDCASEM_BATCHPASS')}" value="2" key="2">批量通过</Option>
            <Option :style="{display: resBtnDis('PENDCASEM_REVISE_BATCH')}" value="3" key="3">批量案由修订</Option>
            <Option :style="{display: resBtnDis('PENDCASEM_SAVEAPPRBATCH')}" value="4" key="4">批量保存审批表</Option>
            <Option :style="{display: resBtnDis('PENDCASEM_REJECT_BATCH')}" value="5" key="5">批量退回</Option>
          </Select>
        </Col>
        <Col span="12">
          <div class="tr pr20">
            <Button class="ml5" type="primary" @click="resActionFind('resFind', null)" :style="{display: resBtnDis('PENDCASEM_QUERY')}">条件搜索</Button>
            <Button class="ml5" type="primary" @click="resAction('resUpdateTypeBatch', null)" :style="{display: resBtnDis('PENDCASEM_REVISE_BATCH')}">批量案由修订</Button>
            <Button class="ml5" type="primary" @click="resAction('resBatchSaveForm', null)" :style="{display: resBtnDis('PENDCASEM_SAVEAPPRBATCH')}">批量保存审批表</Button>
            <Button class="ml5" type="primary" @click="resAction('resRejectBatch', null)" :style="{display: resBtnDis('PENDCASEM_REJECT_BATCH')}">批量退回</Button>
            <Button class="ml5" type="primary" @click="resBatch" :style="{display: resBtnDis('PENDCASEM_BATCHPASS')}">批量通过</Button>
          </div>
        </Col>
      </Row>
      <div class="_caseList clearfix">
        <Row>
          <Col span="24" class="pl20 pr20">
            <Table stripe border align="center" :loading="caseList.loading" :columns="caseList.header" :data="caseList.bodyList">
              <template slot-scope="{ row, index }" slot="check">
                <div v-if="search.batchCondition !== '1' && row.pendBtnStatus === '3'">
                  <Icon v-if="alertShow.ids.indexOf(row.caseId) === -1" class="hand vtt" type="md-square-outline" size="16" color="#2d8cf0" @click="seleArrChange(row, true)"></Icon>
                  <Icon v-else class="hand vtt" type="md-checkbox" size="16" color="#2d8cf0" @click="seleArrChange(row, false)"></Icon>
                </div>
              </template>
              <template slot-scope="{ row, index }" slot="seeFileL">
                <Button :style="{display: resBtnDis('PENDCASEM_FILEDETAIL')}" class="mr5" type="primary" size="small" @click="resAction('seeFile', row)">查看文件</Button>
              </template>
              <template slot-scope="{ row, index }" slot="action">
                <div v-if="row.pendBtnStatus === '3'">
                  <Button :style="{display: resBtnDis('PENDCASEM_PASS')}" class="mr5" type="primary" size="small" @click="resConfCase(index)">通过</Button>
                  <Button :style="{display: resBtnDis('PENDCASEM_REJECT')}" class="mr5" type="primary" size="small" @click="resAction('backCase', row)">退回</Button>
                  <Button :style="{display: resBtnDis('PENDCASEM_APPROVAL')}" class="mr5" type="primary" size="small" @click="resAction('pendForm', row)">立案审批表</Button>
                  <Button :style="{display: resBtnDis('PENDCASEM_REVISE')}" class="mr5" type="primary" size="small" @click="resAction('reson', row)">案由修订</Button>
                </div>
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
    <alert-btn-info :alertShow="alertShow.conf" @alertConfirm="confSave" @alertCancel="alertCanc('conf')" alertTitle="确认立案">
      <p>确定要通过吗？</p>
    </alert-btn-info>
    <alert-btn-info :alertShow="alertShow.batch" @alertConfirm="batchSave" @alertCancel="alertCanc('batch')" alertTitle="确认立案">
      <p>确定要通过吗？</p>
    </alert-btn-info>
    <res-reject-batch  v-if="alertObj.rejectBatch" :resPropsData="alertShow.idsList" @alertConfirm="alertSave('resRejectBatch')" @alertCancel="alertCanc('resRejectBatch')"></res-reject-batch>
    <res-batch-save-form v-if="alertObj.batchSaveForm" :resIdsList="alertShow.idsList" @alertConfirm="alertSave('resBatchSaveForm')" @alertCancel="alertCanc('resBatchSaveForm')"></res-batch-save-form>
    <res-update-type-batch v-if="alertObj.updateTypeBatch" :resPropsData="alertShow.idsList" @alertConfirm="alertSave('resUpdateTypeBatch')" @alertCancel="alertCanc('resUpdateTypeBatch')"></res-update-type-batch>
    <res-find v-if="alertShow.find" @alertConfirm="alertSaveFind('find', ...arguments)" @alertCancel="alertCancFind('find')"></res-find>
    <filing-case-form v-if="formObj.filing" :caseId="formObj.caseId" @alertConfirm="alertSave('pendForm')" @alertCancel="alertCanc('pendForm')"></filing-case-form>
    <res-reson-alert v-if="alertShow.resonModel" :resCaseId="alertShow.resCaseId" :resCaseType="alertShow.resCaseType" @alertConfirm="alertSave('reson')" @alertCancel="alertCanc('reson')"></res-reson-alert>
    <res-see-file v-if="alertObj.seeFile" :resCaseId="alertObj.caseId" @alertConfirm="alertSave('seeFile')" @alertCancel="alertCanc('seeFile')"></res-see-file>
    <res-back-case v-if="alertShow.backCaseModel" :caseId="alertShow.resCaseId" @alertConfirm="alertSave('backCase')" @alertCancel="alertCanc('backCase')"></res-back-case>
  </div>
</template>

<script>
import axios from 'axios'
import {resMess, resBtn, resSearFind} from '@/components/common/mixin.js'
import { mapGetters } from 'vuex'
import spinComp from '@/components/common/spin'
import resFind from '@/page/comm/resFind/resFind'
import alertBtnInfo from '@/components/common/alertBtnInfo'
import filingCaseForm from '@/page/comm/apprForm/filingCaseForm'
import resResonAlert from '@/page/filingMana/pendCaseM/children/resResonAlert'
import resSeeFile from '@/page/filingMana/pendCaseM/children/resSeeFile'
import resBackCase from '@/page/filingMana/pendCaseM/children/resBackCase'
import resBatchSaveForm from '@/page/comm/apprForm/resBatchSaveForm'
import resUpdateTypeBatch from '@/page/filingSecr/pendCase/children/resUpdateTypeBatch'
import resRejectBatch from '@/page/filingMana/pendCaseM/children/resRejectBatch'
import { caseInfo } from '@/config/common.js'

export default {
  name: 'pend_case_m',
  mixins: [resMess, resBtn, resSearFind],
  components: { spinComp, alertBtnInfo, resFind, filingCaseForm, resResonAlert, resSeeFile, resBackCase, resBatchSaveForm, resUpdateTypeBatch, resRejectBatch },
  data () {
    return {
      spinShow: false,
      search: {
        batchCondition: '1',
        text: '',
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
            minWidth: 100
          }
        ],
        bodyList: []
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
        batch: false,
        find: false,
        resonModel: false,
        resCaseId: null,
        resCaseType: null,
        backCaseModel: false
      },
      dataObj: {
        confCaseId: null,
        confCosts: null,
        confType: null
      },
      caseTypeList: [],
      btnMap: null,
      formObj: {
        caseId: null,
        filing: false
      },
      alertObj: {
        seeFile: false,
        caseId: null,
        updateTypeBatch: false,
        batchSaveForm: false,
        rejectBatch: false
      }
    }
  },
  created () {
    this.resCaseList()
  },
  computed: {
    ...mapGetters([
      'buttonMap'
    ])
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
        state: 12,
        caseListType: 9
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
    resConfCase (index) {
      axios.post('/dictionary/findDictionaryList', {
        type: 'caseType'
      }).then(res => {
        let _dataList = res.data.data
        let _select = []
        for (let k in _dataList) {
          let _o = {}
          _o.value = _dataList[k].itemValue
          _o.label = _dataList[k].item
          _select.push(_o)
        }
        this.caseTypeList = _select
        this.alertShow.conf = true
        this.dataObj.confCaseId = this.caseList.bodyList[index].caseId
        this.dataObj.confCosts = this.caseList.bodyList[index].cost
      }).catch(e => {
        this.resMessage('error', '错误信息:' + e + ' 稍后再试')
      })
    },
    confSave () {
      this.alertShow.conf = false
      axios.post('/case/updateCaseStateAnd', {
        caseId: this.dataObj.confCaseId,
        costs: this.dataObj.confCosts
      }).then(res => {
        this.alertCanc('conf')
        this.resMessage('success', '操作成功')
        this.resSearch()
      }).catch(e => {
        this.resMessage('error', '错误信息:' + e + ' 稍后再试')
      })
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
    seleArrChange (_data, bool) {
      let info = _data
      if (bool) {
        if (this.alertShow.ids.indexOf(info.caseId) === -1) {
          if (this.alertShow.ids.length >= 10) {
            this.resMessage('error', '最多只能选择十个案件')
            return false
          } else {
            let _o = {}
            if (this.search.batchCondition === '4') {
              _o.caseId = info.caseId
              _o.formType = 21
            } else if (this.search.batchCondition === '3') {
              _o.caseId = info.caseId
            } else if (this.search.batchCondition === '2') {
              _o.caseId = info.caseId
              _o.costs = info.cost
            } else if (this.search.batchCondition === '5') {
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
    resBatch () {
      if (this.alertShow.ids.length === 0) {
        this.resMessage('error', '请先选择一个案件')
      } else {
        axios.post('/dictionary/findDictionaryList', {
          type: 'caseType'
        }).then(res => {
          let _dataList = res.data.data
          let _select = []
          for (let k in _dataList) {
            let _o = {}
            _o.value = _dataList[k].itemValue
            _o.label = _dataList[k].item
            _select.push(_o)
          }
          this.caseTypeList = _select
          this.alertShow.batch = true
        }).catch(e => {
          this.resMessage('error', '错误信息:' + e + ' 稍后再试')
        })
      }
    },
    batchSave () {
      this.alertShow.batch = false
      axios.put('/caseBatch/updateCaseStateAnd_batch', {
        items: JSON.stringify(this.alertShow.idsList),
        state: '1'
      }, {
        headers: {
          'content-Type': 'application/json;charset=UTF-8'
        }
      }).then(res => {
        this.alertCanc('batch')
        this.resMessage('success', res.data.data)
        this.resSearch()
      }).catch(e => {
        this.alertCanc('batch')
        this.resMessage('error', '错误信息:' + e + ' 稍后再试')
      })
    },
    resAction (type, data) {
      switch (type) {
        case 'pendForm':
          this.formObj.caseId = data.caseId
          this.formObj.filing = true
          break
        case 'reson':
          this.alertShow.resCaseType = data.resCaseType
          this.alertShow.resCaseId = data.caseId
          this.alertShow.resonModel = true
          break
        case 'seeFile':
          this.alertObj.caseId = data.caseId
          this.alertObj.seeFile = true
          break
        case 'backCase':
          this.alertShow.resCaseId = data.caseId
          this.alertShow.backCaseModel = true
          break
        case 'resUpdateTypeBatch':
          if (this.search.batchCondition !== '3') {
            this.resMessage('error', '请先条件选择 \'批量案由修订\'')
          } else if (this.alertShow.ids.length === 0) {
            this.resMessage('error', '请先选择一个案件')
          } else {
            this.alertObj.updateTypeBatch = true
          }
          break
        case 'resBatchSaveForm':
          if (this.search.batchCondition !== '4') {
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
      }
    },
    alertSave (type) {
      switch (type) {
        case 'pendForm':
          this.formObj.filing = false
          this.formObj.caseId = null
          this.resCaseList()
          break
        case 'reson':
          this.alertShow.resonModel = false
          this.alertShow.resCaseId = null
          this.alertShow.resCaseType = null
          this.pageObj.pageNum = 1
          this.resCaseList()
          break
        case 'seeFile':
          this.alertObj.seeFile = false
          this.alertObj.caseId = null
          break
        case 'backCase':
          this.alertShow.resCaseId = null
          this.alertShow.backCaseModel = false
          this.pageObj.pageNum = 1
          this.resCaseList()
          break
        case 'resBatchSaveForm':
          this.alertObj.batchSaveForm = false
          this.resSearch()
          break
        case 'resUpdateTypeBatch':
          this.alertObj.updateTypeBatch = false
          this.resSearch()
          break
        case 'resRejectBatch':
          this.alertObj.rejectBatch = false
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
          break
        case 'batch':
          this.alertShow.batch = false
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
        case 'reson':
          this.alertShow.resonModel = false
          this.alertShow.resCaseId = null
          this.alertShow.resCaseType = null
          break
        case 'seeFile':
          this.alertObj.seeFile = false
          this.alertObj.caseId = null
          break
        case 'backCase':
          this.alertShow.resCaseId = null
          this.alertShow.backCaseModel = false
          break
        case 'resUpdateTypeBatch':
          this.alertObj.updateTypeBatch = false
          this.alertCanc('clearIds')
          break
        case 'resBatchSaveForm':
          this.alertObj.batchSaveForm = false
          this.alertCanc('clearIds')
          break
        case 'resRejectBatch':
          this.alertObj.rejectBatch = false
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
