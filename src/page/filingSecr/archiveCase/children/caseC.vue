<template>
  <div class="caseC">
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
            <Option :value="5" :key="5">结案审核中</Option>
            <Option :value="7" :key="7">结案通过</Option>
            <Option :value="6" :key="6">结案驳回</Option>
          </Select>
        </Col>
        <Col span="12">
          <div class="tr pr20">
            <Button class="ml10" type="primary" @click="resAction('resPassBatch', null)">批量通过</Button>
            <Button class="ml10" type="primary" @click="resAction('resRejeBatch', null)">批量驳回</Button>
          </div>
        </Col>
      </Row>
      <div class="_caseList clearfix">
        <Row>
          <Col span="24" class="pl20 pr20">
            <Table stripe border align="center" :loading="caseList.loading" :columns="caseList.header" :data="caseList.bodyList">
              <template slot-scope="{ row, index }" slot="action">
                <Button v-if="row.state === 5" class="mr5" type="primary" size="small" @click="resAction('resPass', row)">通过</Button>
                <Button v-if="row.state === 5" class="mr5" type="primary" size="small" @click="resAction('resReje', row)">驳回</Button>
                <Button v-if="row.state === 6" class="mr5" type="primary" size="small" @click="resAction('resReason', row)">查看驳回原因</Button>
                <Button v-if="row.state === 7 && row.filePath !== null" class="mr5" type="primary" size="small" @click="resAction('resSeeDoc', row)">查看裁决书</Button>
                <span v-if="row.state === 7 && row.filePath === null" style="color: #2d8cf0" class="mr5" type="text" size="small">无裁决书</span>
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
    <res-pass v-if="alertObj.resPass" :resPropsData="alertObj.resPassData" @alertConfirm="alertSave('resPass')" @alertCancel="alertCanc('resPass')"></res-pass>
  </div>
</template>

<script>
import {resBtn, resPage, resComm, resCommSeleAll} from '@/components/common/mixin.js'
import spinComp from '@/components/common/spin'
import resReason from '@/page/filingSecr/archiveCase/children/children/resReason'
import resPass from '@/page/filingSecr/archiveCase/children/children/resPass'

export default {
  name: 'caseC',
  mixins: [resBtn, resPage, resComm, resCommSeleAll],
  components: { spinComp, resReason, resPass },
  data () {
    return {
      spinShow: false,
      search: {
        text: '',
        pageType: 5,
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
            key: 'closingTime',
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
      if (this.search.state !== 0 && item.state === 5) {
        this.seleArrChange(item, this.caseList.seleMap[this.pageObj.pageNum])
      }
    },
    resFactorB (h, params) {
      let _obj = params.row
      if (this.search.state !== 0 && _obj.state === 5) {
        return this.renderCheck(h, params)
      } else {
        return h('div', [
        ])
      }
    },
    resAction (type, data) {
      let _urlA = '/casesUnderLine/checkCloseUnderLine'
      switch (type) {
        case 'resSeeDoc':
          window.open(data.filePath, '_blank')
          break
        case 'resReason':
          this.alertObj.resReasonData = {
            reason: data.correctionsReason
          }
          this.alertObj.resReason = true
          break
        case 'resPass':
          this.alertObj.resPassData = {
            ids: [data.id],
            state: 1,
            url: _urlA
          }
          this.alertObj.resPass = true
          break
        case 'resReje':
          this.alertObj.resPassData = {
            ids: [data.id],
            state: 2,
            url: _urlA
          }
          this.alertObj.resPass = true
          break
        case 'resPassBatch':
          if (this.search.state !== 5) {
            this.resMessage('error', '请先条件选择 \'结案审核中\'')
          } else if (this.alertObj.ids.length === 0) {
            this.resMessage('error', '请先选择一个案件')
          } else {
            this.alertObj.resPassData = {
              ids: this.alertObj.ids,
              state: 1,
              url: _urlA
            }
            this.alertObj.resPass = true
          }
          break
        case 'resRejeBatch':
          if (this.search.state !== 5) {
            this.resMessage('error', '请先条件选择 \'结案审核中\'')
          } else if (this.alertObj.ids.length === 0) {
            this.resMessage('error', '请先选择一个案件')
          } else {
            this.alertObj.resPassData = {
              ids: this.alertObj.ids,
              state: 2,
              url: _urlA
            }
            this.alertObj.resPass = true
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
