<template>
  <div class="acceCase">
    <head-top :isRegister="true">
      <span class="f36 fcf">待受理案件</span>
    </head-top>
    <div class="_center pr">
      <spin-comp :spinShow="spinShow"></spin-comp>
      <Row>
        <Col span="2">
          <label class="lh32 f16 fc6 fr mr15">搜索</label>
        </Col>
        <Col span="8">
          <Input v-model="search.text" icon="ios-search" placeholder="" class="_search hand" @on-click="resSearch" @keyup.enter.native="resSearch"></Input>
        </Col>
      </Row>
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
    <alert-btn-info :alertShow="alertShow.acceA" @alertConfirm="acceSave('acceA')" @alertCancel="alertCanc('acceA')" alertTitle="受理案件">
      <Row class="_labelFor mb10">
        <Col span="6">
          <div class="_label">请输入纠纷金额 (元)：</div>
        </Col>
        <Col span="16" offset="1">
          <Input v-model="dataObj.acceAA" @on-change="applMoney"/>
        </Col>
        <Col span="16" offset="7">
          <div class="_em" v-if="emObj.status === 1"><span v-text="emObj.text"></span></div>
        </Col>
      </Row>
      <Row class="_labelFor">
        <Col span="6">
          <div class="_label">仲裁金额：</div>
        </Col>
        <Col span="16" offset="1">
          <Input readonly v-model="dataObj.acceAB"/>
        </Col>
      </Row>
    </alert-btn-info>
    <alert-btn-info :alertShow="alertShow.acceB" @alertConfirm="acceSave('acceB')" @alertCancel="alertCanc('acceB')" alertTitle="驳回案件">
      <Input v-model="dataObj.acceB" type="textarea" :autosize="{minRows: 3,maxRows: 10}" placeholder="请输入驳回原因..." />
    </alert-btn-info>
    <alert-btn-info :alertShow="alertShow.retr" @alertConfirm="retrSave" @alertCancel="alertCanc('retr')" alertTitle="操作">
      <p>确定同意撤回案件？</p>
    </alert-btn-info>
  </div>
</template>

<script>
import axios from 'axios'
import headTop from '@/components/header/head'
import spinComp from '@/components/common/spin'
import alertBtnInfo from '@/components/common/alertBtnInfo'
import setRegExp from '@/config/regExp.js'
import { caseInfo } from '@/config/common.js'

export default {
  name: 'acce_case',
  components: { headTop, spinComp, alertBtnInfo },
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
            title: '申请人',
            key: 'partyName',
            align: 'center'
          },
          {
            title: '代理人',
            key: 'proxyName',
            align: 'center'
          },
          {
            title: '被申请人',
            key: 'defendantName',
            align: 'center'
          },
          {
            title: '提交时间',
            key: 'createTime',
            align: 'center'
          },
          {
            title: '案件状态',
            key: 'caseState',
            align: 'center'
          },
          {
            title: '操作',
            key: 'caseId',
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
      emObj: {
        status: 0,
        text: ''
      },
      alertShow: {
        acceA: false,
        acceB: false,
        retr: false
      },
      dataObj: {
        acceAA: null,
        acceAB: null,
        acceB: null,
        acceCaseId: null,
        retrCaseId: null
      }
    }
  },
  created () {
    this.resCaseList()
  },
  methods: {
    renderBtn (h, params) {
      if (params.row.cancelFlage === '1') {
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
                this.resRecallCase(params.index)
              }
            }
          }, '同意撤回')
        ])
      } else {
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
                this.resAcceptCase(1, params.index)
              }
            }
          }, '受理'),
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
                this.resAcceptCase(0, params.index)
              }
            }
          }, '驳回')
        ])
      }
    },
    resCaseList () {
      this.spinShow = true
      axios.post('/case/findRegisterCaseList', {
        startIndex: (this.pageObj.pageNum - 1) * this.pageObj.pageSize,
        pageSize: this.pageObj.pageSize,
        keyword: this.search.text,
        state: 1,
        caseListType: 1
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
    resRecallCase (index) {
      this.dataObj.retrCaseId = this.caseList.bodyList[index].caseId
      this.alertShow.retr = true
    },
    resAcceptCase (status, index) {
      this.dataObj.acceCaseId = this.caseList.bodyList[index].caseId
      if (status) {
        this.alertShow.acceA = true
      } else {
        this.alertShow.acceB = true
      }
    },
    applMoney () {
      if (this.dataObj.acceAA === null || this.dataObj.acceAA === '') {
        this.emObj.status = 1
        this.emObj.text = '请填写纠纷金额！'
        this.dataObj.acceAB = null
      } else if (!setRegExp(this.dataObj.acceAA, 'money')) {
        this.emObj.status = 1
        this.emObj.text = '请输入正确金额格式 例: 10.00 或 10;范围(0~9999999999)'
        this.dataObj.acceAB = null
      } else if (this.dataObj.acceAA === '0' || this.dataObj.acceAA === '0.0' || this.dataObj.acceAA === '0.00') {
        this.emObj.status = 1
        this.emObj.text = '纠纷金额不能为零！'
        this.dataObj.acceAB = null
      } else {
        this.emObj.status = 0
        this.emObj.text = ''
        this.dataObj.acceAB = this.countCost(this.dataObj.acceAA)
      }
    },
    countCost (num) {
      let _num = +num
      let _k = null
      let _v = null
      if (_num < 1000) {
        _k = 70
        _v = 300
      } else if (_num < 50000 && _num >= 1000) {
        _k = 70 + (_num - 1000) * 0.045
        _v = 300
      } else if (_num < 100000 && _num >= 50000) {
        _k = 2275 + (_num - 50000) * 0.035
        _v = _k * 0.15
      } else if (_num < 200000 && _num >= 100000) {
        _k = 4025 + (_num - 100000) * 0.025
        _v = _k * 0.15
      } else if (_num < 500000 && _num >= 200000) {
        _k = 6525 + (_num - 200000) * 0.015
        _v = _k * 0.15
      } else if (_num < 1000000 && _num >= 500000) {
        _k = 11025 + (_num - 500000) * 0.007
        _v = _k * 0.15
      } else if (_num >= 1000000) {
        _k = 14525 + (_num - 1000000) * 0.004
        _v = _k * 0.15
      }
      return ((_k + _v) * 0.7).toFixed(2)
    },
    acceSave (type) {
      if (type === 'acceA') {
        if (this.dataObj.acceAA === null || this.dataObj.acceAA === '') {
          this.$Message.warning({
            content: '请填写纠纷金额！',
            duration: 5
          })
        } else if (!setRegExp(this.dataObj.acceAA, 'money')) {
          this.$Message.warning({
            content: '请正确填写金额格式！',
            duration: 5
          })
        } else {
          axios.post('/case/updateCaseState', {
            caseId: this.dataObj.acceCaseId,
            state: 1,
            money: this.dataObj.acceAA,
            cost: this.dataObj.acceAB
          }).then(res => {
            this.alertCanc(type)
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
        }
      } else if (type === 'acceB') {
        if (this.dataObj.acceB === null || this.dataObj.acceB === '') {
          this.$Message.warning({
            content: '请填写驳回原因！',
            duration: 5
          })
        } else if (!setRegExp(this.dataObj.acceB, 'reject')) {
          this.$Message.warning({
            content: '请正确填写驳回原因格式！',
            duration: 5
          })
        } else {
          axios.post('/case/updateCaseState', {
            caseId: this.dataObj.acceCaseId,
            state: 2,
            reason: this.dataObj.acceB
          }).then(res => {
            this.alertCanc(type)
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
        }
      }
    },
    retrSave () {
      axios.post('/case/updateCaseStateByCancel', {
        caseId: this.dataObj.retrCaseId
      }).then(res => {
        this.alertCanc('retr')
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
    },
    alertCanc (type) {
      if (type === 'acceA') {
        this.alertShow.acceA = false
        this.dataObj.acceAA = null
        this.dataObj.acceAB = null
        this.dataObj.acceCaseId = null
        this.emObj.status = 0
        this.emObj.text = ''
      } else if (type === 'acceB') {
        this.alertShow.acceB = false
        this.dataObj.acceB = null
        this.dataObj.acceCaseId = null
      } else if (type === 'retr') {
        this.alertShow.retr = false
        this.dataObj.retrCaseId = null
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
._labelFor ._label {
  padding: 7px 0;
}
._em {
  padding-top: 5px;
  height: 16px;
  line-height: 16px;
  color: #ff7a7a;
  font-size: 8px;
  span {
    float: right;
  }
}
</style>
