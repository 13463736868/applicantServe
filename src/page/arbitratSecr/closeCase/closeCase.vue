<template>
  <div class="endCaseA">
    <head-top :isRegister="true">
      <span class="f36 fcf">已结案案件</span>
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
        <Col span="12" offset="6" class="tc">
          <Page simple :total="fileList.page.total" :current="fileList.page.pageNum" :page-size="fileList.page.pageSize" show-elevator show-total @on-change="reschangePageF"></Page>
        </Col>
      </Row>
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
  name: 'end_case_a',
  components: { headTop, spinComp, alertBtnInfo },
  data () {
    return {
      spinShow: true,
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
            align: 'center'
          },
          {
            title: '被申请人',
            key: 'defendantName',
            align: 'center'
          },
          {
            title: '结案时间',
            key: 'closingTime',
            align: 'center'
          },
          {
            title: '申请人视频路径',
            key: 'applicantVideo',
            align: 'center'
          },
          {
            title: '被申请人视频路径',
            key: 'respondentVideo',
            align: 'center'
          },
          {
            title: '仲裁员视频路径',
            key: 'arbitratorVideo',
            align: 'center'
          },
          {
            title: '开庭记录文档',
            key: 'fileName',
            align: 'center',
            render: (h, params) => {
              return this.resSeeDocBtn(h, params)
            }
          },
          {
            title: '操作',
            key: 'caseId',
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
                      this.resFileList(params.index)
                    }
                  }
                }, '查看文件')
              ])
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
        file: false
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
            title: '文件文',
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
    resSeeDocBtn (h, params) {
      let _obj = params.row
      if (_obj.fileName === null || _obj.fileName === '' || _obj.fileName === undefined || _obj.filePath === null || _obj.filePath === '' || _obj.filePath === undefined) {
        return h('div', [
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
                this.seeDoc(_obj.filePath)
              }
            }
          }, _obj.fileName)
        ])
      }
    },
    resCaseList () {
      this.spinShow = true
      axios.post('/case/findRegisterCaseList', {
        startIndex: (this.pageObj.pageNum - 1) * this.pageObj.pageSize,
        pageSize: this.pageObj.pageSize,
        keyword: this.search.text,
        state: 6,
        caseListType: 6
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
      }
      axios.post('/case/findCaseFileList', {
        pageIndex: (this.fileList.page.pageNum - 1) * this.fileList.page.pageSize,
        pageSize: this.fileList.page.pageSize,
        caseId: this.fileList.caseId,
        caseState: 3
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
    alertCanc (type) {
      if (type === 'file') {
        this.alertObj.file = false
        this.fileList.bodyList = []
        this.fileList.page.pageNum = 1
        this.fileList.page.total = 0
        this.fileList.caseId = null
      }
    },
    seeDoc (path) {
      window.open(path, '_blank')
    },
    dowDoc (index) {
      window.open('/api/file/download/?fileName=' + this.fileList.bodyList[index].filename + '&filePath=' + this.fileList.bodyList[index].filepath, '_blank')
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
