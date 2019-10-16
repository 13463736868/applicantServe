<template>
  <div class="systMark pr">
    <spin-comp :spinShow="spinShow"></spin-comp>
    <Row class="mb20 pr20">
      <Col span="2">
        <label class="lh32 f16 fc6 fr mr15">搜索</label>
      </Col>
      <Col span="8">
        <Input v-model="search.text" icon="ios-search" class="_search hand" @on-click="resSearch" @keyup.enter.native="resSearch" placeholder="规则名称"></Input>
      </Col>
      <Col span="2" offset="12" class="tr">
        <Button type="primary" @click="resAction('addAppr', null)">添加</Button>
      </Col>
    </Row>
    <div class="_caseList clearfix">
      <Row>
        <Col span="24" class="pl20 pr20">
          <Table stripe border align="center" :loading="caseList.loading" :columns="caseList.header" :data="caseList.bodyList">
            <template slot-scope="{ row, index }" slot="action">
              <!-- <Button class="mr5" type="primary" size="small" @click="resAction('seeAppr', row)">查看</Button> -->
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
    <res-syst-mark v-if="alertObj.add" :resId="alertObj.resId" :resTitle="alertObj.resTitle" @alertConfirm="alertSave('addAppr')" @alertCancel="alertCanc('addAppr')"></res-syst-mark>
  </div>
</template>

<script>
import axios from 'axios'
import { resMess } from '@/components/common/mixin.js'
import spinComp from '@/components/common/spin'
import resSystMark from '@/page/admin/systMana/systMark/children/resSystMark'

export default {
  name: 'syst_mark',
  mixins: [resMess],
  components: { spinComp, resSystMark },
  data () {
    return {
      spinShow: false,
      tabStatus: 'systMark',
      search: {
        text: ''
      },
      caseList: {
        loading: false,
        header: [
          {
            title: '规则名称',
            key: 'watermarkName',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '系统标识',
            key: 'sysFlag',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '创建时间',
            key: 'createTime',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '状态',
            key: 'state',
            tooltip: 'true',
            align: 'center',
            render: (h, params) => {
              return h('span', {
              }, params.row.useFlag === 0 ? '启用' : (params.row.useFlag === 1 ? '禁用' : '未知'))
            }
          },
          {
            title: '操作',
            key: 'id',
            align: 'center',
            minWidth: 120,
            slot: 'action'
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
        add: false,
        resId: null,
        resTitle: ''
      }
    }
  },
  created () {
    this.resCaseList()
  },
  methods: {
    resCaseList () {
      this.spinShow = true
      axios.post('/watermarkReq/list', {
        watermarkName: this.search.text,
        pageIndex: this.pageObj.pageNum,
        pageSize: this.pageObj.pageSize
      }).then(res => {
        let _data = res.data.data
        this.caseList.bodyList = _data.dataList === null ? [] : _data.dataList
        this.pageObj.total = _data.totalCount
        this.spinShow = false
      }).catch(e => {
        this.spinShow = false
        this.resMessage('error', '错误信息:' + e + ' 稍后再试')
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
    resAction (type, data) {
      switch (type) {
        case 'addAppr':
          this.alertObj.resTitle = '添加'
          this.alertObj.resId = null
          this.alertObj.add = true
          break
      }
    },
    alertSave (type) {
      switch (type) {
        case 'addAppr':
          this.alertObj.add = false
          this.alertObj.resId = null
          this.resSearch()
          break
      }
    },
    alertCanc (type) {
      switch (type) {
        case 'addAppr':
          this.alertObj.add = false
          this.alertObj.resId = null
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/style/mixin.scss';
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
