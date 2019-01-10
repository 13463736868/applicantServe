<template>
  <div class="idenCheck">
    <head-top :isRegister="true">
      <span class="f36 fcf">身份审核</span>
    </head-top>
    <div class="_center pr">
      <spin-comp :spinShow="spinShow"></spin-comp>
      <Row>
        <Col span="4" offset="19">
          <Select v-model="reviewStatus" @on-change="resChangeStatus()">
            <Option v-for="item in reviewList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Col>
      </Row>
      <Tabs v-model="tabStatus">
        <TabPane name="comp" label="企业审核">
          <div class="_caseList clearfix">
            <Row>
              <Col span="24" class="pl20 pr20">
                <Table stripe border align="center" :loading="compList.loading" :columns="compList.header" :data="compList.bodyList"></Table>
              </Col>
            </Row>
          </div>
          <div class="_page clearfix">
            <Row>
              <Col span="12" offset="6" class="tc">
                <Page :total="compPage.total" :current="compPage.pageNum" :page-size="compPage.pageSize" show-elevator show-total @on-change="reschangeCompPage"></Page>
              </Col>
            </Row>
          </div>
        </TabPane>
        <TabPane name="indi" label="个人审核">
          <div class="_caseList clearfix">
            <Row>
              <Col span="24" class="pl20 pr20">
                <Table stripe border align="center" :loading="indiList.loading" :columns="indiList.header" :data="indiList.bodyList"></Table>
              </Col>
            </Row>
          </div>
          <div class="_page clearfix">
            <Row>
              <Col span="12" offset="6" class="tc">
                <Page :total="indiPage.total" :current="indiPage.pageNum" :page-size="indiPage.pageSize" show-elevator show-total @on-change="reschangeIndiPage"></Page>
              </Col>
            </Row>
          </div>
        </TabPane>
      </Tabs>
    </div>
    <alert-btn-info :alertShow="compObj.alert" @alertConfirm="compSave" @alertCancel="alertCanc('comp')" alertTitle="操作">
      <p v-if="compObj.state === 1">确定通过审核吗？</p>
      <Input v-else-if="compObj.state === 2" v-model="compObj.reason" type="textarea" :autosize="{minRows: 3,maxRows: 10}" placeholder="请输入驳回原因..." />
    </alert-btn-info>
    <alert-btn-info :alertShow="indiObj.alert" @alertConfirm="indiSave" @alertCancel="alertCanc('indi')" alertTitle="操作">
      <p v-if="indiObj.state === 1">确定通过审核吗？</p>
      <Input v-else-if="indiObj.state === 2" v-model="indiObj.reason" type="textarea" :autosize="{minRows: 3,maxRows: 10}" placeholder="请输入驳回原因..." />
    </alert-btn-info>
  </div>
</template>

<script>
import axios from 'axios'
import { mapActions } from 'vuex'
import headTop from '@/components/header/head'
import spinComp from '@/components/common/spin'
import alertBtnInfo from '@/components/common/alertBtnInfo'

export default {
  name: 'iden_check',
  components: { headTop, spinComp, alertBtnInfo },
  data () {
    return {
      spinShow: false,
      tabStatus: 'comp',
      reviewStatus: 3,
      reviewList: [],
      compList: {
        loading: false,
        header: [
          {
            title: '企业名称',
            key: 'name',
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
                    this.goIdenInfo(2, params.index)
                  }
                }
              }, params.row.name)
            }
          },
          {
            title: '证照类型',
            key: 'permitTypeName',
            align: 'center'
          },
          {
            title: '证照号码',
            key: 'code',
            align: 'center'
          },
          {
            title: '法定代表人',
            key: 'legal',
            align: 'center'
          },
          {
            title: '法人证件',
            key: 'idcardTypeName',
            align: 'center'
          },
          {
            title: '法人证件号码',
            key: 'idcard',
            align: 'center'
          },
          {
            title: '公司地址',
            key: 'address',
            align: 'center'
          },
          {
            title: '审核状态',
            key: 'stateName',
            align: 'center'
          },
          {
            title: '操作',
            key: 'id',
            align: 'center',
            render: (h, params) => {
              return this.renderCompBtn(h, params)
            }
          }
        ],
        bodyList: []
      },
      indiList: {
        loading: false,
        header: [
          {
            title: '姓名',
            key: 'name',
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
                    this.goIdenInfo(1, params.index)
                  }
                }
              }, params.row.name)
            }
          },
          {
            title: '证件类型',
            key: 'idcardTypeName',
            align: 'center'
          },
          {
            title: '证件号码',
            key: 'idcard',
            align: 'center'
          },
          {
            title: '性别',
            key: 'sex',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('span', {
                }, params.row.sex === 1 ? '男' : (params.row.sex === 2 ? '女' : '未知'))
              ])
            }
          },
          {
            title: '联系地址',
            key: 'address',
            align: 'center'
          },
          {
            title: '状态',
            key: 'stateName',
            align: 'center'
          },
          {
            title: '操作',
            key: 'id',
            align: 'center',
            render: (h, params) => {
              return this.renderIndiBtn(h, params)
            }
          }
        ],
        bodyList: []
      },
      compPage: {
        total: 0,
        pageNum: 1,
        pageSize: 10
      },
      indiPage: {
        total: 0,
        pageNum: 1,
        pageSize: 10
      },
      compObj: {
        id: null,
        state: null,
        reason: null,
        alert: false
      },
      indiObj: {
        id: null,
        state: null,
        reason: null,
        alert: false
      }
    }
  },
  created () {
    this.dictionary()
  },
  methods: {
    ...mapActions([
      'setIdenCheckId',
      'setIdenCheckType',
      'setIdenCheckState'
    ]),
    renderCompBtn (h, params) {
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
                this.resComp(1, params.index)
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
                this.resComp(2, params.index)
              }
            }
          }, '驳回')
        ])
      } else {
        return h('div', [
        ])
      }
    },
    renderIndiBtn (h, params) {
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
                this.resIndi(1, params.index)
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
                this.resIndi(2, params.index)
              }
            }
          }, '驳回')
        ])
      } else {
        return h('div', [
        ])
      }
    },
    dictionary () {
      axios.post('/dictionary/findDictionaryList', {
        type: 'approve'
      }).then(res => {
        let _dataList = res.data.data
        let _select = []
        for (let k in _dataList) {
          let _o = {}
          _o.value = _dataList[k].itemValue
          _o.label = _dataList[k].item
          _select.push(_o)
        }
        this.reviewList = _select
        this.resCaseList('once')
      }).catch(e => {
        this.$Message.error({
          content: '错误信息:' + e,
          duration: 5
        })
      })
    },
    resCaseList (type) {
      this.spinShow = true
      if (type === 'once') {
        axios.post('/enterprise/list', {
          pageIndex: (this.compPage.pageNum - 1) * this.compPage.pageSize,
          pageSize: this.compPage.pageSize,
          state: this.reviewStatus
        }).then(res => {
          let _data = res.data.data
          this.compList.bodyList = _data.dataList === null ? [] : _data.dataList
          this.compPage.total = _data.totalCount
          this.spinShow = false
        }).catch(e => {
          this.spinShow = false
          this.$Message.error({
            content: '错误信息:' + e + ' 稍后再试',
            duration: 5
          })
        })
        axios.post('/clientRequest/findRegisterData', {
          pageIndex: (this.indiPage.pageNum - 1) * this.indiPage.pageSize,
          pageSize: this.indiPage.pageSize,
          state: this.reviewStatus
        }).then(res => {
          let _data = res.data.data
          this.indiList.bodyList = _data.dataList === null ? [] : _data.dataList
          this.indiPage.total = _data.totalCount
          this.spinShow = false
        }).catch(e => {
          this.spinShow = false
          this.$Message.error({
            content: '错误信息:' + e + ' 稍后再试',
            duration: 5
          })
        })
      } else {
        // if (this.tabStatus === 'comp') {
        axios.post('/enterprise/list', {
          pageIndex: (this.compPage.pageNum - 1) * this.compPage.pageSize,
          pageSize: this.compPage.pageSize,
          state: this.reviewStatus
        }).then(res => {
          let _data = res.data.data
          this.compList.bodyList = _data.dataList === null ? [] : _data.dataList
          this.compPage.total = _data.totalCount
          this.spinShow = false
        }).catch(e => {
          this.spinShow = false
          this.$Message.error({
            content: '错误信息:' + e + ' 稍后再试',
            duration: 5
          })
        })
        // } else if (this.tabStatus === 'indi') {
        axios.post('/clientRequest/findRegisterData', {
          pageIndex: (this.indiPage.pageNum - 1) * this.indiPage.pageSize,
          pageSize: this.indiPage.pageSize,
          state: this.reviewStatus
        }).then(res => {
          let _data = res.data.data
          this.indiList.bodyList = _data.dataList === null ? [] : _data.dataList
          this.indiPage.total = _data.totalCount
          this.spinShow = false
        }).catch(e => {
          this.spinShow = false
          this.$Message.error({
            content: '错误信息:' + e + ' 稍后再试',
            duration: 5
          })
        })
        // }
      }
    },
    resChangeStatus () {
      // if (this.tabStatus === 'comp') {
      this.compPage.pageNum = 1
      // } else if (this.tabStatus === 'indi') {
      this.indiPage.pageNum = 1
      // }
      this.resCaseList('change')
    },
    reschangeCompPage (page) {
      this.compPage.pageNum = page
      this.resCaseList('more')
    },
    reschangeIndiPage (page) {
      this.indiPage.pageNum = page
      this.resCaseList('more')
    },
    resComp (type, index) {
      this.compObj.id = this.compList.bodyList[index].id
      this.compObj.state = type
      this.compObj.alert = true
    },
    compSave () {
      let _data = {}
      let _url = '/enterprise/verify'
      if (this.compObj.state === 1) {
        _data.id = this.compObj.id
        _data.state = this.compObj.state
        this.sendAjax(_url, _data, 'comp')
      } else if (this.compObj.state === 2) {
        _data.id = this.compObj.id
        _data.state = this.compObj.state
        _data.reason = this.compObj.reason === null ? '' : this.compObj.reason
        this.sendAjax(_url, _data, 'comp')
      }
    },
    resIndi (type, index) {
      this.indiObj.id = this.indiList.bodyList[index].id
      this.indiObj.state = type
      this.indiObj.alert = true
    },
    indiSave () {
      let _data = {}
      let _url = '/clientRequest/updateRegisterPersonal'
      if (this.indiObj.state === 1) {
        _data.id = this.indiObj.id
        _data.state = this.indiObj.state
        this.sendAjax(_url, _data, 'indi')
      } else if (this.indiObj.state === 2) {
        _data.id = this.indiObj.id
        _data.state = this.indiObj.state
        _data.reason = this.indiObj.reason === null ? '' : this.indiObj.reason
        this.sendAjax(_url, _data, 'indi')
      }
    },
    sendAjax (_url, _data, _type) {
      axios.post(_url, _data).then(res => {
        this.alertCanc(_type)
        this.$Message.success({
          content: '操作成功',
          duration: 2
        })
        this.resCaseList('')
      }).catch(e => {
        this.alertCanc(_type)
        this.$Message.error({
          content: '错误信息:' + e,
          duration: 5
        })
      })
    },
    alertCanc (type) {
      if (type === 'comp') {
        this.compObj.alert = false
        this.compObj.id = null
        this.compObj.state = null
        this.compObj.reason = null
      } else if (type === 'indi') {
        this.indiObj.alert = false
        this.indiObj.id = null
        this.indiObj.state = null
        this.indiObj.reason = null
      }
    },
    goIdenInfo (type, index) {
      if (type === 1) {
        this.setIdenCheckId(this.indiList.bodyList[index].id)
        window.localStorage.setItem('idenCheckId', this.indiList.bodyList[index].id)
        this.setIdenCheckType(type)
        window.localStorage.setItem('idenCheckType', type)
        this.setIdenCheckState(this.indiList.bodyList[index].state)
        window.localStorage.setItem('idenCheckState', this.indiList.bodyList[index].state)
      } else if (type === 2) {
        this.setIdenCheckId(this.compList.bodyList[index].id)
        window.localStorage.setItem('idenCheckId', this.compList.bodyList[index].id)
        this.setIdenCheckType(type)
        window.localStorage.setItem('idenCheckType', type)
        this.setIdenCheckState(this.compList.bodyList[index].state)
        window.localStorage.setItem('idenCheckState', this.compList.bodyList[index].state)
      }
      this.$router.push({
        path: '/idenInfo'
      })
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
  ._caseList {
    margin-bottom: 20px;
  }
}
</style>
