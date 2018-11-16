<template>
  <div class="docuAudit">
    <head-top :isRegister="true">
      <span class="f36 fcf">文书审核</span>
    </head-top>
    <div class="_center pr">
      <spin-comp :spinShow="spinShow"></spin-comp>
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
    <alert-btn-info :alertShow="alertShow.docu" @alertConfirm="docuSave" @alertCancel="alertCanc" alertTitle="操作">
      <p v-if="alertShow.state === 1">确定要通过吗？</p>
      <p class="mb10" v-if="alertShow.state === 2">确定要驳回吗？</p>
      <Input v-if="alertShow.state === 2" v-model.trim="alertShow.rejeReason" type="textarea" :autosize="{minRows: 3,maxRows: 10}" placeholder="请输入驳回原因..." />
    </alert-btn-info>
  </div>
</template>

<script>
import axios from 'axios'
import headTop from '@/components/header/head'
import spinComp from '@/components/common/spin'
import alertBtnInfo from '@/components/common/alertBtnInfo'
import { caseInfo } from '@/config/common.js'

export default {
  name: 'docu_audit',
  components: { headTop, spinComp, alertBtnInfo },
  data () {
    return {
      spinShow: false,
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
            title: '申请人',
            key: 'applicantName',
            align: 'center'
          },
          {
            title: '被申请人',
            key: 'respondentName',
            align: 'center'
          },
          {
            title: '代理人',
            key: 'proxyName',
            align: 'center'
          },
          {
            title: '第一秘书',
            key: 'firstSecretary',
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
        rejeReason: ''
      }
    }
  },
  created () {
    this.resCaseList()
  },
  methods: {
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
              marginRight: '5px'
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
              marginRight: '5px'
            },
            on: {
              click: () => {
                this.resCancDocu(params.index)
              }
            }
          }, '驳回')
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
      axios.post('/approve/findCaseDocumentList', {
        pageIndex: (this.pageObj.pageNum - 1) * this.pageObj.pageSize,
        pageSize: this.pageObj.pageSize
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
          axios.post('/approve/updateCaseDocumentByApprove', {
            caseId: this.alertShow.id,
            caseDocumentApprove: this.alertShow.state,
            caseDocuemntId: this.alertShow.caseDocuId,
            caseDocumentReason: this.alertShow.rejeReason
          }).then(res => {
            this.alertCanc()
            this.$Message.success({
              content: '操作成功',
              duration: 2
            })
            this.resCaseList()
          }).catch(e => {
            this.alertCanc()
            this.$Message.error({
              content: '错误信息:' + e + ' 稍后再试',
              duration: 5
            })
          })
        }
      } else {
        axios.post('/approve/updateCaseDocumentByApprove', {
          caseId: this.alertShow.id,
          caseDocumentApprove: this.alertShow.state,
          caseDocuemntId: this.alertShow.caseDocuId
        }).then(res => {
          this.alertCanc()
          this.$Message.success({
            content: '操作成功',
            duration: 2
          })
          this.resCaseList()
        }).catch(e => {
          this.alertCanc()
          this.$Message.error({
            content: '错误信息:' + e + ' 稍后再试',
            duration: 5
          })
        })
      }
    },
    alertCanc () {
      this.alertShow.docu = false
      this.alertShow.id = null
      this.alertShow.state = null
      this.alertShow.caseDocuId = null
      this.alertShow.rejeReason = ''
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
