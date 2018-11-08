<template>
  <div class="poliProtest">
    <head-top :isRegister="true">
      <span class="f36 fcf">管辖权异议</span>
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
    <create-docu :alertShow="alertShow.diss" @alertConfirm="docuSave('diss')" @alertSee="seeDocu('diss')" @alertCancel="alertCanc" alertTitle="操作">
      <Row class="_labelFor">
        <Col span="6" offset="1">
          <p><span class="_span">*</span><b>合同名称：</b></p>
        </Col>
        <Col span="16">
          <Input v-model="alertShow.contractName"></Input>
        </Col>
      </Row>
      <Row class="_labelFor">
        <Col span="6" offset="1">
          <p><span class="_span">*</span><b>本会认为：</b></p>
        </Col>
        <Col span="16">
          <Input v-model="alertShow.conferenceThink" type="textarea" :autosize="{minRows: 3,maxRows: 10}"/>
        </Col>
      </Row>
      <Row class="_labelFor">
        <Col span="6" offset="1">
          <p><span class="_span">*</span><b title="《中华人民共和国仲裁法》第几条">仲裁法第几条：</b></p>
        </Col>
        <Col span="16">
          <Input v-model="alertShow.num1"></Input>
        </Col>
      </Row>
      <Row class="_labelFor">
        <Col span="6" offset="1">
          <p><span class="_span">*</span><b title="《中华人民共和国仲裁法》第几条">仲裁法第几条：</b></p>
        </Col>
        <Col span="16">
          <Input v-model="alertShow.num2"></Input>
        </Col>
      </Row>
      <Row class="_labelFor">
        <Col span="6" offset="1">
          <p><span class="_span">*</span><b title="《最高人民法院关于适用<中华人民共和国仲裁法>若干问题的解释》第几条">仲裁法第几条：</b></p>
        </Col>
        <Col span="16">
          <Input v-model="alertShow.num3"></Input>
        </Col>
      </Row>
    </create-docu>
  </div>
</template>

<script>
import axios from 'axios'
import headTop from '@/components/header/head'
import spinComp from '@/components/common/spin'
import createDocu from '@/components/common/createDocu'
import { caseInfo } from '@/config/common.js'

export default {
  name: 'poli_protest',
  components: { headTop, spinComp, createDocu },
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
              }, params.row.code)
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
            title: '审核状态',
            key: 'jrState',
            align: 'center',
            render: (h, params) => {
              return h('span', {
              }, params.row.jrState === 1 ? '通过' : (params.row.jrState === 2 ? '驳回' : (params.row.jrState === 3 ? '未审核' : '')))
            }
          },
          {
            title: '操作',
            key: 'id',
            align: 'center',
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
        byId: null,
        docuType: null,
        id: null,
        diss: false,
        contractName: '',
        conferenceThink: '',
        num1: '',
        num2: '',
        num3: ''
      }
    }
  },
  created () {
    this.resCaseList()
  },
  methods: {
    renderBtn (h, params) {
      let _obj = params.row
      if (_obj.jrState === null || _obj.jrState === 3) {
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
                this.resSavePoli(params.index)
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
                this.resCancPoli(params.index)
              }
            }
          }, '驳回')
        ])
      } else {
        return h('div', [
        ])
      }
    },
    resCaseList () {
      this.spinShow = true
      axios.post('/approve/findJurisdictionRequestList', {
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
    resSavePoli (index) {
      this.alertShow.id = this.caseList.bodyList[index].id
      this.alertShow.byId = this.caseList.bodyList[index].jurisdictionRequestById
      this.alertShow.docuType = 8
      this.alertShow.diss = true
    },
    resCancPoli (index) {
      this.alertShow.id = this.caseList.bodyList[index].id
      this.alertShow.byId = this.caseList.bodyList[index].jurisdictionRequestById
      this.alertShow.docuType = 9
      this.alertShow.diss = true
    },
    docuSave (type) {
      switch (type) {
        case 'diss':
          if (this.alertShow.contractName === '') {
            this.$Message.warning({
              content: '请填写合同名称',
              duration: 5
            })
          } else if (this.alertShow.conferenceThink === '') {
            this.$Message.warning({
              content: '请填写本会认为内容',
              duration: 5
            })
          } else if (this.alertShow.num1 === '') {
            this.$Message.warning({
              content: '请填写《中华人民共和国仲裁法》第几条',
              duration: 5
            })
          } else if (this.alertShow.num2 === '') {
            this.$Message.warning({
              content: '请填写《中华人民共和国仲裁法》第几条',
              duration: 5
            })
          } else if (this.alertShow.num3 === '') {
            this.$Message.warning({
              content: '《最高人民法院关于适用<中华人民共和国仲裁法>若干问题的解释》第几条',
              duration: 5
            })
          } else {
            axios.post('/case/addDocumentFile', {
              caseId: this.alertShow.id,
              documentType: this.alertShow.docuType,
              jurisdictionRequestById: this.alertShow.byId,
              jsonData: JSON.stringify({
                contractName: this.alertShow.contractName,
                conferenceThink: this.alertShow.conferenceThink,
                num1: this.alertShow.num1,
                num2: this.alertShow.num2,
                num3: this.alertShow.num3
              })
            }).then(res => {
              this.alertCanc()
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
        case 'diss':
          if (this.alertShow.contractName === '') {
            this.$Message.warning({
              content: '请填写合同名称',
              duration: 5
            })
          } else if (this.alertShow.conferenceThink === '') {
            this.$Message.warning({
              content: '请填写本会认为内容',
              duration: 5
            })
          } else if (this.alertShow.num1 === '') {
            this.$Message.warning({
              content: '请填写《中华人民共和国仲裁法》第几条',
              duration: 5
            })
          } else if (this.alertShow.num2 === '') {
            this.$Message.warning({
              content: '请填写《中华人民共和国仲裁法》第几条',
              duration: 5
            })
          } else if (this.alertShow.num3 === '') {
            this.$Message.warning({
              content: '《最高人民法院关于适用<中华人民共和国仲裁法>若干问题的解释》第几条',
              duration: 5
            })
          } else {
            axios.post('/case/previewDocumentFile', {
              caseId: this.alertShow.id,
              documentType: this.alertShow.docuType,
              jurisdictionRequestById: this.alertShow.byId,
              jsonData: JSON.stringify({
                contractName: this.alertShow.contractName,
                conferenceThink: this.alertShow.conferenceThink,
                num1: this.alertShow.num1,
                num2: this.alertShow.num2,
                num3: this.alertShow.num3
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
    alertCanc () {
      this.alertShow.byId = null
      this.alertShow.docuType = null
      this.alertShow.id = null
      this.alertShow.diss = false
      this.alertShow.contractName = ''
      this.alertShow.conferenceThink = ''
      this.alertShow.num1 = ''
      this.alertShow.num2 = ''
      this.alertShow.num3 = ''
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
