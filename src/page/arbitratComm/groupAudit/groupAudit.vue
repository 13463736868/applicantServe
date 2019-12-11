<template>
  <div class="groupAudit">
    <div class="_center pr">
      <spin-comp :spinShow="spinShow"></spin-comp>
      <Row class="pb20">
        <Col span="2">
          <label class="lh32 f16 fc6 fr mr15">条件选择</label>
        </Col>
        <Col span="3">
          <Select v-model="search.batchCondition" @on-change="resSearchList">
            <Option :value="0" :key="0">全部</Option>
            <Option :value="1" :key="1">指定仲裁员(速裁)</Option>
            <Option :value="4" :key="4">指定仲裁员(普裁)</Option>
          </Select>
        </Col>
        <Col span="19">
          <div class="tr pr20">
            <Button class="ml20" type="primary" @click="resActionFind('resFind', null)" :style="{display: resBtnDis('GROUPAUDIT_QUERY')}">条件搜索</Button>
            <Button class="ml20" type="primary" @click="resAction('resReviseBatch', null)" :style="{display: resBtnDis('GROUPAUDIT_BATCHEAPP')}">批量指定仲裁员</Button>
            <Button class="ml20" type="primary" @click="resAction('resReviseEditBatch', null)" :style="{display: resBtnDis('GROUPAUDIT_EDITARBITRATOR_BATCH')}">批量修改仲裁员</Button>
            <Button class="ml20" type="primary" @click="resAction('groupPassBatch', null)" :style="{display: resBtnDis('GROUPAUDIT_AGREE_BATCH')}">批量同意</Button>
          </div>
        </Col>
      </Row>
      <div class="_caseList clearfix">
        <Row>
          <Col span="24" class="pl20 pr20">
            <Table stripe border align="center" :loading="caseList.loading" :columns="caseList.header" :data="caseList.bodyList">
              <template slot-scope="{ row, index }" slot="action">
                <Button :style="{display: resBtnDis('GROUPAUDIT_APPARBITRATORS')}" class="mr5" type="primary" size="small" v-if="row.approverId === '' || row.approverId === null" @click="resAction('resRevise', row)">指定仲裁员</Button>
                <Button :style="{display: resBtnDis('GROUPAUDIT_APPROVAL')}" class="mr5" type="primary" size="small" v-if="(row.approverId === '' || row.approverId === null) || (row.approverId !== '' && row.approverId !== null && row.passFlag === 3)" @click="resAction('groupForm', row)">组庭审批表</Button>
                <Button :style="{display: resBtnDis('GROUPAUDIT_PASS')}" class="mr5" type="primary" size="small" v-if="row.approverId !== '' && row.approverId !== null && row.passFlag === 2" @click="resAction('resPass', row)">通过</Button>
                <Button :style="{display: resBtnDis('GROUPAUDIT_REAPPOINTMENT')}" class="mr5" type="primary" size="small" v-if="row.approverId !== '' && row.approverId !== null && row.passFlag === 3" @click="resAction('resReviseRest', row)">重新指定仲裁员</Button>
                <Button :style="{display: resBtnDis('GROUPAUDIT_EDITARBITRATOR')}" class="mr5" type="primary" size="small" v-if="row.approverId !== '' && row.approverId !== null && row.passFlag === 4" @click="resAction('resReviseEdit', row)">修改仲裁员</Button>
                <Button :style="{display: resBtnDis('GROUPAUDIT_AGREE')}" class="mr5" type="primary" size="small" v-if="row.approverId !== '' && row.approverId !== null && row.passFlag === 4" @click="resAction('groupPass', row)">同意</Button>
              </template>
            </Table>
          </Col>
        </Row>
      </div>
      <div class="_page clearfix">
        <Row>
          <Col span="12" offset="6" class="tc">
            <Page :total="pageObj.total" :current="pageObj.pageNum" :page-size="pageObj.pageSize" show-elevator show-total @on-change="reschangePage" @on-page-size-change="reschangePageSize" show-sizer></Page>
          </Col>
        </Row>
      </div>
    </div>
    <res-revise v-if="alertObj.revise" :resPropsData="alertObj.reviseData" @alertConfirm="alertSave('resRevise')" @alertCancel="alertCanc('resRevise')"></res-revise>
    <res-pass v-if="alertObj.pass" :resPropsData="alertObj.passData" @alertConfirm="alertSave('resPass')" @alertCancel="alertCanc('resPass')"></res-pass>
    <res-group-pass v-if="alertObj.groupPass" :resPropsData="alertObj.groupPassData" @alertConfirm="alertSave('groupPass')" @alertCancel="alertCanc('groupPass')"></res-group-pass>
    <group-Appr-form v-if="formObj.filing" :caseId="formObj.caseId" @alertConfirm="alertSave('groupForm')" @alertCancel="alertCanc('groupForm')"></group-Appr-form>
    <res-find v-if="alertShow.find" @alertConfirm="alertSaveFind('find', ...arguments)" @alertCancel="alertCancFind('find')"></res-find>
  </div>
</template>

<script>
import axios from 'axios'
import {resMess, resBtn, resPage, resSearFind} from '@/components/common/mixin.js'
import spinComp from '@/components/common/spin'
import resFind from '@/page/comm/resFind/resFind'
import alertBtnInfo from '@/components/common/alertBtnInfo'
import groupApprForm from '@/page/comm/apprForm/groupApprForm'
import resGroupPass from '@/page/arbitratComm/groupAudit/children/resGroupPass'
import resPass from '@/page/arbitratComm/groupAudit/children/resPass'
import resRevise from '@/page/arbitratComm/groupAudit/children/resRevise'
import { caseInfo } from '@/config/common.js'

export default {
  name: 'group_audit',
  mixins: [resMess, resBtn, resPage, resSearFind],
  components: { spinComp, resFind, alertBtnInfo, groupApprForm, resGroupPass, resPass, resRevise },
  data () {
    return {
      spinShow: false,
      search: {
        batchCondition: 0,
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
            key: 'id',
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
            title: '案件类型',
            key: 'caseTypeName',
            align: 'center'
          },
          {
            title: '申请人',
            key: 'applicantName',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '申请人仲裁员',
            key: 'applicantApprove',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '被申请人',
            key: 'respondentName',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '被申请人仲裁员',
            key: 'respondentApprove',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '最终仲裁员',
            key: 'approver',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '开庭时间',
            key: 'beginTime',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '操作',
            key: 'id',
            minWidth: 30,
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
      alertShow: {
        idsList: [],
        ids: [],
        find: false
      },
      formObj: {
        caseId: null,
        filing: false
      },
      alertObj: {
        groupPass: false,
        groupPassData: null,
        pass: false,
        passData: null,
        revise: false,
        reviseData: null
      }
    }
  },
  created () {
    this.resCaseList()
  },
  methods: {
    resCaseList () {
      this.spinShow = true
      axios.post('/approve/findGroupApproveList', {
        pageIndex: (this.pageObj.pageNum - 1) * this.pageObj.pageSize,
        pageSize: this.pageObj.pageSize,
        registerToken: this.search.requestName,
        caseTypeCode: this.search.caseType,
        groupApproveType: 'arbitrationCommission',
        batchCondition: this.search.batchCondition
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
    resSearchList () {
      this.search.requestName = ''
      this.search.caseType = ''
      this.alertCanc('clearIds')
      this.pageObj.pageNum = 1
      this.resCaseList()
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
        if (this.search.batchCondition !== 0) {
          this.seleArrChange(item, this.caseList.seleMap[this.pageObj.pageNum])
        }
      })
    },
    renderCheck (h, params) {
      let _obj = params.row
      if (this.search.batchCondition !== 0) {
        if (this.alertShow.ids.indexOf(_obj.id) === -1) {
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
                  this.seleArrChange(params.row, true)
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
                  this.seleArrChange(params.row, false)
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
    seleArrChange (_data, bool) {
      let info = _data
      if (bool) {
        if (this.alertShow.ids.indexOf(info.id) === -1) {
          if (this.alertShow.ids.length >= 10) {
            this.resMessage('error', '最多只能选择十个案件')
            return false
          } else {
            let _o = {}
            if (this.search.batchCondition === 1 || this.search.batchCondition === 4) {
              _o.caseId = info.id
              _o.tribunalRequestId = info.tribunalRequestId
              _o.arbitratorIds = info.recommArbitratorIds
              _o.arbitratorIdNum = info.arbitratorIdNum
            }
            this.alertShow.idsList.push(_o)
            this.alertShow.ids.push(info.id)
          }
        }
      } else {
        if (this.alertShow.ids.indexOf(info.id) !== -1) {
          this.alertShow.idsList.splice(this.alertShow.ids.indexOf(info.id), 1)
          this.alertShow.ids.splice(this.alertShow.ids.indexOf(info.id), 1)
        }
      }
    },
    resAction (type, data) {
      switch (type) {
        case 'groupForm':
          this.formObj.caseId = data.id
          this.formObj.filing = true
          break
        case 'groupPass':
          this.alertObj.groupPassData = {
            state: 1,
            caseId: data.id
          }
          this.alertObj.groupPass = true
          break
        case 'resPass':
          this.alertObj.passData = {
            caseId: data.id,
            tribunalRequestId: data.tribunalRequestId,
            arbitratorIds: data.approverId
          }
          this.alertObj.pass = true
          break
        case 'resRevise':
        case 'resReviseRest':
        case 'resReviseEdit':
          this.alertObj.reviseData = {
            caseId: data.id,
            arbiNum: data.arbitratorIdNum,
            resTribId: data.tribunalRequestId,
            type: type
          }
          this.alertObj.revise = true
          break
        case 'resReviseBatch':
          if (this.search.batchCondition !== 1 && this.search.batchCondition !== 4) {
            this.resMessage('error', '请先条件选择 \'指定仲裁员\'')
          } else if (this.alertShow.ids.length === 0) {
            this.resMessage('error', '请先选择一个案件')
          } else {
            this.alertObj.reviseData = {
              caseTribunalRequest: JSON.stringify(this.alertShow.idsList),
              type: type,
              arbiNum: this.search.batchCondition === 1 ? 1 : 3
            }
            this.alertObj.revise = true
          }
          break
        case 'resReviseEditBatch':
          if (this.search.batchCondition !== 1 && this.search.batchCondition !== 4) {
            this.resMessage('error', '请先条件选择 \'指定仲裁员\'')
          } else if (this.alertShow.ids.length === 0) {
            this.resMessage('error', '请先选择一个案件')
          } else {
            this.alertObj.reviseData = {
              caseId: this.alertShow.ids.join(','),
              type: type,
              arbiNum: this.search.batchCondition === 1 ? 1 : 3
            }
            this.alertObj.revise = true
          }
          break
        case 'groupPassBatch':
          if (this.search.batchCondition !== 1 && this.search.batchCondition !== 4) {
            this.resMessage('error', '请先条件选择 \'指定仲裁员\'')
          } else if (this.alertShow.ids.length === 0) {
            this.resMessage('error', '请先选择一个案件')
          } else {
            this.alertObj.groupPassData = {
              state: 1,
              caseId: this.alertShow.ids.join(',')
            }
            this.alertObj.groupPass = true
          }
          break
      }
    },
    alertSave (type) {
      switch (type) {
        case 'groupForm':
          this.formObj.filing = false
          this.formObj.caseId = null
          this.pageObj.pageNum = 1
          this.resCaseList()
          break
        case 'groupPass':
          this.alertObj.groupPass = false
          this.alertObj.groupPassData = null
          this.resSearchList()
          break
        case 'resPass':
          this.alertObj.pass = false
          this.alertObj.passData = null
          this.pageObj.pageNum = 1
          this.resCaseList()
          break
        case 'resRevise':
          this.alertObj.revise = false
          this.alertObj.reviseData = null
          this.resSearchList()
          break
      }
    },
    alertCanc (type) {
      if (type === 'resRevise') {
        this.alertObj.revise = false
        this.alertObj.reviseData = null
      } else if (type === 'pass') {
        this.alertObj.pass = false
        this.alertObj.passData = null
      } else if (type === 'clearIds') {
        this.alertShow.idsList = []
        this.alertShow.ids = []
        this.caseList.seleMap = {}
      } else if (type === 'groupForm') {
        this.formObj.filing = false
        this.formObj.caseId = null
      } else if (type === 'groupPass') {
        this.alertObj.groupPass = false
        this.alertObj.groupPassData = null
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
    vertical-align: text-top;
  }
}
</style>
