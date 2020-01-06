<template>
  <div class="docuRevise">
    <div class="_center pr">
      <spin-comp :spinShow="spinShow"></spin-comp>
      <Row class="pb20">
        <Col span="22">
          &nbsp;
        </Col>
        <Col span="2">
          <Button type="primary" @click="resFind" :style="{display: resBtnDis('DOCUAUDIT_QUERY')}">条件搜索</Button>
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
    <res-submit v-if="alertObj.resSubmit" :resVal="alertObj.resSubmitData" @alertConfirm="alertSave('resSubmit')" @alertCancel="alertCanc('resSubmit')"></res-submit>
    <res-upload-doc v-if="alertObj.resUploadDoc" :resVal="alertObj.resUploadDocData" @alertConfirm="alertSave('resUploadDoc')" @alertCancel="alertCanc('resUploadDoc')"></res-upload-doc>
  </div>
</template>

<script>
import axios from 'axios'
import {resBtn} from '@/components/common/mixin.js'
import headTop from '@/components/header/head'
import spinComp from '@/components/common/spin'
import alertBtnInfo from '@/components/common/alertBtnInfo'
import alertEditor from '@/page/arbitrator/docuRevise/children/alertEditor'
import resSubmit from '@/page/arbitrator/docuRevise/children/resSubmit'
import resUploadDoc from '@/page/arbitrator/docuRevise/children/resUploadDoc'
import { caseInfo } from '@/config/common.js'

export default {
  name: 'docuRevise',
  mixins: [resBtn],
  components: { headTop, spinComp, alertBtnInfo, alertEditor, resSubmit, resUploadDoc },
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
              }, params.row.caseDocuemntApproveState === 1 ? '通过' : (params.row.caseDocuemntApproveState === 2 ? '驳回' : (params.row.caseDocuemntApproveState === 3 ? '未审核' : (params.row.caseDocuemntApproveState === 0 ? '待提交' : ''))))
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
        id: null,
        idsList: [],
        ids: [],
        find: false,
        editor: false,
        caseId: null,
        docuType: null
      },
      alertObj: {
        resSubmit: false,
        resSubmitData: null,
        resUploadDoc: null,
        resUploadDocData: null
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
      if (_obj.submitFlag === 1) {
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
              display: _obj.editFlag === 1 ? '' : 'none'
            },
            on: {
              click: () => {
                this.resAction('resEditDocu', _obj)
              }
            }
          }, '修改'),
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
                this.resAction('resUploadDoc', _obj)
              }
            }
          }, '更新文书'),
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
                this.resAction('resSubmit', _obj)
              }
            }
          }, '提交')
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
                this.resSeeDocu(params.row.filePath)
              }
            }
          }, '预览文书')
        ])
      }
    },
    resCaseList () {
      this.spinShow = true
      axios.post('/approve/updateDocumentList', {
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
        case 'resSubmit':
          this.alertObj.resSubmitData = {
            documentId: data.caseDocuemntId
          }
          this.alertObj.resSubmit = true
          break
        case 'resUploadDoc':
          this.alertObj.resUploadDocData = {
            documentId: data.caseDocuemntId
          }
          this.alertObj.resUploadDoc = true
          break
      }
    },
    alertSave (type) {
      switch (type) {
        case 'resEditDocu':
          this.alertShow.editor = false
          this.alertShow.caseId = null
          this.alertShow.docuType = null
          this.pageObj.pageNum = 1
          this.resCaseList()
          break
        case 'resSubmit':
          this.alertObj.resSubmit = false
          this.alertObj.resSubmitData = null
          this.pageObj.pageNum = 1
          this.resCaseList()
          break
        case 'resUploadDoc':
          this.alertObj.resUploadDoc = false
          this.alertObj.resUploadDocData = null
          this.pageObj.pageNum = 1
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
        case 'resSubmit':
          this.alertObj.resSubmit = false
          this.alertObj.resSubmitData = null
          break
        case 'resUploadDoc':
          this.alertObj.resUploadDoc = false
          this.alertObj.resUploadDocData = null
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
