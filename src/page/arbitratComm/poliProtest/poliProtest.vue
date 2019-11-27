<template>
  <div class="poliProtest">
    <div class="_center pr">
      <spin-comp :spinShow="spinShow"></spin-comp>
      <div class="_caseList clearfix">
        <Row>
          <Col span="24" class="pl20 pr20">
            <Table stripe border align="center" :loading="caseList.loading" :columns="caseList.header" :data="caseList.bodyList">
              <template slot-scope="{ row, index }" slot="action">
                <Button :style="{display: resBtnDis('POLIPROTEST_PASS')}" class="mr5" type="primary" size="small" v-if="row.jrCaseDocumentState === ''" @click="resAction('resSavePoli', row)">同意</Button>
                <Button :style="{display: resBtnDis('POLIPROTEST_NOPASS')}" class="mr5" type="primary" size="small" v-if="row.jrCaseDocumentState === ''" @click="resAction('resCancPoli', row)">退回</Button>
                <Button :style="{display: resBtnDis('POLIPROTEST_REGEN')}" class="mr5" type="primary" size="small" v-if="row.jrCaseDocumentState === '8'" @click="resAction('resSavePoli', row)">重新生成文书</Button>
                <Button :style="{display: resBtnDis('POLIPROTEST_REGEN')}" class="mr5" type="primary" size="small" v-if="row.jrCaseDocumentState === '9'" @click="resAction('resCancPoli', row)">重新生成文书</Button>
                <span style="color: #2d8cf0" type="text" size="small" v-if="row.jrCaseDocumentState === '6'">文书审核中</span>
                <span style="color: #2d8cf0" type="text" size="small" v-if="row.jrCaseDocumentState === '10'">文书审核通过</span>
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
    <res-poli-docu v-if="alertShow.diss" :resCaseId="alertShow.id" :resRequId="alertShow.byId" :resDocuType="alertShow.docuType" @alertConfirm="alertSave('diss')" @alertCancel="alertCanc('diss')"></res-poli-docu>
    <alert-btn-info :alertShow="alertShow.reas" :isSaveBtn="true" @alertCancel="alertCanc('reas')" alertTitle="仲裁协议异议原因">
      <p class="t2" v-text="alertShow.reasText"></p>
    </alert-btn-info>
  </div>
</template>

<script>
import axios from 'axios'
import {resBtn} from '@/components/common/mixin.js'
import spinComp from '@/components/common/spin'
import alertBtnInfo from '@/components/common/alertBtnInfo'
import resPoliDocu from '@/page/arbitratComm/poliProtest/children/resPoliDocu'
import { caseInfo } from '@/config/common.js'

export default {
  name: 'poli_protest',
  mixins: [resBtn],
  components: { spinComp, alertBtnInfo, resPoliDocu },
  data () {
    return {
      spinShow: false,
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
            key: 'applicantName',
            align: 'center'
          },
          {
            title: '审核状态',
            key: 'jrState',
            align: 'center',
            render: (h, params) => {
              return h('span', {
              }, params.row.jrState === 1 ? '通过' : (params.row.jrState === 2 ? '退回' : (params.row.jrState === 3 ? '未审核' : '')))
            }
          },
          {
            title: '异议原因',
            key: 'id',
            align: 'center',
            render: (h, params) => {
              return this.renderReasBtn(h, params)
            }
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
      alertShow: {
        byId: null,
        docuType: null,
        id: null,
        diss: false,
        reas: false,
        reasText: ''
      }
    }
  },
  created () {
    this.resCaseList()
  },
  methods: {
    renderReasBtn (h, params) {
      return h('div', [
        h('Button', {
          props: {
            type: 'primary',
            size: 'small'
          },
          style: {
            marginRight: '5px'
          },
          on: {
            click: () => {
              this.resPoliReas(params.index)
            }
          }
        }, '查看')
      ])
    },
    resCaseList () {
      this.spinShow = true
      axios.post('/approve/findJurisdictionRequestList', {
        pageIndex: (this.pageObj.pageNum - 1) * this.pageObj.pageSize,
        pageSize: this.pageObj.pageSize
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
    resPoliReas (index) {
      this.alertShow.reasText = this.caseList.bodyList[index].jurisdictionRequestReason
      this.alertShow.reas = true
    },
    resAction (type, data) {
      switch (type) {
        case 'resSavePoli':
        case 'resCancPoli':
          this.alertShow.id = data.id
          this.alertShow.byId = data.jurisdictionRequestById
          this.alertShow.docuType = type === 'resSavePoli' ? 8 : 9
          this.alertShow.diss = true
          break
      }
    },
    alertSave (type, data) {
      switch (type) {
        case 'diss':
          this.alertShow.byId = null
          this.alertShow.docuType = null
          this.alertShow.id = null
          this.alertShow.diss = false
          break
      }
    },
    alertCanc (type) {
      if (type === 'diss') {
        this.alertShow.byId = null
        this.alertShow.docuType = null
        this.alertShow.id = null
        this.alertShow.diss = false
      } else if (type === 'reas') {
        this.alertShow.reas = false
        this.alertShow.reasText = ''
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
  }
}
</style>
