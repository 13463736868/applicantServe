<template>
  <div class="groupAudit">
    <div class="_center pr">
      <spin-comp :spinShow="spinShow"></spin-comp>
      <Row class="pb20">
        <Col span="19">
          &nbsp;
        </Col>
        <Col span="2">
          <Button type="primary" @click="resFind" :style="{display: resBtnDis('GROUPAUDIT_QUERY')}">条件搜索</Button>
        </Col>
        <Col span="3">
          <Button type="primary" @click="resBatch" :style="{display: resBtnDis('GROUPAUDIT_BATCHEAPP')}">批量指定仲裁员</Button>
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
    <alert-btn-info :alertShow="alertShow.agre" @alertConfirm="agreSave" @alertCancel="alertCanc('agre')" alertTitle="操作">
      <div class="pb10">
        <Row class="mb5">
          <Col span="3" offset="1">
            <label class="lh25 f12 fb fl mr15">搜 索 :</label>
          </Col>
          <Col span="8">
            <Input :maxlength="15" size="small" v-model.trim="searchText" icon="md-search" placeholder=""></Input>
          </Col>
        </Row>
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
    <group-Appr-form v-if="formObj.filing" :caseId="formObj.caseId" @alertConfirm="alertSave('groupForm')" @alertCancel="alertCanc('groupForm')"></group-Appr-form>
    <group-pass-alert v-if="alertObj.groupPass" :resCaseId="alertObj.caseId" :resState="alertObj.state" @alertConfirm="alertSave('groupPass')" @alertCancel="alertCanc('groupPass')"></group-pass-alert>
  </div>
</template>

<script>
import axios from 'axios'
import {resBtn} from '@/components/common/mixin.js'
import spinComp from '@/components/common/spin'
import alertBtnInfo from '@/components/common/alertBtnInfo'
import groupApprForm from '@/page/comm/apprForm/groupApprForm'
import groupPassAlert from '@/page/arbitratComm/groupAudit/children/groupPassAlert'
import { caseInfo } from '@/config/common.js'

export default {
  name: 'group_audit',
  mixins: [resBtn],
  components: { spinComp, alertBtnInfo, groupApprForm, groupPassAlert },
  data () {
    return {
      spinShow: false,
      search: {
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
            render: (h, params) => {
              return this.renderCheckS(h, params)
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
        passId: null,
        assignRest: false,
        editArbi: false,
        idsList: [],
        ids: [],
        state: [],
        idsType: '',
        find: false
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
            title: '擅长领域',
            key: 'sign',
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
      },
      searchText: '',
      formObj: {
        caseId: null,
        filing: false
      },
      alertObj: {
        groupPass: false,
        caseId: null,
        state: null
      }
    }
  },
  created () {
    this.resCaseList()
    this.$watch('searchText', this.debounce(this.resSearch, 1000))
  },
  computed: {
    seleShow () {
      if (this.alertShow.infoMoney === null) {
        return false
      } else if (this.alertShow.infoMoney === 1) {
        return false
      } else if (this.alertShow.infoMoney === 3) {
        return true
      } else {
        return false
      }
    }
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
              display: this.resBtnDis('GROUPAUDIT_APPARBITRATORS')
            },
            on: {
              click: () => {
                this.resAssign(params.index)
              }
            }
          }, '指定仲裁员'),
          h('Button', {
            props: {
              type: 'primary',
              size: 'small'
            },
            style: {
              marginRight: '5px',
              display: this.resBtnDis('GROUPAUDIT_APPROVAL')
            },
            on: {
              click: () => {
                this.resAction('groupForm', params.row)
              }
            }
          }, '组庭审批表')
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
                display: this.resBtnDis('GROUPAUDIT_PASS')
              },
              on: {
                click: () => {
                  this.resPass(params.index)
                }
              }
            }, '通过')
          ])
        } else if (_obj.passFlag === 3) {
          return h('div', [
            h('Button', {
              props: {
                type: 'primary',
                size: 'small'
              },
              style: {
                display: this.resBtnDis('GROUPAUDIT_REAPPOINTMENT')
              },
              on: {
                click: () => {
                  this.resAssignRest(params.index)
                }
              }
            }, '重新指定仲裁员'),
            h('Button', {
              props: {
                type: 'primary',
                size: 'small'
              },
              style: {
                marginRight: '5px',
                display: this.resBtnDis('GROUPAUDIT_APPROVAL')
              },
              on: {
                click: () => {
                  this.resAction('groupForm', params.row)
                }
              }
            }, '组庭审批表')
          ])
        } else if (_obj.passFlag === 4) {
          return h('div', [
            h('Button', {
              props: {
                type: 'primary',
                size: 'small'
              },
              style: {
                display: this.resBtnDis('GROUPAUDIT_EDITARBITRATOR')
              },
              on: {
                click: () => {
                  this.resEditArbi(params.index)
                }
              }
            }, '修改仲裁员'),
            h('Button', {
              props: {
                type: 'primary',
                size: 'small'
              },
              style: {
                marginRight: '5px',
                display: this.resBtnDis('GROUPAUDIT_AGREE')
              },
              on: {
                click: () => {
                  this.resAction('groupPass', params.row)
                }
              }
            }, '同意')
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
        pageSize: this.pageObj.pageSize,
        registerToken: this.search.requestName,
        caseTypeCode: this.search.caseType,
        groupApproveType: 'arbitrationCommission'
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
    debounce (fn, idle) {
      let setTm
      if (!idle || idle <= 0) return fn
      return () => {
        clearTimeout(setTm)
        setTm = setTimeout(fn.bind(this, ...arguments), idle)
      }
    },
    resSearchList () {
      this.search.requestName = ''
      this.search.caseType = ''
      this.alertCanc('clearIds')
      this.pageObj.pageNum = 1
      this.resCaseList()
    },
    resSearch () {
      this.selePageObj.pageNum = 1
      this.resUserList()
    },
    resEditArbi (index) {
      this.alertShow.editArbi = true
      this.resAssign(index)
    },
    resAssignRest (index) {
      this.alertShow.assignRest = true
      this.resAssign(index)
    },
    resAssign (index) {
      this.selePageObj.pageNum = 1
      this.alertShow.agre = true
      if (this.alertShow.idsType === '') {
        this.alertShow.tribId = this.caseList.bodyList[index].tribunalRequestId
        this.alertShow.caseId = this.caseList.bodyList[index].id
        this.alertShow.infoMoney = this.caseList.bodyList[index].arbitratorIdNum
        this.seleArr = this.seleShow === true ? ['', '', ''] : ['']
        this.seleArrName = this.seleShow === true ? ['', '', ''] : ['']
      } else {
        this.alertShow.infoMoney = this.alertShow.state[0]
        this.seleArr = this.seleShow === true ? ['', '', ''] : ['']
        this.seleArrName = this.seleShow === true ? ['', '', ''] : ['']
      }
      this.resUserList()
    },
    resUserList () {
      axios.post('/clientRequest/findUsersList', {
        pageIndex: (this.selePageObj.pageNum - 1) * this.selePageObj.pageSize,
        pageSize: this.selePageObj.pageSize,
        roleName: 'arbitrator',
        keyword: this.searchText
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
            content: '请选择第 ' + (k - 0 + 1) + ' 位仲裁员后再点击确定',
            duration: 5
          })
          return false
        }
      }
      if (this.alertShow.assignRest) {
        this.alertShow.agre = false
        axios.post('/approve/updateArbitrator', {
          caseId: this.alertShow.caseId,
          arbitratorIds: this.seleArr.join(',')
        }).then(res => {
          this.selePageObj.pageNum = 1
          this.alertCanc('agre')
          this.$Message.success({
            content: '操作成功',
            duration: 2
          })
          this.resSearchList()
        }).catch(e => {
          this.alertCanc('agre')
          this.$Message.error({
            content: '错误信息:' + e + ' 稍后再试',
            duration: 5
          })
        })
      } else if (this.alertShow.editArbi) {
        this.alertShow.agre = false
        axios.post('/approve/confirmArbitrator', {
          caseId: this.alertShow.caseId,
          arbitratorIds: this.seleArr.join(',')
        }).then(res => {
          this.selePageObj.pageNum = 1
          this.alertCanc('agre')
          this.$Message.success({
            content: '操作成功',
            duration: 2
          })
          this.resSearchList()
        }).catch(e => {
          this.alertCanc('agre')
          this.$Message.error({
            content: '错误信息:' + e + ' 稍后再试',
            duration: 5
          })
        })
      } else {
        if (this.alertShow.idsType === '') {
          this.alertShow.agre = false
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
            this.resSearchList()
          }).catch(e => {
            this.alertCanc('agre')
            this.$Message.error({
              content: '错误信息:' + e + ' 稍后再试',
              duration: 5
            })
          })
        } else {
          this.alertShow.agre = false
          axios.post('/batchGroupCourt/updateChooseArbitratorBatch', {
            caseTribunalRequest: JSON.stringify(this.alertShow.idsList),
            arbitratorIds: this.seleArr.join(',')
          }).then(res => {
            this.selePageObj.pageNum = 1
            this.alertCanc('agre')
            this.$Message.success({
              content: res.data.data,
              duration: 2
            })
            this.resSearchList()
          }).catch(e => {
            this.alertCanc('agre')
            this.$Message.error({
              content: '错误信息:' + e + ' 稍后再试',
              duration: 5
            })
          })
        }
      }
    },
    resPass (index) {
      this.alertShow.pass = true
      this.alertShow.tribId = this.caseList.bodyList[index].tribunalRequestId
      this.alertShow.caseId = this.caseList.bodyList[index].id
      this.alertShow.passId = this.caseList.bodyList[index].approverId
    },
    passSave () {
      this.alertShow.pass = false
      axios.post('/approve/updateGroupApproveToArbitrator', {
        caseId: this.alertShow.caseId,
        tribunalRequestId: this.alertShow.tribId,
        arbitratorIds: this.alertShow.passId
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
    renderCheckS (h, params) {
      let _obj = params.row
      if (_obj.approverId === null || _obj.approverId === '') {
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
                  this.seleArrChangeS(params.index, true)
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
                  this.seleArrChangeS(params.index, false)
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
    seleArrChangeS (index, bool) {
      let info = this.caseList.bodyList[index]
      if (bool) {
        if (this.alertShow.state.length === 0) {
          if (this.alertShow.ids.indexOf(info.id) === -1) {
            if (this.alertShow.ids.length >= 10) {
              this.$Message.error({
                content: '最多只能选择十个案件',
                duration: 5
              })
              return false
            } else {
              if (this.alertShow.state.length === 0) {
                this.alertShow.state.push(info.arbitratorIdNum)
              }
              let _o = {}
              _o.caseId = info.id
              _o.tribunalRequestId = info.tribunalRequestId
              _o.arbitratorIdNum = info.arbitratorIdNum
              this.alertShow.idsList.push(_o)
              this.alertShow.ids.push(info.id)
            }
          }
        } else if (this.alertShow.state.length === 1) {
          if (this.alertShow.state[0] === 1) {
            if (info.arbitratorIdNum === 1) {
              if (this.alertShow.ids.indexOf(info.id) === -1) {
                if (this.alertShow.ids.length >= 10) {
                  this.$Message.error({
                    content: '最多只能选择十个案件',
                    duration: 5
                  })
                  return false
                } else {
                  if (this.alertShow.state.length === 0) {
                    this.alertShow.state.push(info.arbitratorIdNum)
                  }
                  let _o = {}
                  _o.caseId = info.id
                  _o.tribunalRequestId = info.tribunalRequestId
                  _o.arbitratorIdNum = info.arbitratorIdNum
                  this.alertShow.idsList.push(_o)
                  this.alertShow.ids.push(info.id)
                }
              }
            } else {
              this.$Message.error({
                content: '不能同时指定仲裁员数不一的致案件',
                duration: 5
              })
              return false
            }
          } else if (this.alertShow.state[0] === 3) {
            if (info.arbitratorIdNum === 3) {
              if (this.alertShow.ids.indexOf(info.id) === -1) {
                if (this.alertShow.ids.length >= 10) {
                  this.$Message.error({
                    content: '最多只能选择十个案件',
                    duration: 5
                  })
                  return false
                } else {
                  if (this.alertShow.state.length === 0) {
                    this.alertShow.state.push(info.arbitratorIdNum)
                  }
                  let _o = {}
                  _o.caseId = info.id
                  _o.tribunalRequestId = info.tribunalRequestId
                  _o.arbitratorIdNum = info.arbitratorIdNum
                  this.alertShow.idsList.push(_o)
                  this.alertShow.ids.push(info.id)
                }
              }
            } else {
              this.$Message.error({
                content: '不能同时指定仲裁员数不一的致案件',
                duration: 5
              })
              return false
            }
          }
        } else {
          this.$Message.error({
            content: '错误信息:请刷新后重试',
            duration: 5
          })
          return false
        }
      } else {
        if (this.alertShow.ids.indexOf(info.id) !== -1) {
          this.alertShow.idsList.splice(this.alertShow.ids.indexOf(info.id), 1)
          this.alertShow.ids.splice(this.alertShow.ids.indexOf(info.id), 1)
          if (this.alertShow.ids.length === 0) {
            this.alertShow.state = []
          }
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
        this.alertShow.idsType = 'ids'
        this.resAssign('')
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
    resAction (type, data) {
      switch (type) {
        case 'groupForm':
          this.formObj.caseId = data.id
          this.formObj.filing = true
          break
        case 'groupPass':
          this.alertObj.state = 1
          this.alertObj.caseId = data.id
          this.alertObj.groupPass = true
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
          this.alertObj.caseId = null
          this.alertObj.state = null
          this.pageObj.pageNum = 1
          this.resCaseList()
          break
      }
    },
    alertCanc (type) {
      if (type === 'agre') {
        this.alertShow.agre = false
        this.alertShow.tribId = null
        this.alertShow.caseId = null
        this.alertShow.infoMoney = null
        this.seleArr = []
        this.seleArrName = []
        this.searchText = ''
        this.alertShow.assignRest = false
        this.alertShow.editArbi = false
        this.alertShow.idsType = ''
      } else if (type === 'pass') {
        this.alertShow.pass = false
        this.alertShow.tribId = null
        this.alertShow.caseId = null
        this.alertShow.passId = null
      } else if (type === 'find') {
        this.alertShow.find = false
        this.search.requestName = ''
        this.search.caseType = ''
        // this.search.caseTypeList = {}
        // this.search.requestNameList = []
      } else if (type === 'clearIds') {
        this.alertShow.idsList = []
        this.alertShow.ids = []
        this.alertShow.state = []
      } else if (type === 'groupForm') {
        this.formObj.filing = false
        this.formObj.caseId = null
      } else if (type === 'groupPass') {
        this.alertObj.groupPass = false
        this.alertObj.caseId = null
        this.alertObj.state = null
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
