<template>
  <div class="stenciList">
    <div class="_center pr">
      <spin-comp :spinShow="spinShow"></spin-comp>
      <Row class="mb20">
        <Col span="19">
          &nbsp;
        </Col>
        <Col span="2"
             class="tc">
        <Button type="primary"
                @click="resActionFind('resFind', null)"
                :style="{display: resBtnDis('STENCILLIST_QUERY')}">条件搜索</Button>
        </Col>
        <Col span="2"
             class="tc">
        <Button type="primary"
                @click="resAdd"
                :style="{display: resBtnDis('STENCILLIST_NEWTEMPLATE')}">新建模版</Button>
        </Col>
      </Row>
      <div class="_caseList clearfix">
        <Row>
          <Col span="24"
               class="pl20 pr20">
          <Table stripe
                 border
                 align="center"
                 :loading="caseList.loading"
                 :columns="caseList.header"
                 :data="caseList.bodyList"></Table>
          </Col>
        </Row>
      </div>
      <div class="_page clearfix">
        <Row>
          <Col span="12"
               offset="6"
               class="tc">
          <Page :total="pageObj.total"
                :current="pageObj.pageNum"
                :page-size="pageObj.pageSize"
                show-elevator
                show-total
                @on-change="reschangePage"></Page>
          </Col>
        </Row>
      </div>
    </div>
    <alert-btn-info :alertShow="alertShow.reas"
                    :isSaveBtn="true"
                    @alertCancel="alertCanc('reas')"
                    alertTitle="退回原因">
      <p class="t2"
         v-text="alertShow.reasText"></p>
    </alert-btn-info>
    <alertBtnInfo :alertShow="alertShow.subm" @alertConfirm="submSave" @alertCancel="alertCanc('subm')" alertTitle="操作">
      <p>确定要提交吗？</p>
    </alertBtnInfo>
    <div v-if="alertShow.editorDest">
      <alert-editor :alertShow="alertShow.editor"
                    @alertConfirm="editorSave"
                    @alertCancel="alertCanc('editor')"
                    :alertName="alertShow.editorName"
                    :alertCode="alertShow.editorCode"
                    :alertToken="alertShow.editorToken"
                    :alertTypeId="alertShow.editorTypeId"
                    :alertContent="alertShow.editorContent"
                    :alertDocument="alertShow.documentType"
                    :alertDisType="alertShow.disType"
                    alertTitle="编辑"></alert-editor>
    </div>
    <res-find v-if="alertShow.find" @alertConfirm="alertSaveFind('find', ...arguments)" @alertCancel="alertCancFind('find')"></res-find>
  </div>
</template>

<script>
import axios from 'axios'
import {resBtn, resSearFind} from '@/components/common/mixin.js'
import spinComp from '@/components/common/spin'
import resFind from '@/page/comm/resFind/resFind'
import alertBtnInfo from '@/components/common/alertBtnInfo'
import alertEditor from '@/page/arbitrator/stencilList/children/ceshiEditor'
// import alertEditor from '@/page/arbitrator/stencilList/children/alertEditor'

export default {
  name: 'stenci_list',
  mixins: [resBtn, resSearFind],
  components: { spinComp, alertBtnInfo, resFind, alertEditor },
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
            title: '模板名称',
            key: 'tempName',
            align: 'center'
          },
          {
            title: '模板文书类型',
            key: 'templateDocumentType',
            align: 'center'
          },
          {
            title: '注册人名称',
            key: 'userName',
            align: 'center'
          },
          {
            title: '案件类型名称',
            key: 'caseTypeName',
            align: 'center'
          },
          {
            title: '创建时间',
            key: 'createTime',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '审核状态',
            key: 'approveStatus',
            align: 'center'
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
        find: false,
        disType: false,
        editor: false,
        editorDest: false,
        editorName: null,
        editorCode: null,
        editorToken: null,
        editorTypeId: null,
        editorContent: null,
        editorTempId: null,
        documentType: null,
        reas: false,
        reasText: '',
        subm: false,
        sumbId: null
      }
    }
  },
  created () {
    this.resCaseList()
  },
  methods: {
    renderBtn (h, params) {
      let _obj = params.row
      if (_obj.status === 2) {
        return h('div', [
          h('Button', {
            props: {
              type: 'primary',
              size: 'small'
            },
            style: {
              marginRight: '5px',
              display: this.resBtnDis('STENCILLIST_VIEW')
            },
            on: {
              click: () => {
                this.seePdf(_obj.tempPath)
              }
            }
          }, '查看'),
          h('Button', {
            props: {
              type: 'primary',
              size: 'small'
            },
            style: {
              marginRight: '5px',
              display: this.resBtnDis('STENCILLIST_UPDATE')
            },
            on: {
              click: () => {
                this.resEdit(params.index)
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
                this.resReas(_obj.reason)
              }
            }
          }, '退回原因'),
          h('Button', {
            props: {
              type: 'primary',
              size: 'small'
            },
            style: {
              marginRight: '5px',
              display: _obj.filePath === '' || _obj.filePath === null ? 'none' : this.resBtnDis('STENCILLIST_LIST_DOWNLOAD')
            },
            on: {
              click: () => {
                window.open(_obj.filePath, '_blank')
              }
            }
          }, '下载')
        ])
      } else if (_obj.status === 1 || _obj.status === 3) {
        return h('div', [
          h('Button', {
            props: {
              type: 'primary',
              size: 'small'
            },
            style: {
              marginRight: '5px',
              display: this.resBtnDis('STENCILLIST_VIEW')
            },
            on: {
              click: () => {
                this.seePdf(_obj.tempPath)
              }
            }
          }, '查看'),
          h('Button', {
            props: {
              type: 'primary',
              size: 'small'
            },
            style: {
              marginRight: '5px',
              display: _obj.filePath === '' || _obj.filePath === null ? 'none' : this.resBtnDis('STENCILLIST_LIST_DOWNLOAD')
            },
            on: {
              click: () => {
                window.open(_obj.filePath, '_blank')
              }
            }
          }, '下载')
        ])
      } else if (_obj.status === 4) {
        return h('div', [
          h('Button', {
            props: {
              type: 'primary',
              size: 'small'
            },
            style: {
              marginRight: '5px',
              display: this.resBtnDis('STENCILLIST_VIEW')
            },
            on: {
              click: () => {
                this.seePdf(_obj.tempPath)
              }
            }
          }, '查看'),
          h('Button', {
            props: {
              type: 'primary',
              size: 'small'
            },
            style: {
              marginRight: '5px',
              display: this.resBtnDis('STENCILLIST_UPDATE')
            },
            on: {
              click: () => {
                this.resEdit(params.index)
              }
            }
          }, '修改'),
          h('Button', {
            props: {
              type: 'primary',
              size: 'small'
            },
            style: {
              marginRight: '5px',
              display: this.resBtnDis('STENCILLIST_SUBMIT')
            },
            on: {
              click: () => {
                this.resSubm(params.index)
              }
            }
          }, '提交')
        ])
      }
    },
    resCaseList () {
      this.spinShow = true
      axios.post('/batchCaseDocument/findTemplate', {
        pageIndex: (this.pageObj.pageNum - 1) * this.pageObj.pageSize,
        pageSize: this.pageObj.pageSize,
        userToken: this.search.requestName,
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
    reschangePage (page) {
      this.pageObj.pageNum = page
      this.resCaseList()
    },
    seePdf (path) {
      window.open(path, '_blank')
    },
    resSubm (index) {
      let obj = this.caseList.bodyList[index]
      this.alertShow.sumbId = obj.id
      this.alertShow.subm = true
    },
    submSave () {
      this.alertShow.subm = false
      axios.post('/batchCaseDocument/updateTemplateStatus', {
        templateId: this.alertShow.sumbId,
        templateStatus: '3'
      }).then(res => {
        this.alertCanc('sumb')
        this.$Message.success({
          content: '操作成功',
          duration: 2
        })
        this.resCaseList()
      }).catch(e => {
        this.alertCanc('sumb')
        this.$Message.error({
          content: '错误信息:' + e + ' 稍后再试',
          duration: 5
        })
      })
    },
    resAdd () {
      this.alertShow.disType = false
      this.alertShow.editorDest = true
      this.alertShow.editor = true
    },
    resEdit (index) {
      let obj = this.caseList.bodyList[index]
      this.alertShow.editorName = obj.tempName
      this.alertShow.editorCode = obj.tempCode
      this.alertShow.editorToken = obj.userToken
      this.alertShow.editorTypeId = obj.caseTypeId
      this.alertShow.editorContent = obj.tempContent
      this.alertShow.editorTempId = obj.id
      this.alertShow.documentType = obj.documentType
      this.alertShow.disType = true
      this.alertShow.editorDest = true
      this.alertShow.editor = true
    },
    editorSave (tempId, type, name, token, tokenName, id, cont, docuType, ids) {
      if (type === 'add') {
        axios.post('/batchCaseDocument/saveTemplate', {
          tempName: name,
          userToken: token,
          userName: tokenName,
          caseTypeId: id,
          tempContent: cont,
          templateId: this.alertShow.editorTempId === null ? tempId : this.alertShow.editorTempId,
          caseDocumentType: docuType,
          caseFields: ids
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
      } else if (type === 'see') {
        axios.post('/batchCaseDocument/saveTemplate', {
          previewflag: 1,
          tempName: name,
          userToken: token,
          userName: tokenName,
          caseTypeId: id,
          tempContent: cont,
          templateId: this.alertShow.editorTempId,
          caseDocumentType: docuType,
          caseFields: ids
        }).then(res => {
          window.open(res.data.data, '_blank')
        }).catch(e => {
          this.$Message.error({
            content: '错误信息:' + e + ' 稍后再试',
            duration: 5
          })
        })
      }
    },
    resReas (reason) {
      this.alertShow.reasText = reason
      this.alertShow.reas = true
    },
    alertCanc (type) {
      switch (type) {
        case 'editor':
          this.alertShow.editor = false
          this.alertShow.editorDest = false
          this.alertShow.editorContent = null
          this.alertShow.editorName = null
          this.alertShow.editorCode = null
          this.alertShow.editorToken = null
          this.alertShow.editorTypeId = null
          this.alertShow.editorTempId = null
          this.alertShow.documentType = null
          break
        case 'reas':
          this.alertShow.reas = false
          this.alertShow.reasText = ''
          break
        case 'subm':
          this.alertShow.subm = false
          this.alertShow.sumbId = null
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/style/mixin";
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
