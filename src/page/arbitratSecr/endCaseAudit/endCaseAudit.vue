<template>
  <div class="remuneAudit">
    <div class="_center pr">
      <spin-comp :spinShow="spinShow"></spin-comp>
      <Row>
        <Col span="2">
          <label class="lh32 f16 fc6 fr mr15">搜索</label>
        </Col>
        <Col span="8">
          <Input v-model="search.text" icon="ios-search" class="_search hand" @on-click="resSearch" @keyup.enter.native="resSearch" placeholder="案号 / 案件编号 / 申请人 / 被申请人 / 代理人 / 年限"></Input>
        </Col>
      </Row>
      <div class="_caseList clearfix">
        <Row>
          <Col span="24" class="pl20 pr20">
            <Table stripe border align="center" :loading="caseList.loading" :columns="caseList.header" :data="caseList.bodyList">
              <template slot-scope="{ row, index }" slot="action">
                <Button :style="{display: resBtnDis('ENDCASEAUDIT_AUDIT')}" class="mr5" type="primary" size="small" v-if="row.auditButtonFlag" @click="resAction('endForm', row)">审核</Button>
                <Button :style="{display: resBtnDis('ENDCASEAUDIT_STARTPROCESS')}" class="mr5" type="primary" size="small" v-if="row.startButtonFlag" @click="resAction('startEndForm', row)">发起审批</Button>
                <Button :style="{display: resBtnDis('ENDCASEAUDIT_FILEDETAIL')}" class="mr5" type="primary" size="small" @click="resAction('seeForm', row)">查看</Button>
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
    <end-case-form v-if="formObj.filing" :caseId="formObj.caseId" @alertConfirm="alertSave('endForm')" @alertCancel="alertCanc('endForm')"></end-case-form>
    <start-form v-if="formObj.start" :caseId="formObj.caseId" formType="closecase" @alertConfirm="alertSave('start')" @alertCancel="alertCanc('start')"></start-form>
  </div>
</template>

<script>
import axios from 'axios'
import {resBtn} from '@/components/common/mixin.js'
import spinComp from '@/components/common/spin'
import endCaseForm from '@/page/comm/apprForm/endCaseForm'
import startForm from '@/page/comm/apprForm/startForm'
import { caseInfo } from '@/config/common.js'

export default {
  name: 'endCase_audit',
  mixins: [resBtn],
  components: { spinComp, endCaseForm, startForm },
  data () {
    return {
      spinShow: true,
      search: {
        text: ''
      },
      caseList: {
        loading: false,
        header: [
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
          {
            title: '案件编号',
            key: 'id',
            align: 'center'
          },
          {
            title: '案由',
            key: 'caseReson',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '申请人',
            key: 'propName',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '被申请人',
            key: 'repoName',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '结案时间',
            key: 'closing_time',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '标的(元)',
            key: 'money',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '纠纷类型',
            key: 'disputeType',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '仲裁费(元)',
            key: 'cost',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '操作',
            key: 'id',
            align: 'center',
            minWidth: 120,
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
      formObj: {
        caseId: null,
        filing: false,
        start: false
      }
    }
  },
  created () {
    this.resCaseList()
  },
  methods: {
    resCaseList () {
      this.spinShow = true
      axios.post('/closeCaseForm/list', {
        pageIndex: (this.pageObj.pageNum - 1) * this.pageObj.pageSize,
        pageSize: this.pageObj.pageSize,
        keyword: this.search.text,
        formType: 'closecase'
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
      this.pageObj.pageNum = 1
      this.resCaseList()
    },
    reschangePage (page) {
      this.pageObj.pageNum = page
      this.resCaseList()
    },
    resAction (type, data) {
      switch (type) {
        case 'endForm':
          this.formObj.caseId = data.id
          this.formObj.filing = true
          break
        case 'startEndForm':
          this.formObj.caseId = data.id
          this.formObj.start = true
          break
        case 'seeForm':
          axios.post('/approvalForm/queryUrl', {
            caseId: data.id,
            type: '23'
          }).then(res => {
            window.open(res.data.data, '_blank')
          }).catch(e => {
            this.$Message.error({
              content: '错误信息:' + e + ' 稍后再试',
              duration: 5
            })
          })
          break
      }
    },
    alertSave (type) {
      switch (type) {
        case 'endForm':
          this.formObj.filing = false
          this.formObj.caseId = null
          this.resCaseList()
          break
        case 'start':
          this.formObj.start = false
          this.formObj.caseId = null
          this.resSearch()
          break
      }
    },
    alertCanc (type) {
      switch (type) {
        case 'endForm':
          this.formObj.filing = false
          this.formObj.caseId = null
          break
        case 'start':
          this.formObj.start = false
          this.formObj.caseId = null
          break
      }
    },
    goCaseInfo (index) {
      let obj = {}
      obj.caseId = this.caseList.bodyList[index].id
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
</style>
