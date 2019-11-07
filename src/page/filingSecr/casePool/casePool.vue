<template>
  <div class="casePool">
    <div class="_center pr">
      <spin-comp :spinShow="spinShow"></spin-comp>
      <Row>
        <Col span="2">
          <label class="lh32 f16 fc6 fr mr15">搜索</label>
        </Col>
        <Col span="8">
          <Input v-model="search.text" icon="ios-search" class="_search hand" @on-click="resSearch" @keyup.enter.native="resSearch" placeholder="申请人 / 被申请人"></Input>
        </Col>
        <Col span="10">
          &nbsp;
        </Col>
        <Col span="2">
          <Button type="primary" @click="resFind" :style="{display: resBtnDis('ACCECASE_QUERY')}">条件搜索</Button>
        </Col>
        <Col span="2">
          <Button type="primary" @click="resBatch" :style="{display: resBtnDis('ACCECASE_BATCHACC')}">批量拉取</Button>
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
    <alert-btn-info :alertShow="alertShow.retr" @alertConfirm="retrSave" @alertCancel="alertCanc('retr')" alertTitle="操作">
      <p>确定同意撤回案件？</p>
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
    <get-case-alert v-if="alertShow.getCase" :getCaseId="alertShow.ids" @saveClick="alertSave('getCase')" @cancClick="alertCanc('getCase')"></get-case-alert>
  </div>
</template>

<script>
import axios from 'axios'
import {resBtn} from '@/components/common/mixin.js'
import spinComp from '@/components/common/spin'
import alertBtnInfo from '@/components/common/alertBtnInfo'
import getCaseAlert from '@/page/filingSecr/casePool/children/getCaseAlert'
import { caseInfo } from '@/config/common.js'

export default {
  name: 'case_pool',
  mixins: [resBtn],
  components: { spinComp, alertBtnInfo, getCaseAlert },
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
            renderHeader: (h, params) => {
              return this.renderAllSele(h, params)
            },
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
        bodyList: [],
        seleMap: {}
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
        retr: false,
        idsList: [],
        ids: [],
        state: null,
        find: false,
        getCase: false
      },
      dataObj: {
        retrCaseId: null
      },
      reviewStatus: 1
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
    renderAllSele (h, params) {
      return h('div', [
        h('span', {
          style: {
            cursor: 'pointer',
            userSelect: 'none'
          },
          on: {
            click: () => {
              this.resAllSele()
            }
          }
        }, '全选')
      ])
    },
    resAllSele () {
      if (this.caseList.seleMap[this.pageObj.pageNum] === undefined) {
        this.caseList.seleMap[this.pageObj.pageNum] = true
      } else {
        this.caseList.seleMap[this.pageObj.pageNum] = !this.caseList.seleMap[this.pageObj.pageNum]
      }
      this.caseList.bodyList.forEach((item, index) => {
        let _obj = item
        if (_obj.cancelFlag !== '1' && _obj.acceptBtnStatus === '1') {
          this.seleArrChange(index, this.caseList.seleMap[this.pageObj.pageNum])
        }
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
              marginRight: '5px',
              display: this.resBtnDis('ACCECASE_PASSWITHDRAW')
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
          if (params.row.acceptBtnStatus === '1') {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px',
                  display: this.resBtnDis('ACCECASE_ACCEPT')
                },
                on: {
                  click: () => {
                    this.resGetCase(params.index)
                  }
                }
              }, '拉取')
            ])
          } else {
            return h('div', [
            ])
          }
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
      this.caseList.seleMap = {}
      this.alertCanc('clearIds')
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
    resGetCase (index) {
      this.seleArrChange(index, true)
      this.alertShow.getCase = true
    },
    resBatch () {
      if (this.alertShow.ids.length === 0) {
        this.$Message.error({
          content: '请先选择一个案件',
          duration: 5
        })
      } else {
        this.alertShow.getCase = true
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
        if (params.row.acceptBtnStatus === '1') {
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
    alertSave (type) {
      if (type === 'getCase') {
        this.alertCanc(type)
        this.resSearch()
      }
    },
    alertCanc (type) {
      if (type === 'retr') {
        this.alertShow.retr = false
        this.dataObj.retrCaseId = null
      } else if (type === 'find') {
        this.alertShow.find = false
        this.search.requestName = ''
        this.search.caseType = ''
        // this.search.caseTypeList = {}
        // this.search.requestNameList = []
      } else if (type === 'clearIds') {
        this.alertShow.idsList = []
        this.alertShow.ids = []
      } else if (type === 'getCase') {
        this.alertShow.getCase = false
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
