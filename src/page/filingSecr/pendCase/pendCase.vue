<template>
  <div class="pendCase">
    <head-top :isRegister="true">
      <span class="f36 fcf">待立案案件</span>
    </head-top>
    <div class="_center pr">
      <spin-comp :spinShow="spinShow"></spin-comp>
      <Row>
        <Col span="2">
          <label class="lh32 f16 fc6 fr mr15">搜索</label>
        </Col>
        <Col span="8">
          <Input v-model="search.text" icon="ios-search" class="_search hand" @on-click="resSearch" @keyup.enter.native="resSearch" placeholder="申请人 / 被申请人"></Input>
        </Col>
        <Col span="2" offset="10">
          <Button type="primary" @click="resFind">条件搜索</Button>
        </Col>
        <Col span="2">
          <Button type="primary" @click="resBatch">批量立案</Button>
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
    <alert-btn-info :alertShow="alertShow.conf" @alertConfirm="confSave" @alertCancel="alertCanc('conf')" alertTitle="确认立案">
      <Row class="_labelFor">
        <Col span="4" offset="2">
          <div class="_label">纠纷类型：</div>
        </Col>
        <Col span="16">
          <Select v-model="dataObj.confType">
            <Option v-for="item in caseTypeList" :value="item.value" :key="item.value">{{item.label}}</Option>
          </Select>
        </Col>
      </Row>
    </alert-btn-info>
    <alert-btn-info :alertShow="alertShow.batch" @alertConfirm="batchSave" @alertCancel="alertCanc('batch')" alertTitle="确认立案">
      <Row class="_labelFor">
        <Col span="4" offset="2">
          <div class="_label">纠纷类型：</div>
        </Col>
        <Col span="16">
          <Select v-model="dataObj.confType">
            <Option v-for="item in caseTypeList" :value="item.value" :key="item.value">{{item.label}}</Option>
          </Select>
        </Col>
      </Row>
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
import { caseInfo } from '@/config/common.js'

export default {
  name: 'pend_case',
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
            title: '案件类型',
            key: 'caseTypeName',
            align: 'center'
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
            title: '受理时间',
            key: 'acceptTime',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '操作',
            key: 'caseId',
            align: 'center',
            render: (h, params) => {
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
                      this.resConfCase(params.index)
                    }
                  }
                }, '确认立案')
              ])
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
        conf: false,
        idsList: [],
        ids: [],
        batch: false,
        find: false
      },
      dataObj: {
        confCaseId: null,
        confCosts: null,
        confType: null
      },
      caseTypeList: []
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
    resCaseList () {
      this.spinShow = true
      axios.post('/case/findRegisterCaseList', {
        startIndex: (this.pageObj.pageNum - 1) * this.pageObj.pageSize,
        pageSize: this.pageObj.pageSize,
        keyword: this.search.text,
        registerToken: this.search.requestName,
        caseTypeCode: this.search.caseType,
        state: 12,
        caseListType: 2
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
    resConfCase (index) {
      axios.post('/dictionary/findDictionaryList', {
        type: 'caseType'
      }).then(res => {
        let _dataList = res.data.data
        let _select = []
        for (let k in _dataList) {
          let _o = {}
          _o.value = _dataList[k].itemValue
          _o.label = _dataList[k].item
          _select.push(_o)
        }
        this.caseTypeList = _select
        this.alertShow.conf = true
        this.dataObj.confCaseId = this.caseList.bodyList[index].caseId
        this.dataObj.confCosts = this.caseList.bodyList[index].cost
      }).catch(e => {
        this.$Message.error({
          content: '错误信息:' + e + ' 稍后再试',
          duration: 5
        })
      })
    },
    confSave () {
      if (this.dataObj.confType === null) {
        this.$Message.warning({
          content: '请选择纠纷类型',
          duration: 5
        })
      } else {
        this.alertShow.conf = false
        axios.post('/case/updateCaseStateAndType', {
          caseId: this.dataObj.confCaseId,
          caseType: this.dataObj.confType,
          costs: this.dataObj.confCosts
        }).then(res => {
          this.alertCanc('conf')
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
    },
    renderCheck (h, params) {
      let _obj = params.row
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
            _o.costs = info.cost
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
    resBatch () {
      if (this.alertShow.ids.length === 0) {
        this.$Message.error({
          content: '请先选择一个案件',
          duration: 5
        })
      } else {
        axios.post('/dictionary/findDictionaryList', {
          type: 'caseType'
        }).then(res => {
          let _dataList = res.data.data
          let _select = []
          for (let k in _dataList) {
            let _o = {}
            _o.value = _dataList[k].itemValue
            _o.label = _dataList[k].item
            _select.push(_o)
          }
          this.caseTypeList = _select
          this.alertShow.batch = true
        }).catch(e => {
          this.$Message.error({
            content: '错误信息:' + e + ' 稍后再试',
            duration: 5
          })
        })
      }
    },
    batchSave () {
      if (this.dataObj.confType === null) {
        this.$Message.warning({
          content: '请先选择案件类型',
          duration: 5
        })
      } else {
        this.alertShow.batch = false
        axios.put('/caseBatch/updateCaseStateAndType_batch', {
          caseType: this.dataObj.confType,
          items: JSON.stringify(this.alertShow.idsList)
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
      if (type === 'conf') {
        this.alertShow.conf = false
        this.dataObj.confCaseId = null
        this.dataObj.confCosts = null
        this.dataObj.confType = null
      } else if (type === 'batch') {
        this.alertShow.batch = false
        this.dataObj.confType = null
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
</style>
