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
            <Table stripe border align="center" :loading="caseList.loading" :columns="caseList.header" :data="caseList.bodyList"></Table>
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
    <alert-btn-info :alertShow="alertShow.temp" @alertConfirm="tempSave" @alertCancel="alertCanc('temp')" alertTitle="操作">
      <p v-if="alertShow.state === 1">确定要通过吗？</p>
      <p class="mb10" v-if="alertShow.state === 2">确定要驳回吗？</p>
      <Input v-if="alertShow.state === 2" v-model.trim="alertShow.tempReason" type="textarea" :autosize="{minRows: 3,maxRows: 10}" placeholder="请输入驳回原因..." />
    </alert-btn-info>
    <res-find v-if="alertShow.find" @alertConfirm="alertSaveFind('find', ...arguments)" @alertCancel="alertCancFind('find')"></res-find>
  </div>
</template>

<script>
import axios from 'axios'
import {resBtn, resPage, resSearFind} from '@/components/common/mixin.js'
import spinComp from '@/components/common/spin'
import resFind from '@/page/comm/resFind/resFind'
import alertBtnInfo from '@/components/common/alertBtnInfo'

export default {
  name: 'temp_audit',
  mixins: [resBtn, resPage, resSearFind],
  components: { spinComp, resFind, alertBtnInfo },
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
    renderBtn (h, params) {
      let _obj = params.row
      if (_obj.status === 3) {
        return h('div', [
          h('Button', {
            props: {
              type: 'primary',
              size: 'small'
            },
            style: {
              marginRight: '5px',
              display: this.resBtnDis('TEMPAUDIT_PASS')
            },
            on: {
              click: () => {
                this.resSaveTemp(params.index)
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
              display: this.resBtnDis('TEMPAUDIT_NOPASS')
            },
            on: {
              click: () => {
                this.resCancTemp(params.index)
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
              display: this.resBtnDis('TEMPAUDIT_VIEW')
            },
            on: {
              click: () => {
                this.seePdf(_obj.tempPath)
              }
            }
          }, '查看')
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
              display: this.resBtnDis('TEMPAUDIT_VIEW')
            },
            on: {
              click: () => {
                this.seePdf(_obj.tempPath)
              }
            }
          }, '查看')
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
            content: '请填写驳回原因',
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
