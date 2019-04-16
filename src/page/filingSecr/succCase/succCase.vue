<template>
  <div class="succCase">
    <head-top :isRegister="true">
      <span class="f36 fcf">立案成功案件</span>
    </head-top>
    <div class="_center pr">
      <spin-comp :spinShow="spinShow"></spin-comp>
      <Row>
        <Col span="2">
          <label class="lh32 f16 fc6 fr mr15">搜索</label>
        </Col>
        <Col span="8">
          <Input v-model="search.text" icon="ios-search" placeholder="" class="_search hand" @on-click="resSearch" @keyup.enter.native="resSearch"></Input>
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
    <alert-btn-info :alertShow="alertObj.file" :isSaveBtn="true" @alertCancel="alertCanc('file')" alertTitle="文件列表">
      <Row>
        <Col span="24">
          <Table stripe align="center" :loading="fileList.loading" :columns="fileList.header" :data="fileList.bodyList"></Table>
        </Col>
      </Row>
      <Row class="pt15">
        <Col span="16" class="tr">
          <Page simple :total="fileList.page.total" :current="fileList.page.pageNum" :page-size="fileList.page.pageSize" show-elevator show-total @on-change="reschangePageF"></Page>
        </Col>
        <Col span="8" class="tc">
          <Button type="primary" size="small" @click="dowZip">一键下载</Button>
        </Col>
      </Row>
    </alert-btn-info>
    <alert-btn-info :alertShow="alertObj.send" @alertConfirm="sendDocSave" @alertCancel="alertCanc('sendDoc')" alertTitle="操作">
      <p>确定要发送邮件，短信通知吗？（确认内容无误后点击确定）</p>
    </alert-btn-info>
  </div>
</template>

<script>
import axios from 'axios'
import headTop from '@/components/header/head'
import spinComp from '@/components/common/spin'
import alertBtnInfo from '@/components/common/alertBtnInfo'
import { caseInfo } from '@/config/common.js'
import regi from '@/config/regiType.js'

export default {
  name: 'succ_case',
  components: { headTop, spinComp, alertBtnInfo },
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
            title: '提交时间',
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
            title: '操作',
            key: 'caseId',
            align: 'center',
            render: (h, params) => {
              let _obj = params.row
              if (_obj.state === 3) {
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
                        this.resFileList(params.index)
                      }
                    }
                  }, '查看文件')
                ])
              } else if (_obj.state === 12) {
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
                        this.resFileList(params.index)
                      }
                    }
                  }, '查看文件'),
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
                        this.resSendDoc(params.index)
                      }
                    }
                  }, '送达')
                ])
              } else {
                return h('div', [
                ])
              }
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
      alertObj: {
        file: false,
        fileIdArr: [],
        send: false,
        sendId: null
      },
      fileList: {
        header: [
          {
            title: '角色',
            key: 'peopleType',
            align: 'center',
            render: (h, params) => {
              return h('span', {
              }, params.row.peopleType === '1' ? '申请人' : (params.row.peopleType === '2' ? '被申请人' : ''))
            }
          },
          {
            title: '文件名',
            key: 'filename',
            align: 'center'
          },
          {
            title: '操作',
            key: 'fileId',
            align: 'center',
            render: (h, params) => {
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
                      this.seeDoc(params.row.filepath)
                    }
                  }
                }, '预览'),
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.dowDoc(params.index)
                    }
                  }
                }, '下载')
              ])
            }
          }
        ],
        bodyList: [],
        page: {
          total: 0,
          pageNum: 1,
          pageSize: 5
        },
        caseId: null
      }
    }
  },
  created () {
    this.resCaseList()
  },
  methods: {
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
    resFileList (index) {
      this.fileList.caseId = this.caseList.bodyList[index].caseId
      this.sendFileList('once')
    },
    reschangePageF (page) {
      this.fileList.page.pageNum = page
      this.sendFileList('more')
    },
    sendFileList (type) {
      if (type === 'once') {
        this.alertObj.file = true
        axios.post('/case/findCaseFileList', {
          pageIndex: 0,
          pageSize: 999,
          caseId: this.fileList.caseId,
          caseState: 1
        }).then(res => {
          let _data = res.data.data
          for (let k in _data.dataList) {
            if (_data.dataList[k].fileId !== null) {
              this.alertObj.fileIdArr.push(_data.dataList[k].fileId)
            }
          }
        }).catch(e => {
          this.$Message.error({
            content: '错误信息:' + e + ' 稍后再试',
            duration: 5
          })
        })
      }
      axios.post('/case/findCaseFileList', {
        pageIndex: (this.fileList.page.pageNum - 1) * this.fileList.page.pageSize,
        pageSize: this.fileList.page.pageSize,
        caseId: this.fileList.caseId,
        caseState: 1
      }).then(res => {
        let _data = res.data.data
        this.fileList.bodyList = _data.dataList === null ? [] : _data.dataList
        this.fileList.page.total = _data.totalCount
      }).catch(e => {
        this.$Message.error({
          content: '错误信息:' + e + ' 稍后再试',
          duration: 5
        })
      })
    },
    resSendDoc (index) {
      this.alertObj.sendId = this.caseList.bodyList[index].caseId
      this.alertObj.send = true
    },
    sendDocSave () {
      this.alertObj.send = false
      axios.post('/electronic/service/101', {
        caseId: this.alertObj.sendId
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
    alertCanc (type) {
      if (type === 'file') {
        this.alertObj.file = false
        this.fileList.bodyList = []
        this.fileList.page.pageNum = 1
        this.fileList.page.total = 0
        this.fileList.caseId = null
        this.alertObj.fileIdArr = []
      } else if (type === 'sendDoc') {
        this.alertObj.send = false
        this.alertObj.sendId = null
      }
    },
    seeDoc (path) {
      window.open(path, '_blank')
    },
    dowDoc (index) {
      window.open(regi.api + '/file/download/?fileName=' + this.fileList.bodyList[index].filename + '&filePath=' + this.fileList.bodyList[index].filepath, '_blank')
    },
    dowZip () {
      let _fileIds = this.alertObj.fileIdArr.join(',')
      window.open(regi.api + '/file/documentZip/download?fileIds=' + _fileIds, '_blank')
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
