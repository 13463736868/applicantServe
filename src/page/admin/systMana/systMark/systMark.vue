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
        <Button type="primary" @click="resAction('add', null)">添加</Button>
      </Col>
    </Row>
    <div class="_caseList clearfix">
      <Row>
        <Col span="24" class="pl20 pr20">
          <Table stripe border align="center" :loading="caseList.loading" :columns="caseList.header" :data="caseList.bodyList">
            <template slot-scope="{ row, index }" slot="action">
              <Button class="mr5" type="primary" size="small" @click="resAction('edit', row)">修改</Button>
              <Button class="mr5" type="primary" size="small" @click="resAction('see', row)">查看</Button>
              <Button class="mr5" type="primary" size="small" @click="resAction('del', row)">删除</Button>
              <Button class="mr5" type="primary" size="small" @click="resAction('start', row)">{{row.useFlag === 1 ? '启用' :  '禁用'}}</Button>
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
    <alert-btn-info :alertShow="alertShow.delModel" @alertConfirm="alertSave('del')" @alertCancel="alertCanc('del')" alertTitle="操作">
      <p>确定要删除吗？</p>
    </alert-btn-info>
    <alert-btn-info :alertShow="alertShow.startModel" @alertConfirm="alertSave('start')" @alertCancel="alertCanc('start')" alertTitle="操作">
      <p v-if="alertShow.startRow === 1">确定要启用吗？</p>
      <p v-if="alertShow.startRow === 0">确定要禁用吗？</p>
    </alert-btn-info>
    <res-syst-mark v-if="alertShow.addModel" :resId="alertShow.resId" :resTitle="alertShow.resTitle" @alertConfirm="alertSave('add')" @alertCancel="alertCanc('add')"></res-syst-mark>
  </div>
</template>

<script>
import axios from 'axios'
import { resMess } from '@/components/common/mixin.js'
import spinComp from '@/components/common/spin'
import resSystMark from '@/page/admin/systMana/systMark/children/resSystMark'
import alertBtnInfo from '@/components/common/alertBtnInfo'

export default {
  name: 'syst_mark',
  mixins: [resMess],
  components: { spinComp, alertBtnInfo, resSystMark },
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
      alertShow: {
        resId: null,
        resTitle: '添加',
        addModel: false,
        delModel: false,
        startModel: false,
        startRow: null
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
        case 'edit':
          this.alertShow.addModel = true
          this.alertShow.resTitle = '修改'
          this.alertShow.resId = data.id
          break
        case 'add':
          this.alertShow.addModel = true
          this.alertShow.resTitle = '添加'
          this.alertShow.resId = ''
          break
        case 'del':
          this.alertShow.delModel = true
          this.alertShow.resId = data.id
          break
        case 'start':
          this.alertShow.startModel = true
          this.alertShow.resId = data.id
          this.alertShow.startRow = data.useFlag
          break
        case 'see':
          this.alertShow.addModel = true
          this.alertShow.resTitle = '查看'
          this.alertShow.resId = data.id
      }
    },
    alertSave (type) {
      switch (type) {
        case 'add':
          this.alertShow.addModel = false
          this.resCaseList()
          break
        case 'del':
          this.alertShow.delModel = false
          axios.post('/watermarkReq/delSysWatermark', {
            id: this.alertShow.resId
          }).then(res => {
            this.resMessage('success', res.data.data)
            this.alertCanc('del')
            this.resCaseList()
          }).catch(e => {
            this.resMessage('error', '错误信息:' + e + ' 稍后再试')
          })
          break
        case 'start':
          this.alertShow.delModel = false
          axios.post('/watermarkReq/setUseFlag', {
            id: this.alertShow.resId,
            useFlag: this.alertShow.startRow === 1 ? 0 : 1
          }).then(res => {
            this.resMessage('success', res.data.data)
            this.alertCanc('start')
            this.resCaseList()
          }).catch(e => {
            this.resMessage('error', '错误信息:' + e + ' 稍后再试')
          })
          break
      }
    },
    alertCanc (type) {
      switch (type) {
        case 'add':
          this.alertShow.addModel = false
          this.alertShow.resId = null
          break
        case 'del':
          this.alertShow.delModel = false
          this.alertShow.resId = null
          break
        case 'start':
          this.alertShow.startModel = false
          this.alertShow.resId = null
          this.alertShow.startRow = null
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
