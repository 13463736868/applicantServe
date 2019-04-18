<template>
  <div class="filingCase">
    <head-top :isRegister="true">
      <span class="f36 fcf">已立案案件</span>
    </head-top>
    <div class="_center pr">
      <spin-comp :spinShow="spinShow"></spin-comp>
      <Row>
        <Col span="2">
          <label class="lh32 f16 fc6 fr mr15">搜索</label>
        </Col>
        <Col span="8">
          <Input v-model="search.text" icon="ios-search" placeholder="" class="_search hand" @on-click="resSearch" @keyup.enter.native="resSearch" placeholder="案号 / 申请人 / 被申请人"></Input>
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
    <create-docu :alertShow="createObj.show" @alertConfirm="createSave" @alertSee="createSee" @alertCancel="alertCanc" alertTitle="生成决定书">
      <Row>
        <Col span="4" offset="1"><p class="_label">合同名称：</p></Col>
        <Col span="16" offset="2"><Input v-model="createObj.contractName" placeholder="请输入合同名称..." /></Col>
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
  name: 'filing_case',
  components: { headTop, spinComp, createDocu },
  data () {
    return {
      spinShow: false,
      search: {
        text: ''
      },
      caseList: {
        loading: false,
        header: [
          {
            title: '案号',
            key: 'caseCode',
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
              }, params.row.caseCode)
            }
          },
          {
            title: '案件编号',
            key: 'caseId',
            align: 'center'
          },
          {
            title: '申请人',
            key: 'partyName',
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
            title: '被申请人',
            key: 'defendantName',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '申请时间',
            key: 'createTime',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '受理时间',
            key: 'acceptTime',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '备注',
            key: 'requestState',
            align: 'center',
            render: (h, params) => {
              return h('span', {

              }, params.row.requestState === '3' ? '撤回案件' : (params.row.requestState === '4' ? '撤回案件' : (params.row.requestState === '5' ? '撤回案件' : (params.row.requestState === '6' ? '撤回案件' : ''))))
            }
          },
          {
            title: '操作',
            key: 'caseId',
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
      createObj: {
        id: null,
        show: false,
        contractName: '',
        docType: null
      }
    }
  },
  created () {
    this.resCaseList()
  },
  methods: {
    renderBtn (h, params) {
      if (params.row.requestState === '4') {
        if (params.row.pathUrl === null || params.row.pathUrl === '') {
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
                  this.createDoc(4, params.index)
                }
              }
            }, '生成决定书')
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
                marginTop: '5px',
                marginBottom: '5px'
              },
              on: {
                click: () => {
                  this.seeDoc(params.row.pathUrl)
                }
              }
            }, '查看申请书'),
            h('Button', {
              props: {
                type: 'primary',
                size: 'small'
              },
              style: {
                marginRight: '5px',
                marginBottom: '5px'
              },
              on: {
                click: () => {
                  this.createDoc(4, params.index)
                }
              }
            }, '生成决定书')
          ])
        }
      } else if (params.row.requestState === '5') {
        if (params.row.pathUrl === null || params.row.pathUrl === '') {
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
                  this.createDoc(4, params.index)
                }
              }
            }, '重新生成决定书')
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
                  this.seeDoc(params.row.pathUrl)
                }
              }
            }, '查看申请书'),
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
                  this.createDoc(4, params.index)
                }
              }
            }, '重新生成决定书')
          ])
        }
      } else if (params.row.requestState === '3') {
        return h('div', [
          h('span', {
            props: {
              type: 'text',
              size: 'small'
            },
            style: {
              color: '#2d8cf0'
            }
          }, '撤案决定书审核通过')
        ])
      } else if (params.row.requestState === '6') {
        return h('div', [
          h('span', {
            props: {
              type: 'text',
              size: 'small'
            },
            style: {
              color: '#2d8cf0'
            }
          }, '撤案决定书审核中')
        ])
      } else {
        return h('div', [
        ])
      }
    },
    resCaseList () {
      this.spinShow = true
      axios.post('/case/findRegisterCaseList', {
        startIndex: (this.pageObj.pageNum - 1) * this.pageObj.pageSize,
        pageSize: this.pageObj.pageSize,
        keyword: this.search.text,
        state: 3,
        caseListType: 3
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
    goCaseInfo (index) {
      let obj = {}
      obj.caseId = this.caseList.bodyList[index].caseId
      obj.state = this.caseList.bodyList[index].state
      caseInfo(obj)
    },
    seeDoc (path) {
      window.open(path, '_blank')
    },
    createDoc (type, index) {
      this.createObj.show = true
      this.createObj.docType = type
      this.createObj.id = this.caseList.bodyList[index].caseId
    },
    createSave () {
      this.createObj.show = false
      axios.post('/case/addDocumentFile', {
        caseId: this.createObj.id,
        documentType: this.createObj.docType,
        jsonData: JSON.stringify({
          contractName: this.createObj.contractName
        })
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
    },
    createSee () {
      axios.post('/case/previewDocumentFile', {
        caseId: this.createObj.id,
        documentType: this.createObj.docType,
        jsonData: JSON.stringify({
          contractName: this.createObj.contractName
        })
      }).then(res => {
        let _path = res.data.data.filepath
        if (_path !== null && _path !== '') {
          window.open(_path, '_blank')
        } else {
          this.$Message.error({
            content: '生成预览文书路径出错,稍后再试',
            duration: 5
          })
        }
      }).catch(e => {
        this.$Message.error({
          content: '错误信息:' + e + ' 稍后再试',
          duration: 5
        })
      })
    },
    alertCanc () {
      this.createObj.show = false
      this.createObj.id = null
      this.createObj.contractName = ''
      this.createObj.docType = null
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
._label {
  padding: 7px 0;
}
</style>
