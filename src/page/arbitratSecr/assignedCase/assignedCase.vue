<template>
  <div class="assignedCase">
    <div class="_center pr">
      <spin-comp :spinShow="spinShow"></spin-comp>
      <Row>
        <Col span="2">
          <label class="lh32 f16 fc6 fr mr15">搜索</label>
        </Col>
        <Col span="4">
          <Input v-model="search.text" icon="ios-search" class="_search hand" @on-click="resSearch" @keyup.enter.native="resSearch" placeholder="案号 / 案件编号 / 申请人 / 被申请人 / 代理人 / 年限"></Input>
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
        <Col span="4" offset="2" class="tc">
          <Button type="primary" class="mr10" @click="resSearch">查询</Button>
        </Col>
      </Row>
      <div class="_caseList clearfix">
        <Row>
          <Col span="24" class="pl20 pr20">
            <Table stripe border align="center" :loading="caseList.loading" :columns="caseList.header" :data="caseList.bodyList">
              <template slot-scope="{ row, index }" slot="action">
                <Button class="mr5" type="primary" size="small" @click="resAction('seeFormGro', row)" :style="{display: resBtnDis('ASSIGNED_GROUPAUDIT')}">查看组庭审批表</Button>
              </template>
            </Table>
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
  </div>
</template>

<script>
import axios from 'axios'
import spinComp from '@/components/common/spin'
import {resBtn} from '@/components/common/mixin.js'
import setRegExp from '@/config/regExp.js'
import { caseInfo } from '@/config/common.js'

export default {
  name: 'tran_form',
  mixins: [resBtn],
  components: { spinComp },
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
      caseStatus: 0,
      caseFeeStart: null,
      caseFeeEnd: null,
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
            key: 'caseid',
            align: 'center'
          },
          {
            title: '案由',
            key: 'caseReson',
            tooltip: 'true',
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
            title: '案件状态',
            key: 'tribunalStateDetail',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '已组庭',
            key: 'id',
            tooltip: 'true',
            minWidth: 30,
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
        listType: ''
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
    resAction (type, data) {
      switch (type) {
        case 'seeFormGro':
          axios.post('/approvalForm/queryUrl', {
            caseId: data.caseid,
            type: '22'
          }).then(res => {
            window.open(res.data.data, '_blank')
          }).catch(e => {
            this.$Message.error({
              content: '错误信息:' + e + ' 稍后再试',
              duration: 5
            })
          })
          break
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
