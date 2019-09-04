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
        <Col span="8">
          &nbsp;
        </Col>
        <Col span="2">
          <Button type="primary" @click="resBatchEdit" :style="{display: resBtnDis('GROUPCASE_BATCH_DOWNLOAD')}">批量下载</Button>
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
            <Table stripe border align="center" :loading="caseList.loading" :columns="caseList.header" :data="caseList.bodyList">
              <template slot-scope="{ row, index }" slot="action">
                <Button :style="{display: resBtnDis('GROUPCASE_UPDATE')}" class="mr5" type="primary" size="small" v-if="row.isconfirm === 0 || row.isconfirm === null" @click="resEditData(index)">修改</Button>
                <Button :style="{display: resBtnDis('GROUPCASE_CONFIRM')}" class="mr5" type="primary" size="small" v-if="row.isconfirm === 0" @click="resConfData(index)">确认</Button>
                <Button :style="{display: resBtnDis('GROUPCASE_UPLOADQUESTION')}" class="mr5" type="primary" size="small" v-if="row.btnUploadQuesFlag" @click="resAction('uploadQues', row)">上传问题清单</Button>
                <div v-if="!resSetRegExp(row.endCasePatten, 'groupCase')">
                  <Button :style="{display: resBtnDis('GROUPCASE_PASSWITHDRAW')}" class="mr5" type="primary" size="small" v-if="row.endCasePatten === '1'" @click="resPassReve(index)">同意撤回</Button>
                  <Button :style="{display: resBtnDis('GROUPCASE_REGENWITHDRAW')}" class="mr5" type="primary" size="small" v-if="row.endCasePatten === '2'" @click="resPassReve(index)">重新生成撤回书</Button>
                  <Button :style="{display: resBtnDis('GROUPCASE_GENCORRECTIONS')}" class="mr5" type="primary" size="small" v-if="row.endCasePatten === '3'" @click="resAddEvid(index)">生成补正书</Button>
                  <Button :style="{display: resBtnDis('GROUPCASE_REGENCORRECTIONS')}" class="mr5" type="primary" size="small" v-if="row.endCasePatten === '4'" @click="resAddEvid(index)">重新生成补正书</Button>
                  <Button :style="{display: resBtnDis('GROUPCASE_ENDCASE')}" class="mr5" type="primary" size="small" v-if="row.endCasePatten === '5' || row.endCasePatten === '11'" @click="resEndCase(index)">结案</Button>
                  <Button :style="{display: resBtnDis('GROUPCASE_WITHDRAWCASE')}" class="mr5" type="primary" size="small" v-if="row.endCasePatten === '5' || row.endCasePatten === '8' || row.endCasePatten === '11'" @click="resCancCase(index)">撤案</Button>
                  <Button :style="{display: resBtnDis('GROUPCASE_ENTERCOURTROOM')}" class="mr5" type="primary" size="small" v-if="row.endCasePatten === '5'" @click="goCourtRoom(index)">进入庭室</Button>
                  <Button :style="{display: resBtnDis('GROUPCASE_RECORD')}" class="mr5" type="primary" size="small" v-if="row.endCasePatten === '5'" @click="resRecord(index)">记录</Button>
                  <Button :style="{display: resBtnDis('GROUPCASE_REGEN')}" class="mr5" type="primary" size="small" v-if="row.endCasePatten === '6'" @click="resEndCase(index)">重新生成文书</Button>
                  <Button :style="{display: resBtnDis('GROUPCASE_REGENWITHDRAWDOC')}" class="mr5" type="primary" size="small" v-if="row.endCasePatten === '7'" @click="resCancCase(index)">重新生成撤案书</Button>
                  <Button :style="{display: resBtnDis('GROUPCASE_REENDCASE')}" class="mr5" type="primary" size="small" v-if="row.endCasePatten === '10'" @click="resEndCase(index)">重新结案</Button>
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
    <create-docu :alertShow="alertShow.end" @alertConfirm="docuSave('endNew')" @alertSee="seeDocu('endNew')" @alertCancel="alertCanc('endNew')" alertTitle="操作">
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
      <Row class="_labelFor">
        <Col span="6" offset="1">
          <p><span class="_span">*</span><b>结案模版：</b></p>
        </Col>
        <Col span="16">
          <Select v-model="alertShow.endNewTempCode">
            <Option v-if="item.tempDocumentType === alertShow.docuType" v-for="item in alertShow.endNewTempList" :value="item.tempCode" :key="item.tempCode">{{ item.tempName }}</Option>
          </Select>
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
    <alert-btn-info :alertShow="alertShow.batchEdit" alertSaveText="下载" @alertConfirm="alertSave('batchEdit')" @alertCancel="alertCanc('batchEdit')" alertTitle="操作">
      <Row>
        <Col span="6" offset="1">
          <p class="pt7 pb7">批次号：</p>
        </Col>
        <Col span="12">
          <Select v-model="alertShow.batchNo" filterable>
            <Option v-for="item in alertShow.batchNoList" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </Col>
      </Row>
    </alert-btn-info>
    <edit-data-modal v-if="alertShow.editDataModal" :conShow="true" :editDataId="alertShow.editDataId" @alertConfirm="alertSave('editData')" @alertCancel="alertCanc('editData')"></edit-data-modal>
    <alert-btn-info :alertShow="alertShow.confDataAlert" @alertConfirm="alertSave('confData')" @alertCancel="alertCanc('confData')" alertTitle="操作">
      <p class="t2">确定要确认此条数据吗？</p>
    </alert-btn-info>
    <upload-ques-alert v-if="alertObj.uploadQues" :resCaseId="alertObj.caseId" @alertConfirm="alertSave('uploadQues')" @alertCancel="alertCanc('uploadQues')"></upload-ques-alert>
  </div>
</template>

<script>
import axios from 'axios'
import {resBtn} from '@/components/common/mixin.js'
import spinComp from '@/components/common/spin'
import createDocu from '@/components/common/createDocu'
import alertBtnInfo from '@/components/common/alertBtnInfo'
import editDataModal from '@/page/arbitratSecr/groupAppl/children/editDataModal'
import uploadQuesAlert from '@/page/arbitrator/groupCase/children/uploadQuesAlert'
import alertEditor from '@/components/common/alertEditor'
import { caseInfo } from '@/config/common.js'
import setRegExp from '@/config/regExp.js'

export default {
  name: 'group_case',
  mixins: [resBtn],
  components: { spinComp, createDocu, alertBtnInfo, alertEditor, editDataModal, uploadQuesAlert },
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
            width: 70,
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
        endNewTempList: [],
        endNewTempCode: '',
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
        find: false,
        editDataModal: false,
        editDataId: null,
        confDataAlert: false,
        confDataId: null,
        confDataBatchNo: null,
        batchEdit: false,
        batchNo: null,
        batchNoList: []
      },
      alertObj: {
        uploadQues: false,
        caseId: null
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
    resEndCase (index) {
      let _res = this.caseList.bodyList[index]
      if (_res.writtenFlag === 1) {
        axios.post('/caseType/findAllTemplate').then(res => {
          this.alertShow.endNewTempList = res.data.data
          this.alertShow.userId = _res.id
          this.alertShow.docuType = 1
          this.alertShow.endNewTempCode = _res.tempCode
          this.alertShow.end = true
        }).catch(e => {
          this.$Message.error({
            content: '错误信息:' + e + ' 稍后再试',
            duration: 5
          })
        })
      } else {
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
            axios.post('/caseType/findAllTemplate').then(res => {
              this.alertShow.endNewTempList = res.data.data
              this.alertShow.userId = _res.id
              this.alertShow.docuType = 1
              this.alertShow.endNewTempCode = _res.tempCode
              this.alertShow.end = true
            }).catch(e => {
              this.$Message.error({
                content: '错误信息:' + e + ' 稍后再试',
                duration: 5
              })
            })
          } else {
            this.$Message.warning({
              content: '开庭时间未到，禁止点击',
              duration: 5
            })
          }
        } else if (newD - beginD > 0) {
          axios.post('/caseType/findAllTemplate').then(res => {
            this.alertShow.endNewTempList = res.data.data
            this.alertShow.userId = _res.id
            this.alertShow.docuType = 1
            this.alertShow.endNewTempCode = _res.tempCode
            this.alertShow.end = true
          }).catch(e => {
            this.$Message.error({
              content: '错误信息:' + e + ' 稍后再试',
              duration: 5
            })
          })
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
        case 'endNew':
          if (this.alertShow.endNewTempCode === '' || this.alertShow.endNewTempCode === undefined || this.alertShow.endNewTempCode === null) {
            this.$Message.warning({
              content: '请选择结案模版',
              duration: 5
            })
          } else {
            let _o = {}
            _o[this.alertShow.userId] = this.alertShow.endNewTempCode
            axios.post('/batchCaseDocument/addCaseDocument', {
              documentType: this.alertShow.docuType,
              caseDocumentDataJson: JSON.stringify([_o])
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
          break
        case 'end':
          // 单案结案改成选模版次处废掉
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
              this.alertShow.end = false
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
              this.alertShow.end = false
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
        case 'endNew':
          if (this.alertShow.endNewTempCode === '' || this.alertShow.endNewTempCode === undefined) {
            this.$Message.warning({
              content: '请选择结案模版',
              duration: 5
            })
          } else {
            let _o = {}
            _o[this.alertShow.userId] = this.alertShow.endNewTempCode
            axios.post('/batchCaseDocument/findPreviewCaseDocument', {
              documentType: this.alertShow.docuType,
              caseDocumentDataJson: JSON.stringify([_o])
            }).then(res => {
              window.open(res.data.data, '_blank')
            }).catch(e => {
              this.$Message.error({
                content: '错误信息:' + e + ' 稍后再试',
                duration: 5
              })
            })
          }
          break
        case 'end':
          // 单案结案改成选模版次处废掉
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
    resBatchEdit () {
      axios.get('/case/findAllBatchNo').then(res => {
        let _res = res.data.data
        _res.forEach(a => {
          let _o = {}
          _o.id = a
          _o.name = a
          this.alertShow.batchNoList.push(_o)
        })
        this.alertShow.batchEdit = true
      }).catch(e => {
        this.$Message.error({
          content: '错误信息:' + e + ' 稍后再试',
          duration: 5
        })
      })
    },
    resEditData (index) {
      let _res = this.caseList.bodyList[index]
      this.alertShow.editDataId = _res.id
      this.alertShow.editDataModal = true
    },
    resConfData (index) {
      let _res = this.caseList.bodyList[index]
      this.alertShow.confDataBatchNo = _res.batchNo
      this.alertShow.confDataId = _res.id
      this.alertShow.confDataAlert = true
    },
    resAction (type, data) {
      switch (type) {
        case 'uploadQues':
          this.alertObj.caseId = data.id
          this.alertObj.uploadQues = true
          break
      }
    },
    alertSave (type) {
      switch (type) {
        case 'batchEdit':
          if (this.alertShow.batchNo === null) {
            this.$Message.error({
              content: '请先选择一个批次号',
              duration: 5
            })
            return false
          }
          axios.post('/file/addJudgeTemplate', {
            batchNo: this.alertShow.batchNo,
            dataType: 2
          }).then(res => {
            res.data.data.split(',').forEach(b => {
              window.open(b, '_blank')
            })
            this.alertCanc('batchEdit')
          }).catch(e => {
            this.$Message.error({
              content: '错误信息:' + e + ' 稍后再试',
              duration: 5
            })
          })
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
            this.$Message.success({
              content: res.data.data,
              duration: 2
            })
            this.alertCanc(type)
            this.resSearch()
          }).catch(e => {
            this.$Message.error({
              content: '错误信息:' + e + ' 稍后再试',
              duration: 5
            })
          })
          break
        case 'uploadQues':
          this.alertObj.uploadQues = false
          this.alertObj.caseId = null
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
        case 'end':
        case 'endNew':
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
          if (type === 'endNew') {
            this.alertShow.end = false
            this.alertShow.userId = null
            this.alertShow.endNewTempList = []
          }
          this.alertShow.endNewTempCode = ''
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
        case 'editData':
          this.alertShow.editDataId = null
          this.alertShow.editDataModal = false
          break
        case 'batchEdit':
          this.alertShow.batchEdit = false
          this.alertShow.batchNo = null
          this.alertShow.batchNoList = []
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
