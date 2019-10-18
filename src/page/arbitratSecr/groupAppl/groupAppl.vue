<template>
  <div class="groupAppl">
    <div class="_center pr">
      <spin-comp :spinShow="spinShow"></spin-comp>
      <Row class="pb20 tc">
        <Col span="10">
          &nbsp;
        </Col>
        <Col span="2">
          <Button type="primary" @click="resBatchUp" :style="{display: resBtnDis('GROUPAPPL_UPLOAD_DATA')}">上传数据</Button>
        </Col>
        <Col span="2">
          <Button type="primary" @click="resBatchEdit" :style="{display: resBtnDis('GROUPAPPL_BATCH_MODIFICATION')}">批量下载</Button>
        </Col>
        <Col span="2">
          <Button type="primary" @click="resFind" :style="{display: resBtnDis('GROUPAPPL_QUERY')}">条件搜索</Button>
        </Col>
        <Col span="2">
          <Button type="primary" @click="resBatch(1)" :style="{display: resBtnDis('GROUPAPPL_BATCHSUBMIT')}">批量提交</Button>
        </Col>
        <Col span="3">
          <Button type="primary" @click="resBatch(2)" :style="{display: resBtnDis('GROUPAPPL_BATCHDATE')}">批量指定开庭时间</Button>
        </Col>
        <Col span="3">
          <Button type="primary" @click="resBatch(3)" :style="{display: resBtnDis('GROUPAPPL_BATCHHEAR')}">批量书面审理</Button>
        </Col>
      </Row>
      <div class="_caseList clearfix">
        <Row>
          <Col span="24" class="pl20 pr20">
            <Table stripe border align="center" :loading="caseList.loading" :columns="caseList.header" :data="caseList.bodyList">
              <template slot-scope="{ row, index }" slot="action">
                <Button :style="{display: resBtnDis('GROUPAPPL_SUBMIT')}" class="mr5" type="primary" size="small" v-if="row.logicState === '1' || row.logicState === '4'" @click="resSubm(index)">提交</Button>
                <Button :style="{display: resBtnDis('GROUPAPPL_APPROVAL')}" class="mr5" type="primary" size="small" v-if="row.logicState === '1' || row.logicState === '4'" @click="resAction('succForm', row)">组庭审批表</Button>
                <Button :style="{display: resBtnDis('GROUPAPPL_WITHDRAW')}" class="mr5" type="primary" size="small" v-if="row.logicState === '2'" @click="resPassReve(index)">同意撤回</Button>
                <Button :style="{display: resBtnDis('GROUPAPPL_REASON')}" class="mr5" type="primary" size="small" v-if="row.logicState === '3'" @click="resSeeReas(index)">查看原因</Button>
                <Button :style="{display: resBtnDis('GROUPAPPL_REGEN')}" class="mr5" type="primary" size="small" v-if="row.logicState === '3'" @click="resPassReve(index)">重新生成撤回书</Button>
                <Button :style="{display: resBtnDis('GROUPAPPL_PROPOSAL')}" class="mr5" type="primary" size="small" v-if="row.logicState === '17'" @click="resAction('proPosal', row)">建议仲裁员</Button>
                <Button :style="{display: resBtnDis('GROUPAPPL_VIEWFILE')}" class="mr5" type="primary" size="small" v-if="row.logicState === '4' || row.logicState === '6' || row.logicState === '8' || row.logicState === '9' || row.logicState === '10' || row.logicState === '12' || row.logicState === '13' || row.logicState === '14'" @click="resFileList(index)">查看文件</Button>
                <Button :style="{display: resBtnDis('GROUPAPPL_UPDATEDATE')}" class="mr5" type="primary" size="small" v-if="row.logicState === '5' || row.logicState === '6' || row.logicState === '12'"  @click="resBeginTime('edit', index)">修改开庭时间</Button>
                <Button :style="{display: resBtnDis('GROUPAPPL_APPOINTDATE')}" class="mr5" type="primary" size="small" v-if="row.logicState === '7' || row.logicState === '8'" @click="resBeginTime('once', index)">指定开庭时间</Button>
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
    <create-docu :alertShow="alertObj.reve" @alertConfirm="docuSave('reve')" @alertSee="seeDocu('reve')" @alertCancel="alertCanc('reve')" alertTitle="操作">
      <Row class="_labelFor">
        <Col span="6" offset="1">
          <p><span class="_span">*</span><b>合同名称：</b></p>
        </Col>
        <Col span="16">
          <Input v-model="alertObj.contractName"></Input>
        </Col>
      </Row>
    </create-docu>
    <alert-btn-info :alertShow="alertObj.reas" :isSaveBtn="true" @alertCancel="alertCanc('reas')" alertTitle="撤案驳回原因">
      <p class="t2" v-text="alertObj.reasText"></p>
    </alert-btn-info>
    <alert-btn-info :alertShow="alertShow.batch" @alertConfirm="batchSave" @alertCancel="alertCanc('batch')" alertTitle="操作">
      <p>确定要提交吗？</p>
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
    <edit-data-modal v-if="alertShow.editDataModal" :editDataId="alertShow.editDataId" @alertConfirm="alertSave('editData')" @alertCancel="alertCanc('editData')"></edit-data-modal>
    <group-Appr-form v-if="formObj.filing" :caseId="formObj.caseId" @alertConfirm="alertSava('succForm')" @alertCancel="alertCanc('succForm')"></group-Appr-form>
    <res-pro-posal v-if="alertObj.proPosal" :resCaseId="alertObj.caseId" @alertConfirm="alertSava('proPosal')" @alertCancel="alertCanc('proPosal')"></res-pro-posal>
  </div>
</template>

<script>
import axios from 'axios'
import {resBtn} from '@/components/common/mixin.js'
import spinComp from '@/components/common/spin'
import createDocu from '@/components/common/createDocu'
import alertBtnInfo from '@/components/common/alertBtnInfo'
import uploadBook from '@/components/common/uploadBook'
import editDataModal from '@/page/arbitratSecr/groupAppl/children/editDataModal'
import resProPosal from '@/page/arbitratSecr/groupAppl/children/resProPosal'
import groupApprForm from '@/page/comm/apprForm/groupApprForm'
import { caseInfo } from '@/config/common.js'
import regi from '@/config/regiType.js'

export default {
  name: 'group_appl',
  mixins: [resBtn],
  components: { spinComp, createDocu, alertBtnInfo, uploadBook, editDataModal, resProPosal, groupApprForm },
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
              return this.renderCheck(h, params)
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
            title: '案件类型',
            key: 'caseTypeName',
            tooltip: 'true',
            align: 'center'
          },
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
            title: '确认仲裁员',
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
            align: 'center',
            minWidth: 100,
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
      alertObj: {
        file: false,
        subm: false,
        begin: false,
        caseId: null,
        composeTime: null,
        time: '',
        type: null,
        userId: null,
        docuType: null,
        reve: false,
        contractName: '',
        reasText: '',
        reas: false,
        send: false,
        sendId: null,
        proPosal: false
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
        batch: false,
        state: [],
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
    resCaseList () {
      this.spinShow = true
      axios.post('/approve/findGroupApproveList', {
        pageIndex: (this.pageObj.pageNum - 1) * this.pageObj.pageSize,
        pageSize: this.pageObj.pageSize,
        registerToken: this.search.requestName,
        caseTypeCode: this.search.caseType,
        groupApproveType: 'arbitrationSecretary'
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
          this.$Message.error({
            content: '错误信息:' + e + ' 稍后再试',
            duration: 5
          })
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
        this.$Message.error({
          content: '错误信息:' + e + ' 稍后再试',
          duration: 5
        })
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
        this.$Message.success({
          content: '操作成功',
          duration: 2
        })
        this.resSearch()
      }).catch(e => {
        this.alertCanc('subm')
        this.$Message.error({
          content: '错误信息:' + e + ' 稍后再试',
          duration: 5
        })
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
              this.$Message.warning({
                content: '时间范围必须在 ' + _res.startDate + ' 00:00:00 ~ ' + _res.endDate + ' 23:59:59 之间',
                duration: 6
              })
            } else {
              this.upTimeSave()
            }
          } catch (e) {
            this.$Message.error({
              content: '调取时间范围出错,稍后再试',
              duration: 5
            })
          }
        }).catch(e => {
          this.$Message.error({
            content: '调取时间范围出错,稍后再试',
            duration: 5
          })
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
              this.$Message.warning({
                content: '时间范围必须在 ' + _res.startDate + ' 00:00:00 ~ ' + _res.endDate + ' 23:59:59 之间',
                duration: 6
              })
            } else {
              this.upTimeSave()
            }
          } catch (e) {
            this.$Message.error({
              content: '调取时间范围出错,稍后再试',
              duration: 5
            })
          }
        }).catch(e => {
          this.$Message.error({
            content: '调取时间范围出错,稍后再试',
            duration: 5
          })
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
        this.$Message.success({
          content: '操作成功',
          duration: 2
        })
        this.resSearch()
      }).catch(e => {
        this.alertCanc('begin')
        this.$Message.error({
          content: '错误信息:' + e + ' 稍后再试',
          duration: 5
        })
      })
    },
    resPassReve (index) {
      let res = this.caseList.bodyList[index]
      this.alertObj.userId = res.id
      this.alertObj.docuType = 4
      this.alertObj.reve = true
    },
    docuSave (type) {
      if (type === 'reve') {
        if (this.alertObj.contractName === '') {
          this.$Message.warning({
            content: '请填写合同名称',
            duration: 5
          })
        } else {
          this.alertObj.reve = false
          axios.post('/case/addDocumentFile', {
            caseId: this.alertObj.userId,
            documentType: this.alertObj.docuType,
            jsonData: JSON.stringify({contractName: this.alertObj.contractName})
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
      }
    },
    seeDocu (type) {
      if (type === 'reve') {
        if (this.alertObj.contractName === '') {
          this.$Message.warning({
            content: '请填写合同名称',
            duration: 5
          })
        } else {
          axios.post('/case/previewDocumentFile', {
            caseId: this.alertObj.userId,
            documentType: this.alertObj.docuType,
            jsonData: JSON.stringify({contractName: this.alertObj.contractName})
          }).then(res => {
            window.open(res.data.data.filepath, '_blank')
          }).catch(e => {
            this.$Message.error({
              content: '错误信息:' + e + ' 稍后再试',
              duration: 5
            })
          })
        }
      }
    },
    resSeeReas (index) {
      this.alertObj.reasText = this.caseList.bodyList[index].caseDocumentReason === null ? '' : this.caseList.bodyList[index].caseDocumentReason
      this.alertObj.reas = true
    },
    renderCheck (h, params) {
      let _obj = params.row
      if (_obj.logicState === '1' || _obj.logicState === '4' || _obj.logicState === '7' || _obj.logicState === '8') {
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
        if (this.alertShow.state.length === 0) {
          if (this.alertShow.ids.indexOf(info.id) === -1) {
            if (this.alertShow.ids.length >= 10) {
              this.$Message.error({
                content: '最多只能选择十个案件',
                duration: 5
              })
              return false
            } else {
              if (info.logicState === '1' || info.logicState === '4') {
                if (this.alertShow.state.length === 0) {
                  this.alertShow.state.push('1')
                }
                this.alertShow.ids.push(info.id)
              } else if (info.logicState === '7' || info.logicState === '8') {
                if (this.alertShow.state.length === 0) {
                  this.alertShow.state.push('7')
                }
                this.alertShow.ids.push(info.id)
              }
            }
          }
        } else if (this.alertShow.state.length === 1) {
          if (this.alertShow.state[0] === '1') {
            if (info.logicState === '1' || info.logicState === '4') {
              if (this.alertShow.ids.indexOf(info.id) === -1) {
                if (this.alertShow.ids.length >= 10) {
                  this.$Message.error({
                    content: '最多只能选择十个案件',
                    duration: 5
                  })
                  return false
                } else {
                  if (info.logicState === '1' || info.logicState === '4') {
                    if (this.alertShow.state.length === 0) {
                      this.alertShow.state.push('1')
                    }
                    this.alertShow.ids.push(info.id)
                  }
                }
              }
            } else {
              this.$Message.error({
                content: '不能同时选择待提交案件，和待指定开庭时间案件',
                duration: 5
              })
              return false
            }
          } else if (this.alertShow.state[0] === '7') {
            if (info.logicState === '7' || info.logicState === '8') {
              if (this.alertShow.ids.indexOf(info.id) === -1) {
                if (this.alertShow.ids.length >= 10) {
                  this.$Message.error({
                    content: '最多只能选择十个案件',
                    duration: 5
                  })
                  return false
                } else {
                  if (info.logicState === '7' || info.logicState === '8') {
                    if (this.alertShow.state.length === 0) {
                      this.alertShow.state.push('7')
                    }
                    this.alertShow.ids.push(info.id)
                  }
                }
              }
            } else {
              this.$Message.error({
                content: '不能同时选择待提交案件，和待指定开庭时间案件',
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
        if (type === 1) {
          if (this.alertShow.state[0] === '1') {
            this.alertShow.batch = true
          } else {
            this.$Message.error({
              content: '当前选择的案件只能批量指定开庭时间或者书面审理',
              duration: 5
            })
          }
        } else if (type === 2 || type === 3) {
          if (this.alertShow.state[0] === '7') {
            if (type === 2) {
              this.alertShow.time = true
            } else if (type === 3) {
              this.alertShow.noTime = true
            }
          } else {
            this.$Message.error({
              content: '当前选择的案件只能批量提交',
              duration: 5
            })
          }
        }
      }
    },
    batchSave () {
      this.alertShow.batch = false
      axios.post('/batchGroupCourt/saveGroupCourtBatch', {
        caseIds: this.alertShow.ids.join(',')
      }).then(res => {
        this.alertCanc('batch')
        this.$Message.success({
          content: res.data.data,
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
    timeSave () {
      axios.post('/getDateSection').then(res => {
        let _res = res.data.data
        try {
          let _time = this.alertObj.time.substr(0, 10).split('-').join('')
          let _sTime = res.data.data.startDate.split('-').join('')
          let _eTime = res.data.data.endDate.split('-').join('')
          if (_time - _sTime < 0 || _time - _eTime > 0) {
            this.$Message.warning({
              content: '时间范围必须在 ' + _res.startDate + ' 00:00:00 ~ ' + _res.endDate + ' 23:59:59 之间',
              duration: 6
            })
          } else {
            this.timesSave()
          }
        } catch (e) {
          this.$Message.error({
            content: '调取时间范围出错,稍后再试',
            duration: 5
          })
        }
      }).catch(e => {
        this.$Message.error({
          content: '调取时间范围出错,稍后再试',
          duration: 5
        })
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
        this.$Message.success({
          content: res.data.data,
          duration: 2
        })
        this.resSearch()
      }).catch(e => {
        this.alertCanc('time')
        this.$Message.error({
          content: '错误信息:' + e + ' 稍后再试',
          duration: 5
        })
      })
    },
    noTimesSave (type) {
      if (type === 'time') {
        this.alertCanc('noTime')
        axios.post('/batchGroupCourt/updateGroupOpenTime', {
          caseIds: this.alertShow.ids.join(','),
          updateType: 3
        }).then(res => {
          this.$Message.success({
            content: res.data.data,
            duration: 2
          })
          this.resSearch()
        }).catch(e => {
          this.$Message.error({
            content: '错误信息:' + e + ' 稍后再试',
            duration: 5
          })
        })
      } else if (type === 'begin') {
        this.alertCanc('noBegin')
        axios.post('/approve/updateBeginTime', {
          caseId: this.alertObj.caseId,
          updateType: 3
        }).then(res => {
          this.alertObj.caseId = null
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
        this.$Message.error({
          content: '错误信息:' + e + ' 稍后再试',
          duration: 5
        })
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
            dataType: 1
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
      }
    },
    resAction (type, data) {
      switch (type) {
        case 'succForm':
          this.formObj.caseId = data.id
          this.formObj.filing = true
          break
        case 'proPosal':
          this.alertObj.caseId = data.id
          this.alertObj.proPosal = true
          break
      }
    },
    alertSava (type) {
      switch (type) {
        case 'succForm':
          this.formObj.filing = false
          this.formObj.caseId = null
          this.pageObj.pageNum = 1
          this.resCaseList()
          break
        case 'proPosal':
          this.alertObj.proPosal = false
          this.alertObj.caseId = null
          this.pageObj.pageNum = 1
          this.resCaseList()
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
        this.alertObj.contractName = ''
        this.alertObj.userId = null
        this.alertObj.docuType = null
        this.alertObj.reve = false
      } else if (type === 'reas') {
        this.alertObj.reasText = ''
        this.alertObj.reas = false
      } else if (type === 'batch') {
        this.alertShow.batch = false
      } else if (type === 'time') {
        this.alertShow.time = false
        this.alertObj.time = ''
      } else if (type === 'find') {
        this.alertShow.find = false
        this.search.requestName = ''
        this.search.caseType = ''
        // this.search.caseTypeList = {}
        // this.search.requestNameList = []
      } else if (type === 'clearIds') {
        this.alertShow.ids = []
        this.alertShow.state = []
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
        this.alertObj.caseId = null
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
