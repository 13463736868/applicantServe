<template>
  <div class="groupCase">
    <head-top :isRegister="true">
      <span class="f36 fcf">组庭案件</span>
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
    <create-docu :alertShow="alertShow.canc" @alertConfirm="docuSave('canc')" @alertSee="seeDocu('canc')" @alertCancel="alertCanc('canc')" alertTitle="操作">
      <Row class="_labelFor">
        <Col span="6" offset="1">
          <p><span class="_span">*</span><b>合同名称：</b></p>
        </Col>
        <Col span="16">
          <Input v-model="alertShow.contractName"></Input>
        </Col>
      </Row>
    </create-docu>
    <create-docu :alertShow="alertShow.end" @alertConfirm="docuSave('end')" @alertSee="seeDocu('end')" @alertCancel="alertCanc('end')" alertTitle="操作">
      <Row class="_labelFor">
        <Col span="6" offset="1">
          <p><span class="_span">*</span><b>文书类型：</b></p>
        </Col>
        <Col span="16">
          <RadioGroup v-model="alertShow.docuType" @on-change="alertCanc('docuType')">
            <Radio :label="1">裁决书</Radio>
            <Radio :label="2">调解书</Radio>
          </RadioGroup>
        </Col>
      </Row>
      <div v-if="alertShow.docuType === 1">
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
            <p><span class="_span">*</span><b>合同约定情况：</b></p>
          </Col>
          <Col span="16">
            <Input v-model="alertShow.contractualStipulation"></Input>
          </Col>
        </Row>
        <Row class="_labelFor">
          <Col span="6" offset="1">
            <p><span class="_span">*</span><b>合同履行情况：</b></p>
          </Col>
          <Col span="16">
            <Input v-model="alertShow.contractPerformance"></Input>
          </Col>
        </Row>
        <Row class="_labelFor">
          <Col span="6" offset="1">
            <p><span class="_span">*</span><b>需要还款本金：</b></p>
          </Col>
          <Col span="16">
            <Input v-model="alertShow.repaymentPrincipal"></Input>
          </Col>
        </Row>
        <Row class="_labelFor">
          <Col span="6" offset="1">
            <p><span class="_span">*</span><b>还款基数：</b></p>
          </Col>
          <Col span="16">
            <Input v-model="alertShow.repaymentBase"></Input>
          </Col>
        </Row>
        <Row class="_labelFor">
          <Col span="6" offset="1">
            <p><span class="_span">*</span><b>年利率：</b></p>
          </Col>
          <Col span="16">
            <Input v-model="alertShow.annualRate"></Input>
          </Col>
        </Row>
        <Row class="_labelFor">
          <Col span="6" offset="1">
            <p><span class="_span">*</span><b title="关于利息及逾期利息的计算">利息计算：</b></p>
          </Col>
          <Col span="16">
            <Input v-model="alertShow.interestCalculation"></Input>
          </Col>
        </Row>
      </div>
      <div v-else-if="alertShow.docuType === 2">
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
            <p><span class="_span">*</span><b title="自愿达成协议内容">协议内容：</b></p>
          </Col>
          <Col span="16">
            <Input v-model="alertShow.agreementContent"></Input>
          </Col>
        </Row>
      </div>
    </create-docu>
    <alert-btn-info :alertShow="alertShow.reve" @alertConfirm="reveSave" @alertCancel="alertCanc('reve')" alertTitle="操作">
      <p>确定要同意撤回吗？</p>
    </alert-btn-info>
    <create-docu :alertShow="alertShow.addE" @alertConfirm="docuSave('addE')" @alertSee="seeDocu('addE')" @alertCancel="alertCanc('addE')" alertTitle="操作">
      <Row class="_labelFor">
        <Col span="6" offset="1">
          <p><span class="_span">*</span><b>裁决书第几页：</b></p>
        </Col>
        <Col span="16">
          <Input v-model="alertShow.pageNum"></Input>
        </Col>
      </Row>
      <Row class="_labelFor">
        <Col span="6" offset="1">
          <p><span class="_span">*</span><b>裁决书第几行：</b></p>
        </Col>
        <Col span="16">
          <Input v-model="alertShow.lineNum"></Input>
        </Col>
      </Row>
      <Row class="_labelFor">
        <Col span="6" offset="1">
          <p><span class="_span">*</span><b>更改之前内容：</b></p>
        </Col>
        <Col span="16">
          <Input v-model="alertShow.oldContent"></Input>
        </Col>
      </Row>
      <Row class="_labelFor">
        <Col span="6" offset="1">
          <p><span class="_span">*</span><b>更改之后内容：</b></p>
        </Col>
        <Col span="16">
          <Input v-model="alertShow.newContent"></Input>
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
import alertBtnInfo from '@/components/common/alertBtnInfo'
import { caseInfo } from '@/config/common.js'

export default {
  name: 'group_case',
  components: { headTop, spinComp, createDocu, alertBtnInfo },
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
            key: 'partyName',
            align: 'center'
          },
          {
            title: '被申请人',
            key: 'defendantName',
            align: 'center'
          },
          {
            title: '案件状态',
            key: 'caseState',
            align: 'center'
          },
          {
            title: '开庭时间',
            key: 'beginTime',
            minWidth: 18,
            align: 'center'
          },
          {
            title: '重新生成原因',
            key: 'caseDocumentReason',
            align: 'center'
          },
          {
            title: '操作',
            key: 'id',
            align: 'center',
            minWidth: 70,
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
        canc: false,
        contractName: '',
        docuType: null,
        userId: null,
        end: false,
        contractualStipulation: '',
        contractPerformance: '',
        repaymentPrincipal: '',
        repaymentBase: '',
        annualRate: '',
        interestCalculation: '',
        agreementContent: '',
        reve: false,
        addE: false,
        pageNum: '',
        lineNum: '',
        oldContent: '',
        newContent: ''
      }
    }
  },
  created () {
    this.resCaseList()
  },
  methods: {
    renderBtn (h, params) {
      let _obj = params.row
      if (_obj.arbitratorRole === 1) {
        if (_obj.state === 4) {
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
                  this.goCourtRoom(params.index)
                }
              }
            }, '进入庭室'),
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
                  this.resCancCase(params.index)
                }
              }
            }, '撤回'),
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
                  this.resEndCase(params.index)
                }
              }
            }, '结案')
          ])
        } else if (_obj.state === 6) {
          if (_obj.caseDocumentSupplement === '1') {
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
                    this.resAddEvid(params.index)
                  }
                }
              }, '补证')
            ])
          } else {
            if (_obj.caseDocumentState1 === '2' || _obj.caseDocumentState2 === '2') {
              if (_obj.caseDocumentState1 === '2') {
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
                        this.resEndCase(params.index)
                      }
                    }
                  }, '重新生成文书')
                ])
              } else if (_obj.caseDocumentState2 === '2') {
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
                        this.resAddEvid(params.index)
                      }
                    }
                  }, '重新生成文书')
                ])
              }
            } else if (_obj.caseDocumentState2 === '3') {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  }
                }, '补正书审核中')
              ])
            } else {
              return h('div', [
              ])
            }
          }
        } else if (_obj.state === 9) {
          if (_obj.revokeFlag === '1') {
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
                    this.resPassReve(params.index)
                  }
                }
              }, '同意撤回')
            ])
          } else {
            return h('div', [
            ])
          }
        } else {
          return h('div', [
          ])
        }
      } else {
        return h('div', [
        ])
      }
    },
    resCaseList () {
      this.spinShow = true
      axios.post('/case/findCaseGroupApproveList', {
        pageIndex: (this.pageObj.pageNum - 1) * this.pageObj.pageSize,
        pageSize: this.pageObj.pageSize,
        keyword: this.search.text
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
    goCourtRoom (index) {
      let _info = this.caseList.bodyList[index]
      axios.post('/encryption', {
        params: _info.id
      }).then(res => {
        window.open('https://192.168.1.249:3004/view/index.html#/' + res.data.data, '_blank')
      }).catch(e => {
        this.$Message.error({
          content: '错误信息:' + e + ' 稍后再试',
          duration: 5
        })
      })
    },
    getFormatDate () {
      let date = new Date()
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let strD = date.getDate()
      let hour = date.getHours()
      let minu = date.getMinutes()
      let sec = date.getSeconds()
      let time = ''
      if (month < 10) {
        month = '0' + month
      }
      if (strD < 10) {
        strD = '0' + strD
      }
      if (hour < 10) {
        hour = '0' + hour
      }
      if (minu < 10) {
        minu = '0' + minu
      }
      if (sec < 10) {
        sec = '0' + sec
      }
      time = year + '-' + month + '-' + strD + ' ' + hour + ':' + minu + ':' + sec
      return time
    },
    resCancCase (index) {
      let _res = this.caseList.bodyList[index]
      let newTime = this.getFormatDate()
      let newD = newTime.substr(0, 10).split('-').join('')
      let newT = newTime.substr(11, 5).split('-').join('')
      let beginTime = _res.beginTime
      let beginD = beginTime.substr(0, 10).split('-').join('')
      let beginT = beginTime.substr(11, 5).split('-').join('')
      if (newD - beginD < 0) {
        this.$Message.warning({
          content: '只能开庭半小时之后点击撤回',
          duration: 5
        })
      } else if (newD - beginD === 0) {
        if (newT - beginT > 30) {
          this.alertShow.userId = _res.id
          this.alertShow.docuType = 6
          this.alertShow.canc = true
        } else {
          this.$Message.warning({
            content: '只能开庭半小时之后点击撤回',
            duration: 5
          })
        }
      } else if (newD - beginD > 0) {
        this.alertShow.userId = _res.id
        this.alertShow.docuType = 6
        this.alertShow.canc = true
      }
    },
    resEndCase (index) {
      let _res = this.caseList.bodyList[index]
      this.alertShow.userId = _res.id
      this.alertShow.docuType = 1
      this.alertShow.end = true
    },
    resPassReve (index) {
      let res = this.caseList.bodyList[index]
      this.alertShow.userId = res.id
      this.alertShow.reve = true
    },
    reveSave () {
      axios.post('/case/updateCaseStateByCancel', {
        caseId: this.alertShow.userId
      }).then(res => {
        this.alertCanc('reve')
        this.$Message.success({
          content: '操作成功',
          duration: 2
        })
        this.resCaseList()
      }).catch(e => {
        this.alertCanc('reve')
        this.$Message.error({
          content: '错误信息:' + e + ' 稍后再试',
          duration: 5
        })
      })
    },
    resAddEvid (index) {
      let res = this.caseList.bodyList[index]
      this.alertShow.userId = res.id
      this.alertShow.docuType = 3
      this.alertShow.addE = true
    },
    docuSave (type) {
      switch (type) {
        case 'canc':
          if (this.alertShow.contractName === '') {
            this.$Message.warning({
              content: '请填写合同名称',
              duration: 5
            })
          } else {
            axios.post('/case/addDocumentFile', {
              caseId: this.alertShow.userId,
              documentType: this.alertShow.docuType,
              jsonData: JSON.stringify({contractName: this.alertShow.contractName})
            }).then(res => {
              this.alertCanc('canc')
              this.$Message.success({
                content: '操作成功',
                duration: 2
              })
            }).catch(e => {
              this.$Message.error({
                content: '错误信息:' + e + ' 稍后再试',
                duration: 5
              })
            })
          }
          break
        case 'end':
          if (this.alertShow.docuType === 1) {
            if (this.alertShow.contractName === '') {
              this.$Message.warning({
                content: '请填写合同名称',
                duration: 5
              })
            } else if (this.alertShow.contractualStipulation === '') {
              this.$Message.warning({
                content: '请填写合同约定情况',
                duration: 5
              })
            } else if (this.alertShow.contractPerformance === '') {
              this.$Message.warning({
                content: '请填写合同履行情况',
                duration: 5
              })
            } else if (this.alertShow.repaymentPrincipal === '') {
              this.$Message.warning({
                content: '请填写需要还款本金',
                duration: 5
              })
            } else if (this.alertShow.repaymentBase === '') {
              this.$Message.warning({
                content: '请填写还款基数',
                duration: 5
              })
            } else if (this.alertShow.annualRate === '') {
              this.$Message.warning({
                content: '请填写年利率',
                duration: 5
              })
            } else if (this.alertShow.interestCalculation === '') {
              this.$Message.warning({
                content: '请填写利息计算',
                duration: 5
              })
            } else {
              axios.post('/case/addDocumentFile', {
                caseId: this.alertShow.userId,
                documentType: this.alertShow.docuType,
                jsonData: JSON.stringify({
                  contractName: this.alertShow.contractName,
                  contractualStipulation: this.alertShow.contractualStipulation,
                  contractPerformance: this.alertShow.contractPerformance,
                  repaymentPrincipal: this.alertShow.repaymentPrincipal,
                  repaymentBase: this.alertShow.repaymentBase,
                  annualRate: this.alertShow.annualRate,
                  interestCalculation: this.alertShow.interestCalculation
                })
              }).then(res => {
                this.alertCanc('end')
                this.$Message.success({
                  content: '操作成功',
                  duration: 2
                })
              }).catch(e => {
                this.$Message.error({
                  content: '错误信息:' + e + ' 稍后再试',
                  duration: 5
                })
              })
            }
          } else if (this.alertShow.docuType === 2) {
            if (this.alertShow.contractName === '') {
              this.$Message.warning({
                content: '请填写合同名称',
                duration: 5
              })
            } else if (this.alertShow.agreementContent === '') {
              this.$Message.warning({
                content: '请填写协议内容',
                duration: 5
              })
            } else {
              axios.post('/case/addDocumentFile', {
                caseId: this.alertShow.userId,
                documentType: this.alertShow.docuType,
                jsonData: JSON.stringify({
                  contractName: this.alertShow.contractName,
                  agreementContent: this.alertShow.agreementContent
                })
              }).then(res => {
                this.alertCanc('end')
                this.$Message.success({
                  content: '操作成功',
                  duration: 2
                })
              }).catch(e => {
                this.$Message.error({
                  content: '错误信息:' + e + ' 稍后再试',
                  duration: 5
                })
              })
            }
          } else {
            this.$Message.error({
              content: '请稍后再试',
              duration: 5
            })
          }
          break
        case 'addE':
          if (this.alertShow.pageNum === '') {
            this.$Message.warning({
              content: '请填写裁决书第几页',
              duration: 5
            })
          } else if (this.alertShow.lineNum === '') {
            this.$Message.warning({
              content: '请填写裁决书第几行',
              duration: 5
            })
          } else if (this.alertShow.oldContent === '') {
            this.$Message.warning({
              content: '请填写更改之前内容',
              duration: 5
            })
          } else if (this.alertShow.newContent === '') {
            this.$Message.warning({
              content: '请填写更改之后内容',
              duration: 5
            })
          } else {
            axios.post('/case/addDocumentFile', {
              caseId: this.alertShow.userId,
              documentType: this.alertShow.docuType,
              jsonData: JSON.stringify({
                pageNum: this.alertShow.pageNum,
                lineNum: this.alertShow.lineNum,
                oldContent: this.alertShow.oldContent,
                newContent: this.alertShow.newContent
              })
            }).then(res => {
              this.alertCanc('addE')
              this.$Message.success({
                content: '操作成功',
                duration: 2
              })
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
        case 'canc':
          if (this.alertShow.contractName === '') {
            this.$Message.warning({
              content: '请填写合同名称',
              duration: 5
            })
          } else {
            axios.post('/case/previewDocumentFile', {
              caseId: this.alertShow.userId,
              documentType: this.alertShow.docuType,
              jsonData: JSON.stringify({contractName: this.alertShow.contractName})
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
        case 'end':
          if (this.alertShow.docuType === 1) {
            if (this.alertShow.contractName === '') {
              this.$Message.warning({
                content: '请填写合同名称',
                duration: 5
              })
            } else if (this.alertShow.contractualStipulation === '') {
              this.$Message.warning({
                content: '请填写合同约定情况',
                duration: 5
              })
            } else if (this.alertShow.contractPerformance === '') {
              this.$Message.warning({
                content: '请填写合同履行情况',
                duration: 5
              })
            } else if (this.alertShow.repaymentPrincipal === '') {
              this.$Message.warning({
                content: '请填写需要还款本金',
                duration: 5
              })
            } else if (this.alertShow.repaymentBase === '') {
              this.$Message.warning({
                content: '请填写还款基数',
                duration: 5
              })
            } else if (this.alertShow.annualRate === '') {
              this.$Message.warning({
                content: '请填写年利率',
                duration: 5
              })
            } else if (this.alertShow.interestCalculation === '') {
              this.$Message.warning({
                content: '请填写利息计算',
                duration: 5
              })
            } else {
              axios.post('/case/previewDocumentFile', {
                caseId: this.alertShow.userId,
                documentType: this.alertShow.docuType,
                jsonData: JSON.stringify({
                  contractName: this.alertShow.contractName,
                  contractualStipulation: this.alertShow.contractualStipulation,
                  contractPerformance: this.alertShow.contractPerformance,
                  repaymentPrincipal: this.alertShow.repaymentPrincipal,
                  repaymentBase: this.alertShow.repaymentBase,
                  annualRate: this.alertShow.annualRate,
                  interestCalculation: this.alertShow.interestCalculation
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
          } else if (this.alertShow.docuType === 2) {
            if (this.alertShow.contractName === '') {
              this.$Message.warning({
                content: '请填写合同名称',
                duration: 5
              })
            } else if (this.alertShow.agreementContent === '') {
              this.$Message.warning({
                content: '请填写协议内容',
                duration: 5
              })
            } else {
              axios.post('/case/previewDocumentFile', {
                caseId: this.alertShow.userId,
                documentType: this.alertShow.docuType,
                jsonData: JSON.stringify({
                  contractName: this.alertShow.contractName,
                  agreementContent: this.alertShow.agreementContent
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
          } else {
            this.$Message.error({
              content: '请稍后再试',
              duration: 5
            })
          }
          break
        case 'addE':
          if (this.alertShow.pageNum === '') {
            this.$Message.warning({
              content: '请填写裁决书第几页',
              duration: 5
            })
          } else if (this.alertShow.lineNum === '') {
            this.$Message.warning({
              content: '请填写裁决书第几行',
              duration: 5
            })
          } else if (this.alertShow.oldContent === '') {
            this.$Message.warning({
              content: '请填写更改之前内容',
              duration: 5
            })
          } else if (this.alertShow.newContent === '') {
            this.$Message.warning({
              content: '请填写更改之后内容',
              duration: 5
            })
          } else {
            axios.post('/case/previewDocumentFile', {
              caseId: this.alertShow.userId,
              documentType: this.alertShow.docuType,
              jsonData: JSON.stringify({
                pageNum: this.alertShow.pageNum,
                lineNum: this.alertShow.lineNum,
                oldContent: this.alertShow.oldContent,
                newContent: this.alertShow.newContent
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
    alertCanc (type) {
      switch (type) {
        case 'canc':
          this.alertShow.canc = false
          this.alertShow.contractName = ''
          this.alertShow.userId = null
          this.alertShow.docuType = null
          break
        case 'end':
        case 'docuType':
          this.alertShow.contractName = ''
          this.alertShow.contractualStipulation = ''
          this.alertShow.contractPerformance = ''
          this.alertShow.repaymentPrincipal = ''
          this.alertShow.repaymentBase = ''
          this.alertShow.annualRate = ''
          this.alertShow.interestCalculation = ''
          this.alertShow.agreementContent = ''
          if (type === 'end') {
            this.alertShow.end = false
            this.alertShow.userId = null
            this.alertShow.docuType = null
          }
          break
        case 'reve':
          this.alertShow.userId = null
          this.alertShow.reve = false
          break
        case 'addE':
          this.alertShow.userId = null
          this.alertShow.docuType = null
          this.alertShow.pageNum = ''
          this.alertShow.lineNum = ''
          this.alertShow.oldContent = ''
          this.alertShow.newContent = ''
          this.alertShow.addE = false
          break
        default:
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
  }
}
</style>
