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
      <Row class="pt15">
        <Col span="12" offset="6" class="tc">
          <Page simple :total="fileList.page.total" :current="fileList.page.pageNum" :page-size="fileList.page.pageSize" show-elevator show-total @on-change="reschangePageF"></Page>
        </Col>
      </Row>
    </alert-btn-info>
    <alert-btn-info :alertShow="alertObj.subm" @alertConfirm="submSave" @alertCancel="alertCanc('subm')" alertTitle="操作">
      <p>确定要提交吗？</p>
    </alert-btn-info>
    <alert-btn-info :alertShow="alertObj.begin" @alertConfirm="beginSave" @alertCancel="alertCanc('begin')" alertTitle="操作">
      <Row>
        <Col span="6" offset="1">
          <p class="pt7 pb7">指定开庭时间：</p>
        </Col>
        <Col span="12">
          <DatePicker @on-change="changeDate" type="datetime" placeholder="请指定开庭时间"></DatePicker>
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
            minWidth: 20,
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
            minWidth: 6,
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
            minWidth: 80,
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
      alertObj: {
        file: false,
        subm: false,
        begin: false,
        caseId: null,
        composeTime: null,
        time: '',
        type: null
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
    renderBtn (h, params) {
      if (params.row.tribunalRequestState === 4) {
        if (params.row.beginTime === null || params.row.beginTime === '') {
          return h('div', [
            h('Button', {
              props: {
                type: 'primary',
                size: 'small'
              },
              on: {
                click: () => {
                  this.resSubm(params.index)
                }
              }
            }, '提交')
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
                  this.resFileList(params.index)
                }
              }
            }, '查看文件'),
            h('Button', {
              props: {
                type: 'primary',
                size: 'small'
              },
              on: {
                click: () => {
                  this.resSubm(params.index)
                }
              }
            }, '提交')
          ])
        }
      } else if (params.row.tribunalRequestState === 1) {
        if (params.row.alreadyBeginTime === 1) {
          if (params.row.beginTime === null || params.row.beginTime === '') {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.resBeginTime('edit', params.index)
                  }
                }
              }, '修改开庭时间')
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
                    this.resFileList(params.index)
                  }
                }
              }, '查看文件'),
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.resBeginTime('edit', params.index)
                  }
                }
              }, '修改开庭时间')
            ])
          }
        } else if (params.row.alreadyBeginTime === 2) {
          if (params.row.beginTime === null || params.row.beginTime === '') {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.resBeginTime('once', params.index)
                  }
                }
              }, '指定开庭时间')
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
                    this.resFileList(params.index)
                  }
                }
              }, '查看文件'),
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.resBeginTime('once', params.index)
                  }
                }
              }, '指定开庭时间')
            ])
          }
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
                  this.resFileList(params.index)
                }
              }
            }, '查看文件')
          ])
        }
      } else {
        if (params.row.beginTime === null || params.row.beginTime === '') {
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
                  this.resFileList(params.index)
                }
              }
            }, '查看文件')
          ])
        }
      }
    },
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
      let obj = {}
      obj.caseId = this.caseList.bodyList[index].id
      obj.state = this.caseList.bodyList[index].state
      caseInfo(obj)
    },
    resFileList (index) {
      this.fileList.caseId = this.caseList.bodyList[index].id
      this.sendFileList('once')
    },
    reschangePageF (page) {
      this.fileList.page.pageNum = page
      this.sendFileList('more')
    },
    sendFileList (type) {
      axios.post('/case/findCaseFileList', {
        pageIndex: (this.fileList.page.pageNum - 1) * this.fileList.page.pageSize,
        pageSize: this.fileList.page.pageSize,
        caseId: this.fileList.caseId,
        caseState: 2
      }).then(res => {
        let _data = res.data.data
        this.fileList.bodyList = _data.dataList === null ? [] : _data.dataList
        this.fileList.page.total = _data.totalCount
        if (type === 'once') {
          this.alertObj.file = true
        }
      }).catch(e => {
        this.$Message.error({
          content: '错误信息:' + e + ' 稍后再试',
          duration: 5
        })
      })
    },
    resSubm (index) {
      this.alertObj.subm = true
      this.alertObj.caseId = this.caseList.bodyList[index].id
    },
    submSave () {
      axios.post('/approve/updateGroupApprove', {
        caseId: this.alertObj.caseId
      }).then(res => {
        this.alertCanc('subm')
        this.$Message.success({
          content: '操作成功',
          duration: 2
        })
        this.resCaseList()
      }).catch(e => {
        this.alertCanc('subm')
        this.$Message.error({
          content: '错误信息:' + e + ' 稍后再试',
          duration: 5
        })
      })
    },
    resBeginTime (type, index) {
      this.alertObj.begin = true
      this.alertObj.caseId = this.caseList.bodyList[index].id
      this.alertObj.composeTime = this.caseList.bodyList[index].composeTime
      this.alertObj.type = type
    },
    changeDate (val) {
      this.alertObj.time = val
    },
    beginSave () {
      if (this.alertObj.type === 'once') {
        axios.post('/getDateSection').then(res => {
          let _res = res.data.data
          try {
            let _time = this.alertObj.time.substr(0, 10).split('-').join('')
            let _sTime = res.data.data.startDate.split('-').join('')
            let _eTime = res.data.data.endDate.split('-').join('')
            if (_time - _sTime < 0 || _time - _eTime > 0) {
              this.$Message.warning({
                content: '时间范围必须在 ' + _res.startDate + ' 00:00:00 ~ ' + _res.endDate + ' 23:59:59 之间',
                duration: 6
              })
            } else {
              this.upTimeSave()
            }
          } catch (e) {
            this.$Message.error({
              content: '调取时间范围出错,稍后再试',
              duration: 5
            })
          }
        }).catch(e => {
          this.$Message.error({
            content: '调取时间范围出错,稍后再试',
            duration: 5
          })
        })
      } else if (this.alertObj.type === 'edit') {
        axios.post('/getDateSection', {
          baseDate: this.alertObj.composeTime
        }).then(res => {
          let _res = res.data.data
          try {
            let _time = this.alertObj.time.substr(0, 10).split('-').join('')
            let _sTime = res.data.data.startDate.split('-').join('')
            let _eTime = res.data.data.endDate.split('-').join('')
            if (_time - _sTime < 0 || _time - _eTime > 0) {
              this.$Message.warning({
                content: '时间范围必须在 ' + _res.startDate + ' 00:00:00 ~ ' + _res.endDate + ' 23:59:59 之间',
                duration: 6
              })
            } else {
              this.upTimeSave()
            }
          } catch (e) {
            this.$Message.error({
              content: '调取时间范围出错,稍后再试',
              duration: 5
            })
          }
        }).catch(e => {
          this.$Message.error({
            content: '调取时间范围出错,稍后再试',
            duration: 5
          })
        })
      }
    },
    upTimeSave () {
      let _type = null
      if (this.alertObj.type === 'once') {
        _type = 1
      } else if (this.alertObj.type === 'edit') {
        _type = 2
      }
      axios.post('/approve/updateBeginTime', {
        caseId: this.alertObj.caseId,
        beginTime: this.alertObj.time,
        updateType: _type
      }).then(res => {
        this.alertCanc('begin')
        this.$Message.success({
          content: '操作成功',
          duration: 2
        })
        this.resCaseList()
      }).catch(e => {
        this.alertCanc('begin')
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
      } else if (type === 'subm') {
        this.alertObj.subm = false
        this.alertObj.caseId = null
      } else if (type === 'begin') {
        this.alertObj.begin = false
        this.alertObj.caseId = null
        this.alertObj.composeTime = null
        this.alertObj.time = ''
        this.alertObj.type = null
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
