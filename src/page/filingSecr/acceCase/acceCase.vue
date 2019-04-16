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
        <Col span="2" offset="1">
          <label class="lh32 f16 fc6 fr mr15">状态</label>
        </Col>
        <Col span="4">
          <Select v-model="reviewStatus" @on-change="resChangeStatus()">
            <Option v-for="item in reviewList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Col>
        <Col span="2" offset="1">
          <Button type="primary" @click="resFind">条件搜索</Button>
        </Col>
        <Col span="2">
          <Button type="primary" @click="resBatch(1)">批量受理</Button>
        </Col>
        <Col span="2">
          <Button type="primary" @click="resBatch(2)">批量驳回</Button>
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
    <alert-btn-info :alertShow="alertShow.batch" @alertConfirm="batchSave" @alertCancel="alertCanc('batch')" alertTitle="操作">
      <p v-if="alertShow.state === 1">确定要受理吗？</p>
      <p class="mb10" v-if="alertShow.state === 2">确定要驳回吗？</p>
      <Input v-if="alertShow.state === 2" v-model.trim="alertShow.rejeReason" type="textarea" :autosize="{minRows: 3,maxRows: 10}" placeholder="请输入驳回原因..." />
    </alert-btn-info>
    <alert-btn-info :alertShow="alertShow.find"  @alertConfirm="findSave" @alertCancel="alertCanc('find')" alertTitle="操作">
      <Row class="_labelFor">
        <Col span="6" offset="1">
          <p><span class="_span">*</span><b>注册名称：</b></p>
        </Col>
        <Col span="16">
          <Select v-model="search.requestName" filterable>
            <Option v-for="item in search.requestNameList" :value="item.userToken" :key="item.userToken">{{ item.userName }}</Option>
          </Select>
        </Col>
      </Row>
      <Row class="_labelFor" v-if="search.requestName !== ''">
        <Col span="6" offset="1">
          <p><span class="_span">*</span><b>案件类型：</b></p>
        </Col>
        <Col span="16">
          <Select v-model="search.caseType">
            <Option v-for="item in search.caseTypeList[search.requestName]" :value="item.caseTypeCode" :key="item.caseTypeCode">{{ item.caseTypeName }}</Option>
          </Select>
        </Col>
      </Row>
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
        text: '',
        requestName: '',
        caseType: '',
        caseTypeList: {},
        requestNameList: []
      },
      caseList: {
        loading: false,
        header: [
          {
            title: '选择',
            key: 'caseId',
            width: 60,
            align: 'center',
            render: (h, params) => {
              return this.renderCheck(h, params)
            }
          },
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
            key: 'defendantName',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '提交时间',
            key: 'createTime',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '证据固化',
            key: 'compareSolidifyHashFlag',
            align: 'center',
            render: (h, params) => {
              return this.renderHashFlag(h, params)
            }
          },
          {
            title: '案件状态',
            key: 'caseState',
            align: 'center'
          },
          {
            title: '案件类型',
            key: 'caseTypeName',
            align: 'center'
          },
          {
            title: '仲裁费(元)',
            key: 'cost',
            align: 'center',
            render: (h, params) => {
              return h('span', {
                props: {
                  type: 'text',
                  size: 'small'
                }
              }, params.row.cost === null ? '' : params.row.cost + ' 元')
            }
          },
          {
            title: '操作',
            key: 'caseId',
            minWidth: 26,
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
        retr: false,
        idsList: [],
        ids: [],
        state: null,
        batch: false,
        rejeReason: '',
        find: false
      },
      dataObj: {
        acceAA: null,
        acceAB: null,
        acceB: null,
        acceCaseId: null,
        retrCaseId: null
      },
      reviewStatus: 1,
      reviewList: [
        {
          value: 1,
          label: '待受理'
        },
        {
          value: 2,
          label: '待缴费'
        }
      ]
    }
  },
  created () {
    this.resCaseList()
  },
  methods: {
    dictionary () {
      axios.post('/batchCaseDocument/findCaseType').then(res => {
        let _obj = res.data.data
        this.search.requestNameList = _obj
        this.search.requestNameList.map((a) => {
          this.search.caseTypeList[a.userToken] = a.caseTypeList
        })
      }).catch(e => {
        this.$Message.error({
          content: '错误信息:' + e + ' 稍后再试',
          duration: 5
        })
      })
    },
    renderHashFlag (h, params) {
      let _status = params.row.solidifyHashStatus
      if (_status === '3') {
        return h('span', {
          props: {
            type: 'text',
            size: 'small'
          },
          style: {
            color: '#ff9900',
            cursor: 'pointer'
          },
          on: {
            click: () => {
              this.resGoCase(params.index)
            }
          }
        }, params.row.compareSolidifyHashFlag)
      } else if (_status === '1') {
        return h('span', {
          props: {
            type: 'text',
            size: 'small'
          },
          style: {
            color: '#19be6b',
            cursor: 'pointer'
          },
          on: {
            click: () => {
              this.resGoCase(params.index)
            }
          }
        }, params.row.compareSolidifyHashFlag)
      } else if (_status === '2') {
        return h('span', {
          props: {
            type: 'text',
            size: 'small'
          },
          style: {
            color: '#ed4014',
            cursor: 'pointer'
          },
          on: {
            click: () => {
              this.resGoCase(params.index)
            }
          }
        }, params.row.compareSolidifyHashFlag)
      } else {
        return h('span', {
          props: {
            type: 'text',
            size: 'small'
          },
          style: {
            cursor: 'pointer'
          },
          on: {
            click: () => {
              this.resGoCase(params.index)
            }
          }
        }, params.row.compareSolidifyHashFlag)
      }
    },
    renderBtn (h, params) {
      if (params.row.cancelFlag === '1') {
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
        if (this.reviewStatus === 1) {
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
        } else {
          return h('div', [
          ])
        }
      }
    },
    resCaseList () {
      this.spinShow = true
      axios.post('/case/findRegisterCaseList', {
        startIndex: (this.pageObj.pageNum - 1) * this.pageObj.pageSize,
        pageSize: this.pageObj.pageSize,
        keyword: this.search.text,
        state: this.reviewStatus,
        registerToken: this.search.requestName,
        caseTypeCode: this.search.caseType,
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
      this.search.requestName = ''
      this.search.caseType = ''
      this.alertCanc('clearIds')
      this.pageObj.pageNum = 1
      this.resCaseList()
    },
    reschangePage (page) {
      this.pageObj.pageNum = page
      this.resCaseList()
    },
    resChangeStatus () {
      this.resSearch()
    },
    resRecallCase (index) {
      this.dataObj.retrCaseId = this.caseList.bodyList[index].caseId
      this.alertShow.retr = true
    },
    resAcceptCase (status, index) {
      this.dataObj.acceCaseId = this.caseList.bodyList[index].caseId
      if (status) {
        this.alertShow.acceA = true
        this.dataObj.acceAA = this.caseList.bodyList[index].money
        this.applMoney()
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
        this.countCost(this.dataObj.acceAA)
      }
    },
    countCost (num) {
      let _num = +num
      axios.post('/payMentRequest/findArbitrationFee', {
        money: _num
      }).then(res => {
        this.dataObj.acceAB = res.data.data
      }).catch(e => {
        this.$Message.error({
          content: '错误信息:' + e + ' 稍后再试',
          duration: 5
        })
      })
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
          this.alertShow.acceA = false
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
          this.alertShow.acceB = false
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
      this.alertShow.retr = false
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
    renderCheck (h, params) {
      let _obj = params.row
      if (_obj.cancelFlag === '1') {
        return h('div', [
        ])
      } else if (this.reviewStatus === 1) {
        if (this.alertShow.ids.indexOf(_obj.caseId) === -1) {
          return h('div', [
            h('Icon', {
              props: {
                type: 'md-square-outline',
                size: '16'
              },
              style: {
                color: '#2d8cf0',
                cursor: 'pointer',
                verticalAlign: 'text-top'
              },
              on: {
                click: () => {
                  this.seleArrChange(params.index, true)
                }
              }
            })
          ])
        } else {
          return h('div', [
            h('Icon', {
              props: {
                type: 'md-checkbox',
                size: '16'
              },
              style: {
                color: '#2d8cf0',
                cursor: 'pointer',
                verticalAlign: 'text-top'
              },
              on: {
                click: () => {
                  this.seleArrChange(params.index, false)
                }
              }
            })
          ])
        }
      } else {
        return h('div', [
        ])
      }
    },
    seleArrChange (index, bool) {
      let info = this.caseList.bodyList[index]
      if (bool) {
        if (this.alertShow.ids.indexOf(info.caseId) === -1) {
          if (this.alertShow.ids.length >= 10) {
            this.$Message.error({
              content: '最多只能选择十个案件',
              duration: 5
            })
            return false
          } else {
            let _o = {}
            _o.caseId = info.caseId
            this.alertShow.idsList.push(_o)
            this.alertShow.ids.push(info.caseId)
          }
        }
      } else {
        if (this.alertShow.ids.indexOf(info.caseId) !== -1) {
          this.alertShow.idsList.splice(this.alertShow.ids.indexOf(info.caseId), 1)
          this.alertShow.ids.splice(this.alertShow.ids.indexOf(info.caseId), 1)
        }
      }
    },
    resBatch (type) {
      if (this.alertShow.ids.length === 0) {
        this.$Message.error({
          content: '请先选择一个案件',
          duration: 5
        })
      } else {
        this.alertShow.state = type
        this.alertShow.batch = true
      }
    },
    batchSave () {
      if (this.alertShow.state === 2) {
        if (this.alertShow.rejeReason === '') {
          this.$Message.warning({
            content: '请填写驳回原因',
            duration: 5
          })
        } else {
          this.alertShow.batch = false
          axios.put('/caseBatch/updateCaseState_batch', {
            reason: this.alertShow.rejeReason,
            items: JSON.stringify(this.alertShow.idsList),
            state: this.alertShow.state + ''
          }, {
            headers: {
              'content-Type': 'application/json;charset=UTF-8'
            }
          }).then(res => {
            this.alertCanc('batch')
            this.$Message.success({
              content: res.data.data,
              duration: 2
            })
            this.resSearch()
          }).catch(e => {
            this.alertCanc('batch')
            this.$Message.error({
              content: '错误信息:' + e + ' 稍后再试',
              duration: 5
            })
          })
        }
      } else {
        this.alertShow.batch = false
        axios.put('/caseBatch/updateCaseState_batch', {
          items: JSON.stringify(this.alertShow.idsList),
          state: this.alertShow.state + ''
        }, {
          headers: {
            'content-Type': 'application/json;charset=UTF-8'
          }
        }).then(res => {
          this.alertCanc('batch')
          this.$Message.success({
            content: res.data.data,
            duration: 2
          })
          this.resSearch()
        }).catch(e => {
          this.alertCanc('batch')
          this.$Message.error({
            content: '错误信息:' + e + ' 稍后再试',
            duration: 5
          })
        })
      }
    },
    resFind () {
      this.alertCanc('find')
      this.alertShow.find = true
      this.dictionary()
    },
    findSave () {
      this.alertShow.find = false
      this.alertCanc('clearIds')
      this.pageObj.pageNum = 1
      this.resCaseList()
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
      } else if (type === 'batch') {
        this.alertShow.rejeReason = ''
        this.alertShow.state = null
        this.alertShow.batch = false
      } else if (type === 'find') {
        this.alertShow.find = false
        this.search.requestName = ''
        this.search.caseType = ''
        // this.search.caseTypeList = {}
        // this.search.requestNameList = []
      } else if (type === 'clearIds') {
        this.alertShow.idsList = []
        this.alertShow.ids = []
      }
    },
    goCaseInfo (index) {
      let obj = {}
      obj.caseId = this.caseList.bodyList[index].caseId
      obj.state = this.caseList.bodyList[index].state
      caseInfo(obj)
    },
    resGoCase (index) {
      let obj = {}
      obj.caseId = this.caseList.bodyList[index].caseId
      obj.state = this.caseList.bodyList[index].state
      obj.path = '/caseInfo/evidencesInfo'
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
._labelFor {
  margin-bottom: 10px;
  p {
    padding: 7px 0;
  }
  ._span {
    color: #ff7a7a;
    vertical-align: text-top;
  }
  ._label {
    padding: 7px 0;
  }
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
