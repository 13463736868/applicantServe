<template>
  <div class="withdrawList">
    <div class="_center pr">
      <spin-comp :spinShow="spinShow"></spin-comp>
      <Row>
        <Col span="2">
          <label class="lh32 f16 fc6 fr mr15">搜索</label>
        </Col>
        <Col span="6">
          <Input v-model="search.text" icon="ios-search" class="_search hand" @on-click="resSearch" @keyup.enter.native="resSearch" placeholder="案号 / 案件编号 / 申请人 / 被申请人 / 代理人 / 年限"></Input>
        </Col>
        <Col span="2">
          <label class="lh32 f16 fc6 fr mr15">条件选择</label>
        </Col>
        <Col span="3">
          <Select v-model="search.batchCondition" @on-change="resSearch">
            <Option v-if="usersInfo.roleCode === 'ROLE_LAMS'" value="all" key="all">全部</Option>
            <Option v-if="usersInfo.roleCode === 'ROLE_LAMS'" value="1" key="1">待撤回 (未立案案件)</Option>
            <Option v-if="usersInfo.roleCode === 'ROLE_LAMS'" value="4" key="4">待撤回 (已立案未组庭案件)</Option>
            <Option v-if="usersInfo.roleCode === 'ROLE_BAMS'" value="5" key="5">待撤回 (已组庭案件)</Option>
          </Select>
        </Col>
        <Col span="11">
          <div class="tr pr20">
            <Button class="ml20" type="primary" @click="resAction('resBatchAgree', null)" :style="{display: resBtnDis('WITHDRAW_AGREEBATCH')}">批量同意撤案</Button>
          </div>
        </Col>
      </Row>
      <div class="_caseList clearfix">
        <Row>
          <Col span="24" class="pl20 pr20">
            <Table stripe border align="center" :loading="caseList.loading" :columns="caseList.header" :data="caseList.bodyList">
              <template slot-scope="{ row, index }" slot="action">
                <Button :style="{display: resBtnDis('WITHDRAW_AGREE')}" class="mr5" type="primary" size="small" v-if="row.buttonFlag === true" @click="resAction('withdrawForm', row)">同意撤案</Button>
                <Button :style="{display: resBtnDis('WITHDRAW_FILEDETAIL')}" class="mr5" type="primary" size="small" @click="resAction('seeForm', row)">查看撤案申请书</Button>
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
    <alert-btn-info :alertShow="formObj.withdraw" @alertConfirm="alertSave('withdrawForm')" @alertCancel="alertCanc('withdrawForm')" alertTitle="提示">
      <p>确定要撤回案件吗？</p>
    </alert-btn-info>
    <alert-withdraw-info v-if="formObj.withdrawInfo" :resCaseId="formObj.caseId" :resDocuType="formObj.withdrawType" @alertConfirm="alertSave('withdrawInfo')" @alertCancel="alertCanc('withdrawInfo')"></alert-withdraw-info>
  </div>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
import alertBtnInfo from '@/components/common/alertBtnInfo'
import alertWithdrawInfo from '@/page/arbitratSecr/withdrawList/children/alertWithdrawInfo'
import {resBtn, resMess} from '@/components/common/mixin.js'
import spinComp from '@/components/common/spin'
import { caseInfo } from '@/config/common.js'

export default {
  name: 'withdraw-list',
  mixins: [resBtn, resMess],
  components: { spinComp, alertBtnInfo, alertWithdrawInfo },
  data () {
    return {
      spinShow: true,
      search: {
        text: '',
        batchCondition: 'all'
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
            title: '案由',
            key: 'disputeType',
            tooltip: 'true',
            align: 'center'
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
            title: '争议金额',
            key: 'money',
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
            key: 'caseState',
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
        bodyList: [],
        seleMap: {}
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
      },
      alertShow: {
        ids: []
      }
    }
  },
  created () {
    this.resCaseList()
    if (this.usersInfo) {
      this.search.batchCondition = this.usersInfo.roleCode === 'ROLE_BAMS' ? '5' : 'all'
    }
  },
  computed: {
    ...mapGetters([
      'usersInfo'
    ])
  },
  methods: {
    resCaseList () {
      this.spinShow = true
      axios.post('/closeCaseForm/withdrawList', {
        pageIndex: (this.pageObj.pageNum - 1) * this.pageObj.pageSize,
        pageSize: this.pageObj.pageSize,
        keyword: this.search.text,
        batchCondition: this.search.batchCondition === 'all' ? '' : this.search.batchCondition
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
      this.alertShow.ids = []
      this.caseList.seleMap = {}
      this.pageObj.pageNum = 1
      this.resCaseList()
    },
    reschangePage (page) {
      this.pageObj.pageNum = page
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
        let _obj = item
        if (this.search.batchCondition !== 'all' && _obj.buttonFlag) {
          this.seleArrChange(item, this.caseList.seleMap[this.pageObj.pageNum])
        }
      })
    },
    renderCheck (h, params) {
      let _obj = params.row
      if (this.search.batchCondition !== 'all' && _obj.buttonFlag) {
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
                  this.seleArrChange(_obj, true)
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
                  this.seleArrChange(_obj, false)
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
            this.alertShow.ids.push(info.id)
          }
        }
      } else {
        if (this.alertShow.ids.indexOf(info.id) !== -1) {
          this.alertShow.ids.splice(this.alertShow.ids.indexOf(info.id), 1)
        }
      }
    },
    resAction (type, data) {
      switch (type) {
        case 'withdrawForm':
          if (data.withdrawType === '1') {
            this.formObj.caseId = [data.id]
            this.formObj.withdraw = true
          } else if (data.withdrawType === '5' || data.withdrawType === '4') {
            this.formObj.caseId = [data.id]
            this.formObj.withdrawType = data.withdrawType
            this.formObj.withdrawInfo = true
          }
          break
        case 'seeForm':
          axios.post('/case/findWithdrawDocument', {
            caseId: data.id
          }).then(res => {
            window.open(res.data.data, '_blank')
          }).catch(e => {
            this.$Message.error({
              content: '错误信息:' + e + ' 稍后再试',
              duration: 5
            })
          })
          break
        case 'resBatchAgree':
          if (this.search.batchCondition === 'all') {
            this.resMessage('error', '请先条件选择 \'待撤回\'')
          } else if (this.alertShow.ids.length === 0) {
            this.resMessage('error', '请先选择一个案件')
          } else {
            if (this.search.batchCondition === '1') {
              this.formObj.caseId = this.alertShow.ids
              this.formObj.withdraw = true
            } else if (this.search.batchCondition === '5' || this.search.batchCondition === '4') {
              this.formObj.caseId = this.alertShow.ids
              this.formObj.withdrawType = this.search.batchCondition
              this.formObj.withdrawInfo = true
            }
          }
          break
      }
    },
    alertSave (type) {
      switch (type) {
        case 'withdrawForm':
          axios.post('/case/updateCaseStateByCancel', {
            caseId: this.formObj.caseId.join(',')
          }).then(res => {
            this.alertCanc('withdrawForm')
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
          break
        case 'withdrawInfo':
          this.formObj.withdrawInfo = false
          this.formObj.withdrawType = null
          this.formObj.caseId = null
          this.resSearch()
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
