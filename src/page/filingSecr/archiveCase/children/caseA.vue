<template>
  <div class="caseA">
    <div class="_center pr">
      <spin-comp :spinShow="spinShow"></spin-comp>
      <Row class="pb20">
        <Col span="2">
          <label class="lh32 f16 fc6 fr mr15">搜索</label>
        </Col>
        <Col span="5">
          <Input v-model="search.text" icon="ios-search" class="_search hand" @on-click="resSearch" @keyup.enter.native="resSearch" placeholder="案号 / 申请人 / 被申请人"></Input>
        </Col>
        <Col span="2">
          <label class="lh32 f16 fc6 fr mr15">案件状态</label>
        </Col>
        <Col span="3">
          <Select v-model="search.state" @on-change="resSearch">
            <Option :value="0" :key="0">全部</Option>
            <template v-if="roleCode === 'ROLE_ZCMS'">
              <Option :value="1" :key="1">立案待受理</Option>
              <Option :value="2" :key="2">立案审核中</Option>
              <Option :value="10" :key="10">立案审核驳回</Option>
              <Option :value="9" :key="9">撤案中</Option>
            </template>
            <template v-if="roleCode === 'ROLE_YWZR'">
              <Option :value="2" :key="2">立案审核中</Option>
              <Option :value="3" :key="3">立案已受理</Option>
              <Option :value="10" :key="10">立案审核驳回</Option>
            </template>
          </Select>
        </Col>
        <Col span="12">
          <div class="tr pr20">
            <template v-if="roleCode === 'ROLE_ZCMS'">
              <Button class="ml10" type="primary" @click="resAction('resFilingBatch', null)">批量立案</Button>
              <Button class="ml10" type="primary" @click="resAction('resRefuBatch', null)">批量驳回</Button>
            </template>
            <template v-if="roleCode === 'ROLE_YWZR'">
              <Button class="ml10" type="primary" @click="resAction('resPassBatch', null)">批量通过</Button>
              <Button class="ml10" type="primary" @click="resAction('resRejeBatch', null)">批量驳回</Button>
            </template>
          </div>
        </Col>
      </Row>
      <div class="_caseList clearfix">
        <Row>
          <Col span="24" class="pl20 pr20">
            <Table stripe border align="center" :loading="caseList.loading" :columns="caseList.header" :data="caseList.bodyList">
              <template slot-scope="{ row, index }" slot="action">
                <div v-if="roleCode === 'ROLE_ZCMS'">
                  <Button v-if="[1, 10].indexOf(row.state) !== -1" class="mr5" type="primary" size="small" @click="resAction('resArbi', row)">修改仲裁费</Button>
                  <Button v-if="[1, 10].indexOf(row.state) !== -1" class="mr5" type="primary" size="small" @click="resAction('resFiling', row)">确认立案</Button>
                  <Button v-if="[1, 10].indexOf(row.state) !== -1" class="mr5" type="primary" size="small" @click="resAction('resRefu', row)">驳回</Button>
                  <Button v-if="row.state === 9" class="mr5" type="primary" size="small" @click="resAction('resAgree', row)">同意</Button>
                  <Button v-if="row.state === 10" class="mr5" type="primary" size="small" @click="resAction('resReason', row)">查看驳回原因</Button>
                  <span style="color: #2d8cf0" class="mr5" type="text" size="small" v-if="row.state === 2">立案审核中</span>
                </div>
                <div v-if="roleCode === 'ROLE_YWZR'">
                  <Button v-if="row.state === 2" class="mr5" type="primary" size="small" @click="resAction('resPass', row)">通过</Button>
                  <Button v-if="row.state === 2" class="mr5" type="primary" size="small" @click="resAction('resReje', row)">驳回</Button>
                  <Button v-if="row.state === 10" class="mr5" type="primary" size="small" @click="resAction('resReason', row)">查看驳回原因</Button>
                </div>
              </template>
            </Table>
          </Col>
        </Row>
      </div>
      <div class="_page clearfix">
        <Row>
          <Col span="12" offset="6" class="tc">
            <Page :total="pageObj.total" :current="pageObj.pageNum" :page-size="pageObj.pageSize" show-elevator show-total @on-change="reschangePage" @on-page-size-change="reschangePageSize" show-sizer :page-size-opts="[10, 20, 30, 40, 80, 100, 200]"></Page>
          </Col>
        </Row>
      </div>
    </div>
    <res-reason v-if="alertObj.resReason" :resPropsData="alertObj.resReasonData" @alertConfirm="alertCanc('resReason')" @alertCancel="alertCanc('resReason')"></res-reason>
    <res-filing v-if="alertObj.resFiling" :resPropsData="alertObj.resFilingData" @alertConfirm="alertSave('resFiling')" @alertCancel="alertCanc('resFiling')"></res-filing>
    <res-arbi v-if="alertObj.resArbi" :resPropsData="alertObj.resArbiData" @alertConfirm="alertSave('resArbi')" @alertCancel="alertCanc('resArbi')"></res-arbi>
    <res-agree v-if="alertObj.resAgree" :resPropsData="alertObj.resAgreeData" @alertConfirm="alertSave('resAgree')" @alertCancel="alertCanc('resAgree')"></res-agree>
    <res-pass v-if="alertObj.resPass" :resPropsData="alertObj.resPassData" @alertConfirm="alertSave('resPass')" @alertCancel="alertCanc('resPass')"></res-pass>
  </div>
</template>

<script>
import {resMess, resBtn, resPage, resComm, resCommSeleAll} from '@/components/common/mixin.js'
import spinComp from '@/components/common/spin'
import resReason from '@/page/filingSecr/archiveCase/children/children/resReason'
import resFiling from '@/page/filingSecr/archiveCase/children/children/resFiling'
import resArbi from '@/page/filingSecr/archiveCase/children/children/resArbi'
import resAgree from '@/page/filingSecr/archiveCase/children/children/resAgree'
import resPass from '@/page/filingSecr/archiveCase/children/children/resPass'

export default {
  name: 'caseA',
  mixins: [resMess, resBtn, resPage, resComm, resCommSeleAll],
  props: ['roleCode'],
  components: { spinComp, resReason, resFiling, resArbi, resAgree, resPass },
  data () {
    return {
      spinShow: false,
      search: {
        text: '',
        pageType: 1,
        caseListUrl: '/casesUnderLine/findCasesUnderLineList',
        state: 0
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
              return this.resFactorB(h, params)
            }
          },
          {
            title: '案件编号',
            key: 'id',
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
                    this.goArchiveCaseInfo(params.row)
                  }
                }
              }, params.row.id)
            }
          },
          {
            title: '案号',
            key: 'code',
            align: 'center'
          },
          {
            title: '案件类型',
            key: 'caseType',
            align: 'center'
          },
          {
            title: '申请人',
            key: 'applicantName',
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
            key: 'respondentName',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '争议金额(元)',
            key: 'money',
            align: 'center'
          },
          {
            title: '仲裁费(元)',
            key: 'cost',
            align: 'center'
          },
          {
            title: '案件状态',
            key: 'stateName',
            align: 'center'
          },
          {
            title: '提交时间',
            key: 'createtime',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '操作',
            key: 'id',
            align: 'center',
            minWidth: 80,
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
      alertObj: {
        ids: [],
        resReason: false,
        resReasonData: null,
        resFiling: false,
        resFilingData: null,
        resArbi: false,
        resArbiData: null,
        resAgree: false,
        resAgreeData: null,
        resPass: false,
        resPassData: null
      }
    }
  },
  created () {
    this.resCaseList(this.search.caseListUrl)
  },
  methods: {
    resFactorA (item) {
      if (this.search.state !== 0 && ((this.roleCode === 'ROLE_ZCMS' && item.cost !== 0 && (item.state === 1 || item.state === 10)) || (this.roleCode === 'ROLE_YWZR' && item.state === 2))) {
        this.seleArrChange(item, this.caseList.seleMap[this.pageObj.pageNum])
      }
    },
    resFactorB (h, params) {
      let _obj = params.row
      if (this.search.state !== 0 && ((this.roleCode === 'ROLE_ZCMS' && _obj.cost !== 0 && (_obj.state === 1 || _obj.state === 10)) || (this.roleCode === 'ROLE_YWZR' && _obj.state === 2))) {
        return this.renderCheck(h, params)
      } else {
        return h('div', [
        ])
      }
    },
    resAction (type, data) {
      let _urlA = '/casesUnderLine/checkWithdrawCaseUnderLine'
      let _urlB = '/casesUnderLine/updateCostByCaseId'
      let _urlC = '/casesUnderLine/confirmCase'
      switch (type) {
        case 'resAgree':
          this.alertObj.resAgreeData = {
            id: data.id,
            url: _urlA
          }
          this.alertObj.resAgree = true
          break
        case 'resArbi':
          this.alertObj.resArbiData = {
            id: data.id,
            url: _urlB
          }
          this.alertObj.resArbi = true
          break
        case 'resFiling':
          if (data.cost === 0) {
            this.resMessage('warning', '请先输入仲裁费')
            this.resAction('resArbi', data)
            return false
          } else {
            this.alertObj.resFilingData = {
              ids: [data.id],
              state: 1,
              url: _urlC
            }
            this.alertObj.resFiling = true
          }
          break
        case 'resRefu':
          this.alertObj.resFilingData = {
            ids: [data.id],
            state: 2,
            url: _urlC
          }
          this.alertObj.resFiling = true
          break
        case 'resReason':
          this.alertObj.resReasonData = {
            reason: data.decisionReason
          }
          this.alertObj.resReason = true
          break
        case 'resPass':
          this.alertObj.resPassData = {
            ids: [data.id],
            state: 1,
            url: _urlC
          }
          this.alertObj.resPass = true
          break
        case 'resReje':
          this.alertObj.resPassData = {
            ids: [data.id],
            state: 2,
            url: _urlC
          }
          this.alertObj.resPass = true
          break
        case 'resPassBatch':
          if (this.search.state !== 2) {
            this.resMessage('error', '请先条件选择 \'立案审核中\'')
          } else if (this.alertObj.ids.length === 0) {
            this.resMessage('error', '请先选择一个案件')
          } else {
            this.alertObj.resPassData = {
              ids: this.alertObj.ids,
              state: 1,
              url: _urlC
            }
            this.alertObj.resPass = true
          }
          break
        case 'resRejeBatch':
          if (this.search.state !== 2) {
            this.resMessage('error', '请先条件选择 \'立案审核中\'')
          } else if (this.alertObj.ids.length === 0) {
            this.resMessage('error', '请先选择一个案件')
          } else {
            this.alertObj.resPassData = {
              ids: this.alertObj.ids,
              state: 2,
              url: _urlC
            }
            this.alertObj.resPass = true
          }
          break
        case 'resFilingBatch':
          if (this.search.state !== 1 && this.search.state !== 10) {
            this.resMessage('error', '请先条件选择 \'立案待受理 或 立案审核驳回\'')
          } else if (this.alertObj.ids.length === 0) {
            this.resMessage('error', '请先选择一个案件')
          } else {
            this.alertObj.resFilingData = {
              ids: this.alertObj.ids,
              state: 1,
              url: _urlC
            }
            this.alertObj.resFiling = true
          }
          break
        case 'resRefuBatch':
          if (this.search.state !== 1 && this.search.state !== 10) {
            this.resMessage('error', '请先条件选择 \'立案待受理 或 立案审核驳回\'')
          } else if (this.alertObj.ids.length === 0) {
            this.resMessage('error', '请先选择一个案件')
          } else {
            this.alertObj.resFilingData = {
              ids: this.alertObj.ids,
              state: 2,
              url: _urlC
            }
            this.alertObj.resFiling = true
          }
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
  width: 100%;
  @include mw(1180px);
  @include bc;
  ._caseList {
    margin-bottom: 20px;
  }
}
</style>
