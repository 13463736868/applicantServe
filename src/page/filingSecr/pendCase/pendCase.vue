<template>
  <div class="pendCase">
    <div class="_center pr">
      <spin-comp :spinShow="spinShow"></spin-comp>
      <Row>
        <Col span="2">
          <label class="lh32 f16 fc6 fr mr15">搜索</label>
        </Col>
        <Col span="8">
          <Input v-model="search.text" icon="ios-search" class="_search hand" @on-click="resSearch" @keyup.enter.native="resSearch" placeholder="案号 / 案件编号 / 申请人 / 被申请人 / 代理人 / 年限"></Input>
        </Col>
        <Col span="10">
          &nbsp;
        </Col>
        <Col span="2">
          <Button type="primary" @click="resActionFind('resFind', null)" :style="{display: resBtnDis('PENDCASE_QUERY')}">条件搜索</Button>
        </Col>
        <Col span="2">
          <Button type="primary" @click="resBatch" :style="{display: resBtnDis('PENDCASE_BATCHFILING')}">批量立案</Button>
        </Col>
      </Row>
      <div class="_caseList clearfix">
        <Row>
          <Col span="24" class="pl20 pr20">
            <Table stripe border align="center" :loading="caseList.loading" :columns="caseList.header" :data="caseList.bodyList">
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
    <alert-btn-info :alertShow="alertShow.batch" @alertConfirm="batchSave" @alertCancel="alertCanc('batch')" alertTitle="确认立案">
      <Row class="_labelFor">
        <Col span="4" offset="2">
          <div class="_label">纠纷类型：</div>
        </Col>
        <Col span="16">
          <Select v-model="dataObj.confType">
            <Option v-for="item in caseTypeList" :value="item.value" :key="item.value">{{item.label}}</Option>
          </Select>
        </Col>
      </Row>
    </alert-btn-info>
    <res-find v-if="alertShow.find" @alertConfirm="alertSaveFind('find', ...arguments)" @alertCancel="alertCancFind('find')"></res-find>
    <filing-case-form v-if="formObj.filing" :caseId="formObj.caseId" @alertConfirm="alertSave('pendForm')" @alertCancel="alertCanc('pendForm')"></filing-case-form>
    <res-see-file v-if="alertObj.seeFile" :resCaseId="alertObj.caseId" @alertConfirm="alertSave('seeFile')" @alertCancel="alertCanc('seeFile')"></res-see-file>
    <res-update-pendcase v-if="alertShow.caseCause" :caseId="alertShow.caseId" :resCaseType="alertShow.resCaseType" @alertConfirm="alertSave('caseCause')" @alertCancel="alertCanc('caseCause')"></res-update-pendcase>
    <res-back-case  v-if="alertShow.backCase" :caseId="alertShow.caseId" @alertConfirm="alertSave('backCase')" @alertCancel="alertCanc('backCase')"></res-back-case>
  </div>
</template>

<script>
import axios from 'axios'
import {resBtn, resSearFind} from '@/components/common/mixin.js'
import spinComp from '@/components/common/spin'
import alertBtnInfo from '@/components/common/alertBtnInfo'
import resFind from '@/page/comm/resFind/resFind'
import filingCaseForm from '@/page/comm/apprForm/filingCaseForm'
import resSeeFile from '@/page/filingSecr/pendCase/children/resSeeFile'
import resUpdatePendcase from '@/page/filingSecr/pendCase/children/resUpdatePendcase'
import resBackCase from '@/page/filingSecr/pendCase/children/resBackCase'
import { caseInfo } from '@/config/common.js'

export default {
  name: 'pend_case',
  mixins: [resBtn, resSearFind],
  components: { spinComp, alertBtnInfo, resFind, filingCaseForm, resSeeFile, resUpdatePendcase, resBackCase },
  data () {
    return {
      spinShow: false,
      search: {
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
            render: (h, params) => {
              return this.renderCheck(h, params)
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
      caseTypeList: [],
      formObj: {
        caseId: null,
        filing: false
      },
      alertObj: {
        seeFile: false,
        caseId: null
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
        state: 12,
        caseListType: 2
      }).then(res => {
        let _data = res.data.data
        this.caseList.bodyList = _data.dataList === null ? [] : _data.dataList
        this.pageObj.total = _data.totalCount
        this.spinShow = false
      }).catch(e => {
        this.spinShow = false
        this.$Message.error({
          content: '错误信息:' + e + ' 稍后再试',
          duration: 5
        })
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
    renderCheck (h, params) {
      let _obj = params.row
      if (_obj.pendBtnStatus === '1') {
        if (this.alertShow.ids.indexOf(_obj.caseId) === -1) {
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
                  this.seleArrChange(params.index, true)
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
                  this.seleArrChange(params.index, false)
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
    seleArrChange (index, bool) {
      let info = this.caseList.bodyList[index]
      if (bool) {
        if (this.alertShow.ids.indexOf(info.caseId) === -1) {
          if (this.alertShow.ids.length >= 10) {
            this.$Message.error({
              content: '最多只能选择十个案件',
              duration: 5
            })
            return false
          } else {
            let _o = {}
            _o.caseId = info.caseId
            _o.costs = info.cost
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
        this.$Message.error({
          content: '请先选择一个案件',
          duration: 5
        })
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
          this.$Message.error({
            content: '错误信息:' + e + ' 稍后再试',
            duration: 5
          })
        })
      }
    },
    batchSave () {
      if (this.dataObj.confType === null) {
        this.$Message.warning({
          content: '请先选择案件类型',
          duration: 5
        })
      } else {
        this.alertShow.batch = false
        axios.put('/caseBatch/updateCaseStateAndType_batch', {
          caseType: this.dataObj.confType,
          items: JSON.stringify(this.alertShow.idsList)
        }, {
          headers: {
            'content-Type': 'application/json;charset=UTF-8'
          }
        }).then(res => {
          this.alertCanc('batch')
          this.$Message.success({
            content: res.data.data,
            duration: 2
          })
          this.resSearch()
        }).catch(e => {
          this.alertCanc('batch')
          this.$Message.error({
            content: '错误信息:' + e + ' 稍后再试',
            duration: 5
          })
        })
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
            this.$Message.success({
              content: '操作成功',
              duration: 2
            })
            this.resSearch()
          }).catch(e => {
            this.$Message.error({
              content: '错误信息:' + e + ' 稍后再试',
              duration: 5
            })
          })
          break
        case 'pendForm':
          this.formObj.filing = false
          this.formObj.caseId = null
          this.pageObj.pageNum = 1
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
        case 'batch':
          this.alertShow.batch = false
          this.dataObj.confType = null
          break
        case 'clearIds':
          this.alertShow.idsList = []
          this.alertShow.ids = []
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
          this.alertShow.resCaseType = null
          this.alertShow.caseId = null
          this.alertShow.caseCause = false
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
