<template>
  <div class="statisticsCase">
    <div class="_center pr">
      <spin-comp :spinShow="spinShow"></spin-comp>
      <Row class="mb20">
        <Col span="2">
          <label class="lh32 f16 fc6 fr mr15">日期选择</label>
        </Col>
        <Col span="3">
          <DatePicker class="wmax" @on-change="resDateChange" :options="dateDisa" format="yyyy-MM-dd" type="daterange" placement="bottom-end" placeholder="起始日期 - 结束日期"></DatePicker>
        </Col>
        <Col span="2">
          <label class="lh32 f16 fc6 fr mr15">注册名称：</label>
        </Col>
        <Col span="3">
          <Select v-model="search.requestName" filterable>
            <Option value="all" key="all">全部</Option>
            <Option v-for="item in search.requestNameList" :value="item.userToken" :key="item.userToken">{{ item.userName }}</Option>
          </Select>
        </Col>
        <Col span="2">
          <label class="lh32 f16 fc6 fr mr15">案由：</label>
        </Col>
        <Col span="3">
          <Select v-model="search.caseType">
            <Option value="all" key="all">全部</Option>
            <Option v-for="item in search.caseTypeList" :value="item.itemValue" :key="item.itemValue">{{ item.item }}</Option>
          </Select>
        </Col>
        <Col span="9">
          <div class="tr pr20">
            <Button type="primary" class="mr10" :style="{display: resBtnDis('STATISTICSCASE_SEARCH')}" @click="resSearch">查询</Button>
            <Button class="ml20" type="primary" :style="{display: resBtnDis('STATISTICSCASE_EXPEXCEL')}" @click="resAction('resExportCase', null)">导出列表</Button>
          </div>
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
  </div>
</template>

<script>
import axios from 'axios'
import {resBtn} from '@/components/common/mixin.js'
import spinComp from '@/components/common/spin'
import { caseInfo } from '@/config/common.js'
import regi from '@/config/regiType.js'

export default {
  name: 'statisticsCase',
  mixins: [resBtn],
  components: { spinComp },
  data () {
    return {
      dateDisa: {
        disabledDate (date) {
          return date && date.valueOf() > Date.now()
        }
      },
      spinShow: false,
      search: {
        text: '',
        requestName: 'all',
        caseType: 'all',
        caseTypeList: {},
        requestNameList: [],
        startTime: '',
        endTime: ''
      },
      caseList: {
        loading: false,
        header: [
          {
            title: '申请人',
            key: 'cutomerName',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '案由',
            key: 'typeName',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '已立案案件数量',
            key: 'upNum',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '已结案案件数量',
            key: 'closeNum',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '争议总金额(元)',
            key: 'totleMoney',
            align: 'center'
          },
          {
            title: '仲裁费总金额(元)',
            key: 'totleCost',
            align: 'center'
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
        find: false
      }
    }
  },
  created () {
    this.dictionary()
    this.resCaseList()
  },
  methods: {
    dictionary () {
      axios.post('/dictionary/findDictionaryList', {
        type: 'caseType'
      }).then(res => {
        this.search.caseTypeList = res.data.data
      }).catch(e => {
        this.resMessage('error', '错误信息:' + e + ' 稍后再试')
      })
      axios.post('/batchCaseDocument/findCaseType').then(res => {
        let _obj = res.data.data
        this.search.requestNameList = _obj
      }).catch(e => {
        this.resMessage('error', '错误信息:' + e + ' 稍后再试')
      })
    },
    resCaseList () {
      this.spinShow = true
      axios.post('/caseStatistics/list', {
        pageIndex: (this.pageObj.pageNum - 1) * this.pageObj.pageSize,
        pageSize: this.pageObj.pageSize,
        token: this.search.requestName === 'all' ? '' : this.search.requestName,
        type: this.search.caseType === 'all' ? '' : this.search.caseType,
        startTime: this.search.startTime,
        endTime: this.search.endTime
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
    resDateChange (val) {
      this.search.startTime = val[0]
      this.search.endTime = val[1]
    },
    resAction (type, data) {
      switch (type) {
        case 'resExportCase':
          window.open(regi.api + '/caseStatistics/exportData?token=' + this.search.requestName + '&type=' + this.search.caseType + '&startTime=' + this.search.startTime + '&endTime=' + this.search.endTime, '_blank')
          break
      }
    },
    alertCanc (type) {
      if (type === 'clearIds') {
        return false
      }
    },
    goCaseInfo (index) {
      let obj = {}
      obj.caseId = this.caseList.bodyList[index].caseId
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
._labelFor {
  margin-bottom: 10px;
  p {
    padding: 7px 0;
  }
  ._span {
    color: #ff7a7a;
    vertical-align: text-top;
  }
  ._label {
    padding: 7px 0;
  }
}
._em {
  padding-top: 5px;
  height: 16px;
  line-height: 16px;
  color: #ff7a7a;
  font-size: 8px;
  span {
    float: right;
  }
}
</style>
