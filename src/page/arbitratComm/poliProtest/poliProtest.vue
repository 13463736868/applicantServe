<template>
  <div class="poliProtest">
    <head-top :isRegister="true">
      <span class="f36 fcf">管辖权异议</span>
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
    <alert-btn-info :alertShow="alertShow.poli" @alertConfirm="poliSave" @alertCancel="alertCanc" alertTitle="操作">
      <p v-if="alertShow.state === 1">确定要通过吗？</p>
      <Input v-else-if="alertShow.state === 2" v-model="alertShow.poliReason" type="textarea" :autosize="{minRows: 3,maxRows: 10}" placeholder="请输入驳回原因..." />
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
  name: 'poli_protest',
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
            title: '审核状态',
            key: 'jrState',
            align: 'center',
            render: (h, params) => {
              return h('span', {
              }, params.row.jrState === 1 ? '通过' : (params.row.jrState === 2 ? '驳回' : (params.row.jrState === 3 ? '未审核' : '')))
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
        state: null,
        poli: false,
        poliReason: '',
        id: null
      }
    }
  },
  created () {
    this.resCaseList()
  },
  methods: {
    renderBtn (h, params) {
      let _obj = params.row
      if (_obj.state === null || _obj.state === 3) {
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
                this.resSavePoli(params.index)
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
                this.resCancPoli(params.index)
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
    resSavePoli (index) {
      this.alertShow.state = 1
      this.alertShow.id = this.caseList.bodyList[index].jurisdictionRequestById
      this.alertShow.poli = true
    },
    resCancPoli (index) {
      this.alertShow.state = 2
      this.alertShow.id = this.caseList.bodyList[index].jurisdictionRequestById
      this.alertShow.poli = true
    },
    poliSave () {
      if (this.alertShow.state === 1) {
        axios.post('/approve/updateJurisdictionRequestByid', {
          jurisdictionRequestById: this.alertShow.id,
          jurisdictionRequestApprove: this.alertShow.state
        }).then(res => {
          this.alertCanc()
          this.$Message.success({
            content: '操作成功',
            duration: 2
          })
          this.resCaseList()
        }).catch(e => {
          this.alertCanc()
          this.$Message.error({
            content: '错误信息:' + e + ' 稍后再试',
            duration: 5
          })
        })
      } else if (this.alertShow.state === 2) {
        if (this.alertShow.poliReason === '') {
          this.$Message.warning({
            content: '请填写驳回原因',
            duration: 5
          })
        } else {
          axios.post('/approve/updateJurisdictionRequestByid', {
            jurisdictionRequestById: this.alertShow.id,
            jurisdictionRequestApprove: this.alertShow.state,
            jurisdictionRequestReason: this.alertShow.poliReason
          }).then(res => {
            this.alertCanc()
            this.$Message.success({
              content: '操作成功',
              duration: 2
            })
            this.resCaseList()
          }).catch(e => {
            this.alertCanc()
            this.$Message.error({
              content: '错误信息:' + e + ' 稍后再试',
              duration: 5
            })
          })
        }
      }
    },
    alertCanc () {
      this.alertShow.poli = false
      this.alertShow.poliReason = ''
      this.alertShow.id = null
      this.alertShow.state = null
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
