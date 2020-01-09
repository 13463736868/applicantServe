<template>
  <div class="groupAppl">
    <div class="_center pr">
      <spin-comp :spinShow="spinShow"></spin-comp>
      <Row class="mb20">
        <Col span="2">
          <label class="lh32 f16 fc6 fr mr15">搜索</label>
        </Col>
        <Col span="5">
          <Input v-model="search.text" icon="ios-search" class="_search hand" @on-click="resSearch" @keyup.enter.native="resSearch" placeholder="案号 / 案件编号 / 申请人 / 被申请人 / 代理人 / 年限"></Input>
        </Col>
        <Col span="2">
          <label class="lh32 f16 fc6 fr mr15">条件选择</label>
        </Col>
        <Col span="3">
          <Select v-model="search.batchCondition" @on-change="resSearch">
            <Option value="1" key="1">全部</Option>
            <Option :style="{display: resBtnDis('GROUPAPPL_BATCHSUJESTPROPOSAL')}" value="2" key="2">批量建议仲裁员</Option>
            <!-- <Option :style="{display: resBtnDis('GROUPAPPL_BATCHSUJESTPROPOSAL')}" value="3" key="3">待(批量建议仲裁员(三个))</Option> -->
            <Option v-if="resBtnDis('GROUPAPPL_BATCHSAVEFORM') !== 'none' || resBtnDis('GROUPAPPL_BATCHSUBMIT') !== 'none'" value="4" key="4">批量提交/批量保存组庭审批表</Option>
          </Select>
        </Col>
        <Col span="12">
          <div class="tr pr20">
            <Button class="ml20" type="primary" @click="resActionFind('resFind', null)" :style="{display: resBtnDis('GROUPAPPL_QUERY')}">条件搜索</Button>
            <Button class="ml20" type="primary" @click="resAction('resBatchProPosal', null)" :style="{display: resBtnDis('GROUPAPPL_BATCHSUJESTPROPOSAL')}">批量建议仲裁员</Button>
            <Button class="ml20" type="primary" @click="resAction('resBatchSaveForm', null)" :style="{display: resBtnDis('GROUPAPPL_BATCHSAVEFORM')}">批量保存审批表</Button>
            <Button class="ml20" type="primary" @click="resAction('resBatchSubmit', null)" :style="{display: resBtnDis('GROUPAPPL_BATCHSUBMIT')}">批量提交</Button>
            <Button class="ml20" type="primary" @click="resBatchEdit" :style="{display: resBtnDis('GROUPAPPL_BATCH_MODIFICATION')}">批量下载</Button>
            <Button class="ml20" type="primary" @click="resBatchUp" :style="{display: resBtnDis('GROUPAPPL_UPLOAD_DATA')}">上传数据</Button>
            <!-- <Button class="ml20" type="primary" @click="resBatch(3)" :style="{display: resBtnDis('GROUPAPPL_BATCHHEAR')}">批量书面审理</Button> -->
            <Button class="ml20" type="primary" @click="resBatch(2)" :style="{display: resBtnDis('GROUPAPPL_BATCHDATE')}">批量指定开庭时间</Button>
          </div>
        </Col>
      </Row>
      <div class="_caseList clearfix">
        <Row>
          <Col span="24" class="pl20 pr20">
            <Table stripe border align="center" :loading="caseList.loading" :columns="caseList.header" :data="caseList.bodyList">
              <template slot-scope="{ row, index }" slot="check">
                <div v-if="search.batchCondition !== '1' && ['16', '17', '18', '1', '4', '19', '20'].indexOf(row.logicState) !== -1">
                  <Icon v-if="alertShow.ids.indexOf(row.id) === -1" class="hand vtt" type="md-square-outline" size="16" color="#2d8cf0" @click="seleArrChange(row, true)"></Icon>
                  <Icon v-else class="hand vtt" type="md-checkbox" size="16" color="#2d8cf0" @click="seleArrChange(row, false)"></Icon>
                </div>
              </template>
              <template slot-scope="{ row, index }" slot="proPosal">
                <Button :style="{display: resBtnDis('GROUPAPPL_PROPOSAL')}" type="primary" size="small" v-if="row.logicState === '17' || row.logicState === '18'" @click="resAction('proPosal', row)">选择仲裁员</Button>
                <Button :style="{display: resBtnDis('GROUPAPPL_PROPOSAL')}" type="primary" size="small" v-if="row.logicState === '16'" @click="resAction('proPosal', row)">修改仲裁员</Button>
                <p v-if="row.recommArbitrators !== ''" class="mr5" type="text" size="small">{{row.recommArbitrators}}</p>
              </template>
              <template slot-scope="{ row, index }" slot="action">
                <Button :style="{display: resBtnDis('GROUPAPPL_SUBMIT')}" class="mr5" type="primary" size="small" v-if="row.logicState === '1' || row.logicState === '4'" @click="resSubm(index)">提交</Button>
                <Button :style="{display: resBtnDis('GROUPAPPL_APPROVAL')}" class="mr5" type="primary" size="small" v-if="['1', '4', '16', '19', '20'].indexOf(row.logicState) !== -1" @click="resAction('succForm', row)">组庭审批表</Button>
                <Button :style="{display: resBtnDis('GROUPAPPL_WITHDRAW')}" class="mr5" type="primary" size="small" v-if="row.logicState === '2'" @click="resAction('resPassReve', row)">同意撤回</Button>
                <Button :style="{display: resBtnDis('GROUPAPPL_REASON')}" class="mr5" type="primary" size="small" v-if="row.logicState === '3'" @click="resSeeReas(index)">查看原因</Button>
                <Button :style="{display: resBtnDis('GROUPAPPL_REGEN')}" class="mr5" type="primary" size="small" v-if="row.logicState === '3'" @click="resAction('resPassReve', row)">重新生成撤回书</Button>
                <Button :style="{display: resBtnDis('GROUPAPPL_VIEWFILE')}" class="mr5" type="primary" size="small" v-if="['14', '13', '21', '12', '10', '9', '4', '6', '8'].indexOf(row.logicState) !== -1" @click="resFileList(index)">查看文件</Button>
                <Button :style="{display: resBtnDis('GROUPAPPL_UPDATEDATE')}" class="mr5" type="primary" size="small" v-if="row.logicState === '5' || row.logicState === '6' || row.logicState === '12'"  @click="resBeginTime('edit', index)">修改开庭时间</Button>
                <Button :style="{display: resBtnDis('GROUPAPPL_APPOINTDATE')}" class="mr5" type="primary" size="small" v-if="row.logicState === '7' || row.logicState === '8' || row.logicState === '21'" @click="resBeginTime('once', index)">指定开庭时间</Button>
                <Button :style="{display: resBtnDis('GROUPAPPL_TRANSTOHEARING')}" class="mr5" type="primary" size="small" v-if="row.logicState === '7'" @click="resTranBook(index)">书面审理</Button>
                <Button :style="{display: resBtnDis('GROUPAPPL_ARRIVE')}" class="mr5" type="primary" size="small" v-if="row.logicState === '12' || row.logicState === '13'" @click="resSendDoc(index)">送达</Button>
                <Button :style="{display: resBtnDis('GROUPAPPL_UPDATE')}" class="mr5" type="primary" size="small" v-if="row.isconfirm === 0 || row.isconfirm === null" @click="resEditData(index)">修改</Button>
                <span style="color: #2d8cf0" class="mr5" type="text" size="small" v-if="row.logicState === '11'">{{row.logicContent}}</span>
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
    <alert-btn-info :alertShow="alertObj.file" :isSaveBtn="true" @alertCancel="alertCanc('file')" alertTitle="文件列表">
      <Row>
        <Col span="24">
          <Table stripe align="center" :loading="fileList.loading" :columns="fileList.header" :data="fileList.bodyList"></Table>
        </Col>
      </Row>
      <Row class="pt15">
        <Col span="16" class="tr">
          <Page simple :total="fileList.page.total" :current="fileList.page.pageNum" :page-size="fileList.page.pageSize" show-elevator show-total @on-change="reschangePageF"></Page>
        </Col>
        <Col span="8" class="tc">
          <Button type="primary" size="small" @click="dowZip">一键下载</Button>
        </Col>
      </Row>
    </alert-btn-info>
    <alert-btn-info :alertShow="alertObj.subm" @alertConfirm="submSave" @alertCancel="alertCanc('subm')" alertTitle="操作">
      <p>确定要提交吗？</p>
    </alert-btn-info>
    <alert-btn-info :alertShow="alertObj.begin" @alertConfirm="beginSave" @alertCancel="alertCanc('begin')" alertTitle="操作">
      <Row>
        <Col span="6" offset="1">
          <p class="pt7 pb7">指定开庭时间：</p>
        </Col>
        <Col span="12">
          <DatePicker @on-change="changeDate" type="datetime" placeholder="请指定开庭时间"></DatePicker>
        </Col>
      </Row>
    </alert-btn-info>
    <alert-btn-info :alertShow="alertObj.reas" :isSaveBtn="true" @alertCancel="alertCanc('reas')" alertTitle="撤案退回原因">
      <p class="t2" v-text="alertObj.reasText"></p>
    </alert-btn-info>
    <alert-btn-info :alertShow="alertShow.time" @alertConfirm="timeSave" @alertCancel="alertCanc('time')" alertTitle="操作">
      <Row>
        <Col span="6" offset="1">
          <p class="pt7 pb7">指定开庭时间：</p>
        </Col>
        <Col span="12">
          <DatePicker @on-change="changeDate" type="datetime" placeholder="请指定开庭时间"></DatePicker>
        </Col>
      </Row>
    </alert-btn-info>
    <alert-btn-info :alertShow="alertObj.send" @alertConfirm="sendDocSave" @alertCancel="alertCanc('sendDoc')" alertTitle="操作">
      <p>确定要发送邮件，短信通知吗？（确认内容无误后点击确定）</p>
    </alert-btn-info>
    <alert-btn-info :alertShow="alertShow.noTime" @alertConfirm="noTimesSave('time')" @alertCancel="alertCanc('noTime')" alertTitle="操作">
      <p>确定要批量书面审理吗？</p>
    </alert-btn-info>
    <alert-btn-info :alertShow="alertShow.noBegin" @alertConfirm="noTimesSave('begin')" @alertCancel="alertCanc('noBegin')" alertTitle="操作">
      <p>确定要书面审理吗？</p>
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
    <alert-btn-info :isCancBtn="true" :isSaveBtn="true" :alertShow="alertShow.batchUp" alertTitle="操作">
      <upload-book childName="批量导入修改" :fileType="['xlsx']" :uploadUrl="resUploadUrl" @saveClick="batchUpSave" @cancClick="alertCanc('batchUp')"></upload-book>
    </alert-btn-info>
    <res-batch-submit v-if="alertObj.batchSubmit" :resIdsList="alertShow.ids" @alertConfirm="alertSave('resBatchSubmit')" @alertCancel="alertCanc('resBatchSubmit')"></res-batch-submit>
    <res-batch-save-form v-if="alertObj.batchSaveForm" :resIdsList="alertShow.idsList" @alertConfirm="alertSave('resBatchSaveForm')" @alertCancel="alertCanc('resBatchSaveForm')"></res-batch-save-form>
    <res-batch-pro-posal v-if="alertObj.batchProPosal" :resIdsList="alertShow.idsList" :resArbiNum="alertObj.arbiNum" @alertConfirm="alertSave('resBatchProPosal')" @alertCancel="alertCanc('resBatchProPosal')"></res-batch-pro-posal>
    <res-reve-docu v-if="alertObj.reve" :resCaseId="alertObj.userId" @alertConfirm="alertSave('reve')" @alertCancel="alertCanc('reve')"></res-reve-docu>
    <edit-data-modal v-if="alertShow.editDataModal" :editDataId="alertShow.editDataId" @alertConfirm="alertSave('editData')" @alertCancel="alertCanc('editData')"></edit-data-modal>
    <group-Appr-form v-if="formObj.filing" :caseId="formObj.caseId" @alertConfirm="alertSave('succForm')" @alertCancel="alertCanc('succForm')"></group-Appr-form>
    <res-pro-posal v-if="alertObj.proPosal" :resArbiNum="alertObj.arbiNum" :resLogicState="alertObj.logicState" :resCaseId="alertObj.caseId" @alertConfirm="alertSave('proPosal')" @alertCancel="alertCanc('proPosal')"></res-pro-posal>
    <res-find v-if="alertShow.find" @alertConfirm="alertSaveFind('find', ...arguments)" @alertCancel="alertCancFind('find')"></res-find>
  </div>
</template>

<script>
import axios from 'axios'
import {resMess, resBtn, resSearFind} from '@/components/common/mixin.js'
import spinComp from '@/components/common/spin'
import resFind from '@/page/comm/resFind/resFind'
import createDocu from '@/components/common/createDocu'
import alertBtnInfo from '@/components/common/alertBtnInfo'
import uploadBook from '@/components/common/uploadBook'
import resReveDocu from '@/page/arbitratSecr/groupAppl/children/resReveDocu'
import editDataModal from '@/page/arbitratSecr/groupAppl/children/editDataModal'
import resProPosal from '@/page/arbitratSecr/groupAppl/children/resProPosal'
import resBatchProPosal from '@/page/arbitratSecr/groupAppl/children/resBatchProPosal'
import resBatchSaveForm from '@/page/comm/apprForm/resBatchSaveForm'
import resBatchSubmit from '@/page/arbitratSecr/groupAppl/children/resBatchSubmit'
import groupApprForm from '@/page/comm/apprForm/groupApprForm'
import { caseInfo } from '@/config/common.js'
import regi from '@/config/regiType.js'

export default {
  name: 'group_appl',
  mixins: [resMess, resBtn, resSearFind],
  components: { spinComp, createDocu, resFind, alertBtnInfo, uploadBook, resReveDocu, editDataModal, resProPosal, resBatchProPosal, resBatchSaveForm, resBatchSubmit, groupApprForm },
  data () {
    return {
      spinShow: false,
      search: {
        batchCondition: '1',
        text: '',
        batchStatus: '',
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
            slot: 'check',
            renderHeader: (h, params) => {
              return this.renderAllSele(h, params)
            }
          },
          {
            title: '案号',
            key: 'code',
            minWidth: 20,
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
          // {
          //   title: '案件编号',
          //   key: 'id',
          //   align: 'center'
          // },
          // {
          //   title: '批次号',
          //   key: 'batchNo',
          //   align: 'center'
          // },
          // {
          //   title: '案件类型',
          //   key: 'caseTypeName',
          //   tooltip: 'true',
          //   align: 'center'
          // },
          {
            title: '案由',
            key: 'caseReson',
            tooltip: 'true',
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
            minWidth: 6,
            align: 'center'
          },
          {
            title: '建议仲裁庭人选',
            key: 'recommArbitrators',
            tooltip: 'true',
            align: 'center',
            minWidth: 30,
            slot: 'proPosal'
          },
          {
            title: '确认仲裁员',
            key: 'approver',
            tooltip: 'true',
            align: 'center'
          },
          // {
          //   title: '开庭时间',
          //   key: 'beginTime',
          //   tooltip: 'true',
          //   align: 'center'
          // },
          {
            title: '操作',
            key: 'id',
            align: 'center',
            minWidth: 90,
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
      alertObj: {
        file: false,
        subm: false,
        begin: false,
        caseId: null,
        composeTime: null,
        time: '',
        type: null,
        userId: null,
        reve: false,
        reasText: '',
        reas: false,
        send: false,
        sendId: null,
        proPosal: false,
        arbiNum: null,
        logicState: null,
        batchProPosal: false,
        batchSaveForm: false,
        batchSubmit: false
      },
      fileList: {
        header: [
          {
            title: '角色',
            key: 'peopleType',
            align: 'center',
            render: (h, params) => {
              return h('span', {
              }, params.row.peopleType === '1' ? '申请人' : (params.row.peopleType === '2' ? '被申请人' : ''))
            }
          },
          {
            title: '文件名',
            key: 'filename',
            align: 'center'
          },
          {
            title: '操作',
            key: 'fileId',
            align: 'center',
            render: (h, params) => {
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
                      this.seeDoc(params.row.filepath)
                    }
                  }
                }, '预览'),
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.dowDoc(params.index)
                    }
                  }
                }, '下载')
              ])
            }
          }
        ],
        bodyList: [],
        page: {
          total: 0,
          pageNum: 1,
          pageSize: 5
        },
        caseId: null
      },
      alertShow: {
        ids: [],
        idsList: [],
        batch: false,
        time: false,
        fileIdArr: [],
        find: false,
        noTime: false,
        noBegin: false,
        batchEdit: false,
        batchNo: null,
        batchNoList: [],
        batchUp: false,
        editDataModal: false,
        editDataId: null
      },
      formObj: {
        caseId: null,
        filing: false
      }
    }
  },
  created () {
    this.resCaseList()
  },
  computed: {
    resUploadUrl () {
      return regi.api + '/caseImport/importCaseExt'
    }
  },
  methods: {
    resCaseList () {
      this.spinShow = true
      axios.post('/approve/findGroupApproveList', {
        pageIndex: (this.pageObj.pageNum - 1) * this.pageObj.pageSize,
        pageSize: this.pageObj.pageSize,
        keyword: this.search.text,
        registerToken: this.search.requestName,
        caseTypeCode: this.search.caseType,
        groupApproveType: 'arbitrationSecretary',
        batchCondition: this.search.batchCondition
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
    resTranBook (index) {
      this.alertObj.caseId = this.caseList.bodyList[index].id
      this.alertShow.noBegin = true
    },
    resFileList (index) {
      this.fileList.caseId = this.caseList.bodyList[index].id
      this.sendFileList('once')
    },
    reschangePageF (page) {
      this.fileList.page.pageNum = page
      this.sendFileList('more')
    },
    sendFileList (type) {
      if (type === 'once') {
        this.alertObj.file = true
        axios.post('/case/findCaseFileList', {
          pageIndex: 0,
          pageSize: 999,
          caseId: this.fileList.caseId,
          caseState: 2
        }).then(res => {
          let _data = res.data.data
          for (let k in _data.dataList) {
            if (_data.dataList[k].fileId !== null) {
              this.alertShow.fileIdArr.push(_data.dataList[k].fileId)
            }
          }
        }).catch(e => {
          this.resMessage('error', '错误信息:' + e + ' 稍后再试')
        })
      }
      axios.post('/case/findCaseFileList', {
        pageIndex: (this.fileList.page.pageNum - 1) * this.fileList.page.pageSize,
        pageSize: this.fileList.page.pageSize,
        caseId: this.fileList.caseId,
        caseState: 2
      }).then(res => {
        let _data = res.data.data
        this.fileList.bodyList = _data.dataList === null ? [] : _data.dataList
        this.fileList.page.total = _data.totalCount
      }).catch(e => {
        this.resMessage('error', '错误信息:' + e + ' 稍后再试')
      })
    },
    resSubm (index) {
      this.alertObj.subm = true
      this.alertObj.caseId = this.caseList.bodyList[index].id
    },
    submSave () {
      this.alertObj.subm = false
      axios.post('/approve/updateGroupApprove', {
        caseId: this.alertObj.caseId
      }).then(res => {
        this.alertCanc('subm')
        this.resMessage('success', '操作成功')
        this.resSearch()
      }).catch(e => {
        this.alertCanc('subm')
        this.resMessage('error', '错误信息:' + e + ' 稍后再试')
      })
    },
    resBeginTime (type, index) {
      this.alertObj.begin = true
      this.alertObj.caseId = this.caseList.bodyList[index].id
      this.alertObj.composeTime = this.caseList.bodyList[index].composeTime
      this.alertObj.type = type
    },
    changeDate (val) {
      this.alertObj.time = val
    },
    beginSave () {
      if (this.alertObj.type === 'once') {
        axios.post('/getDateSection').then(res => {
          let _res = res.data.data
          try {
            let _time = this.alertObj.time.substr(0, 10).split('-').join('')
            let _sTime = res.data.data.startDate.split('-').join('')
            let _eTime = res.data.data.endDate.split('-').join('')
            if (_time - _sTime < 0 || _time - _eTime > 0) {
              this.resMessage('warning', '时间范围必须在 ' + _res.startDate + ' 00:00:00 ~ ' + _res.endDate + ' 23:59:59 之间')
            } else {
              this.upTimeSave()
            }
          } catch (e) {
            this.resMessage('error', '调取时间范围出错,稍后再试')
          }
        }).catch(e => {
          this.resMessage('error', '调取时间范围出错,稍后再试')
        })
      } else if (this.alertObj.type === 'edit') {
        axios.post('/getDateSection', {
          baseDate: this.alertObj.composeTime
        }).then(res => {
          let _res = res.data.data
          try {
            let _time = this.alertObj.time.substr(0, 10).split('-').join('')
            let _sTime = res.data.data.startDate.split('-').join('')
            let _eTime = res.data.data.endDate.split('-').join('')
            if (_time - _sTime < 0 || _time - _eTime > 0) {
              this.resMessage('warning', '时间范围必须在 ' + _res.startDate + ' 00:00:00 ~ ' + _res.endDate + ' 23:59:59 之间')
            } else {
              this.upTimeSave()
            }
          } catch (e) {
            this.resMessage('error', '调取时间范围出错,稍后再试')
          }
        }).catch(e => {
          this.resMessage('error', '调取时间范围出错,稍后再试')
        })
      }
    },
    upTimeSave () {
      let _type = null
      if (this.alertObj.type === 'once') {
        _type = 1
      } else if (this.alertObj.type === 'edit') {
        _type = 2
      }
      this.alertObj.begin = false
      axios.post('/approve/updateBeginTime', {
        caseId: this.alertObj.caseId,
        beginTime: this.alertObj.time,
        updateType: _type
      }).then(res => {
        this.alertCanc('begin')
        this.resMessage('success', '操作成功')
        this.resSearch()
      }).catch(e => {
        this.alertCanc('begin')
        this.resMessage('error', '错误信息:' + e + ' 稍后再试')
      })
    },
    resSeeReas (index) {
      this.alertObj.reasText = this.caseList.bodyList[index].caseDocumentReason === null ? '' : this.caseList.bodyList[index].caseDocumentReason
      this.alertObj.reas = true
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
        if (this.search.batchCondition !== '1' && ['16', '17', '18', '1', '4', '19', '20'].indexOf(_obj.logicState) !== -1) {
          this.seleArrChange(item, this.caseList.seleMap[this.pageObj.pageNum])
        }
      })
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
            if (this.search.batchCondition === '2' || this.search.batchCondition === '3') {
              _o.caseId = info.id
              _o.state = info.logicState
              _o.arbitratorIds = ''
            } else if (this.search.batchCondition === '4') {
              _o.caseId = info.id
              _o.formType = 22
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
    resBatch (type) {
      if (this.alertShow.ids.length === 0) {
        this.resMessage('error', '请先选择一个案件')
      } else {
        if (type === 2) {
          this.alertShow.time = true
        } else if (type === 3) {
          this.alertShow.noTime = true
        }
      }
    },
    timeSave () {
      axios.post('/getDateSection').then(res => {
        let _res = res.data.data
        try {
          let _time = this.alertObj.time.substr(0, 10).split('-').join('')
          let _sTime = res.data.data.startDate.split('-').join('')
          let _eTime = res.data.data.endDate.split('-').join('')
          if (_time - _sTime < 0 || _time - _eTime > 0) {
            this.resMessage('warning', '时间范围必须在 ' + _res.startDate + ' 00:00:00 ~ ' + _res.endDate + ' 23:59:59 之间')
          } else {
            this.timesSave()
          }
        } catch (e) {
          this.resMessage('error', '调取时间范围出错,稍后再试')
        }
      }).catch(e => {
        this.resMessage('error', '调取时间范围出错,稍后再试')
      })
    },
    timesSave () {
      this.alertShow.time = false
      axios.post('/batchGroupCourt/updateGroupOpenTime', {
        caseIds: this.alertShow.ids.join(','),
        beginTime: this.alertObj.time,
        updateType: 1
      }).then(res => {
        this.alertCanc('time')
        this.resMessage('success', res.data.data)
        this.resSearch()
      }).catch(e => {
        this.alertCanc('time')
        this.resMessage('error', '错误信息:' + e + ' 稍后再试')
      })
    },
    noTimesSave (type) {
      if (type === 'time') {
        this.alertCanc('noTime')
        axios.post('/batchGroupCourt/updateGroupOpenTime', {
          caseIds: this.alertShow.ids.join(','),
          updateType: 3
        }).then(res => {
          this.resMessage('success', res.data.data)
          this.resSearch()
        }).catch(e => {
          this.resMessage('error', '错误信息:' + e + ' 稍后再试')
        })
      } else if (type === 'begin') {
        this.alertCanc('noBegin')
        axios.post('/approve/updateBeginTime', {
          caseId: this.alertObj.caseId,
          updateType: 3
        }).then(res => {
          this.alertObj.caseId = null
          this.resMessage('success', '操作成功')
          this.resSearch()
        }).catch(e => {
          this.resMessage('error', '错误信息:' + e + ' 稍后再试')
        })
      }
    },
    resSendDoc (index) {
      this.alertObj.sendId = this.caseList.bodyList[index].id
      this.alertObj.send = true
    },
    sendDocSave () {
      this.alertObj.send = false
      axios.post('/electronic/service/102', {
        caseId: this.alertObj.sendId
      }).then(res => {
        this.alertCanc('sendDoc')
        this.resMessage('success', '操作成功')
        this.resCaseList()
      }).catch(e => {
        this.resMessage('error', '错误信息:' + e + ' 稍后再试')
      })
    },
    resEditData (index) {
      let _res = this.caseList.bodyList[index]
      this.alertShow.editDataId = _res.id
      this.alertShow.editDataModal = true
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
        this.resMessage('error', '错误信息:' + e + ' 稍后再试')
      })
    },
    resBatchUp () {
      this.alertShow.batchUp = true
    },
    batchUpSave (obj) {
      this.resSearch()
      this.alertShow.batchUp = false
      this.$Message.success({
        content: obj,
        duration: 10
      })
    },
    resAction (type, data) {
      switch (type) {
        case 'succForm':
          this.formObj.caseId = data.id
          this.formObj.filing = true
          break
        case 'proPosal':
          this.alertObj.caseId = data.id
          this.alertObj.logicState = data.logicState
          this.alertObj.arbiNum = data.arbitratorIdNum
          this.alertObj.proPosal = true
          break
        case 'resPassReve':
          this.alertObj.userId = data.id
          this.alertObj.reve = true
          break
        case 'resBatchProPosal':
          if (this.search.batchCondition !== '2' && this.search.batchCondition !== '3') {
            this.resMessage('error', '请先条件选择 \'批量建议仲裁员\'')
          } else if (this.alertShow.ids.length === 0) {
            this.resMessage('error', '请先选择一个案件')
          } else {
            this.alertObj.arbiNum = this.search.batchCondition === '2' ? 1 : 3
            this.alertObj.batchProPosal = true
          }
          break
        case 'resBatchSaveForm':
          if (this.search.batchCondition !== '4') {
            this.resMessage('error', '请先条件选择 \'批量提交 / 批量保存组庭审批表\'')
          } else if (this.alertShow.ids.length === 0) {
            this.resMessage('error', '请先选择一个案件')
          } else {
            this.alertObj.batchSaveForm = true
          }
          break
        case 'resBatchSubmit':
          if (this.search.batchCondition !== '4') {
            this.resMessage('error', '请先条件选择 \'批量提交 / 批量保存组庭审批表\'')
          } else if (this.alertShow.ids.length === 0) {
            this.resMessage('error', '请先选择一个案件')
          } else {
            this.alertObj.batchSubmit = true
          }
          break
      }
    },
    alertSave (type) {
      switch (type) {
        case 'batchEdit':
          if (this.alertShow.batchNo === null) {
            this.resMessage('error', '请先选择一个批次号')
            return false
          }
          axios.post('/file/addJudgeTemplate', {
            batchNo: this.alertShow.batchNo,
            dataType: 1
          }).then(res => {
            res.data.data.split(',').forEach(b => {
              window.open(b, '_blank')
            })
            this.alertCanc('batchEdit')
          }).catch(e => {
            this.resMessage('error', '错误信息:' + e + ' 稍后再试')
          })
          break
        case 'editData':
          this.alertCanc(type)
          this.resSearch()
          break
        case 'succForm':
          this.formObj.filing = false
          this.formObj.caseId = null
          this.resCaseList()
          break
        case 'proPosal':
          this.alertObj.proPosal = false
          this.alertObj.logicState = null
          this.alertObj.caseId = null
          this.alertObj.arbiNum = null
          this.pageObj.pageNum = 1
          this.resCaseList()
          break
        case 'reve':
          this.alertObj.reve = false
          this.alertObj.userId = null
          this.resCaseList()
          break
        case 'resBatchProPosal':
          this.alertObj.arbiNum = null
          this.alertObj.batchProPosal = false
          this.alertCanc('clearIds')
          this.resCaseList()
          break
        case 'resBatchSaveForm':
          this.alertObj.batchSaveForm = false
          this.alertCanc('clearIds')
          this.resCaseList()
          break
        case 'resBatchSubmit':
          this.alertObj.batchSubmit = false
          this.resSearch()
          break
      }
    },
    alertCanc (type) {
      if (type === 'file') {
        this.alertObj.file = false
        this.fileList.bodyList = []
        this.fileList.page.pageNum = 1
        this.fileList.page.total = 0
        this.fileList.caseId = null
        this.alertShow.fileIdArr = []
      } else if (type === 'subm') {
        this.alertObj.subm = false
        this.alertObj.caseId = null
      } else if (type === 'begin') {
        this.alertObj.begin = false
        this.alertObj.caseId = null
        this.alertObj.composeTime = null
        this.alertObj.time = ''
        this.alertObj.type = null
      } else if (type === 'reve') {
        this.alertShow.reve = false
        this.alertShow.userId = null
      } else if (type === 'reas') {
        this.alertObj.reasText = ''
        this.alertObj.reas = false
      } else if (type === 'time') {
        this.alertShow.time = false
        this.alertObj.time = ''
      } else if (type === 'clearIds') {
        this.alertShow.ids = []
        this.alertShow.idsList = []
        this.caseList.seleMap = {}
      } else if (type === 'sendDoc') {
        this.alertObj.send = false
        this.alertObj.sendId = null
      } else if (type === 'noTime') {
        this.alertShow.noTime = false
      } else if (type === 'noBegin') {
        this.alertShow.noBegin = false
      } else if (type === 'batchEdit') {
        this.alertShow.batchEdit = false
        this.alertShow.batchNo = null
        this.alertShow.batchNoList = []
      } else if (type === 'batchUp') {
        this.alertShow.batchUp = false
      } else if (type === 'editData') {
        this.alertShow.editDataId = null
        this.alertShow.editDataModal = false
      } else if (type === 'succForm') {
        this.formObj.filing = false
        this.formObj.caseId = null
      } else if (type === 'proPosal') {
        this.alertObj.proPosal = false
        this.alertObj.logicState = null
        this.alertObj.caseId = null
        this.alertObj.arbiNum = null
      } else if (type === 'resBatchProPosal') {
        this.alertObj.arbiNum = null
        this.alertObj.batchProPosal = false
        this.alertCanc('clearIds')
      } else if (type === 'resBatchSaveForm') {
        this.alertObj.batchSaveForm = false
        this.alertCanc('clearIds')
      } else if (type === 'resBatchSubmit') {
        this.alertObj.batchSubmit = false
        this.alertCanc('clearIds')
      }
    },
    seeDoc (path) {
      window.open(path, '_blank')
    },
    dowDoc (index) {
      window.open(regi.api + '/file/download/?fileName=' + this.fileList.bodyList[index].filename + '&filePath=' + this.fileList.bodyList[index].filepath, '_blank')
    },
    dowZip () {
      let _fileIds = this.alertShow.fileIdArr.join(',')
      window.open(regi.api + '/file/documentZip/download?fileIds=' + _fileIds, '_blank')
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
