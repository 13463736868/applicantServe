<template>
  <div class="registList">
    <div class="_center pr">
      <spin-comp :spinShow="spinShow"></spin-comp>
      <Row>
        <Col span="2">
          <label class="lh32 f16 fc6 fr mr15">搜索</label>
        </Col>
        <Col span="8">
          <Input v-model="search.text" icon="ios-search" class="_search hand" @on-click="resSearch" @keyup.enter.native="resSearch" placeholder="案号 / 申请人 / 被申请人"></Input>
        </Col>
        <Col span="3" offset="1">
          <Select v-model="caseStatus" @on-change="resSearch">
            <Option v-for="item in caseStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Col>
      </Row>
      <div class="_caseList clearfix">
        <Row>
          <Col span="24" class="pl20 pr20">
            <Table stripe border align="center" :row-class-name="rowClassName" :loading="caseList.loading" :columns="caseList.header" :data="caseList.bodyList"></Table>
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
import { caseInfo } from '@/config/common.js'

export default {
  name: 'regist_list',
  components: { spinComp },
  data () {
    return {
      spinShow: true,
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
            key: 'propName',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '被申请人',
            key: 'repoName',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '纠纷类型',
            key: 'disputeType',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '争议标的(元)',
            key: 'money',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '仲裁费(元)',
            key: 'cost',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '立案时间',
            key: 'up_time',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '组庭时间',
            key: 'group_time',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '开庭时间',
            key: 'begin_time',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '结案时间',
            key: 'closing_time',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '结案方式',
            key: 'endType',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '秘书',
            key: 'bamsleaderName',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '仲裁员',
            key: 'arbitratorName',
            tooltip: 'true',
            align: 'center'
          }
        ],
        bodyList: []
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
    rowClassName (row, index) {
      if (row.endType === '裁决') {
        return 'table-blue'
      } else if (row.endType === '调解') {
        return 'table-green'
      } else if (row.endType === '撤案') {
        return 'table-red'
      } else if (row.endType === '中止') {
        return 'table-pink'
      } else {
        return ''
      }
    },
    resCaseList () {
      this.spinShow = true
      axios.post('/closeCaseForm/caseRegisterList', {
        pageIndex: (this.pageObj.pageNum - 1) * this.pageObj.pageSize,
        pageSize: this.pageObj.pageSize,
        keyword: this.search.text,
        timeState: this.caseStatus
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
<style>
.ivu-table .table-blue td {
  background-color: #5B9BD5;
}
.ivu-table .table-green td {
  background-color: #70AC47;
}
.ivu-table .table-red td {
  background-color: #C00000;
}
.ivu-table .table-pink td {
  background-color: #F4B084;
}
</style>
