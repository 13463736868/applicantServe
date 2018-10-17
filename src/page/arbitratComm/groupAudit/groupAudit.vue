<template>
  <div class="groupAudit">
    <head-top :isRegister="true">
      <span class="f36 fcf">组庭审核</span>
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
    <alert-btn-info :alertShow="alertShow.agre" @alertConfirm="agreSave" @alertCancel="alertCanc('agre')" alertTitle="操作">
      <div class="pb10">
        <Row>
          <Col span="20" offset="1">
            <span><b>主 裁： </b></span>
            <span v-if="seleArrName[0] !== ''"><span class="ml5" v-text="seleArrName[0]"></span><Icon @click="resSeleDel(0)" class="ml5 hand" color="#ed3f14" type="md-close"></Icon></span>
          </Col>
        </Row>
        <Row v-if="seleShow">
          <Col span="20" offset="1">
            <span><b>边 裁：</b></span>
            <span v-if="seleArrName[1] !== ''"><span class="ml5" v-text="seleArrName[1]"></span><Icon @click="resSeleDel(1)" class="ml5 hand" color="#ed3f14" type="md-close"></Icon></span>
          </Col>
          <Col span="20" offset="1">
            <span><b>边 裁：</b></span>
            <span v-if="seleArrName[2] !== ''"><span class="ml5" v-text="seleArrName[2]"></span><Icon @click="resSeleDel(2)" class="ml5 hand" color="#ed3f14" type="md-close"></Icon></span>
          </Col>
        </Row>
      </div>
      <Row>
        <Col span="24" class="pl20 pr20">
          <Table stripe align="center" :loading="seleList.loading" :columns="seleList.header" :data="seleList.bodyList"></Table>
        </Col>
      </Row>
      <Row>
        <Col span="12" offset="6" class="tc pt10">
          <Page simple :total="selePageObj.total" :current="selePageObj.pageNum" :page-size="selePageObj.pageSize" show-total @on-change="resChanPage"></Page>
        </Col>
      </Row>
    </alert-btn-info>
    <alert-btn-info :alertShow="alertShow.pass" @alertConfirm="passSave" @alertCancel="alertCanc('pass')" alertTitle="操作">
      <p>确定要通过吗？</p>
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
  name: 'group_audit',
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
            title: '申请人仲裁员',
            key: 'applicantApprove',
            align: 'center'
          },
          {
            title: '被申请人',
            key: 'respondentName',
            align: 'center'
          },
          {
            title: '被申请人仲裁员',
            key: 'respondentApprove',
            align: 'center'
          },
          {
            title: '最终仲裁员',
            key: 'approver',
            align: 'center'
          },
          {
            title: '开庭时间',
            key: 'beginTime',
            align: 'center'
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
        agre: false,
        tribId: null,
        caseId: null,
        infoMoney: null,
        pass: false,
        passId: null
      },
      seleList: {
        loading: false,
        header: [
          {
            title: '名称',
            key: 'name',
            align: 'center'
          },
          {
            title: '邮箱',
            key: 'email',
            align: 'center'
          },
          {
            title: '操作',
            key: 'id',
            align: 'center',
            render: (h, params) => {
              return this.renderCheck(h, params)
            }
          }
        ],
        bodyList: []
      },
      seleArr: [],
      seleArrName: [],
      selePageObj: {
        total: 0,
        pageNum: 1,
        pageSize: 5
      }
    }
  },
  created () {
    this.resCaseList()
  },
  computed: {
    seleShow () {
      if (this.alertShow.infoMoney === null) {
        return false
      } else if (this.alertShow.infoMoney < 1000000) {
        return false
      } else if (this.alertShow.infoMoney >= 1000000) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    renderCheck (h, params) {
      let _id = params.row.id
      if (this.seleArr.indexOf(_id) === -1) {
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
    renderBtn (h, params) {
      let _obj = params.row
      if (_obj.approverId === null || _obj.approverId === '') {
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
                this.resAssign(params.index)
              }
            }
          }, '指定仲裁员')
        ])
      } else {
        if (_obj.passFlag === 2) {
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
                  this.resPass(params.index)
                }
              }
            }, '通过')
          ])
        } else {
          return h('div', [
          ])
        }
      }
    },
    resCaseList () {
      this.spinShow = true
      axios.post('/approve/findGroupApproveList', {
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
    resAssign (index) {
      this.alertShow.agre = true
      this.alertShow.tribId = this.caseList.bodyList[index].tribunalRequestId
      this.alertShow.caseId = this.caseList.bodyList[index].id
      this.alertShow.infoMoney = this.caseList.bodyList[index].money
      this.seleArr = this.seleShow === true ? ['', '', ''] : ['']
      this.seleArrName = this.seleShow === true ? ['', '', ''] : ['']
      this.resUserList()
    },
    resUserList () {
      axios.post('/clientRequest/findUsersList', {
        pageIndex: (this.selePageObj.pageNum - 1) * this.selePageObj.pageSize,
        pageSize: this.selePageObj.pageSize,
        roleName: 'arbitrator'
      }).then(res => {
        this.seleList.bodyList = res.data.data.dataList === null ? [] : res.data.data.dataList
        this.selePageObj.total = res.data.data.totalCount
      }).catch(e => {
        this.$Message.error({
          content: '错误信息:' + e + ' 稍后再试',
          duration: 5
        })
      })
    },
    resChanPage (page) {
      this.selePageObj.pageNum = page
      this.resUserList()
    },
    seleArrChange (index, bool) {
      let _id = this.seleList.bodyList[index].id
      let _name = this.seleList.bodyList[index].name
      let _userNum = this.seleShow === true ? '三' : '一'
      if (bool) {
        if (this.seleArr.indexOf(_id) === -1) {
          let _t = false
          for (let k in this.seleArr) {
            if (this.seleArr[k] === '') {
              this.seleArr[k] = _id
              this.seleArrName[k] = _name
              this.seleArr.splice(k, 0)
              this.seleArrName.splice(k, 0)
              _t = true
              break
            }
          }
          if (!_t) {
            this.$Message.error({
              content: '仲裁员最多只能选择' + _userNum + '位！',
              duration: 5
            })
          }
        }
      } else {
        if (this.seleArr.indexOf(_id) !== -1) {
          this.seleArrName.splice(this.seleArr.indexOf(_id), 1, '')
          this.seleArr.splice(this.seleArr.indexOf(_id), 1, '')
        }
      }
    },
    resSeleDel (num) {
      this.seleArr[num] = ''
      this.seleArrName[num] = ''
      this.resUserList()
    },
    agreSave () {
      for (let k in this.seleArr) {
        if (this.seleArr[k] === '') {
          this.$Message.error({
            content: '请选择仲裁员后再点击确定',
            duration: 5
          })
          return false
        }
      }
      axios.post('/approve/updateGroupApproveToArbitrator', {
        caseId: this.alertShow.caseId,
        tribunalRequestId: this.alertShow.tribId,
        arbitratorIds: this.seleArr.join(',')
      }).then(res => {
        this.selePageObj.pageNum = 1
        this.alertCanc('agre')
        this.$Message.success({
          content: '操作成功',
          duration: 2
        })
        this.resCaseList()
      }).catch(e => {
        this.alertCanc('agre')
        this.$Message.error({
          content: '错误信息:' + e + ' 稍后再试',
          duration: 5
        })
      })
    },
    resPass (index) {
      this.alertShow.pass = true
      this.alertShow.tribId = this.caseList.bodyList[index].tribunalRequestId
      this.alertShow.caseId = this.caseList.bodyList[index].id
      this.alertShow.passId = this.caseList.bodyList[index].approverId
    },
    passSave () {
      axios.post('/approve/updateGroupApproveToArbitrator', {
        caseId: this.alertShow.caseId,
        tribunalRequestId: this.alertShow.tribId,
        arbitratorIds: this.passId
      }).then(res => {
        this.alertCanc('pass')
        this.$Message.success({
          content: '操作成功',
          duration: 2
        })
      }).catch(e => {
        this.alertCanc('pass')
        this.$Message.error({
          content: '错误信息:' + e + ' 稍后再试',
          duration: 5
        })
      })
    },
    alertCanc (type) {
      if (type === 'agre') {
        this.alertShow.agre = false
        this.alertShow.tribId = null
        this.alertShow.caseId = null
        this.alertShow.infoMoney = null
        this.seleArr = []
        this.seleArrName = []
      } else if (type === 'pass') {
        this.alertShow.pass = false
        this.alertShow.tribId = null
        this.alertShow.caseId = null
        this.alertShow.passId = null
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
</style>
