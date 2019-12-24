<template>
  <div class="paymentSlip">
    <div class="_center pr">
      <spin-comp :spinShow="spinShow"></spin-comp>
      <Row>
        <Col span="2">
          <label class="lh32 f16 fc6 fr mr15">搜索</label>
        </Col>
        <Col span="8">
          <Input v-model="search.text" icon="ios-search-strong" class="_search" @on-click="resSearch" @keyup.enter.native="resSearch" placeholder="缴费单号"></Input>
        </Col>
      </Row>
      <div class="_payList clearfix">
        <Row>
          <Col span="24" class="pl20 pr20">
            <Table stripe border align="center" :loading="payList.loading" :columns="payList.header" :data="payList.bodyList"></Table>
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
    <alert-btn-info :alertShow="alertShow.canc" @alertCancel="alertCanc('canc')" @alertConfirm="cancSave" alertTitle="提示">
      <p v-text="alertShow.cancText"></p>
    </alert-btn-info>
  </div>
</template>

<script>
import axios from 'axios'
import {resBtn, resPage} from '@/components/common/mixin.js'
import { mapActions } from 'vuex'
import spinComp from '@/components/common/spin'
import alertBtnInfo from '@/components/common/alertBtnInfo'

export default {
  name: 'paymentSlip',
  mixins: [resBtn, resPage],
  components: { spinComp, alertBtnInfo },
  data () {
    return {
      spinShow: true,
      search: {
        text: ''
      },
      payList: {
        loading: false,
        header: [
          {
            title: '缴费单号',
            key: 'paymentNumber',
            align: 'center',
            render: (h, params) => {
              return h('span', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                style: {
                  color: '#2d8cf0',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    this.goPaymentInfo(params.index)
                  }
                }
              }, params.row.paymentNumber)
            }
          },
          {
            title: '订单状态',
            key: 'statusName',
            align: 'center'
          },
          {
            title: '案件个数',
            key: 'caseNum',
            align: 'center'
          },
          {
            title: '提交时间',
            key: 'createTime',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '总支付金额(元)',
            key: 'costTotal',
            align: 'center',
            render: (h, params) => {
              return h('span', {
                props: {
                  type: 'text',
                  size: 'small'
                }
              }, params.row.costTotal + ' 元')
            }
          },
          {
            title: '操作',
            key: 'id',
            align: 'center',
            render: (h, params) => {
              if (params.row.status === 1) {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px',
                      display: this.resBtnDis('PAYMENTSLIP_VIEWPAYVOUCHERS')
                    },
                    on: {
                      click: () => {
                        this.seeFile(params.row.filepath)
                      }
                    }
                  }, '查看缴费凭证'),
                  h('Button', {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px',
                      display: this.resBtnDis('PAYMENTSLIP_PASS')
                    },
                    on: {
                      click: () => {
                        this.resCanc(params.index, 2)
                      }
                    }
                  }, '同意'),
                  h('Button', {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    style: {
                      display: this.resBtnDis('PAYMENTSLIP_NOPASS')
                    },
                    on: {
                      click: () => {
                        this.resCanc(params.index, 4)
                      }
                    }
                  }, '驳回')
                ])
              } else {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px',
                      display: this.resBtnDis('PAYMENTSLIP_VIEWPAYVOUCHERS')
                    },
                    on: {
                      click: () => {
                        this.seeFile(params.row.filepath)
                      }
                    }
                  }, '查看缴费凭证')
                ])
              }
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
        canc: false,
        id: null,
        cancType: null,
        cancText: ''
      }
    }
  },
  created () {
    this.resPayList()
  },
  methods: {
    ...mapActions([
      'setPaymentInfoId'
    ]),
    resPayList () {
      this.spinShow = true
      axios.post('/payMentRequest/findPayMent', {
        pageIndex: (this.pageObj.pageNum - 1) * this.pageObj.pageSize,
        pageSize: this.pageObj.pageSize,
        paymentNumber: this.search.text,
        commissionType: this.committeeStatus
      }).then(res => {
        let _data = res.data.data
        this.payList.bodyList = _data.dataList === null ? [] : _data.dataList
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
    goPaymentInfo (index) {
      this.setPaymentInfoId(JSON.stringify(this.payList.bodyList[index]))
      window.localStorage.setItem('paymentInfoId', JSON.stringify(this.payList.bodyList[index]))
      this.$router.push({
        path: '/paymentInfo'
      })
    },
    resSearch () {
      this.pageObj.pageNum = 1
      this.resPayList()
    },
    resChangeStatus () {
      this.pageObj.pageNum = 1
      this.resPayList()
    },
    reschangePage (page) {
      this.pageObj.pageNum = page
      this.resPayList()
    },
    seeFile (path) {
      window.open(path, '_blank')
    },
    resCanc (index, type) {
      this.alertShow.id = this.payList.bodyList[index].id
      this.alertShow.cancType = type
      if (type === 2) {
        this.alertShow.cancText = '确定要同意这个缴费批次吗？'
      } else if (type === 4) {
        this.alertShow.cancText = '确定要驳回这个缴费批次吗？'
      }
      this.alertShow.canc = true
    },
    cancSave () {
      this.alertShow.canc = false
      axios.post('/payMentRequest/updatePayMent', {
        id: this.alertShow.id,
        state: this.alertShow.cancType
      }).then(res => {
        this.resSearch()
        this.$Message.success({
          content: '操作成功',
          duration: 2
        })
      }).catch(e => {
        this.$Message.error({
          content: '错误信息:' + e + ' 稍后再试',
          duration: 5
        })
      })
    },
    alertCanc (type) {
      if (type === 'canc') {
        this.alertShow.id = null
        this.alertShow.canc = false
        this.alertShow.cancType = null
        this.alertShow.cancText = ''
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
  ._payList {
    margin-bottom: 20px;
  }
}
</style>
