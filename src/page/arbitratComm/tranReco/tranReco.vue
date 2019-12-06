<template>
  <div class="tranRecoD">
    <div class="_center pr">
      <spin-comp :spinShow="spinShow"></spin-comp>
      <Row>
        <Col span="2">
          <label class="lh32 f16 fc6 fr mr15">搜索</label>
        </Col>
        <Col span="4">
          <Input v-model="search.text" icon="ios-search" class="_search hand" @on-click="resSearch" @keyup.enter.native="resSearch"></Input>
        </Col>
        <Col span="3" offset="1">
          <Select v-model="caseStatus" @on-change="resSearch">
            <Option v-for="item in caseStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Col>
        <Col span="3" class="tr">
          <Input v-model="caseFeeStart" clearable placeholder="起始仲裁费" style="width: 100px"/>
        </Col>
        <Col span="1" class="_line">
          <Icon type="md-remove"/>
        </Col>
        <Col span="3">
          <Input v-model="caseFeeEnd" clearable placeholder="结束仲裁费" style="width: 100px" />
        </Col>
        <Col span="3">
          <Select v-model="listStatus" @on-change="resSearch">
            <Option value="all" key="all">全部</Option>
            <Option value="notAssign" key="notAssign">未分配</Option>
            <Option value="assign" key="assign">已分配</Option>
          </Select>
        </Col>
        <Col span="4" class="tc">
          <Button type="primary" class="mr10" @click="resSearch">查询</Button>
          <Button type="primary" @click="resAction('assignAll', null)" :style="{display: resBtnDis('TRANRECOD_BATCHASSIGN')}">批量分配</Button>
        </Col>
      </Row>
      <div class="_caseList clearfix">
        <Row>
          <Col span="24" class="pl20 pr20">
            <Table stripe border align="center" :loading="caseList.loading" :columns="caseList.header" :data="caseList.bodyList">
              <template slot-scope="{ row, index }" slot="action">
                <Button v-if="row.buttonFlag" class="mr5" type="primary" size="small" @click="resAction('assign', row)" :style="{display: resBtnDis('TRANRECOD_ASSIGN')}">分配</Button>
              </template>
            </Table>
          </Col>
        </Row>
      </div>
      <div class="_page clearfix">
        <Row>
          <Col span="12" offset="6" class="tc">
            <Page :total="pageObj.total" :current="pageObj.pageNum" :page-size="pageObj.pageSize" show-elevator show-total @on-change="reschangePage" @on-page-size-change="reschangePageSize" show-sizer></Page>
          </Col>
        </Row>
      </div>
    </div>
    <res-assig-alert v-if="alertShow.assigModel" :resCaseIdList="alertShow.caseIdList" @alertConfirm="alertSave('assig')" @alertCancel="alertCanc('assig')"></res-assig-alert>
  </div>
</template>

<script>
import axios from 'axios'
import spinComp from '@/components/common/spin'
import {resBtn, resPage} from '@/components/common/mixin.js'
import setRegExp from '@/config/regExp.js'
import { caseInfo } from '@/config/common.js'
import resAssigAlert from '@/page/arbitratComm/tranReco/children/resAssigAlert'

export default {
  name: 'tran_reco_d',
  mixins: [resBtn, resPage],
  components: { spinComp, resAssigAlert },
  data () {
    return {
      spinShow: false,
      search: {
        text: ''
      },
      caseStatusList: [
        {
          value: 0,
          label: '全部'
        },
        {
          value: 1,
          label: '近一周'
        },
        {
          value: 2,
          label: '近一月'
        },
        {
          value: 3,
          label: '近三月'
        },
        {
          value: 4,
          label: '近半年'
        },
        {
          value: 5,
          label: '近一年'
        }
      ],
      listStatus: 'all',
      caseStatus: 0,
      caseFeeStart: null,
      caseFeeEnd: null,
      caseList: {
        loading: false,
        header: [
          {
            title: '选择',
            key: 'id',
            align: 'center',
            maxWidth: 80,
            renderHeader: (h, params) => {
              return this.renderAllSele(h, params)
            },
            render: (h, params) => {
              return this.renderCheck(h, params)
            }
          },
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
            key: 'caseid',
            align: 'center'
          },
          {
            title: '申请人',
            key: 'propName',
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
            key: 'respName',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '仲裁费(元)',
            key: 'cost',
            align: 'center'
          },
          {
            title: '提交时间',
            key: 'subtime',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '受理时间',
            key: 'acctime',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '接收人',
            key: 'acceptPerson',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '操作',
            key: 'id',
            tooltip: 'true',
            align: 'center',
            slot: 'action'
          }
        ],
        bodyList: [],
        seleMap: {}
      },
      pageObj: {
        total: 0,
        pageNum: 1,
        pageSize: 10
      },
      alertShow: {
        assigModel: false,
        caseIdList: []
      }
    }
  },
  created () {
    this.resCaseList()
  },
  methods: {
    resCaseList () {
      this.spinShow = true
      axios.post('/account/list', {
        pageIndex: (this.pageObj.pageNum - 1) * this.pageObj.pageSize,
        pageSize: this.pageObj.pageSize,
        keyword: this.search.text,
        timeState: this.caseStatus,
        arbFeeStart: this.caseFeeStart,
        arbFeeEnd: this.caseFeeEnd,
        listType: this.listStatus === 'all' ? '' : this.listStatus
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
      if ((this.caseFeeStart !== null && this.caseFeeStart !== '') && (this.caseFeeEnd !== null && this.caseFeeEnd !== '')) {
        if (!setRegExp(this.caseFeeStart, 'money')) {
          this.$Message.error({
            content: '请正确填写起始仲裁费格式',
            duration: 5
          })
        } else if (!setRegExp(this.caseFeeEnd, 'money')) {
          this.$Message.error({
            content: '请正确填写结束仲裁费格式',
            duration: 5
          })
        } else if (this.caseFeeEnd - this.caseFeeStart < 0) {
          this.$Message.error({
            content: '起始仲裁费不能大于结束仲裁费',
            duration: 5
          })
        } else {
          this.pageObj.pageNum = 1
          this.resCaseList()
        }
      } else if ((this.caseFeeStart === null || this.caseFeeStart === '') && (this.caseFeeEnd === null || this.caseFeeEnd === '')) {
        if (this.caseFeeStart === '') {
          this.caseFeeStart = null
        }
        if (this.caseFeeEnd === '') {
          this.caseFeeEnd = null
        }
        this.pageObj.pageNum = 1
        this.resCaseList()
      } else {
        if (this.caseFeeStart === null || this.caseFeeStart === '') {
          this.$Message.error({
            content: '请填写起始仲裁费',
            duration: 5
          })
        }
        if (this.caseFeeEnd === null || this.caseFeeEnd === '') {
          this.$Message.error({
            content: '请填写结束仲裁费',
            duration: 5
          })
        }
      }
    },
    reschangePage (page) {
      this.pageObj.pageNum = page
      this.resCaseList()
    },
    renderAllSele (h, params) {
      return h('div', [
        h('span', {
          style: {
            cursor: 'pointer',
            userSelect: 'none'
          },
          on: {
            click: () => {
              this.resAllSele()
            }
          }
        }, '全选')
      ])
    },
    resAllSele () {
      if (this.caseList.seleMap[this.pageObj.pageNum] === undefined) {
        this.caseList.seleMap[this.pageObj.pageNum] = true
      } else {
        this.caseList.seleMap[this.pageObj.pageNum] = !this.caseList.seleMap[this.pageObj.pageNum]
      }
      this.caseList.bodyList.forEach((item, index) => {
        let _obj = item
        if (_obj.buttonFlag) {
          this.seleArrChange(item, this.caseList.seleMap[this.pageObj.pageNum])
        }
      })
    },
    renderCheck (h, params) {
      let _obj = params.row
      if (_obj.buttonFlag) {
        if (this.alertShow.caseIdList.indexOf(_obj.caseid) === -1) {
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
                  this.seleArrChange(_obj, true)
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
                  this.seleArrChange(_obj, false)
                }
              }
            })
          ])
        }
      } else {
        return h('div', [
        ])
      }
    },
    seleArrChange (_obj, bool) {
      let info = _obj
      if (bool) {
        if (this.alertShow.caseIdList.indexOf(info.caseid) === -1) {
          if (this.alertShow.caseIdList.length >= 10) {
            this.$Message.error({
              content: '最多只能选择十个案件',
              duration: 5
            })
            return false
          } else {
            this.alertShow.caseIdList.push(info.caseid)
          }
        }
      } else {
        if (this.alertShow.caseIdList.indexOf(info.caseid) !== -1) {
          this.alertShow.caseIdList.splice(this.alertShow.caseIdList.indexOf(info.caseid), 1)
        }
      }
    },
    resAction (type, data) {
      switch (type) {
        case 'assign':
          this.alertShow.caseIdList = []
          this.alertShow.caseIdList.push(data.caseid)
          this.alertShow.assigModel = true
          break
        case 'assignAll':
          if (this.alertShow.caseIdList.length === 0) {
            this.$Message.warning({
              content: '请先选择一个案件',
              duration: 5
            })
          } else {
            this.alertShow.assigModel = true
          }
          break
      }
    },
    alertSave (type) {
      if (type === 'assig') {
        this.alertShow.caseIdList = []
        this.alertShow.assigModel = false
        this.pageObj.pageNum = 1
        this.resCaseList()
      }
    },
    alertCanc (type) {
      if (type === 'assig') {
        this.alertShow.assigModel = false
      }
    },
    goCaseInfo (index) {
      let obj = {}
      obj.caseId = this.caseList.bodyList[index].caseid
      obj.state = this.caseList.bodyList[index].state
      caseInfo(obj)
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
  ._line {
    text-align: center;
    padding: 7px 0;
  }
  ._caseList {
    margin-bottom: 20px;
  }
}
</style>
