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
        <Col span="14">
          <div class="tr pr20">
            <Button class="ml20" type="primary" @click="resAction('resBatchEdit', null)" :style="{display: resBtnDis('GROUPCASE_BATCH_DOWNLOAD')}">批量下载</Button>
            <Button class="ml20" type="primary" @click="resAction('resFind', null)" :style="{display: resBtnDis('GROUPCASE_QUERY')}">条件搜索</Button>
            <Button class="ml20" type="primary" @click="resEnds" :style="{display: resBtnDis('GROUPCASE_BATCHEND')}">批量结案</Button>
          </div>
        </Col>
      </Row>
      <div class="_caseList clearfix">
        <Row>
          <Col span="24" class="pl20 pr20">
            <Table stripe border align="center" :loading="caseList.loading" :columns="caseList.header" :data="caseList.bodyList">
              <template slot-scope="{ row, index }" slot="action">
                <Button :style="{display: resBtnDis('GROUPCASE_UPDATE')}" class="mr5" type="primary" size="small" v-if="row.isconfirm === 0 || row.isconfirm === null" @click="resAction('resEditData', row)">修改</Button>
                <Button :style="{display: resBtnDis('GROUPCASE_CONFIRM')}" class="mr5" type="primary" size="small" v-if="row.isconfirm === 0" @click="resAction('resConfData', row)">确认</Button>
                <Button :style="{display: resBtnDis('GROUPCASE_UPLOADQUESTION')}" class="mr5" type="primary" size="small" v-if="row.btnUploadQuesFlag" @click="resAction('uploadQues', row)">上传问题清单</Button>
                <div v-if="!resSetRegExp(row.endCasePatten, 'groupCase')">
                  <Button :style="{display: resBtnDis('GROUPCASE_PASSWITHDRAW')}" class="mr5" type="primary" size="small" v-if="row.endCasePatten === '1'" @click="resAction('resPassReve', row)">同意撤回</Button>
                  <Button :style="{display: resBtnDis('GROUPCASE_REGENWITHDRAW')}" class="mr5" type="primary" size="small" v-if="row.endCasePatten === '2'" @click="resAction('resPassReve', row)">重新生成撤回书</Button>
                  <Button :style="{display: resBtnDis('GROUPCASE_GENCORRECTIONS')}" class="mr5" type="primary" size="small" v-if="row.endCasePatten === '3'" @click="resAction('resAddEvid', row)">生成补正书</Button>
                  <Button :style="{display: resBtnDis('GROUPCASE_REGENCORRECTIONS')}" class="mr5" type="primary" size="small" v-if="row.endCasePatten === '4'" @click="resAction('resAddEvid', row)">重新生成补正书</Button>
                  <Button :style="{display: resBtnDis('GROUPCASE_ENDCASE')}" class="mr5" type="primary" size="small" v-if="row.endCasePatten === '5' || row.endCasePatten === '11' || row.endCasePatten === '12'" @click="resEndCase('resEndCase', row)">结案</Button>
                  <Button :style="{display: resBtnDis('GROUPCASE_RESERVATION')}" class="mr5" type="primary" size="small" v-if="row.endCasePatten === '12'" @click="resAction('resErvation', row)">预约开庭</Button>
                  <Button :style="{display: resBtnDis('GROUPCASE_WITHDRAWCASE')}" class="mr5" type="primary" size="small" v-if="row.endCasePatten === '5' || row.endCasePatten === '8' || row.endCasePatten === '11'" @click="resCancCase('resCancCase', row)">撤案</Button>
                  <Button :style="{display: resBtnDis('GROUPCASE_ENTERCOURTROOM')}" class="mr5" type="primary" size="small" v-if="row.endCasePatten === '5'" @click="goCourtRoom(index)">进入庭室</Button>
                  <Button :style="{display: resBtnDis('GROUPCASE_CLOSE')}" class="mr5" type="primary" size="small" v-if="row.endCasePatten === '5'" @click="resAction('resClose', row)">关闭庭室</Button>
                  <Button :style="{display: resBtnDis('GROUPCASE_RECORD')}" class="mr5" type="primary" size="small" v-if="row.endCasePatten === '5'" @click="resRecord(index)">记录</Button>
                  <Button :style="{display: resBtnDis('GROUPCASE_REGEN')}" class="mr5" type="primary" size="small" v-if="row.endCasePatten === '6'" @click="resEndCase('resEndCase', row)">重新生成文书</Button>
                  <Button :style="{display: resBtnDis('GROUPCASE_REGENWITHDRAWDOC')}" class="mr5" type="primary" size="small" v-if="row.endCasePatten === '7'" @click="resCancCase('resCancCase', row)">重新生成撤案书</Button>
                  <Button :style="{display: resBtnDis('GROUPCASE_REENDCASE')}" class="mr5" type="primary" size="small" v-if="row.endCasePatten === '10'" @click="resEndCase('resEndCase', row)">重新结案</Button>
                </div>
                <div v-else="">
                  <span style="color: #2d8cf0" type="text" size="small">{{row.endCasePatten}}</span>
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
    <alert-btn-info :alertShow="alertShow.reas" :isSaveBtn="true" @alertCancel="alertCanc('reas')" alertTitle="查看">
      <p class="t2" v-text="alertShow.reasText"></p>
    </alert-btn-info>
    <alert-btn-info :alertShow="alertShow.batch"  @alertConfirm="batchSave" @alertCancel="alertCanc('batch')" alertTitle="操作">
      <p class="t2">确定要批量结案吗？</p>
    </alert-btn-info>
    <alert-btn-info :alertShow="alertShow.confDataAlert" @alertConfirm="alertSave('confData')" @alertCancel="alertCanc('confData')" alertTitle="操作">
      <p class="t2">确定要确认此条数据吗？</p>
    </alert-btn-info>
    <div v-if="alertShow.editorDest">
      <alert-editor :alertShow="alertShow.editor" :editorId="alertShow.editorId" :editorValue="alertShow.editorValue" @alertConfirm="editorSave" @alertCancel="alertCanc('editor')" alertTitle="编辑"></alert-editor>
    </div>
    <res-end-docu v-if="alertObj.resEndCase" :resVal="alertObj.endCaseData" @alertConfirm="alertSave('resEndCase')" @alertCancel="alertCanc('resEndCase')"></res-end-docu>
    <res-canc-docu v-if="alertShow.canc" :resCaseId="alertShow.userId" @alertConfirm="alertSave('canc')" @alertCancel="alertCanc('canc')"></res-canc-docu>
    <res-reve-docu v-if="alertShow.reve" :resCaseId="alertShow.userId" @alertConfirm="alertSave('reve')" @alertCancel="alertCanc('reve')"></res-reve-docu>
    <res-adde-docu v-if="alertShow.addE" :resCaseId="alertShow.userId" @alertConfirm="alertSave('adde')" @alertCancel="alertCanc('adde')"></res-adde-docu>
    <res-find v-if="alertShow.find" @alertConfirm="alertSave('find', ...arguments)" @alertCancel="alertCanc('find')"></res-find>
    <res-batch-edit v-if="alertShow.batchEdit" @alertConfirm="alertSave('batchEdit')" @alertCancel="alertCanc('batchEdit')"></res-batch-edit>
    <edit-data-modal v-if="alertShow.editDataModal" :conShow="true" :editDataId="alertShow.editDataId" @alertConfirm="alertSave('editData')" @alertCancel="alertCanc('editData')"></edit-data-modal>
    <upload-ques-alert v-if="alertObj.uploadQues" :resCaseId="alertObj.caseId" @alertConfirm="alertSave('uploadQues')" @alertCancel="alertCanc('uploadQues')"></upload-ques-alert>
    <res-ervation v-if="alertShow.resErvation" :resErvationData="alertShow.ervationData"  @alertConfirm="alertSave('resErvation')" @alertCancel="alertCanc('resErvation')"></res-ervation>
    <res-close v-if="alertShow.resClose" :resCloseData="alertShow.closeData" @alertConfirm="alertSave('resClose')" @alertCancel="alertCanc('resClose')"></res-close>
  </div>
</template>

<script>
import axios from 'axios'
import {resBtn, resPage, resMess} from '@/components/common/mixin.js'
import spinComp from '@/components/common/spin'
import alertBtnInfo from '@/components/common/alertBtnInfo'
import uploadQuesAlert from '@/page/arbitrator/groupCase/children/uploadQuesAlert'
import editDataModal from '@/page/arbitratSecr/groupAppl/children/editDataModal'
import resBatchEdit from '@/page/arbitrator/groupCase/children/resBatchEdit'
import resFind from '@/page/arbitrator/groupCase/children/resFind'
import resReveDocu from '@/page/arbitrator/groupCase/children/resReveDocu'
import resCancDocu from '@/page/arbitrator/groupCase/children/resCancDocu'
import resAddeDocu from '@/page/arbitrator/groupCase/children/resAddeDocu'
import resEndDocu from '@/page/arbitrator/groupCase/children/resEndDocu'
import resErvation from '@/page/arbitrator/groupCase/children/resErvation'
import resClose from '@/page/arbitrator/groupCase/children/resClose'
import alertEditor from '@/components/common/alertEditor'
import { caseInfo } from '@/config/common.js'
import setRegExp from '@/config/regExp.js'

export default {
  name: 'group_case',
  mixins: [resBtn, resPage, resMess],
  components: { spinComp, alertBtnInfo, alertEditor, uploadQuesAlert, editDataModal, resBatchEdit, resFind, resEndDocu, resReveDocu, resCancDocu, resAddeDocu, resErvation, resClose },
  data () {
    return {
      spinShow: false,
      search: {
        text: '',
        requestName: '',
        caseType: ''
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
            title: '批次号',
            key: 'batchNo',
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
            minWidth: 10,
            render: (h, params) => {
              return this.reasonBtn(h, params)
            }
          },
          {
            title: '操作',
            key: 'id',
            align: 'center',
            minWidth: 90,
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
      alertShow: {
        canc: false,
        docuType: null,
        userId: null,
        reve: false,
        addE: false,
        reasText: '',
        editor: false,
        editorId: null,
        editorDest: false,
        ids: [],
        idsList: [],
        batch: false,
        find: false,
        editDataModal: false,
        editDataId: null,
        confDataAlert: false,
        confDataId: null,
        confDataBatchNo: null,
        batchEdit: false,
        resErvation: false,
        ervationData: null,
        resClose: false,
        closeData: null
      },
      alertObj: {
        uploadQues: false,
        caseId: null,
        resEndCase: false,
        endCaseData: null
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
              on: {
                click: () => {
                  this.resAction('seeReasonD', params.row)
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
              on: {
                click: () => {
                  this.resAction('seeReasonC', params.row)
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
                  this.resAction('seeReasonC', params.row)
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
                  this.resAction('seeReasonD', params.row)
                }
              }
            }, '文书驳回原因')
          ])
        }
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
      this.alertShow.editorDest = true
      this.alertShow.editor = true
      this.alertShow.editorId = _info.id
    },
    goCourtRoom (index) {
      let _info = this.caseList.bodyList[index]
      axios.post('/encryption', {
        params: _info.id + '$' + 1
      }).then(res => {
        window.open('' + res.data.data, '_blank')
      }).catch(e => {
        this.resMessage('error', '错误信息:' + e + ' 稍后再试')
      })
    },
    resCancCase (type, data) {
      let _res = data
      if (_res.writtenFlag === 1) {
        this.resAction(type, data)
      } else {
        let newTime = this.getFormatDate()
        let newD = newTime.substr(0, 10).split('-').join('')
        let newT = (newTime.substr(11, 2) - 0) * 60 + (newTime.substr(14, 2) - 0)
        let beginTime = _res.beginTime
        let beginD = beginTime.substr(0, 10).split('-').join('')
        let beginT = (beginTime.substr(11, 2) - 0) * 60 + (beginTime.substr(14, 2) - 0)
        if (newD - beginD < 0) {
          this.resMessage('warning', '只能开庭半小时之后点击撤回')
        } else if (newD - beginD === 0) {
          if (newT - beginT > 30) {
            this.resAction(type, data)
          } else {
            this.resMessage('warning', '只能开庭半小时之后点击撤回')
          }
        } else if (newD - beginD > 0) {
          this.resAction(type, data)
        }
      }
    },
    resEndCase (type, data) {
      let _res = data
      if (_res.writtenFlag === 1) {
        this.resAction(type, data)
      } else {
        let newTime = this.getFormatDate()
        let newD = newTime.substr(0, 10).split('-').join('')
        let newT = (newTime.substr(11, 2) - 0) * 60 + (newTime.substr(14, 2) - 0)
        let beginTime = _res.beginTime
        let beginD = beginTime.substr(0, 10).split('-').join('')
        let beginT = (beginTime.substr(11, 2) - 0) * 60 + (beginTime.substr(14, 2) - 0)
        if (beginTime === '' || beginTime === null) {
          this.resMessage('warning', '没有开庭时间，禁止点击')
        } else if (newD - beginD < 0) {
          this.resMessage('warning', '开庭时间未到，禁止点击')
        } else if (newD - beginD === 0) {
          if (newT - beginT > 0) {
            this.resAction(type, data)
          } else {
            this.resMessage('warning', '开庭时间未到，禁止点击')
          }
        } else if (newD - beginD > 0) {
          this.resAction(type, data)
        }
      }
    },
    editorSave (html, cont) {
      axios.post('/case/saveTrialRecord', {
        caseId: this.alertShow.editorId,
        htmlContent: html,
        content: cont
      }).then(res => {
        this.alertCanc('editor')
        this.resMessage('success', '操作成功')
        this.resCaseList()
      }).catch(e => {
        this.resMessage('error', '错误信息:' + e + ' 稍后再试')
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
            this.resMessage('error', '最多只能选择十个案件')
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
        this.resMessage('error', '请先在条件搜索里选择一个结案方式进行搜索')
      } else if (this.alertShow.ids.length === 0) {
        this.resMessage('error', '请先选择一个案件')
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
        this.resMessage('error', '错误信息:' + e + ' 稍后再试')
      })
    },
    resAction (type, data) {
      switch (type) {
        case 'seeReasonD':
          this.alertShow.reasText = data.caseDocumentReason
          this.alertShow.reas = true
          break
        case 'seeReasonC':
          this.alertShow.reasText = data.correctionsReason
          this.alertShow.reas = true
          break
        case 'uploadQues':
          this.alertObj.caseId = data.id
          this.alertObj.uploadQues = true
          break
        case 'resEditData':
          this.alertShow.editDataId = data.id
          this.alertShow.editDataModal = true
          break
        case 'resBatchEdit':
          this.alertShow.batchEdit = true
          break
        case 'resFind':
          this.alertShow.find = true
          break
        case 'resConfData':
          this.alertShow.confDataBatchNo = data.batchNo
          this.alertShow.confDataId = data.id
          this.alertShow.confDataAlert = true
          break
        case 'resPassReve':
          this.alertShow.userId = data.id
          this.alertShow.reve = true
          break
        case 'resCancCase':
          this.alertShow.userId = data.id
          this.alertShow.canc = true
          break
        case 'resAddEvid':
          this.alertShow.userId = data.id
          this.alertShow.addE = true
          break
        case 'resEndCase':
          this.alertObj.endCaseData = {}
          this.alertObj.endCaseData.id = data.id
          this.alertObj.endCaseData.endNewTempCode = data.tempCode
          this.alertObj.resEndCase = true
          break
        case 'resErvation':
          this.alertShow.resErvation = true
          this.alertShow.ervationData = data
          break
        case 'resClose':
          this.alertShow.resClose = true
          this.alertShow.closeData = data
          break
      }
    },
    alertSave (type, data) {
      switch (type) {
        case 'batchEdit':
          this.alertShow.batchEdit = false
          break
        case 'editData':
          this.alertCanc(type)
          this.resSearch()
          break
        case 'confData':
          axios.post('/case/updateConfirmTemplate', {
            batchNo: this.alertShow.confDataBatchNo,
            caseId: this.alertShow.confDataId,
            isconfirm: 1
          }).then(res => {
            this.resMessage('success', res.data.data)
            this.alertCanc(type)
            this.resSearch()
          }).catch(e => {
            this.resMessage('error', '错误信息:' + e + ' 稍后再试')
          })
          break
        case 'find':
          this.alertShow.find = false
          this.alertCanc('clearIds')
          this.search.requestName = data.requestName
          this.search.caseType = data.caseType
          this.search.batchDocuType = data.batchDocuType
          this.pageObj.pageNum = 1
          this.resCaseList()
          break
        case 'uploadQues':
          this.alertObj.uploadQues = false
          this.alertObj.caseId = null
          this.pageObj.pageNum = 1
          this.resCaseList()
          break
        case 'reve':
          this.alertShow.reve = false
          this.alertShow.userId = null
          this.resCaseList()
          break
        case 'canc':
          this.alertShow.canc = false
          this.alertShow.userId = null
          this.resCaseList()
          break
        case 'addE':
          this.alertShow.addE = false
          this.alertShow.userId = null
          this.resCaseList()
          break
        case 'resEndCase':
          this.alertObj.resEndCase = false
          this.pageObj.pageNum = 1
          this.resCaseList()
          break
        case 'resClose':
          this.alertShow.resClose = false
          this.alertShow.closeData = null
          this.pageObj.pageNum = 1
          this.resCaseList()
          break
        case 'resErvation':
          this.alertShow.resErvation = false
          this.alertShow.ervationData = null
          this.pageObj.pageNum = 1
          this.resCaseList()
          break
      }
    },
    alertCanc (type) {
      switch (type) {
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
          break
        case 'clearIds':
          this.alertShow.idsList = []
          this.alertShow.ids = []
          break
        case 'editData':
          this.alertShow.editDataId = null
          this.alertShow.editDataModal = false
          break
        case 'batchEdit':
          this.alertShow.batchEdit = false
          break
        case 'confData':
          this.alertShow.confDataBatchNo = null
          this.alertShow.confDataId = null
          this.alertShow.confDataAlert = false
          break
        case 'uploadQues':
          this.alertObj.uploadQues = false
          this.alertObj.caseId = null
          break
        case 'reve':
          this.alertShow.reve = false
          this.alertShow.userId = null
          break
        case 'canc':
          this.alertShow.canc = false
          this.alertShow.userId = null
          break
        case 'addE':
          this.alertShow.userId = null
          this.alertShow.addE = false
          break
        case 'resEndCase':
          this.alertObj.resEndCase = false
          break
        case 'resClose':
          this.alertShow.resClose = false
          this.alertShow.closeData = null
          break
        case 'resErvation':
          this.alertShow.resErvation = false
          this.alertShow.ervationData = null
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
