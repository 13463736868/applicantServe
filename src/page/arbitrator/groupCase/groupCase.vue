<template>
  <div class="groupCase">
    <div class="_center pr">
      <spin-comp :spinShow="spinShow"></spin-comp>
      <Row>
        <Col span="2">
          <label class="lh32 f16 fc6 fr mr15">搜索</label>
        </Col>
        <Col span="8">
          <Input v-model="search.text" icon="ios-search" class="_search hand" @on-click="resSearch" @keyup.enter.native="resSearch" placeholder="案号 / 申请人 / 被申请人"></Input>
        </Col>
        <Col span="10">
          &nbsp;
        </Col>
        <Col span="2">
          <Button type="primary" @click="resFind" :style="{display: resBtnDis('GROUPCASE_QUERY')}">条件搜索</Button>
        </Col>
        <Col span="2">
          <Button type="primary" @click="resEnds" :style="{display: resBtnDis('GROUPCASE_BATCHEND')}">批量结案</Button>
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
      <Row class="_labelFor">
        <Col span="6" offset="1">
          <p><span class="_span">*</span><b>结案方式：</b></p>
        </Col>
        <Col span="16">
          <Select v-model="search.batchDocuType">
            <Option v-if="item.item !== '仲裁申请书'" v-for="item in search.batchDocuTypeList" :value="item.itemValue" :key="item.itemValue">{{ item.item }}</Option>
          </Select>
        </Col>
      </Row>
    </alert-btn-info>
    <end-case-alert v-if="alertObj.resEndCase" :resVal="alertObj.endCaseData" @alertConfirm="alertSave('resEndCase')" @alertCancel="alertCanc('resEndCase')"></end-case-alert>
  </div>
</template>

<script>
import axios from 'axios'
import {resBtn} from '@/components/common/mixin.js'
import headTop from '@/components/header/head'
import spinComp from '@/components/common/spin'
import createDocu from '@/components/common/createDocu'
import alertBtnInfo from '@/components/common/alertBtnInfo'
import endCaseAlert from '@/page/arbitrator/groupCase/children/endCaseAlert'
import alertEditor from '@/components/common/alertEditor'
import { caseInfo } from '@/config/common.js'
import setRegExp from '@/config/regExp.js'

export default {
  name: 'group_case',
  mixins: [resBtn],
  components: { headTop, spinComp, createDocu, alertBtnInfo, alertEditor, endCaseAlert },
  data () {
    return {
      spinShow: false,
      search: {
        text: '',
        requestName: '',
        caseType: '',
        caseTypeList: {},
        requestNameList: [],
        batchDocuType: null,
        batchDocuTypeList: []
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
            tooltip: 'true',
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
            tooltip: 'true',
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
        endNewTempList: [],
        endNewTempCode: '',
        canc: false,
        contractName: '',
        docuType: null,
        userId: null,
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
      },
      alertObj: {
        resEndCase: false,
        endCaseData: null
      }
    }
  },
  created () {
    this.resCaseList()
  },
  methods: {
    dictionary () {
      axios.post('/dictionary/findDictionaryList', {
        type: 'batchDocumentType'
      }).then(res => {
        this.search.batchDocuTypeList = res.data.data
      }).catch(e => {
        this.$Message.error({
          content: '错误信息:' + e + ' 稍后再试',
          duration: 5
        })
      })
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
                marginRight: '5px',
                display: this.resBtnDis('GROUPCASE_PASSWITHDRAW')
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
                marginRight: '5px',
                display: this.resBtnDis('GROUPCASE_REGENWITHDRAW')
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
              style: {
                display: this.resBtnDis('GROUPCASE_GENCORRECTIONS')
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
              style: {
                display: this.resBtnDis('GROUPCASE_REGENCORRECTIONS')
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
                marginRight: '5px',
                display: this.resBtnDis('GROUPCASE_ENDCASE')
              },
              on: {
                click: () => {
                  this.resAction('resEndCase', params.row)
                }
              }
            }, '结案'),
            h('Button', {
              props: {
                type: 'primary',
                size: 'small'
              },
              style: {
                marginRight: '5px',
                display: this.resBtnDis('GROUPCASE_WITHDRAWCASE')
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
                marginRight: '5px',
                display: this.resBtnDis('GROUPCASE_ENTERCOURTROOM')
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
              style: {
                display: this.resBtnDis('GROUPCASE_RECORD')
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
              style: {
                display: this.resBtnDis('GROUPCASE_REGEN')
              },
              on: {
                click: () => {
                  this.resAction('resEndCase', params.row)
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
              style: {
                display: this.resBtnDis('GROUPCASE_REGENWITHDRAWDOC')
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
                marginRight: '5px',
                display: this.resBtnDis('GROUPCASE_WITHDRAWCASE')
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
              style: {
                display: this.resBtnDis('GROUPCASE_REENDCASE')
              },
              on: {
                click: () => {
                  this.resAction('resEndCase', params.row)
                }
              }
            }, '重新结案')
          ])
        } else if (_obj.endCasePatten === '11') {
          return h('div', [
            h('Button', {
              props: {
                type: 'primary',
                size: 'small'
              },
              style: {
                marginRight: '5px',
                display: this.resBtnDis('GROUPCASE_ENDCASE')
              },
              on: {
                click: () => {
                  this.resAction('resEndCase', params.row)
                }
              }
            }, '结案'),
            h('Button', {
              props: {
                type: 'primary',
                size: 'small'
              },
              style: {
                marginRight: '5px',
                display: this.resBtnDis('GROUPCASE_WITHDRAWCASE')
              },
              on: {
                click: () => {
                  this.resCancCase(params.index)
                }
              }
            }, '撤案')
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
        keyword: this.search.text,
        caseDocementType: this.search.batchDocuType
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
          window.open('' + res.data.data, '_blank')
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
      if (_res.writtenFlag === 1) {
        this.alertShow.userId = _res.id
        this.alertShow.docuType = 6
        this.alertShow.canc = true
      } else {
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
            this.alertShow[type] = false
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
            this.alertShow.addE = false
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
      if ((_obj.endCasePatten === '5' || _obj.endCasePatten === '10' || _obj.endCasePatten === '11') && _obj.tempCode !== null) {
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
      if (this.search.batchDocuType === null || this.search.batchDocuType === undefined) {
        this.$Message.error({
          content: '请先在条件搜索里选择一个结案方式进行搜索',
          duration: 5
        })
      } else if (this.alertShow.ids.length === 0) {
        this.$Message.error({
          content: '请先选择一个案件',
          duration: 5
        })
      } else {
        this.alertShow.batch = true
      }
    },
    batchSave () {
      this.alertShow.batch = false
      axios.post('/batchCaseDocument/addCaseDocumentList', {
        caseDocumentDataJson: JSON.stringify(this.alertShow.idsList),
        batchDocumentType: this.search.batchDocuType
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
    resAction (type, data) {
      switch (type) {
        case 'resEndCase':
          if (data.writtenFlag === 1) {
            this.alertObj.endCaseData = {}
            this.alertObj.endCaseData.id = data.id
            this.alertObj.endCaseData.endNewTempCode = data.tempCode
            this.alertObj.resEndCase = true
          } else {
            let newTime = this.getFormatDate()
            let newD = newTime.substr(0, 10).split('-').join('')
            let newT = (newTime.substr(11, 2) - 0) * 60 + (newTime.substr(14, 2) - 0)
            let beginTime = data.beginTime
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
                this.alertObj.endCaseData = {}
                this.alertObj.endCaseData.id = data.id
                this.alertObj.endCaseData.endNewTempCode = data.tempCode
                this.alertObj.resEndCase = true
              } else {
                this.$Message.warning({
                  content: '开庭时间未到，禁止点击',
                  duration: 5
                })
              }
            } else if (newD - beginD > 0) {
              this.alertObj.endCaseData = {}
              this.alertObj.endCaseData.id = data.id
              this.alertObj.endCaseData.endNewTempCode = data.tempCode
              this.alertObj.resEndCase = true
            }
          }
          break
      }
    },
    alertSave (type) {
      switch (type) {
        case 'resEndCase':
          this.alertObj.resEndCase = false
          this.pageObj.pageNum = 1
          this.resCaseList()
          break
      }
    },
    alertCanc (type) {
      switch (type) {
        case 'canc':
          this.alertShow.canc = false
          this.alertShow.contractName = ''
          this.alertShow.userId = null
          this.alertShow.docuType = null
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
        case 'resEndCase':
          this.alertObj.resEndCase = false
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
