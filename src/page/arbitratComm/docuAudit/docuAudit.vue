<template>
  <div class="docuAudit">
    <div class="_center pr">
      <spin-comp :spinShow="spinShow"></spin-comp>
      <Row class="pb20">
        <Col span="18">
          &nbsp;
        </Col>
        <Col span="2">
          <Button type="primary" @click="resFind" :style="{display: resBtnDis('DOCUAUDIT_QUERY')}">条件搜索</Button>
        </Col>
        <Col span="2">
          <Button type="primary" @click="resBatch(1)" :style="{display: resBtnDis('DOCUAUDIT_BATCHPASS')}">批量通过</Button>
        </Col>
        <Col span="2">
          <Button type="primary" @click="resBatch(2)" :style="{display: resBtnDis('DOCUAUDIT_BATCHREJECTION')}">批量驳回</Button>
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
    <alert-btn-info :alertShow="alertShow.docu" @alertConfirm="docuSave" @alertCancel="alertCanc('docu')" alertTitle="操作">
      <p v-if="alertShow.state === 1">确定要通过吗？</p>
      <p class="mb10" v-if="alertShow.state === 2">确定要驳回吗？</p>
      <Input v-if="alertShow.state === 2" v-model.trim="alertShow.rejeReason" type="textarea" :autosize="{minRows: 3,maxRows: 10}" placeholder="请输入驳回原因..." />
    </alert-btn-info>
    <alert-btn-info :alertShow="alertShow.batch" @alertConfirm="batchSave" @alertCancel="alertCanc('docu')" alertTitle="操作">
      <p v-if="alertShow.state === 1">确定要通过吗？</p>
      <p class="mb10" v-if="alertShow.state === 2">确定要驳回吗？</p>
      <Input v-if="alertShow.state === 2" v-model.trim="alertShow.rejeReason" type="textarea" :autosize="{minRows: 3,maxRows: 10}" placeholder="请输入驳回原因..." />
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
    <alert-editor v-if="alertShow.editor" :caseId="alertShow.caseId" :docuType="alertShow.docuType" @alertConfirm="alertSave('resEditDocu')" @alertCancel="alertCanc('resEditDocu')"></alert-editor>
  </div>
</template>

<script>
import axios from 'axios'
import {resBtn} from '@/components/common/mixin.js'
import headTop from '@/components/header/head'
import spinComp from '@/components/common/spin'
import alertBtnInfo from '@/components/common/alertBtnInfo'
import alertEditor from '@/page/arbitratComm/docuAudit/children/alertEditor'
import { caseInfo } from '@/config/common.js'

export default {
  name: 'docu_audit',
  mixins: [resBtn],
  components: { headTop, spinComp, alertBtnInfo, alertEditor },
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
            title: '第一秘书',
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
              }, params.row.caseDocuemntApproveState === 1 ? '通过' : (params.row.caseDocuemntApproveState === 2 ? '驳回' : (params.row.caseDocuemntApproveState === 3 ? '未审核' : '')))
            }
          },
          {
            title: '操作',
            key: 'id',
            align: 'center',
            minWidth: 98,
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
        docuType: null
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
    renderBtn (h, params) {
      let _obj = params.row
      if (_obj.caseDocuemntApproveState === null || _obj.caseDocuemntApproveState === 3) {
        return h('div', [
          h('Button', {
            props: {
              type: 'primary',
              size: 'small'
            },
            style: {
              marginRight: '5px',
              display: this.resBtnDis('DOCUAUDIT_PREVIWDOC')
            },
            on: {
              click: () => {
                this.resSeeDocu(params.row.filePath)
              }
            }
          }, '预览文书'),
          h('Button', {
            props: {
              type: 'primary',
              size: 'small'
            },
            style: {
              marginRight: '5px',
              display: this.resBtnDis('DOCUAUDIT_PASS')
            },
            on: {
              click: () => {
                this.resSaveDocu(params.index)
              }
            }
          }, '通过'),
          h('Button', {
            props: {
              type: 'primary',
              size: 'small'
            },
            style: {
              marginRight: '5px',
              display: this.resBtnDis('DOCUAUDIT_NOPASS')
            },
            on: {
              click: () => {
                this.resCancDocu(params.index)
              }
            }
          }, '驳回'),
          h('Button', {
            props: {
              type: 'primary',
              size: 'small'
            },
            style: {
              marginRight: '5px',
              display: _obj.editFlag === 0 ? 'none' : ''
            },
            on: {
              click: () => {
                this.resAction('resEditDocu', _obj)
              }
            }
          }, '修改')
        ])
      } else {
        return h('div', [
          h('Button', {
            props: {
              type: 'primary',
              size: 'small'
            },
            style: {
              marginRight: '5px',
              display: this.resBtnDis('DOCUAUDIT_PREVIWDOC')
            },
            on: {
              click: () => {
                this.resSeeDocu(params.row.filePath)
              }
            }
          }, '预览文书')
        ])
      }
    },
    resCaseList () {
      this.spinShow = true
      axios.post('/approve/findCaseDocumentList', {
        pageIndex: (this.pageObj.pageNum - 1) * this.pageObj.pageSize,
        pageSize: this.pageObj.pageSize,
        registerToken: this.search.requestName,
        caseTypeCode: this.search.caseType
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
      // this.pageObj.pageNum = 1
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
    resSeeDocu (path) {
      if (path === null || path === '') {
        this.$Message.error({
          content: '获取文书地址出错',
          duration: 5
        })
      } else {
        window.open(path, '_blank')
      }
    },
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
          this.$Message.warning({
            content: '请填写驳回原因',
            duration: 5
          })
        } else {
          this.alertShow.docu = false
          axios.post('/approve/updateCaseDocumentByApprove', {
            caseId: this.alertShow.id,
            caseDocumentApprove: this.alertShow.state,
            caseDocuemntId: this.alertShow.caseDocuId,
            caseDocumentReason: this.alertShow.rejeReason
          }).then(res => {
            this.alertCanc('docu')
            this.$Message.success({
              content: '操作成功',
              duration: 2
            })
            this.resSearch()
          }).catch(e => {
            this.alertCanc('docu')
            this.$Message.error({
              content: '错误信息:' + e + ' 稍后再试',
              duration: 5
            })
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
          this.$Message.success({
            content: '操作成功',
            duration: 2
          })
          this.resSearch()
        }).catch(e => {
          this.alertCanc('docu')
          this.$Message.error({
            content: '错误信息:' + e + ' 稍后再试',
            duration: 5
          })
        })
      }
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
      if (this.alertShow.ids.length === 0) {
        this.$Message.error({
          content: '请先选择一个案件',
          duration: 5
        })
      } else {
        this.alertShow.state = type
        this.alertShow.batch = true
      }
    },
    batchSave () {
      if (this.alertShow.state === 2) {
        if (this.alertShow.rejeReason === '') {
          this.$Message.warning({
            content: '请填写驳回原因',
            duration: 5
          })
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
            this.$Message.error({
              content: '错误信息:' + e + ' 稍后再试',
              duration: 5
            })
          })
        }
      } else {
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
    resAction (type, data) {
      switch (type) {
        case 'resEditDocu':
          this.alertShow.caseId = data.id
          this.alertShow.docuType = data.type
          this.alertShow.editor = true
          break
      }
    },
    alertSave (type) {
      switch (type) {
        case 'resEditDocu':
          this.alertShow.editor = false
          this.alertShow.caseId = null
          this.alertShow.docuType = null
          // this.pageObj.pageNum = 1
          this.resCaseList()
          break
      }
    },
    alertCanc (type) {
      switch (type) {
        case 'resEditDocu':
          this.alertShow.editor = false
          this.alertShow.caseId = null
          this.alertShow.docuType = null
          break
        case 'docu':
          this.alertShow.docu = false
          this.alertShow.id = null
          this.alertShow.state = null
          this.alertShow.caseDocuId = null
          this.alertShow.rejeReason = ''
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
