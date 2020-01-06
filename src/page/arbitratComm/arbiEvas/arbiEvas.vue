<template>
  <div class="arbiEvas">
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
    <create-docu :alertShow="alertShow.reje" @alertConfirm="docuSave('reje')" @alertSee="seeDocu('reje')" @alertCancel="alertCanc('reje')" alertTitle="操作">
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
          <p><span class="_span">*</span><b>审批意见：</b></p>
        </Col>
        <Col span="16">
          <Input v-model="alertShow.rejeReason" type="textarea" :autosize="{minRows: 3,maxRows: 10}" placeholder="请输入驳回原因..."/>
        </Col>
      </Row>
    </create-docu>
    <alert-btn-info :alertShow="alertShow.agreNew" @alertConfirm="agreNewSave" @alertCancel="alertCanc('agreNew')" alertTitle="操作">
      <p>确定同意吗？</p>
    </alert-btn-info>
    <alert-btn-info :alertShow="alertShow.agre" @alertConfirm="agreSave" @alertCancel="alertCanc('agre')" alertTitle="操作">
      <div class="pb10">
        <Row class="mb5">
          <Col span="3" offset="1">
            <label class="lh25 f12 fb fl mr15">搜 索 :</label>
          </Col>
          <Col span="8">
            <Input :maxlength="15" size="small" v-model.trim="searchText" icon="md-search" placeholder=""></Input>
          </Col>
        </Row>
        <Row v-if="alertShow.infoUser !== null">
          <Col span="20" offset="1" v-if="alertShow.infoUser[0] !== '-1'">
            <span><b>主 裁： </b></span>
            <span v-if="seleArrName[0] !== ''"><span class="ml5" v-text="seleArrName[0]"></span><Icon @click="resSeleDel(0)" class="ml5 hand" color="#ed3f14" type="md-close"></Icon></span>
          </Col>
        </Row>
        <Row v-if="seleShow">
          <Col span="20" offset="1" v-if="alertShow.infoUser[1] !== '-1'">
            <span><b>边 裁：</b></span>
            <span v-if="seleArrName[1] !== ''"><span class="ml5" v-text="seleArrName[1]"></span><Icon @click="resSeleDel(1)" class="ml5 hand" color="#ed3f14" type="md-close"></Icon></span>
          </Col>
          <Col span="20" offset="1" v-if="alertShow.infoUser[2] !== '-1'">
            <span><b>边 裁：</b></span>
            <span v-if="seleArrName[2] !== ''"><span class="ml5" v-text="seleArrName[2]"></span><Icon @click="resSeleDel(2)" class="ml5 hand" color="#ed3f14" type="md-close"></Icon></span>
          </Col>
        </Row>
      </div>
      <Row>
        <Col span="24" class="pl20 pr20">
          <Table stripe align="center" :loading="seleList.loading" :columns="seleList.header" :data="seleList.bodyList"></Table>
        </Col>
      </Row>
      <Row>
        <Col span="12" offset="6" class="tc pt10">
          <Page simple :total="selePageObj.total" :current="selePageObj.pageNum" :page-size="selePageObj.pageSize" show-total @on-change="resChanPage"></Page>
        </Col>
      </Row>
    </alert-btn-info>
    <alert-btn-info :alertShow="alertShow.reas" :isSaveBtn="true" @alertCancel="alertCanc('reas')" alertTitle="仲裁员回避原因">
      <p class="t2" v-text="alertShow.reasText"></p>
    </alert-btn-info>
  </div>
</template>

<script>
import axios from 'axios'
import {resBtn} from '@/components/common/mixin.js'
import headTop from '@/components/header/head'
import spinComp from '@/components/common/spin'
import alertBtnInfo from '@/components/common/alertBtnInfo'
import createDocu from '@/components/common/createDocu'
import { caseInfo } from '@/config/common.js'

export default {
  name: 'arbi_evas',
  mixins: [resBtn],
  components: { headTop, spinComp, alertBtnInfo, createDocu },
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
            tooltip: 'true',
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
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '被申请人',
            key: 'respondentName',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '被回避仲裁员',
            key: 'approver',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '审核状态',
            key: 'avoidState',
            align: 'center',
            render: (h, params) => {
              return h('span', {
              }, params.row.avoidState === 1 ? '通过' : (params.row.avoidState === 2 ? '驳回' : (params.row.avoidState === 3 ? '未审核' : '')))
            }
          },
          {
            title: '回避原因',
            key: 'id',
            tooltip: 'true',
            align: 'center',
            render: (h, params) => {
              return this.renderReasBtn(h, params)
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
        reje: false,
        id: null,
        rejeReason: '',
        arbitratorIds: null,
        avoidState: null,
        contractName: '',
        conferenceThink: '',
        agre: false,
        avoidRequestId: null,
        infoUser: null,
        infoMoney: null,
        agreNew: false,
        reas: false,
        reasText: ''
      },
      seleList: {
        loading: false,
        header: [
          {
            title: '名称',
            key: 'name',
            align: 'center'
          },
          {
            title: '擅长领域',
            key: 'sign',
            align: 'center'
          },
          {
            title: '操作',
            key: 'id',
            align: 'center',
            render: (h, params) => {
              return this.renderCheck(h, params)
            }
          }
        ],
        bodyList: []
      },
      seleArr: [],
      seleArrName: [],
      selePageObj: {
        total: 0,
        pageNum: 1,
        pageSize: 5
      },
      searchText: ''
    }
  },
  created () {
    this.resCaseList()
    this.$watch('searchText', this.debounce(this.resSearch, 1000))
  },
  computed: {
    seleShow () {
      if (this.alertShow.infoMoney === null) {
        return false
      } else if (this.alertShow.infoMoney < 1000000) {
        return false
      } else if (this.alertShow.infoMoney >= 1000000) {
        return true
      } else {
        return false
      }
    },
    infoUserArr () {
      if (this.alertShow.infoUser.length === 1) {
        return ['']
      } else {
        let _n = ['', '', '']
        this.alertShow.infoUser.forEach(function (v, i) {
          if (v === '-1') {
            _n[i] = '-1'
          }
        })
        return _n
      }
    },
    infoUserNum () {
      if (this.alertShow.infoUser.length === 1) {
        return '一'
      } else {
        let _n = 0
        this.alertShow.infoUser.forEach(function (v, i) {
          if (v !== '-1') {
            _n++
          }
        })
        return _n === 1 ? '一' : (_n === 2 ? '二' : (_n === 3 ? '三' : ''))
      }
    }
  },
  methods: {
    renderReasBtn (h, params) {
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
              this.resArbiEvas(params.index)
            }
          }
        }, '查看')
      ])
    },
    renderCheck (h, params) {
      let _id = params.row.id
      if (this.seleArr.indexOf(_id) === -1) {
        return h('div', [
          h('Icon', {
            props: {
              type: 'md-square-outline',
              size: '16'
            },
            style: {
              color: '#2d8cf0',
              cursor: 'pointer',
              verticalAlign: 'text-top'
            },
            on: {
              click: () => {
                this.seleArrChange(params.index, true)
              }
            }
          })
        ])
      } else {
        return h('div', [
          h('Icon', {
            props: {
              type: 'md-checkbox',
              size: '16'
            },
            style: {
              color: '#2d8cf0',
              cursor: 'pointer',
              verticalAlign: 'text-top'
            },
            on: {
              click: () => {
                this.seleArrChange(params.index, false)
              }
            }
          })
        ])
      }
    },
    renderBtn (h, params) {
      let _obj = params.row
      if (_obj.showButtonState === '1') {
        return h('div', [
          h('Button', {
            props: {
              type: 'primary',
              size: 'small'
            },
            style: {
              marginRight: '5px',
              display: this.resBtnDis('ARBIEVAS_PASS')
            },
            on: {
              click: () => {
                this.resNewSaveEvas(params.index)
              }
            }
          }, '同意'),
          h('Button', {
            props: {
              type: 'primary',
              size: 'small'
            },
            style: {
              marginRight: '5px',
              display: this.resBtnDis('ARBIEVAS_NOPASS')
            },
            on: {
              click: () => {
                this.resCancEvas(params.index)
              }
            }
          }, '驳回')
        ])
      } else if (_obj.showButtonState === '2') {
        return h('div', [
          h('Button', {
            props: {
              type: 'primary',
              size: 'small'
            },
            style: {
              marginRight: '5px',
              display: this.resBtnDis('ARBIEVAS_REGEN')
            },
            on: {
              click: () => {
                this.resCancEvas(params.index)
              }
            }
          }, '重新生成文书')
        ])
      } else if (_obj.showButtonState === '3') {
        return h('div', [
          h('span', {
            props: {
              type: 'text',
              size: 'small'
            },
            style: {
              color: '#2d8cf0'
            }
          }, '文书审核中')
        ])
      } else if (_obj.showButtonState === '4') {
        return h('div', [
          h('span', {
            props: {
              type: 'text',
              size: 'small'
            },
            style: {
              color: '#2d8cf0'
            }
          }, '文书审核通过')
        ])
      } else if (_obj.showButtonState === '5') {
        return h('div', [
        ])
      }
    },
    resArbiEvas (index) {
      this.alertShow.reasText = this.caseList.bodyList[index].avoidReason
      this.alertShow.reas = true
    },
    resCaseList () {
      this.spinShow = true
      axios.post('/approve/findEvadeAppoverList', {
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
    debounce (fn, idle) {
      let setTm
      if (!idle || idle <= 0) return fn
      return () => {
        clearTimeout(setTm)
        setTm = setTimeout(fn.bind(this, ...arguments), idle)
      }
    },
    resSearch () {
      this.selePageObj.pageNum = 1
      this.resUserList()
    },
    resSaveEvas (index) {
      this.selePageObj.pageNum = 1
      this.alertShow.agre = true
      this.alertShow.avoidRequestId = this.caseList.bodyList[index].avoidRequestId
      this.alertShow.infoMoney = this.caseList.bodyList[index].money
      this.alertShow.infoUser = this.caseList.bodyList[index].approver.split(',')
      this.seleArr = JSON.parse(JSON.stringify(this.infoUserArr))
      this.seleArrName = JSON.parse(JSON.stringify(this.infoUserArr))
      this.resUserList()
    },
    resNewSaveEvas (index) {
      this.alertShow.agreNew = true
      this.alertShow.avoidRequestId = this.caseList.bodyList[index].avoidRequestId
    },
    resUserList () {
      axios.post('/clientRequest/findUsersList', {
        pageIndex: (this.selePageObj.pageNum - 1) * this.selePageObj.pageSize,
        pageSize: this.selePageObj.pageSize,
        roleName: 'arbitrator',
        keyword: this.searchText
      }).then(res => {
        this.seleList.bodyList = res.data.data.dataList === null ? [] : res.data.data.dataList
        this.selePageObj.total = res.data.data.totalCount
      }).catch(e => {
        this.$Message.error({
          content: '错误信息:' + e + ' 稍后再试',
          duration: 5
        })
      })
    },
    resChanPage (page) {
      this.selePageObj.pageNum = page
      this.resUserList()
    },
    seleArrChange (index, bool) {
      let _id = this.seleList.bodyList[index].id
      let _name = this.seleList.bodyList[index].name
      if (bool) {
        if (this.seleArr.indexOf(_id) === -1) {
          let _t = false
          for (let k in this.seleArr) {
            if (this.seleArr[k] === '') {
              this.seleArr[k] = _id
              this.seleArrName[k] = _name
              this.seleArr.splice(k, 0)
              this.seleArrName.splice(k, 0)
              _t = true
              break
            }
          }
          if (!_t) {
            this.$Message.error({
              content: '仲裁员最多只能选择' + this.infoUserNum + '位！',
              duration: 5
            })
          }
        }
      } else {
        if (this.seleArr.indexOf(_id) !== -1) {
          this.seleArrName.splice(this.seleArr.indexOf(_id), 1, '')
          this.seleArr.splice(this.seleArr.indexOf(_id), 1, '')
        }
      }
    },
    resSeleDel (num) {
      this.seleArr[num] = ''
      this.seleArrName[num] = ''
      this.resUserList()
    },
    agreSave () {
      for (let k in this.seleArr) {
        if (this.seleArr[k] === '') {
          this.$Message.error({
            content: '请选择仲裁员后再点击确定',
            duration: 5
          })
          return false
        }
      }
      this.alertShow.agre = false
      axios.post('/approve/updateAvoidRequestAppover', {
        avoidRequestId: this.alertShow.avoidRequestId,
        avoidState: 1,
        arbitratorIds: this.seleArr.join(',')
      }).then(res => {
        this.selePageObj.pageNum = 1
        this.alertCanc('agre')
        this.$Message.success({
          content: '操作成功',
          duration: 2
        })
        this.resCaseList()
      }).catch(e => {
        this.alertCanc('agre')
        this.$Message.error({
          content: '错误信息:' + e + ' 稍后再试',
          duration: 5
        })
      })
    },
    agreNewSave () {
      this.alertShow.agreNew = false
      axios.post('/approve/updateAvoidRequestAppover', {
        avoidRequestId: this.alertShow.avoidRequestId,
        avoidState: 1
      }).then(res => {
        this.alertCanc('agreNew')
        this.$Message.success({
          content: '操作成功',
          duration: 2
        })
        this.resCaseList()
      }).catch(e => {
        this.alertCanc('agreNew')
        this.$Message.error({
          content: '错误信息:' + e + ' 稍后再试',
          duration: 5
        })
      })
    },
    resCancEvas (index) {
      this.alertShow.id = this.caseList.bodyList[index].id
      this.alertShow.avoidRequestId = this.caseList.bodyList[index].avoidRequestId
      this.alertShow.arbitratorIds = this.caseList.bodyList[index].arbitratorIds
      this.alertShow.avoidState = 2
      this.alertShow.docuType = 7
      this.alertShow.reje = true
    },
    docuSave (type) {
      switch (type) {
        case 'reje':
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
          } else if (this.alertShow.rejeReason === '') {
            this.$Message.warning({
              content: '请填写审批意见',
              duration: 5
            })
          } else {
            this.alertShow.reje = false
            axios.post('/approve/updateAvoidRequestAppover', {
              avoidRequestId: this.alertShow.avoidRequestId,
              content: this.alertShow.rejeReason,
              avoidState: this.alertShow.avoidState,
              arbitratorIds: this.alertShow.arbitratorIds,
              jsonData: JSON.stringify({
                contractName: this.alertShow.contractName,
                conferenceThink: this.alertShow.conferenceThink
              })
            }).then(res => {
              this.alertCanc('reje')
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
        case 'reje':
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
          } else if (this.alertShow.rejeReason === '') {
            this.$Message.warning({
              content: '请填写审批意见',
              duration: 5
            })
          } else {
            axios.post('/case/previewDocumentFile', {
              caseId: this.alertShow.id,
              documentType: this.alertShow.docuType,
              jsonData: JSON.stringify({
                contractName: this.alertShow.contractName,
                conferenceThink: this.alertShow.conferenceThink
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
      if (type === 'reje') {
        this.alertShow.reje = false
        this.alertShow.id = null
        this.alertShow.rejeReason = ''
        this.alertShow.avoidRequestId = null
        this.alertShow.arbitratorIds = null
        this.alertShow.avoidState = null
        this.alertShow.contractName = ''
        this.alertShow.conferenceThink = ''
      } else if (type === 'agre') {
        this.alertShow.agre = false
        this.alertShow.avoidRequestId = null
        this.alertShow.infoMoney = null
        this.alertShow.infoUser = null
        this.seleArr = []
        this.seleArrName = []
        this.searchText = ''
      } else if (type === 'agreNew') {
        this.alertShow.agreNew = false
      } else if (type === 'reas') {
        this.alertShow.reas = false
        this.alertShow.reasText = ''
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
