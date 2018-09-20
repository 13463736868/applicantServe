<template>
  <div class="groupAppl">
    <head-top :isRegister="true">
      <span class="f36 fcf">组庭申请</span>
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
    <alert-btn-info :alertShow="alertObj.file" :isSaveBtn="true" @alertCancel="alertCanc('file')" alertTitle="文件列表">
      <Row>
        <Col span="24">
          <Table stripe align="center" :loading="fileList.loading" :columns="fileList.header" :data="fileList.bodyList"></Table>
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

export default {
  name: 'group_appl',
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
            title: '申请人仲裁员',
            key: 'applicantApprove',
            align: 'center'
          },
          {
            title: '被申请人',
            key: 'respondentName',
            align: 'center'
          },
          {
            title: '被申请人仲裁员',
            key: 'respondentApprove',
            align: 'center'
          },
          {
            title: '确认仲裁员',
            key: 'approver',
            align: 'center'
          },
          {
            title: '开庭时间',
            key: 'beginTime',
            align: 'center'
          },
          {
            title: '操作',
            key: 'id',
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
                }, '预览')
              ])
            }
          }
        ],
        bodyList: []
      }
    }
  },
  created () {
    this.resCaseList()
  },
  methods: {
    resCaseList () {
      this.spinShow = true
      axios.post('/approve/findGroupApproveList', {
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
    resSearch () {
      this.pageObj.pageNum = 1
      this.resCaseList()
    },
    reschangePage (page) {
      this.pageObj.pageNum = page
      this.resCaseList()
    },
    goCaseInfo (index) {
      console.log(this.caseList.bodyList[index])
    },
    resFileList (index) {
      let _obj = this.caseList.bodyList[index]
      axios.post('/case/findCaseFileList', {
        caseId: _obj.id,
        caseState: 2
      }).then(res => {
        this.fileList.bodyList = res.data.data
        this.alertObj.file = true
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
      }
    },
    seeDoc (path) {
      window.open(path, '_blank')
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
