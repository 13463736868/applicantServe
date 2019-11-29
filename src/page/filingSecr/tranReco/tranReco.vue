<template>
  <div class="tranRecoE">
    <div class="_center pr">
      <spin-comp :spinShow="spinShow"></spin-comp>
      <Row>
        <Col span="2">
          <label class="lh32 f16 fc6 fr mr15">搜索</label>
        </Col>
        <Col span="8">
          <Input v-model="search.text" icon="ios-search" class="_search hand" @on-click="resSearch" @keyup.enter.native="resSearch" placeholder="案号 / 案件编号 / 申请人 / 被申请人 / 代理人 / 年限 / 票据号码"></Input>
        </Col>
      </Row>
      <div class="_caseList clearfix">
        <Row>
          <Col span="24" class="pl20 pr20">
            <Table stripe border align="center" :loading="caseList.loading" :columns="caseList.header" :data="caseList.bodyList">
              <template slot-scope="{ row, index }" slot="action">
                <Button class="mr5" type="primary" size="small" @click="resAction('inquire', row)" :style="{display: resBtnDis('TRANRECOE_PROCESS')}">进度查询</Button>
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
    <res-inquire-alert v-if="alertObj.inquire" :resCaseId="alertObj.resCaseId" @alertConfirm="alertSave('inquire')" @alertCancel="alertCanc('inquire')"></res-inquire-alert>
  </div>
</template>

<script>
import axios from 'axios'
import {resBtn} from '@/components/common/mixin.js'
import { caseInfo } from '@/config/common.js'
import spinComp from '@/components/common/spin'
import resInquireAlert from '@/page/filingSecr/tranReco/children/resInquireAlert'

export default {
  name: 'tran_reco_e',
  mixins: [resBtn],
  components: { spinComp, resInquireAlert },
  data () {
    return {
      spinShow: false,
      search: {
        text: ''
      },
      caseList: {
        loading: false,
        header: [
          {
            title: '案号',
            key: 'caseCode',
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
              }, params.row.caseCode)
            }
          },
          {
            title: '案件编号',
            key: 'caseid',
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
            title: '代理人',
            key: 'proxyName',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '被申请人',
            key: 'respName',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '仲裁费(元)',
            key: 'cost',
            align: 'center'
          },
          {
            title: '票据号码',
            key: 'billNumber',
            align: 'center'
          },
          {
            title: '操作',
            key: 'id',
            align: 'center',
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
        inquire: false,
        resCaseId: null
      }
    }
  },
  created () {
    this.resCaseList()
  },
  methods: {
    resCaseList () {
      this.spinShow = true
      axios.post('/account/list', {
        pageIndex: (this.pageObj.pageNum - 1) * this.pageObj.pageSize,
        pageSize: this.pageObj.pageSize,
        keyword: this.search.text
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
        case 'inquire':
          this.alertObj.resCaseId = data.caseid
          this.alertObj.inquire = true
          break
      }
    },
    alertSave (type) {
      switch (type) {
        case 'inquire':
          this.alertObj.inquire = false
          this.alertObj.resCaseId = null
          this.resSearch()
          break
      }
    },
    alertCanc (type) {
      switch (type) {
        case 'inquire':
          this.alertObj.inquire = false
          this.alertObj.resCaseId = null
          break
      }
    },
    goCaseInfo (index) {
      let obj = {}
      obj.caseId = this.caseList.bodyList[index].caseid
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
