<template>
  <div class="withdrawList">
    <div class="_center pr">
      <spin-comp :spinShow="spinShow"></spin-comp>
      <Row>
        <Col span="2">
          <label class="lh32 f16 fc6 fr mr15">搜索</label>
        </Col>
        <Col span="8">
          <Input v-model="search.text" icon="ios-search" class="_search hand" @on-click="resSearch" @keyup.enter.native="resSearch" placeholder="案号 / 案件编号 / 申请人 / 被申请人 / 代理人 / 年限"></Input>
        </Col>
      </Row>
      <div class="_caseList clearfix">
        <Row>
          <Col span="24" class="pl20 pr20">
            <Table stripe border align="center" :loading="caseList.loading" :columns="caseList.header" :data="caseList.bodyList">
              <template slot-scope="{ row, index }" slot="action">
                <div v-if="!resSetRegExp(row.buttonFlag, 'groupCase')">
                  <Button :style="{display: resBtnDis('WITHDRAW_AGREE')}" class="mr5" type="primary" size="small" v-if="row.buttonFlag === '1'" @click="resAction('withdrawForm', row)">同意撤案</Button>
                  <Button :style="{display: resBtnDis('WITHDRAW_AGREE')}" class="mr5" type="primary" size="small" v-if="row.buttonFlag === '2'" @click="resAction('withdrawForm', row)">重新生成决定书</Button>
                  <Button :style="{display: resBtnDis('WITHDRAW_AGREE')}" class="mr5" type="primary" size="small" v-if="row.buttonFlag === '3'" @click="resAction('seeDocuBook', row)">查看撤案决定书</Button>
                  <Button :style="{display: resBtnDis('WITHDRAW_FILEDETAIL')}" v-if="row.applicationFilePath !== '' && row.applicationFilePath !== null" class="mr5" type="primary" size="small" @click="resAction('seeApplBook', row)">查看撤案申请书</Button>
                </div>
                <div v-else="">
                  <span style="color: #2d8cf0" type="text" size="small">{{row.buttonFlag}}</span>
                </div>
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
    <alert-btn-info :alertShow="formObj.withdraw" @alertConfirm="alertSave('withdrawForm')" @alertCancel="alertCanc('withdrawForm')" alertTitle="提示">
      <p>确定要撤回案件吗？</p>
    </alert-btn-info>
    <alert-withdraw-info v-if="formObj.withdrawInfo" :resCaseId="formObj.caseId" :resDocuType="formObj.withdrawType" @alertConfirm="alertSave('withdrawInfo')" @alertCancel="alertCanc('withdrawInfo')"></alert-withdraw-info>
  </div>
</template>

<script>
import axios from 'axios'
import alertBtnInfo from '@/components/common/alertBtnInfo'
import alertWithdrawInfo from '@/page/arbitratSecr/withdrawList/children/alertWithdrawInfo'
import {resBtn, resPage, resMess} from '@/components/common/mixin.js'
import spinComp from '@/components/common/spin'
import { caseInfo } from '@/config/common.js'
import setRegExp from '@/config/regExp.js'

export default {
  name: 'withdraw_list',
  mixins: [resBtn, resPage, resMess],
  components: { spinComp, alertBtnInfo, alertWithdrawInfo },
  data () {
    return {
      spinShow: true,
      search: {
        text: ''
      },
      caseList: {
        loading: false,
        header: [
          {
            title: '案件编号',
            key: 'id',
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
              }, params.row.id)
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
            title: '申请人',
            key: 'propName',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '被申请人',
            key: 'repoName',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '争议金额(元)',
            key: 'money',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '纠纷类型',
            key: 'disputeType',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '仲裁费(元)',
            key: 'cost',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '案件状态',
            key: 'caseStateDesc',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '操作',
            key: 'id',
            align: 'center',
            minWidth: 120,
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
      formObj: {
        caseId: null,
        withdraw: false,
        withdrawInfo: false,
        withdrawType: null
      }
    }
  },
  created () {
    this.resCaseList()
  },
  methods: {
    resSetRegExp (val, type) {
      return setRegExp(val, type)
    },
    resCaseList () {
      this.spinShow = true
      axios.post('/closeCaseForm/withdrawList', {
        pageIndex: (this.pageObj.pageNum - 1) * this.pageObj.pageSize,
        pageSize: this.pageObj.pageSize,
        keyword: this.search.text
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
      this.pageObj.pageNum = 1
      this.resCaseList()
    },
    reschangePage (page) {
      this.pageObj.pageNum = page
      this.resCaseList()
    },
    resAction (type, data) {
      switch (type) {
        case 'withdrawForm':
          this.formObj.caseId = data.id
          if (data.withdrawType === '1' || data.withdrawType === 1) {
            this.formObj.withdraw = true
          } else if ([4, 5, '4', '5'].indexOf(data.withdrawType) !== -1) {
            this.formObj.withdrawType = data.withdrawType
            this.formObj.withdrawInfo = true
          } else {
            this.formObj.caseId = null
            return false
          }
          break
        case 'seeApplBook':
          window.open(data.applicationFilePath, '_blank')
          break
        case 'seeDocuBook':
          window.open(data.documentFilePath, '_blank')
          break
      }
    },
    alertSave (type) {
      switch (type) {
        case 'withdrawForm':
          axios.post('/case/updateCaseStateByCancel', {
            caseId: this.formObj.caseId
          }).then(res => {
            this.alertCanc('withdrawForm')
            this.resMessage('success', '操作成功')
            this.resCaseList()
          }).catch(e => {
            this.resMessage('error', '错误信息:' + e + ' 稍后再试')
          })
          break
        case 'withdrawInfo':
          this.formObj.withdrawInfo = false
          this.formObj.withdrawType = null
          this.formObj.caseId = null
          this.resCaseList()
          break
      }
    },
    alertCanc (type) {
      switch (type) {
        case 'withdrawForm':
          this.formObj.withdraw = false
          this.formObj.caseId = null
          break
        case 'withdrawInfo':
          this.formObj.withdrawInfo = false
          this.formObj.withdrawType = null
          this.formObj.caseId = null
          break
      }
    },
    goCaseInfo (index) {
      let obj = {}
      obj.caseId = this.caseList.bodyList[index].id
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
</style>
