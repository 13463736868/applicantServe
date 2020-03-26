<template>
  <div class="caseB">
    <div class="_center pr">
      <spin-comp :spinShow="spinShow"></spin-comp>
      <Row class="pb20">
        <Col span="2">
          <label class="lh32 f16 fc6 fr mr15">搜索</label>
        </Col>
        <Col span="5">
          <Input v-model="search.text" icon="ios-search" class="_search hand" @on-click="resSearch" @keyup.enter.native="resSearch" placeholder="案号 / 申请人 / 被申请人"></Input>
        </Col>
      </Row>
      <div class="_caseList clearfix">
        <Row>
          <Col span="24" class="pl20 pr20">
            <Table stripe border align="center" :loading="caseList.loading" :columns="caseList.header" :data="caseList.bodyList">
              <template slot-scope="{ row, index }" slot="action">
                <Button v-if="[3, 6].indexOf(row.state) !== -1" class="mr5" type="primary" size="small" @click="resAction('resEndCase', row)">结案</Button>
                <Button v-if="row.state === 6" class="mr5" type="primary" size="small" @click="resAction('resReason', row)">查看驳回原因</Button>
                <span style="color: #2d8cf0" class="mr5" type="text" size="small" v-if="row.state === 5">结案审核中</span>
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
    <res-end-case v-if="alertObj.resEndCase" :resPropsData="alertObj.resEndCaseData" @alertConfirm="alertSave('resEndCase')" @alertCancel="alertCanc('resEndCase')"></res-end-case>
  </div>
</template>

<script>
import {resBtn, resPage, resComm} from '@/components/common/mixin.js'
import spinComp from '@/components/common/spin'
import resReason from '@/page/filingSecr/archiveCase/children/children/resReason'
import resEndCase from '@/page/filingSecr/archiveCase/children/children/resEndCase'

export default {
  name: 'caseB',
  mixins: [resBtn, resPage, resComm],
  components: { spinComp, resReason, resEndCase },
  data () {
    return {
      spinShow: false,
      search: {
        text: '',
        pageType: 2,
        caseListUrl: '/casesUnderLine/findCasesUnderLineList',
        state: null
      },
      caseList: {
        loading: false,
        header: [
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
            title: '立案时间',
            key: 'upTime',
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
        bodyList: []
      },
      pageObj: {
        total: 0,
        pageNum: 1,
        pageSize: 10
      },
      alertObj: {
        resReason: false,
        resReasonData: null,
        resEndCase: false,
        resEndCaseData: null
      }
    }
  },
  created () {
    this.resCaseList(this.search.caseListUrl)
  },
  methods: {
    resAction (type, data) {
      switch (type) {
        case 'resEndCase':
          this.alertObj.resEndCaseData = {
            id: data.id
          }
          this.alertObj.resEndCase = true
          break
        case 'resReason':
          this.alertObj.resReasonData = {
            reason: data.correctionsReason
          }
          this.alertObj.resReason = true
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
