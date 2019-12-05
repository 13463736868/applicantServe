<template>
  <div class="acceCase">
    <div class="_center pr">
      <spin-comp :spinShow="spinShow"></spin-comp>
      <Row>
        <Col span="2">
          <label class="lh32 f16 fc6 fr mr15">搜索</label>
        </Col>
        <Col span="5">
          <Input v-model="search.text" icon="ios-search" class="_search hand" @on-click="resSearch" @keyup.enter.native="resSearch" placeholder="案号 / 案件编号 / 申请人 / 被申请人 / 代理人 / 年限"></Input>
        </Col>
        <Col span="2">
          <label class="lh32 f16 fc6 fr mr15">状态</label>
        </Col>
        <Col span="3">
          <Select v-model="reviewStatus" @on-change="resChangeStatus()">
            <Option v-for="item in reviewList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Col>
        <Col span="12">
          <div class="tr pr20">
            <Button class="ml20" type="primary" @click="resActionFind('resFind', null)" :style="{display: resBtnDis('ACCECASE_QUERY')}">条件搜索</Button>
            <Button class="ml20" type="primary" @click="resBatch(1)" :style="{display: resBtnDis('ACCECASE_BATCHACC')}">批量通知交费</Button>
            <Button class="ml20" type="primary" @click="resBatch(2)" :style="{display: resBtnDis('ACCECASE_BATCHREJECTION')}">批量退回</Button>
          </div>
        </Col>
      </Row>
      <div class="_caseList clearfix">
        <Row>
          <Col span="24" class="pl20 pr20">
            <Table stripe border align="center" :loading="caseList.loading" :columns="caseList.header" :data="caseList.bodyList">
              <template slot-scope="{ row, index }" slot="check">
                <div v-if="row.cancelFlag !== '1' && row.state === 1 && row.acceptBtnStatus === '1'">
                  <Icon v-if="alertShow.ids.indexOf(row.caseId) === -1" class="hand vtt" type="md-square-outline" size="16" color="#2d8cf0" @click="seleArrChange(row, true)"></Icon>
                  <Icon v-else class="hand vtt" type="md-checkbox" size="16" color="#2d8cf0" @click="seleArrChange(row, false)"></Icon>
                </div>
              </template>
              <template slot-scope="{ row, index }" slot="hashFlag">
                <span v-if="row.solidifyHashStatus === '3'" @click="resGoCase(index)" style="color: #ff9900;" class="mr5 hand" type="text" size="small">{{row.compareSolidifyHashFlag}}</span>
                <span v-if="row.solidifyHashStatus === '1'" @click="resGoCase(index)" style="color: #19be6b;" class="mr5 hand" type="text" size="small">{{row.compareSolidifyHashFlag}}</span>
                <span v-if="row.solidifyHashStatus === '2'" @click="resGoCase(index)" style="color: #ed4014;" class="mr5 hand" type="text" size="small">{{row.compareSolidifyHashFlag}}</span>
                <span v-if="['1', '2', '3'].indexOf(row.solidifyHashStatus) === -1" @click="resGoCase(index)" class="mr5 hand" type="text" size="small">{{row.compareSolidifyHashFlag}}</span>
              </template>
              <template slot-scope="{ row, index }" slot="action">
                <Button :style="{display: resBtnDis('ACCECASE_PASSWITHDRAW')}" type="primary" size="small" v-if="row.cancelFlag === '1'" @click="resRecallCase(index)">同意撤回</Button>
                <Button :style="{display: resBtnDis('ACCECASE_ACCEPT')}" type="primary" size="small" v-if="row.cancelFlag !== '1' && row.state === 1 && row.acceptBtnStatus === '1'" @click="resAcceptCase(1, index)">通知交费</Button>
                <Button :style="{display: resBtnDis('ACCECASE_REJECT')}" type="primary" size="small" v-if="row.cancelFlag !== '1' && row.state === 1 && row.acceptBtnStatus === '1'" @click="resAcceptCase(0, index)">退回</Button>
                <span style="color: #2d8cf0" class="mr5" type="text" size="small" v-if="row.cancelFlag !== '1' && row.state === 1 && row.acceptBtnStatus === '2'">通知交费审核中</span>
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
    <alert-btn-info :alertShow="alertShow.acceA" @alertConfirm="acceSave('acceA')" @alertCancel="alertCanc('acceA')" alertTitle="通知交费">
      <Row class="_labelFor mb10">
        <Col span="6">
          <div class="_label">请输入争议标的额 (元)：</div>
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
          <div class="_label">仲裁费金额：</div>
        </Col>
        <Col span="16" offset="1">
          <Input readonly v-model="dataObj.acceAB"/>
        </Col>
      </Row>
    </alert-btn-info>
    <alert-btn-info :alertShow="alertShow.acceB" @alertConfirm="acceSave('acceB')" @alertCancel="alertCanc('acceB')" alertTitle="退回案件">
      <Input v-model="dataObj.acceB" type="textarea" :autosize="{minRows: 3,maxRows: 10}" placeholder="请输入退回原因..." />
    </alert-btn-info>
    <alert-btn-info :alertShow="alertShow.retr" @alertConfirm="retrSave" @alertCancel="alertCanc('retr')" alertTitle="操作">
      <p>确定同意撤回案件？</p>
    </alert-btn-info>
    <alert-btn-info :alertShow="alertShow.batch" @alertConfirm="batchSave" @alertCancel="alertCanc('batch')" alertTitle="操作">
      <p v-if="alertShow.state === 1">确定要通知交费吗？</p>
      <p class="mb10" v-if="alertShow.state === 2">确定要退回吗？</p>
      <Input v-if="alertShow.state === 2" v-model.trim="alertShow.rejeReason" type="textarea" :autosize="{minRows: 3,maxRows: 10}" placeholder="请输入退回原因..." />
    </alert-btn-info>
    <res-find v-if="alertShow.find" @alertConfirm="alertSaveFind('find', ...arguments)" @alertCancel="alertCancFind('find')"></res-find>
  </div>
</template>

<script>
import axios from 'axios'
import {resMess, resBtn, resSearFind} from '@/components/common/mixin.js'
import spinComp from '@/components/common/spin'
import alertBtnInfo from '@/components/common/alertBtnInfo'
import resFind from '@/page/comm/resFind/resFind'
import setRegExp from '@/config/regExp.js'
import { caseInfo } from '@/config/common.js'

export default {
  name: 'acce_case',
  mixins: [resMess, resBtn, resSearFind],
  components: { spinComp, alertBtnInfo, resFind },
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
            slot: 'check',
            renderHeader: (h, params) => {
              return this.renderAllSele(h, params)
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
            title: '案由',
            key: 'caseReson',
            tooltip: 'true',
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
            title: '证据固化',
            key: 'compareSolidifyHashFlag',
            align: 'center',
            slot: 'hashFlag'
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
            slot: 'action'
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
      reviewStatus: 0,
      reviewList: [
        {
          value: 0,
          label: '全部'
        },
        {
          value: 1,
          label: '待受理'
        },
        {
          value: 2,
          label: '待交费'
        }
      ]
    }
  },
  created () {
    this.resCaseList()
  },
  methods: {
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
        this.resMessage('error', '错误信息:' + e + ' 稍后再试')
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
        this.resMessage('error', '错误信息:' + e + ' 稍后再试')
      })
    },
    acceSave (type) {
      if (type === 'acceA') {
        if (this.dataObj.acceAA === null || this.dataObj.acceAA === '') {
          this.resMessage('warning', '请填写纠纷金额！')
        } else if (!setRegExp(this.dataObj.acceAA, 'money')) {
          this.resMessage('warning', '请正确填写金额格式！')
        } else {
          this.alertShow.acceA = false
          axios.post('/case/updateCaseState', {
            caseId: this.dataObj.acceCaseId,
            state: 1,
            money: this.dataObj.acceAA,
            cost: this.dataObj.acceAB
          }).then(res => {
            this.alertCanc(type)
            this.resMessage('success', '操作成功')
            this.resSearch()
          }).catch(e => {
            this.resMessage('error', '错误信息:' + e + ' 稍后再试')
          })
        }
      } else if (type === 'acceB') {
        if (this.dataObj.acceB === null || this.dataObj.acceB === '') {
          this.resMessage('warning', '请填写退回原因！')
        } else if (!setRegExp(this.dataObj.acceB, 'reject')) {
          this.resMessage('warning', '请正确填写退回原因格式！')
        } else {
          this.alertShow.acceB = false
          axios.post('/case/updateCaseState', {
            caseId: this.dataObj.acceCaseId,
            state: 2,
            reason: this.dataObj.acceB
          }).then(res => {
            this.alertCanc(type)
            this.resMessage('success', '操作成功')
            this.resSearch()
          }).catch(e => {
            this.resMessage('error', '错误信息:' + e + ' 稍后再试')
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
        this.resMessage('success', '操作成功')
        this.resSearch()
      }).catch(e => {
        this.resMessage('error', '错误信息:' + e + ' 稍后再试')
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
        if (_obj.cancelFlag !== '1' && _obj.state === 1 && _obj.acceptBtnStatus === '1') {
          this.seleArrChange(item, this.caseList.seleMap[this.pageObj.pageNum])
        }
      })
    },
    seleArrChange (_data, bool) {
      let info = _data
      if (bool) {
        if (this.alertShow.ids.indexOf(info.caseId) === -1) {
          if (this.alertShow.ids.length >= 10) {
            this.resMessage('error', '最多只能选择十个案件')
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
        this.resMessage('error', '请先选择一个案件')
      } else {
        this.alertShow.state = type
        this.alertShow.batch = true
      }
    },
    batchSave () {
      if (this.alertShow.state === 2) {
        if (this.alertShow.rejeReason === '') {
          this.resMessage('warning', '请填写退回原因')
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
            this.resMessage('success', res.data.data)
            this.resSearch()
          }).catch(e => {
            this.alertCanc('batch')
            this.resMessage('error', '错误信息:' + e + ' 稍后再试')
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
          this.resMessage('success', res.data.data)
          this.resSearch()
        }).catch(e => {
          this.alertCanc('batch')
          this.resMessage('error', '错误信息:' + e + ' 稍后再试')
        })
      }
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
      } else if (type === 'clearIds') {
        this.alertShow.idsList = []
        this.alertShow.ids = []
        this.caseList.seleMap = {}
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
