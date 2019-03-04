<template>
  <div class="groupCase">
    <head-top :isRegister="true">
      <span class="f36 fcf">组庭案件</span>
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
        <Col span="2" offset="10">
          <Button type="primary" @click="resFind">条件搜索</Button>
        </Col>
        <Col span="2">
          <Button type="primary" @click="resEnds">批量结案</Button>
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
    <create-docu :alertShow="alertShow.canc" @alertConfirm="docuSave('canc')" @alertSee="seeDocu('canc')" @alertCancel="alertCanc('canc')" alertTitle="操作">
      <Row class="_labelFor">
        <Col span="6" offset="1">
          <p><span class="_span">*</span><b>合同名称：</b></p>
        </Col>
        <Col span="16">
          <Input v-model="alertShow.contractName"></Input>
        </Col>
      </Row>
    </create-docu>
    <create-docu :alertShow="alertShow.end" @alertConfirm="docuSave('end')" @alertSee="seeDocu('end')" @alertCancel="alertCanc('end')" alertTitle="操作">
      <Row class="_labelFor">
        <Col span="6" offset="1">
          <p><span class="_span">*</span><b>文书类型：</b></p>
        </Col>
        <Col span="16">
          <RadioGroup v-model="alertShow.docuType" @on-change="alertCanc('docuType')">
            <Radio :label="1">裁决书</Radio>
            <Radio :label="2">调解书</Radio>
          </RadioGroup>
        </Col>
      </Row>
      <div v-if="alertShow.docuType === 1">
        <Row class="_labelFor">
          <Col span="6" offset="1">
            <p><span class="_span">*</span><b>合同名称：</b></p>
          </Col>
          <Col span="16">
            <Input v-model="alertShow.contractName"></Input>
          </Col>
        </Row>
        <Row class="_labelFor">
          <Col span="6" offset="1">
            <p><span class="_span">*</span><b>合同约定情况：</b></p>
          </Col>
          <Col span="16">
            <Input v-model="alertShow.contractualStipulation"></Input>
          </Col>
        </Row>
        <Row class="_labelFor">
          <Col span="6" offset="1">
            <p><span class="_span">*</span><b>合同履行情况：</b></p>
          </Col>
          <Col span="16">
            <Input v-model="alertShow.contractPerformance"></Input>
          </Col>
        </Row>
        <Row class="_labelFor">
          <Col span="6" offset="1">
            <p><span class="_span">*</span><b>需要还款本金：</b></p>
          </Col>
          <Col span="16">
            <Input v-model="alertShow.repaymentPrincipal"></Input>
          </Col>
        </Row>
        <Row class="_labelFor">
          <Col span="6" offset="1">
            <p><span class="_span">*</span><b>还款基数：</b></p>
          </Col>
          <Col span="16">
            <Input v-model="alertShow.repaymentBase"></Input>
          </Col>
        </Row>
        <Row class="_labelFor">
          <Col span="6" offset="1">
            <p><span class="_span">*</span><b>年利率：</b></p>
          </Col>
          <Col span="16">
            <Input v-model="alertShow.annualRate"></Input>
          </Col>
        </Row>
        <Row class="_labelFor">
          <Col span="6" offset="1">
            <p><span class="_span">*</span><b title="关于利息及逾期利息的计算">利息计算：</b></p>
          </Col>
          <Col span="16">
            <Input v-model="alertShow.interestCalculation"></Input>
          </Col>
        </Row>
      </div>
      <div v-else-if="alertShow.docuType === 2">
        <Row class="_labelFor">
          <Col span="6" offset="1">
            <p><span class="_span">*</span><b>合同名称：</b></p>
          </Col>
          <Col span="16">
            <Input v-model="alertShow.contractName"></Input>
          </Col>
        </Row>
        <Row class="_labelFor">
          <Col span="6" offset="1">
            <p><span class="_span">*</span><b title="自愿达成协议内容">协议内容：</b></p>
          </Col>
          <Col span="16">
            <Input v-model="alertShow.agreementContent"></Input>
          </Col>
        </Row>
      </div>
    </create-docu>
    <create-docu :alertShow="alertShow.reve" @alertConfirm="docuSave('reve')" @alertSee="seeDocu('reve')" @alertCancel="alertCanc('reve')" alertTitle="操作">
      <Row class="_labelFor">
        <Col span="6" offset="1">
          <p><span class="_span">*</span><b>合同名称：</b></p>
        </Col>
        <Col span="16">
          <Input v-model="alertShow.contractName"></Input>
        </Col>
      </Row>
    </create-docu>
    <create-docu :alertShow="alertShow.addE" @alertConfirm="docuSave('addE')" @alertSee="seeDocu('addE')" @alertCancel="alertCanc('addE')" alertTitle="操作">
      <Row class="_labelFor">
        <Col span="6" offset="1">
          <p><span class="_span">*</span><b>裁决书第几页：</b></p>
        </Col>
        <Col span="16">
          <Input v-model="alertShow.pageNum"></Input>
        </Col>
      </Row>
      <Row class="_labelFor">
        <Col span="6" offset="1">
          <p><span class="_span">*</span><b>裁决书第几行：</b></p>
        </Col>
        <Col span="16">
          <Input v-model="alertShow.lineNum"></Input>
        </Col>
      </Row>
      <Row class="_labelFor">
        <Col span="6" offset="1">
          <p><span class="_span">*</span><b>更改之前内容：</b></p>
        </Col>
        <Col span="16">
          <Input v-model="alertShow.oldContent"></Input>
        </Col>
      </Row>
      <Row class="_labelFor">
        <Col span="6" offset="1">
          <p><span class="_span">*</span><b>更改之后内容：</b></p>
        </Col>
        <Col span="16">
          <Input v-model="alertShow.newContent"></Input>
        </Col>
      </Row>
    </create-docu>
    <alert-btn-info :alertShow="alertShow.reas" :isSaveBtn="true" @alertCancel="alertCanc('reas')" alertTitle="查看">
      <p class="t2" v-text="alertShow.reasText"></p>
    </alert-btn-info>
    <alert-btn-info :alertShow="alertShow.batch"  @alertConfirm="batchSave" @alertCancel="alertCanc('batch')" alertTitle="操作">
      <p class="t2">确定要批量结案吗？</p>
    </alert-btn-info>
    <div v-if="alertShow.editorDest">
      <alert-editor :alertShow="alertShow.editor" :editorId="alertShow.editorId" :editorValue="alertShow.editorValue" @alertConfirm="editorSave" @alertCancel="alertCanc('editor')" alertTitle="编辑"></alert-editor>
    </div>
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
import createDocu from '@/components/common/createDocu'
import alertBtnInfo from '@/components/common/alertBtnInfo'
import alertEditor from '@/components/common/alertEditor'
import { caseInfo } from '@/config/common.js'
import setRegExp from '@/config/regExp.js'
import regi from '@/config/regiType.js'

export default {
  name: 'group_case',
  components: { headTop, spinComp, createDocu, alertBtnInfo, alertEditor },
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
            key: 'id',
            width: 60,
            align: 'center',
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
            title: '申请人',
            key: 'partyName',
            align: 'center'
          },
          {
            title: '被申请人',
            key: 'defendantName',
            align: 'center'
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
            title: '模版名称',
            key: 'tempName',
            align: 'center'
          },
          {
            title: '开庭时间',
            key: 'beginTime',
            minWidth: 18,
            align: 'center'
          },
          {
            title: '原因',
            key: 'id',
            align: 'center',
            render: (h, params) => {
              return this.reasonBtn(h, params)
            }
          },
          {
            title: '操作',
            key: 'id',
            align: 'center',
            minWidth: 120,
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
        canc: false,
        contractName: '',
        docuType: null,
        userId: null,
        end: false,
        contractualStipulation: '',
        contractPerformance: '',
        repaymentPrincipal: '',
        repaymentBase: '',
        annualRate: '',
        interestCalculation: '',
        agreementContent: '',
        reve: false,
        addE: false,
        pageNum: '',
        lineNum: '',
        oldContent: '',
        newContent: '',
        reasText: '',
        editor: false,
        editorId: null,
        editorDest: false,
        ids: [],
        idsList: [],
        batch: false,
        find: false
      }
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
    reasonBtn (h, params) {
      let _obj = params.row
      if (_obj.correctionsReason === '' || _obj.correctionsReason === null) {
        if (_obj.caseDocumentReason === '' || _obj.caseDocumentReason === null) {
          return h('div', [
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
                  this.seeReasonD(params.index)
                }
              }
            }, '文书驳回原因')
          ])
        }
      } else {
        if (_obj.caseDocumentReason === '' || _obj.caseDocumentReason === null) {
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
                  this.seeReasonC(params.index)
                }
              }
            }, '补正原因')
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
                  this.seeReasonC(params.index)
                }
              }
            }, '补正原因'),
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
                  this.seeReasonD(params.index)
                }
              }
            }, '文书驳回原因')
          ])
        }
      }
    },
    renderBtn (h, params) {
      let _obj = params.row
      if (!setRegExp(_obj.endCasePatten, 'groupCase')) {
        if (_obj.endCasePatten === '1') {
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
                  this.resPassReve(params.index)
                }
              }
            }, '同意撤回')
          ])
        } else if (_obj.endCasePatten === '2') {
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
                  this.resPassReve(params.index)
                }
              }
            }, '重新生成撤回书')
          ])
        } else if (_obj.endCasePatten === '3') {
          return h('div', [
            h('Button', {
              props: {
                type: 'primary',
                size: 'small'
              },
              on: {
                click: () => {
                  this.resAddEvid(params.index)
                }
              }
            }, '生成补正书')
          ])
        } else if (_obj.endCasePatten === '4') {
          return h('div', [
            h('Button', {
              props: {
                type: 'primary',
                size: 'small'
              },
              on: {
                click: () => {
                  this.resAddEvid(params.index)
                }
              }
            }, '重新生成补正书')
          ])
        } else if (_obj.endCasePatten === '5') {
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
                  this.resEndCase(params.index)
                }
              }
            }, '结案'),
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
                  this.resCancCase(params.index)
                }
              }
            }, '撤案'),
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
                  this.goCourtRoom(params.index)
                }
              }
            }, '进入庭室'),
            h('Button', {
              props: {
                type: 'primary',
                size: 'small'
              },
              on: {
                click: () => {
                  this.resRecord(params.index)
                }
              }
            }, '记录')
          ])
        } else if (_obj.endCasePatten === '6') {
          return h('div', [
            h('Button', {
              props: {
                type: 'primary',
                size: 'small'
              },
              on: {
                click: () => {
                  this.resEndCase(params.index)
                }
              }
            }, '重新生成文书')
          ])
        } else if (_obj.endCasePatten === '7') {
          return h('div', [
            h('Button', {
              props: {
                type: 'primary',
                size: 'small'
              },
              on: {
                click: () => {
                  this.resCancCase(params.index)
                }
              }
            }, '重新生成撤案书')
          ])
        } else if (_obj.endCasePatten === '8') {
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
                  this.resCancCase(params.index)
                }
              }
            }, '撤案')
          ])
        } else if (_obj.endCasePatten === '9') {
          return h('div', [
          ])
        } else if (_obj.endCasePatten === '10') {
          return h('div', [
            h('Button', {
              props: {
                type: 'primary',
                size: 'small'
              },
              on: {
                click: () => {
                  this.resEndCase(params.index)
                }
              }
            }, '重新结案')
          ])
        } else {
          return h('div', [
          ])
        }
      } else {
        return h('div', [
          h('span', {
            props: {
              type: 'text',
              size: 'small'
            },
            style: {
              color: '#2d8cf0'
            }
          }, _obj.endCasePatten)
        ])
      }
    },
    resCaseList () {
      this.spinShow = true
      axios.post('/case/findCaseGroupApproveList', {
        pageIndex: (this.pageObj.pageNum - 1) * this.pageObj.pageSize,
        pageSize: this.pageObj.pageSize,
        registerToken: this.search.requestName,
        caseTypeCode: this.search.caseType,
        keyword: this.search.text
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
    goCaseInfo (index) {
      let obj = {}
      obj.caseId = this.caseList.bodyList[index].id
      obj.state = this.caseList.bodyList[index].state
      caseInfo(obj)
    },
    getFormatDate () {
      let date = new Date()
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let strD = date.getDate()
      let hour = date.getHours()
      let minu = date.getMinutes()
      let sec = date.getSeconds()
      let time = ''
      if (month < 10) {
        month = '0' + month
      }
      if (strD < 10) {
        strD = '0' + strD
      }
      if (hour < 10) {
        hour = '0' + hour
      }
      if (minu < 10) {
        minu = '0' + minu
      }
      if (sec < 10) {
        sec = '0' + sec
      }
      time = year + '-' + month + '-' + strD + ' ' + hour + ':' + minu + ':' + sec
      return time
    },
    resRecord (index) {
      let _info = this.caseList.bodyList[index]
      let newTime = this.getFormatDate()
      let newD = newTime.substr(0, 10).split('-').join('')
      let newT = (newTime.substr(11, 2) - 0) * 60 + (newTime.substr(14, 2) - 0)
      let beginTime = _info.beginTime
      let beginD = beginTime.substr(0, 10).split('-').join('')
      let beginT = (beginTime.substr(11, 2) - 0) * 60 + (beginTime.substr(14, 2) - 0)
      if (newD !== beginD) {
        this.$Message.warning({
          content: '只能在开庭前十分钟及开庭后半小时内进入',
          duration: 5
        })
      } else if (beginT - newT > 10 || newT - beginT > 30) {
        this.$Message.warning({
          content: '只能在开庭前十分钟及开庭后半小时内进入',
          duration: 5
        })
      } else {
        this.alertShow.editorDest = true
        this.alertShow.editor = true
        this.alertShow.editorId = _info.id
      }
    },
    goCourtRoom (index) {
      let _info = this.caseList.bodyList[index]
      let newTime = this.getFormatDate()
      let newD = newTime.substr(0, 10).split('-').join('')
      let newT = (newTime.substr(11, 2) - 0) * 60 + (newTime.substr(14, 2) - 0)
      let beginTime = _info.beginTime
      let beginD = beginTime.substr(0, 10).split('-').join('')
      let beginT = (beginTime.substr(11, 2) - 0) * 60 + (beginTime.substr(14, 2) - 0)
      if (newD !== beginD) {
        this.$Message.warning({
          content: '只能在开庭前十分钟及开庭后半小时内进入',
          duration: 5
        })
      } else if (beginT - newT > 10 || newT - beginT > 30) {
        this.$Message.warning({
          content: '只能在开庭前十分钟及开庭后半小时内进入',
          duration: 5
        })
      } else {
        axios.post('/encryption', {
          params: _info.id + '$' + 1
        }).then(res => {
          window.open(regi.dataMap.goRoom + res.data.data, '_blank')
        }).catch(e => {
          this.$Message.error({
            content: '错误信息:' + e + ' 稍后再试',
            duration: 5
          })
        })
      }
    },
    resCancCase (index) {
      let _res = this.caseList.bodyList[index]
      let newTime = this.getFormatDate()
      let newD = newTime.substr(0, 10).split('-').join('')
      let newT = (newTime.substr(11, 2) - 0) * 60 + (newTime.substr(14, 2) - 0)
      let beginTime = _res.beginTime
      let beginD = beginTime.substr(0, 10).split('-').join('')
      let beginT = (beginTime.substr(11, 2) - 0) * 60 + (beginTime.substr(14, 2) - 0)
      if (newD - beginD < 0) {
        this.$Message.warning({
          content: '只能开庭半小时之后点击撤回',
          duration: 5
        })
      } else if (newD - beginD === 0) {
        if (newT - beginT > 30) {
          this.alertShow.userId = _res.id
          this.alertShow.docuType = 6
          this.alertShow.canc = true
        } else {
          this.$Message.warning({
            content: '只能开庭半小时之后点击撤回',
            duration: 5
          })
        }
      } else if (newD - beginD > 0) {
        this.alertShow.userId = _res.id
        this.alertShow.docuType = 6
        this.alertShow.canc = true
      }
    },
    resEndCase (index) {
      let _res = this.caseList.bodyList[index]
      let newTime = this.getFormatDate()
      let newD = newTime.substr(0, 10).split('-').join('')
      let newT = (newTime.substr(11, 2) - 0) * 60 + (newTime.substr(14, 2) - 0)
      let beginTime = _res.beginTime
      let beginD = beginTime.substr(0, 10).split('-').join('')
      let beginT = (beginTime.substr(11, 2) - 0) * 60 + (beginTime.substr(14, 2) - 0)
      if (beginTime === '' || beginTime === null) {
        this.$Message.warning({
          content: '没有开庭时间，禁止点击',
          duration: 5
        })
      } else if (newD - beginD < 0) {
        this.$Message.warning({
          content: '开庭时间未到，禁止点击',
          duration: 5
        })
      } else if (newD - beginD === 0) {
        if (newT - beginT > 0) {
          this.alertShow.userId = _res.id
          this.alertShow.docuType = 1
          this.alertShow.end = true
        } else {
          this.$Message.warning({
            content: '开庭时间未到，禁止点击',
            duration: 5
          })
        }
      } else if (newD - beginD > 0) {
        this.alertShow.userId = _res.id
        this.alertShow.docuType = 1
        this.alertShow.end = true
      }
    },
    resPassReve (index) {
      let res = this.caseList.bodyList[index]
      this.alertShow.userId = res.id
      this.alertShow.docuType = 5
      this.alertShow.reve = true
    },
    resAddEvid (index) {
      let res = this.caseList.bodyList[index]
      this.alertShow.userId = res.id
      this.alertShow.docuType = 3
      this.alertShow.addE = true
    },
    seeReasonD (index) {
      this.alertShow.reasText = this.caseList.bodyList[index].caseDocumentReason
      this.alertShow.reas = true
    },
    seeReasonC (index) {
      this.alertShow.reasText = this.caseList.bodyList[index].correctionsReason
      this.alertShow.reas = true
    },
    docuSave (type) {
      switch (type) {
        case 'reve':
        case 'canc':
          if (this.alertShow.contractName === '') {
            this.$Message.warning({
              content: '请填写合同名称',
              duration: 5
            })
          } else {
            axios.post('/case/addDocumentFile', {
              caseId: this.alertShow.userId,
              documentType: this.alertShow.docuType,
              jsonData: JSON.stringify({contractName: this.alertShow.contractName})
            }).then(res => {
              this.alertCanc(type)
              this.$Message.success({
                content: '操作成功',
                duration: 2
              })
              this.resCaseList()
            }).catch(e => {
              this.$Message.error({
                content: '错误信息:' + e + ' 稍后再试',
                duration: 5
              })
            })
          }
          break
        case 'end':
          if (this.alertShow.docuType === 1) {
            if (this.alertShow.contractName === '') {
              this.$Message.warning({
                content: '请填写合同名称',
                duration: 5
              })
            } else if (this.alertShow.contractualStipulation === '') {
              this.$Message.warning({
                content: '请填写合同约定情况',
                duration: 5
              })
            } else if (this.alertShow.contractPerformance === '') {
              this.$Message.warning({
                content: '请填写合同履行情况',
                duration: 5
              })
            } else if (this.alertShow.repaymentPrincipal === '') {
              this.$Message.warning({
                content: '请填写需要还款本金',
                duration: 5
              })
            } else if (this.alertShow.repaymentBase === '') {
              this.$Message.warning({
                content: '请填写还款基数',
                duration: 5
              })
            } else if (this.alertShow.annualRate === '') {
              this.$Message.warning({
                content: '请填写年利率',
                duration: 5
              })
            } else if (this.alertShow.interestCalculation === '') {
              this.$Message.warning({
                content: '请填写利息计算',
                duration: 5
              })
            } else {
              axios.post('/case/addDocumentFile', {
                caseId: this.alertShow.userId,
                documentType: this.alertShow.docuType,
                jsonData: JSON.stringify({
                  contractName: this.alertShow.contractName,
                  contractualStipulation: this.alertShow.contractualStipulation,
                  contractPerformance: this.alertShow.contractPerformance,
                  repaymentPrincipal: this.alertShow.repaymentPrincipal,
                  repaymentBase: this.alertShow.repaymentBase,
                  annualRate: this.alertShow.annualRate,
                  interestCalculation: this.alertShow.interestCalculation
                })
              }).then(res => {
                this.alertCanc('end')
                this.$Message.success({
                  content: '操作成功',
                  duration: 2
                })
                this.resCaseList()
              }).catch(e => {
                this.$Message.error({
                  content: '错误信息:' + e + ' 稍后再试',
                  duration: 5
                })
              })
            }
          } else if (this.alertShow.docuType === 2) {
            if (this.alertShow.contractName === '') {
              this.$Message.warning({
                content: '请填写合同名称',
                duration: 5
              })
            } else if (this.alertShow.agreementContent === '') {
              this.$Message.warning({
                content: '请填写协议内容',
                duration: 5
              })
            } else {
              axios.post('/case/addDocumentFile', {
                caseId: this.alertShow.userId,
                documentType: this.alertShow.docuType,
                jsonData: JSON.stringify({
                  contractName: this.alertShow.contractName,
                  agreementContent: this.alertShow.agreementContent
                })
              }).then(res => {
                this.alertCanc('end')
                this.$Message.success({
                  content: '操作成功',
                  duration: 2
                })
                this.resCaseList()
              }).catch(e => {
                this.$Message.error({
                  content: '错误信息:' + e + ' 稍后再试',
                  duration: 5
                })
              })
            }
          } else {
            this.$Message.error({
              content: '请稍后再试',
              duration: 5
            })
          }
          break
        case 'addE':
          if (this.alertShow.pageNum === '') {
            this.$Message.warning({
              content: '请填写裁决书第几页',
              duration: 5
            })
          } else if (this.alertShow.lineNum === '') {
            this.$Message.warning({
              content: '请填写裁决书第几行',
              duration: 5
            })
          } else if (this.alertShow.oldContent === '') {
            this.$Message.warning({
              content: '请填写更改之前内容',
              duration: 5
            })
          } else if (this.alertShow.newContent === '') {
            this.$Message.warning({
              content: '请填写更改之后内容',
              duration: 5
            })
          } else {
            axios.post('/case/addDocumentFile', {
              caseId: this.alertShow.userId,
              documentType: this.alertShow.docuType,
              jsonData: JSON.stringify({
                pageNum: this.alertShow.pageNum,
                lineNum: this.alertShow.lineNum,
                oldContent: this.alertShow.oldContent,
                newContent: this.alertShow.newContent
              })
            }).then(res => {
              this.alertCanc('addE')
              this.$Message.success({
                content: '操作成功',
                duration: 2
              })
              this.resCaseList()
            }).catch(e => {
              this.$Message.error({
                content: '错误信息:' + e + ' 稍后再试',
                duration: 5
              })
            })
          }
          break
        default:
          break
      }
    },
    seeDocu (type) {
      switch (type) {
        case 'reve':
        case 'canc':
          if (this.alertShow.contractName === '') {
            this.$Message.warning({
              content: '请填写合同名称',
              duration: 5
            })
          } else {
            axios.post('/case/previewDocumentFile', {
              caseId: this.alertShow.userId,
              documentType: this.alertShow.docuType,
              jsonData: JSON.stringify({contractName: this.alertShow.contractName})
            }).then(res => {
              window.open(res.data.data.filepath, '_blank')
            }).catch(e => {
              this.$Message.error({
                content: '错误信息:' + e + ' 稍后再试',
                duration: 5
              })
            })
          }
          break
        case 'end':
          if (this.alertShow.docuType === 1) {
            if (this.alertShow.contractName === '') {
              this.$Message.warning({
                content: '请填写合同名称',
                duration: 5
              })
            } else if (this.alertShow.contractualStipulation === '') {
              this.$Message.warning({
                content: '请填写合同约定情况',
                duration: 5
              })
            } else if (this.alertShow.contractPerformance === '') {
              this.$Message.warning({
                content: '请填写合同履行情况',
                duration: 5
              })
            } else if (this.alertShow.repaymentPrincipal === '') {
              this.$Message.warning({
                content: '请填写需要还款本金',
                duration: 5
              })
            } else if (this.alertShow.repaymentBase === '') {
              this.$Message.warning({
                content: '请填写还款基数',
                duration: 5
              })
            } else if (this.alertShow.annualRate === '') {
              this.$Message.warning({
                content: '请填写年利率',
                duration: 5
              })
            } else if (this.alertShow.interestCalculation === '') {
              this.$Message.warning({
                content: '请填写利息计算',
                duration: 5
              })
            } else {
              axios.post('/case/previewDocumentFile', {
                caseId: this.alertShow.userId,
                documentType: this.alertShow.docuType,
                jsonData: JSON.stringify({
                  contractName: this.alertShow.contractName,
                  contractualStipulation: this.alertShow.contractualStipulation,
                  contractPerformance: this.alertShow.contractPerformance,
                  repaymentPrincipal: this.alertShow.repaymentPrincipal,
                  repaymentBase: this.alertShow.repaymentBase,
                  annualRate: this.alertShow.annualRate,
                  interestCalculation: this.alertShow.interestCalculation
                })
              }).then(res => {
                window.open(res.data.data.filepath, '_blank')
              }).catch(e => {
                this.$Message.error({
                  content: '错误信息:' + e + ' 稍后再试',
                  duration: 5
                })
              })
            }
          } else if (this.alertShow.docuType === 2) {
            if (this.alertShow.contractName === '') {
              this.$Message.warning({
                content: '请填写合同名称',
                duration: 5
              })
            } else if (this.alertShow.agreementContent === '') {
              this.$Message.warning({
                content: '请填写协议内容',
                duration: 5
              })
            } else {
              axios.post('/case/previewDocumentFile', {
                caseId: this.alertShow.userId,
                documentType: this.alertShow.docuType,
                jsonData: JSON.stringify({
                  contractName: this.alertShow.contractName,
                  agreementContent: this.alertShow.agreementContent
                })
              }).then(res => {
                window.open(res.data.data.filepath, '_blank')
              }).catch(e => {
                this.$Message.error({
                  content: '错误信息:' + e + ' 稍后再试',
                  duration: 5
                })
              })
            }
          } else {
            this.$Message.error({
              content: '请稍后再试',
              duration: 5
            })
          }
          break
        case 'addE':
          if (this.alertShow.pageNum === '') {
            this.$Message.warning({
              content: '请填写裁决书第几页',
              duration: 5
            })
          } else if (this.alertShow.lineNum === '') {
            this.$Message.warning({
              content: '请填写裁决书第几行',
              duration: 5
            })
          } else if (this.alertShow.oldContent === '') {
            this.$Message.warning({
              content: '请填写更改之前内容',
              duration: 5
            })
          } else if (this.alertShow.newContent === '') {
            this.$Message.warning({
              content: '请填写更改之后内容',
              duration: 5
            })
          } else {
            axios.post('/case/previewDocumentFile', {
              caseId: this.alertShow.userId,
              documentType: this.alertShow.docuType,
              jsonData: JSON.stringify({
                pageNum: this.alertShow.pageNum,
                lineNum: this.alertShow.lineNum,
                oldContent: this.alertShow.oldContent,
                newContent: this.alertShow.newContent
              })
            }).then(res => {
              window.open(res.data.data.filepath, '_blank')
            }).catch(e => {
              this.$Message.error({
                content: '错误信息:' + e + ' 稍后再试',
                duration: 5
              })
            })
          }
          break
        default:
          break
      }
    },
    editorSave (html, cont) {
      axios.post('/case/saveTrialRecord', {
        caseId: this.alertShow.editorId,
        htmlContent: html,
        content: cont
      }).then(res => {
        this.alertCanc('editor')
        this.$Message.success({
          content: '操作成功',
          duration: 2
        })
        this.resCaseList()
      }).catch(e => {
        this.$Message.error({
          content: '错误信息:' + e + ' 稍后再试',
          duration: 5
        })
      })
    },
    renderCheck (h, params) {
      let _obj = params.row
      if ((_obj.endCasePatten === '5' || _obj.endCasePatten === '10') && _obj.tempCode !== null) {
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
        if (this.alertShow.ids.indexOf(info.id) === -1) {
          if (this.alertShow.ids.length >= 10) {
            this.$Message.error({
              content: '最多只能选择十个案件',
              duration: 5
            })
            return false
          } else {
            let _o = {}
            _o[info.id] = info.tempCode
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
    resEnds () {
      if (this.alertShow.ids.length === 0) {
        this.$Message.error({
          content: '请先选择一个案件',
          duration: 5
        })
      } else {
        this.alertShow.batch = true
      }
    },
    batchSave () {
      axios.post('/batchCaseDocument/addCaseDocumentList', {
        caseDocumentDataJson: JSON.stringify(this.alertShow.idsList)
      }).then(res => {
        this.alertCanc('batch')
        this.$Message.success({
          content: res.data.message,
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
      switch (type) {
        case 'canc':
          this.alertShow.canc = false
          this.alertShow.contractName = ''
          this.alertShow.userId = null
          this.alertShow.docuType = null
          break
        case 'end':
        case 'docuType':
          this.alertShow.contractName = ''
          this.alertShow.contractualStipulation = ''
          this.alertShow.contractPerformance = ''
          this.alertShow.repaymentPrincipal = ''
          this.alertShow.repaymentBase = ''
          this.alertShow.annualRate = ''
          this.alertShow.interestCalculation = ''
          this.alertShow.agreementContent = ''
          if (type === 'end') {
            this.alertShow.end = false
            this.alertShow.userId = null
            this.alertShow.docuType = null
          }
          break
        case 'reve':
          this.alertShow.contractName = ''
          this.alertShow.userId = null
          this.alertShow.docuType = null
          this.alertShow.reve = false
          break
        case 'addE':
          this.alertShow.userId = null
          this.alertShow.docuType = null
          this.alertShow.pageNum = ''
          this.alertShow.lineNum = ''
          this.alertShow.oldContent = ''
          this.alertShow.newContent = ''
          this.alertShow.addE = false
          break
        case 'reas':
          this.alertShow.reas = false
          this.alertShow.reasText = ''
          break
        case 'editor':
          this.alertShow.editor = false
          this.alertShow.editorId = null
          this.alertShow.editorDest = false
          break
        case 'batch':
          this.alertShow.batch = false
          break
        case 'find':
          this.alertShow.find = false
          this.search.requestName = ''
          this.search.caseType = ''
          // this.search.caseTypeList = {}
          // this.search.requestNameList = []
          break
        case 'clearIds':
          this.alertShow.idsList = []
          this.alertShow.ids = []
          break
        default:
          break
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
  }
}
</style>
