<template>
  <div class="applReissue">
    <head-top :isRegister="true">
      <span class="f36 fcf">申请补正</span>
    </head-top>
    <div class="_center pr">
      <spin-comp :spinShow="spinShow"></spin-comp>
      <div class="_caseList clearfix">
        <Row>
          <Col span="24" class="pl20 pr20">
            <Table stripe border align="center" :loading="caseList.loading" :columns="caseList.header" :data="caseList.bodyList"></Table>
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
    <alert-btn-info :alertShow="alertShow.appl" @alertConfirm="applSave" @alertCancel="alertCanc('appl')" alertTitle="操作">
      <p v-if="alertShow.state === 1">确认要通过吗？</p>
      <p v-else-if="alertShow.state === 2">确认要驳回吗？</p>
    </alert-btn-info>
    <alert-btn-info :alertShow="alertShow.reas" :isSaveBtn="true" @alertCancel="alertCanc('reas')" alertTitle="补正原因">
      <p class="t2" v-text="alertShow.reasText"></p>
    </alert-btn-info>
  </div>
</template>

<script>
import axios from 'axios'
import headTop from '@/components/header/head'
import spinComp from '@/components/common/spin'
import alertBtnInfo from '@/components/common/alertBtnInfo'
import { caseInfo } from '@/config/common.js'

export default {
  name: 'appl_reissue',
  components: { headTop, spinComp, alertBtnInfo },
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
            title: '申请人',
            key: 'applicantName',
            align: 'center'
          },
          {
            title: '申请时间',
            key: 'correctionsTime',
            align: 'center'
          },
          {
            title: '仲裁员',
            key: 'arbitratorName',
            align: 'center'
          },
          {
            title: '状态',
            key: 'correctionsOperationStatusName',
            align: 'center'
          },
          {
            title: '补正原因',
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
            render: (h, params) => {
              return this.renderBtn(h, params)
            }
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
        appl: false,
        state: null,
        id: null,
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
    renderBtn (h, params) {
      let _obj = params.row
      if (_obj.correctionsOperationStatus === null || _obj.correctionsOperationStatus === 3) {
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
                this.resSaveReis(params.index)
              }
            }
          }, '通过'),
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
                this.resCancReis(params.index)
              }
            }
          }, '驳回')
        ])
      } else {
        return h('div', [
        ])
      }
    },
    resCaseList () {
      this.spinShow = true
      axios.post('/clientRequest/findCaseRevisionList', {
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
    resSaveReis (index) {
      this.alertShow.state = 1
      this.alertShow.id = this.caseList.bodyList[index].id
      this.alertShow.appl = true
    },
    resCancReis (index) {
      this.alertShow.state = 2
      this.alertShow.id = this.caseList.bodyList[index].id
      this.alertShow.appl = true
    },
    resPoliReas (index) {
      this.alertShow.reasText = this.caseList.bodyList[index].correctionsReason
      this.alertShow.reas = true
    },
    applSave () {
      axios.post('/clientRequest/updateCaseRevision', {
        caseId: this.alertShow.id,
        approveState: this.alertShow.state
      }).then(res => {
        this.alertCanc('appl')
        this.$Message.success({
          content: '操作成功',
          duration: 2
        })
        this.resCaseList()
      }).catch(e => {
        this.alertCanc('appl')
        this.$Message.error({
          content: '错误信息:' + e + ' 稍后再试',
          duration: 5
        })
      })
    },
    alertCanc (type) {
      if (type === 'appl') {
        this.alertShow.appl = false
        this.alertShow.state = null
        this.alertShow.id = null
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
</style>
