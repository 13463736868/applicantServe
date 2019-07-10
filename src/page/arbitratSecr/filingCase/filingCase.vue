<template>
  <div class="filingCase">
    <div class="_center pr">
      <spin-comp :spinShow="spinShow"></spin-comp>
      <Row>
        <Col span="2">
          <label class="lh32 f16 fc6 fr mr15">搜索</label>
        </Col>
        <Col span="8">
          <Input v-model="search.text" icon="ios-search" class="_search hand" @on-click="resSearch" @keyup.enter.native="resSearch"></Input>
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
    <create-docu :alertShow="createObj.show" @alertConfirm="createSave" @alertSee="createSee" @alertCancel="alertCanc('create')" alertTitle="生成决定书">
      <Row>
        <Col span="4" offset="1"><p class="_label">合同名称：</p></Col>
        <Col span="16" offset="2"><Input v-model="createObj.contractName" placeholder="请输入合同名称..." /></Col>
      </Row>
    </create-docu>
    <alert-btn-info :alertShow="sendDocObj.show"  @alertConfirm="saveSendDoc" @alertCancel="alertCanc('sendDoc')" alertTitle="操作">
      <Row>
        <Col span="6" offset="1">
          <p class="pt7 pb7">指定送达回证时间：</p>
        </Col>
        <Col span="16">
          <DatePicker class="wmax" :options="dateDisa" @on-change="sendDocChange" type="datetime"></DatePicker>
        </Col>
      </Row>
    </alert-btn-info>
  </div>
</template>

<script>
import axios from 'axios'
import {resBtn} from '@/components/common/mixin.js'
import spinComp from '@/components/common/spin'
import alertBtnInfo from '@/components/common/alertBtnInfo'
import createDocu from '@/components/common/createDocu'
import { caseInfo } from '@/config/common.js'

export default {
  name: 'filing_case',
  mixins: [resBtn],
  components: { spinComp, createDocu, alertBtnInfo },
  data () {
    return {
      dateDisa: {
        disabledDate (date) {
          return date && date.valueOf() > Date.now()
        }
      },
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

              }, params.row.requestState === '7' ? '撤回案件' : (params.row.requestState === '8' ? '撤回案件' : (params.row.requestState === '9' ? '撤回案件' : (params.row.requestState === '10' ? '撤回案件' : ''))))
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
      },
      sendDocObj: {
        id: null,
        show: false,
        servDate: ''
      }
    }
  },
  created () {
    this.resCaseList()
  },
  methods: {
    renderBtn (h, params) {
      let _state = params.row.requestState
      if (_state === '1') {
        return h('div', [
          h('span', {
            props: {
              type: 'text',
              size: 'small'
            },
            style: {
              color: '#2d8cf0',
              marginRight: '5px'
            }
          }, '撤案决定书审核通过')
        ])
      } else if (_state === '2') {
        return h('div', [
          h('Button', {
            props: {
              type: 'primary',
              size: 'small'
            },
            style: {
              marginRight: '5px',
              display: this.resBtnDis('FILINGCASE_DECISION')
            },
            on: {
              click: () => {
                this.createDoc(4, params.index)
              }
            }
          }, '生成决定书')
        ])
      } else if (_state === '3') {
        return h('div', [
          h('Button', {
            props: {
              type: 'primary',
              size: 'small'
            },
            style: {
              marginRight: '5px',
              display: this.resBtnDis('FILINGCASE_REGEN')
            },
            on: {
              click: () => {
                this.createDoc(4, params.index)
              }
            }
          }, '重新生成决定书')
        ])
      } else if (_state === '4') {
        return h('div', [
          h('span', {
            props: {
              type: 'text',
              size: 'small'
            },
            style: {
              color: '#2d8cf0',
              marginRight: '5px'
            }
          }, '撤案决定书审核中')
        ])
      } else if (_state === '5') {
        return h('div', [
          // h('Button', {
          //   props: {
          //     type: 'primary',
          //     size: 'small'
          //   },
          //   style: {
          //     marginRight: '5px',
          //     display: this.resBtnDis('FILINGCASE_OFFLINEARR')
          //   },
          //   on: {
          //     click: () => {
          //       this.resSendDoc(params.index)
          //     }
          //   }
          // }, '线下送达')
        ])
      } else if (_state === '6') {
        return h('div', [
        ])
      } else if (_state === '7') {
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
      } else if (_state === '8') {
        return h('div', [
          h('Button', {
            props: {
              type: 'primary',
              size: 'small'
            },
            style: {
              marginRight: '5px',
              display: this.resBtnDis('FILINGCASE_DECISION')
            },
            on: {
              click: () => {
                this.createDoc(4, params.index)
              }
            }
          }, '生成决定书')
        ])
      } else if (_state === '9') {
        return h('div', [
          h('Button', {
            props: {
              type: 'primary',
              size: 'small'
            },
            style: {
              marginRight: '5px',
              display: this.resBtnDis('FILINGCASE_REGEN')
            },
            on: {
              click: () => {
                this.createDoc(4, params.index)
              }
            }
          }, '重新生成决定书')
        ])
      } else if (_state === '10') {
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
    resSendDoc (index) {
      this.sendDocObj.id = this.caseList.bodyList[index].caseId
      this.sendDocObj.show = true
    },
    sendDocChange (val) {
      this.sendDocObj.servDate = val
    },
    saveSendDoc () {
      if (this.sendDocObj.servDate === '') {
        this.$Message.error({
          content: '请选择指定送达回证时间',
          duration: 5
        })
        return false
      }
      axios.post('/case/addDocumentFile', {
        caseId: this.sendDocObj.id,
        documentType: 10,
        jsonData: JSON.stringify({serviceDate: this.sendDocObj.servDate})
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
        this.alertCanc('create')
        this.$Message.success({
          content: '操作成功',
          duration: 2
        })
        this.resCaseList()
      }).catch(e => {
        this.alertCanc('create')
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
    alertCanc (type) {
      if (type === 'create') {
        this.createObj.show = false
        this.createObj.id = null
        this.createObj.contractName = ''
        this.createObj.docType = null
      } else if (type === 'sendDoc') {
        this.sendDocObj.show = false
        this.sendDocObj.servDate = ''
        this.sendDocObj.id = null
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
._label {
  padding: 7px 0;
}
</style>
