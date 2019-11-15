<template>
  <div class="tempAudit">
    <div class="_center pr">
      <spin-comp :spinShow="spinShow"></spin-comp>
      <Row class="mb20">
        <Col span="21">
          &nbsp;
        </Col>
        <Col span="2" class="tc">
          <Button type="primary" @click="resActionFind('resFind', null)" :style="{display: resBtnDis('TEMPAUDIT_QUERY')}">条件搜索</Button>
        </Col>
      </Row>
      <div class="_caseList clearfix">
        <Row>
          <Col span="24" class="pl20 pr20">
            <Table stripe border align="center" :loading="caseList.loading" :columns="caseList.header" :data="caseList.bodyList">
              <template slot-scope="{ row, index }" slot="action">
                <Button :style="{display: resBtnDis('TEMPAUDIT_PASS')}" class="mr5" type="primary" size="small" v-if="row.status === 3" @click="resSaveTemp(index)">通过</Button>
                <Button :style="{display: resBtnDis('TEMPAUDIT_NOPASS')}" class="mr5" type="primary" size="small" v-if="row.status === 3" @click="resCancTemp(index)">退回</Button>
                <Button :style="{display: resBtnDis('TEMPAUDIT_UPD')}" class="mr5" type="primary" size="small" v-if="row.status === 3" @click="resActionFind(row)">修改</Button>
                <Button :style="{display: resBtnDis('TEMPAUDIT_VIEW')}" class="mr5" type="primary" size="small" @click="seePdf(row.tempPath)">查看</Button>
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
    <alert-btn-info :alertShow="alertShow.temp" @alertConfirm="tempSave" @alertCancel="alertCanc('temp')" alertTitle="操作">
      <p v-if="alertShow.state === 1">确定要通过吗？</p>
      <p class="mb10" v-if="alertShow.state === 2">确定要退回吗？</p>
      <Input v-if="alertShow.state === 2" v-model.trim="alertShow.tempReason" type="textarea" :autosize="{minRows: 3,maxRows: 10}" placeholder="请输入退回原因..." />
    </alert-btn-info>
    <div v-if="editorObj.editorDest">
      <alert-editor :alertShow="editorObj.editor"
                    @alertConfirm="alertSaveEditor"
                    @alertCancel="alertCancEditor('editor')"
                    :alertName="editorObj.editorName"
                    :alertCode="editorObj.editorCode"
                    :alertToken="editorObj.editorToken"
                    :alertTypeId="editorObj.editorTypeId"
                    :alertContent="editorObj.editorContent"
                    :alertDocument="editorObj.documentType"
                    :alertDisType="editorObj.disType"
                    alertTitle="编辑"></alert-editor>
    </div>
    <res-find v-if="alertShow.find" @alertConfirm="alertSaveFind('find', ...arguments)" @alertCancel="alertCancFind('find')"></res-find>
  </div>
</template>

<script>
import axios from 'axios'
import {resBtn, resSearFind, resEditEditor} from '@/components/common/mixin.js'
import spinComp from '@/components/common/spin'
import resFind from '@/page/comm/resFind/resFind'
import alertBtnInfo from '@/components/common/alertBtnInfo'
import alertEditor from '@/page/arbitrator/stencilList/children/ceshiEditor'

export default {
  name: 'temp_audit',
  mixins: [resBtn, resSearFind, resEditEditor],
  components: { spinComp, resFind, alertBtnInfo, alertEditor },
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
            tooltip: 'true',
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
        temp: false,
        state: null,
        tempReason: '',
        id: null,
        find: false
      }
    }
  },
  created () {
    this.resCaseList()
  },
  methods: {
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
    resSearch () {
      this.pageObj.pageNum = 1
      this.resCaseList()
    },
    reschangePage (page) {
      this.pageObj.pageNum = page
      this.resCaseList()
    },
    resSaveTemp (index) {
      this.alertShow.state = 1
      this.alertShow.id = this.caseList.bodyList[index].id
      this.alertShow.temp = true
    },
    resCancTemp (index) {
      this.alertShow.state = 2
      this.alertShow.id = this.caseList.bodyList[index].id
      this.alertShow.temp = true
    },
    seePdf (path) {
      window.open(path, '_blank')
    },
    tempSave () {
      if (this.alertShow.state === 2) {
        if (this.alertShow.tempReason === '') {
          this.$Message.warning({
            content: '请填写退回原因',
            duration: 5
          })
        } else {
          this.alertShow.temp = false
          axios.post('/batchCaseDocument/updateTemplateStatus', {
            templateId: this.alertShow.id,
            templateStatus: this.alertShow.state,
            reason: this.alertShow.tempReason
          }).then(res => {
            this.alertCanc('temp')
            this.$Message.success({
              content: '操作成功',
              duration: 2
            })
            this.resSearch()
          }).catch(e => {
            this.alertCanc('temp')
            this.$Message.error({
              content: '错误信息:' + e + ' 稍后再试',
              duration: 5
            })
          })
        }
      } else {
        this.alertShow.temp = false
        axios.post('/batchCaseDocument/updateTemplateStatus', {
          templateId: this.alertShow.id,
          templateStatus: this.alertShow.state
        }).then(res => {
          this.alertCanc('temp')
          this.$Message.success({
            content: '操作成功',
            duration: 2
          })
          this.resSearch()
        }).catch(e => {
          this.alertCanc('temp')
          this.$Message.error({
            content: '错误信息:' + e + ' 稍后再试',
            duration: 5
          })
        })
      }
    },
    alertCanc (type) {
      switch (type) {
        case 'temp':
          this.alertShow.temp = false
          this.alertShow.state = null
          this.alertShow.id = null
          this.alertShow.tempReason = ''
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
    vertical-align: text-top;
  }
}
</style>
