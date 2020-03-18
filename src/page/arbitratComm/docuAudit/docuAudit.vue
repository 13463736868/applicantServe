<template>
  <div class="docuAudit">
    <div class="_center pr">
      <spin-comp :spinShow="spinShow"></spin-comp>
      <Row class="pb20">
        <Col span="2">
          <label class="lh32 f16 fc6 fr mr15">状态选择</label>
        </Col>
        <Col span="3">
          <Select v-model="search.state" @on-change="resSearch">
            <Option value="all" :key="0">全部</Option>
            <Option value="1" :key="1">通过</Option>
            <Option value="2" :key="2">驳回</Option>
            <Option value="3" :key="3">未审核</Option>
          </Select>
        </Col>
        <Col span="19">
          <div class="tr pr20">
            <Button class="ml20" type="primary" @click="resActionFind('resFind', null)" :style="{display: resBtnDis('DOCUAUDIT_QUERY')}">条件搜索</Button>
            <Button class="ml20" type="primary" @click="resBatch(1)" :style="{display: resBtnDis('DOCUAUDIT_BATCHPASS')}">批量通过</Button>
            <Button class="ml20" type="primary" @click="resBatch(2)" :style="{display: resBtnDis('DOCUAUDIT_BATCHREJECTION')}">批量驳回</Button>
          </div>
        </Col>
      </Row>
      <div class="_caseList clearfix">
        <Row>
          <Col span="24" class="pl20 pr20">
            <Table stripe border align="center" :loading="caseList.loading" :columns="caseList.header" :data="caseList.bodyList">
              <template slot-scope="{ row, index }" slot="action">
                <Button class="mr5" type="primary" size="small" :style="{display: resBtnDis('DOCUAUDIT_PREVIWDOC')}" @click="resAction('resPreviwdoc', row)">预览文书</Button>
                <Button class="mr5" type="primary" size="small" v-if="row.isServed === null" :style="{display: resBtnDis('DOCUAUDIT_SERVICE')}" @click="resAction('resService', row)">文书送达</Button>
                <div v-if="row.auditBtn">
                  <Button class="mr5" type="primary" size="small" :style="{display: resBtnDis('DOCUAUDIT_PASS')}" @click="resSaveDocu(index)">通过</Button>
                  <Button class="mr5" type="primary" size="small" :style="{display: resBtnDis('DOCUAUDIT_NOPASS')}" @click="resCancDocu(index)">驳回</Button>
                  <Button v-if="row.source === 1" class="mr5" type="primary" size="small" :style="{display: resBtnDis('DOCUAUDIT_EDIT')}" @click="resEditDocu(index)">修改</Button>
                </div>
              </template>
            </Table>
          </Col>
        </Row>
      </div>
      <div class="_page clearfix">
        <Row>
          <Col span="12" offset="6" class="tc">
            <Page :total="pageObj.total" :current="pageObj.pageNum" :page-size="pageObj.pageSize" show-elevator show-total @on-change="reschangePage" @on-page-size-change="reschangePageSize" show-sizer :page-size-opts="[10, 20, 30, 40, 80, 100, 200]"></Page>
          </Col>
        </Row>
      </div>
    </div>
    <alert-btn-info :alertShow="alertShow.docu" @alertConfirm="docuSave" @alertCancel="alertCanc('docu')" alertTitle="操作">
      <p v-if="alertShow.state === 1">确定要通过吗？</p>
      <p class="mb10" v-if="alertShow.state === 2">确定要驳回吗？</p>
      <Input v-if="alertShow.state === 2" v-model.trim="alertShow.rejeReason" type="textarea" :autosize="{minRows: 3,maxRows: 10}" placeholder="请输入驳回原因..." />
    </alert-btn-info>
    <alert-btn-info :alertShow="alertShow.batch" @alertConfirm="batchSave" @alertCancel="alertCanc('docu')" alertTitle="操作">
      <spin-comp :spinShow="alertShow.spinShow"></spin-comp>
      <p v-if="alertShow.state === 1">确定要通过吗？</p>
      <p class="mb10" v-if="alertShow.state === 2">确定要驳回吗？</p>
      <Input v-if="alertShow.state === 2" v-model.trim="alertShow.rejeReason" type="textarea" :autosize="{minRows: 3,maxRows: 10}" placeholder="请输入驳回原因..." />
    </alert-btn-info>
    <alert-editor v-if="alertShow.editor" :caseId="alertShow.caseId" :docuType="alertShow.docuType" @alertConfirm="alertSave('editDocu')" @alertCancel="alertCanc('editDocu')"></alert-editor>
    <alert-service v-if="alertShow.sendService" :resServiceData="alertShow.serviceData" @alertConfirm="alertSave('resService')" @alertCancel="alertCanc('resService')"></alert-service>
    <res-find v-if="alertShow.find" @alertConfirm="alertSaveFind('find', ...arguments)" @alertCancel="alertCancFind('find')"></res-find>
  </div>
</template>

<script>
import axios from 'axios'
import {resBtn, resPage, resMess, resSearFind} from '@/components/common/mixin.js'
import spinComp from '@/components/common/spin'
import resFind from '@/page/comm/resFind/resFind'
import alertBtnInfo from '@/components/common/alertBtnInfo'
import { caseInfo } from '@/config/common.js'
import alertEditor from '@/page/arbitratComm/docuAudit/children/alertEditor'
import alertService from '@/page/arbitratComm/docuAudit/children/resService'

export default {
  name: 'docu_audit',
  mixins: [resBtn, resPage, resMess, resSearFind],
  components: { spinComp, resFind, alertBtnInfo, alertEditor, alertService },
  data () {
    return {
      spinShow: false,
      search: {
        state: 'all',
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
            renderHeader: (h, params) => {
              return this.renderAllSele(h, params)
            },
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
              }, params.row.CODE)
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
            title: '被申请人',
            key: 'respondentName',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '代理人',
            key: 'proxyName',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '秘书',
            key: 'firstSecretary',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '文书类型',
            key: 'caseDocumentType',
            align: 'center'
          },
          {
            title: '创建时间',
            key: 'createtime',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '审核状态',
            key: 'caseDocuemntApproveState',
            align: 'center',
            render: (h, params) => {
              return h('span', {
              }, params.row.caseDocuemntApproveState === 1 ? '通过' : (params.row.caseDocuemntApproveState === 2 ? '驳回' : (params.row.caseDocuemntApproveState === 3 ? '未审核' : (params.row.caseDocuemntApproveState === 5 ? '审核中' : ''))))
            }
          },
          {
            title: '操作',
            key: 'id',
            align: 'center',
            minWidth: 98,
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
      alertShow: {
        spinShow: false,
        state: null,
        docu: false,
        id: null,
        caseDocuId: null,
        rejeReason: '',
        idsList: [],
        ids: [],
        batch: false,
        find: false,
        editor: false,
        caseId: null,
        docuType: null,
        sendService: false,
        serviceData: null
      }
    }
  },
  created () {
    this.resCaseList()
  },
  methods: {
    resCaseList () {
      this.spinShow = true
      axios.post('/approve/findCaseDocumentList', {
        pageIndex: (this.pageObj.pageNum - 1) * this.pageObj.pageSize,
        pageSize: this.pageObj.pageSize,
        registerToken: this.search.requestName,
        caseTypeCode: this.search.caseType,
        state: this.search.state === 'all' ? null : this.search.state
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
    // resSeeDocu (path) {
    //   if (path === null || path === '') {
    //     this.$Message.error({
    //       content: '获取文书地址出错',
    //       duration: 5
    //     })
    //   } else {
    //     window.open(path, '_blank')
    //   }
    // },
    resSaveDocu (index) {
      this.alertShow.id = this.caseList.bodyList[index].id
      this.alertShow.caseDocuId = this.caseList.bodyList[index].caseDocuemntId
      this.alertShow.state = 1
      this.alertShow.docu = true
    },
    resCancDocu (index) {
      this.alertShow.id = this.caseList.bodyList[index].id
      this.alertShow.caseDocuId = this.caseList.bodyList[index].caseDocuemntId
      this.alertShow.state = 2
      this.alertShow.docu = true
    },
    docuSave () {
      if (this.alertShow.state === 2) {
        if (this.alertShow.rejeReason === '') {
          this.resMessage('warning', '请填写驳回原因')
        } else {
          this.alertShow.docu = false
          axios.post('/approve/updateCaseDocumentByApprove', {
            caseId: this.alertShow.id,
            caseDocumentApprove: this.alertShow.state,
            caseDocuemntId: this.alertShow.caseDocuId,
            caseDocumentReason: this.alertShow.rejeReason
          }).then(res => {
            this.alertCanc('docu')
            this.resMessage('success', '操作成功')
            this.resSearch()
          }).catch(e => {
            this.alertCanc('docu')
            this.resMessage('error', '错误信息:' + e + ' 稍后再试')
          })
        }
      } else {
        this.alertShow.docu = false
        axios.post('/approve/updateCaseDocumentByApprove', {
          caseId: this.alertShow.id,
          caseDocumentApprove: this.alertShow.state,
          caseDocuemntId: this.alertShow.caseDocuId
        }).then(res => {
          this.alertCanc('docu')
          this.resMessage('success', '操作成功')
          this.resSearch()
        }).catch(e => {
          this.alertCanc('docu')
          this.resMessage('error', '错误信息:' + e + ' 稍后再试')
        })
      }
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
        if (_obj.caseDocuemntApproveState === 3) {
          this.seleArrChange(item, this.caseList.seleMap[this.pageObj.pageNum])
        }
      })
    },
    renderCheck (h, params) {
      let _obj = params.row
      if (_obj.caseDocuemntApproveState === 3) {
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
          if (this.alertShow.ids.length >= 200) {
            this.resMessage('error', '最多只能选择二百个案件')
            return false
          } else {
            let _o = {}
            _o.caseId = info.id
            _o.documentId = info.caseDocuemntId
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
      this.alertShow.state = type
      this.alertShow.batch = true
      if (this.alertShow.ids.length === 0) {
        this.resMessage('error', '请先选择一个案件')
      } else {
        this.alertShow.state = type
        this.alertShow.batch = true
      }
    },
    batchSave () {
      if (this.alertShow.state === 2) {
        if (this.alertShow.rejeReason === '') {
          this.resMessage('warning', '请填写驳回原因')
        } else {
          this.alertShow.docu = false
          axios.post('/approve/caseDocumentBatch', {
            caseDocumentIds: JSON.stringify(this.alertShow.idsList),
            caseDocumentApprove: this.alertShow.state,
            caseDocumentReason: this.alertShow.rejeReason
          }).then(res => {
            this.alertCanc('docu')
            this.alertShow.idsList = []
            this.alertShow.ids = []
            this.$Message.success({
              content: res.data.message,
              duration: 2
            })
            this.resSearch()
          }).catch(e => {
            this.alertCanc('docu')
            this.resMessage('error', '错误信息:' + e + ' 稍后再试')
          })
        }
      } else {
        this.alertShow.spinShow = true
        this.alertShow.docu = false
        axios.post('/approve/caseDocumentBatch', {
          caseDocumentIds: JSON.stringify(this.alertShow.idsList),
          caseDocumentApprove: this.alertShow.state
        }).then(res => {
          this.alertCanc('docu')
          this.alertShow.idsList = []
          this.alertShow.ids = []
          this.$Message.success({
            content: res.data.message,
            duration: 2
          })
          this.resSearch()
        }).catch(e => {
          this.alertCanc('docu')
          this.resMessage('error', '错误信息:' + e + ' 稍后再试')
        })
      }
    },
    resEditDocu (index) {
      let info = this.caseList.bodyList[index]
      this.alertShow.caseId = info.id
      this.alertShow.docuType = info.type
      this.alertShow.editor = true
    },
    resAction (type, data) {
      switch (type) {
        case 'resService':
          this.alertShow.sendService = true
          this.alertShow.serviceData = data
          break
        case 'resPreviwdoc':
          if (data.filePath === null || data.filePath === '') {
            this.resMessage('error', '获取文书地址出错')
          } else {
            window.open(data.filePath, '_blank')
          }
          break
      }
    },
    alertSave (type) {
      switch (type) {
        case 'editDocu':
          this.alertShow.editor = false
          this.alertShow.caseId = null
          this.alertShow.docuType = null
          // this.pageObj.pageNum = 1
          this.resCaseList()
          break
        case 'resService':
          this.alertShow.sendService = false
          this.alertShow.serviceData = null
          // this.pageObj.pageNum = 1
          this.resCaseList()
          break
      }
    },
    alertCanc (type) {
      switch (type) {
        case 'docu':
          this.alertShow.docu = false
          this.alertShow.id = null
          this.alertShow.state = null
          this.alertShow.caseDocuId = null
          this.alertShow.rejeReason = ''
          this.alertShow.batch = false
          break
        case 'clearIds':
          this.alertShow.idsList = []
          this.alertShow.ids = []
          this.caseList.seleMap = {}
          break
        case 'editDocu':
          this.alertShow.editor = false
          this.alertShow.caseId = null
          this.alertShow.docuType = null
          break
        case 'resService':
          this.alertShow.sendService = false
          this.alertShow.serviceData = null
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
