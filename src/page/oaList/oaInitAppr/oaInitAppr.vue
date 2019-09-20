<template>
  <div class="oaInitAppr">
    <div class="_center pr">
      <spin-comp :spinShow="spinShow"></spin-comp>
      <Row class="mb20">
        <Col span="2">
          <label class="lh32 f16 fc6 fr mr15">流程</label>
        </Col>
        <Col span="4">
          <Select v-model="search.processKey" style="width:200px" @on-change="resSearch">
            <Option v-for="item in search.processKeyList" :value="item.oaItemKey" :key="item.id">{{ item.item }}</Option>
          </Select>
        </Col>
        <Col span="2">
          <label class="lh32 f16 fc6 fr mr15">状态</label>
        </Col>
        <Col span="4">
          <Select v-model="search.status" style="width:200px" @on-change="resSearch">
            <Option v-for="item in search.statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Col>
        <Col span="2" offset="10">
          <Button type="primary" @click="resAction('addAppr', null)">添加</Button>
        </Col>
      </Row>
      <div class="_caseList clearfix">
        <Row>
          <Col span="24" class="pl20 pr20">
            <Table stripe border align="center" :loading="caseList.loading" :columns="caseList.header" :data="caseList.bodyList">
              <template slot-scope="{ row, index }" slot="action">
                <Button class="mr5" type="primary" size="small" @click="resAction('seeAppr', row)">查看</Button>
                <Button v-if="row.state === '0' || row.state === '3'" class="mr5" type="primary" size="small" @click="resAction('editAppr', row)">修改</Button>
                <Button v-if="row.state === '0'" class="mr5" type="primary" size="small" @click="resAction('submAppr', row)">提交</Button>
                <Button v-if="row.state === '3'" class="mr5" type="primary" size="small" @click="resAction('submAppr', row)">重新提交</Button>
                <Button v-if="row.state === '0'" class="mr5" type="primary" size="small" @click="resAction('delAppr', row)">删除</Button>
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
    <res-add-appr v-if="alertObj.add" :resId="alertObj.resId" :resTitle="alertObj.resTitle" @alertConfirm="alertSave('addAppr')" @alertCancel="alertCanc('addAppr')"></res-add-appr>
    <res-del-appr v-if="alertObj.del" :resId="alertObj.resId" @alertConfirm="alertSave('delAppr')" @alertCancel="alertCanc('delAppr')"></res-del-appr>
    <res-subm-appr v-if="alertObj.subm" :resId="alertObj.resId" :resState="alertObj.resState" :resInstId="alertObj.resInstId" @alertConfirm="alertSave('submAppr')" @alertCancel="alertCanc('submAppr')"></res-subm-appr>
  </div>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
import { resMess } from '@/components/common/mixin.js'
import spinComp from '@/components/common/spin'
import resAddAppr from '@/page/oaList/oaInitAppr/children/resAddAppr'
import resDelAppr from '@/page/oaList/oaInitAppr/children/resDelAppr'
import resSubmAppr from '@/page/oaList/oaInitAppr/children/resSubmAppr'

export default {
  name: 'oa_init_appr',
  mixins: [resMess],
  components: { spinComp, resAddAppr, resDelAppr, resSubmAppr },
  data () {
    return {
      spinShow: false,
      search: {
        text: '',
        status: 'all',
        statusList: [
          {
            label: '全部',
            value: 'all'
          },
          {
            label: '未审核',
            value: '0'
          },
          {
            label: '审核中',
            value: '1'
          },
          {
            label: '审核通过',
            value: '2'
          },
          {
            label: '审核驳回',
            value: '3'
          }
        ],
        processKey: '',
        processKeyList: []
      },
      caseList: {
        loading: false,
        header: [
          {
            title: '申请部门',
            key: 'deptName',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '申请人',
            key: 'userName',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '申请原因',
            key: 'reason',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '创建时间',
            key: 'createTimeStr',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '备注',
            key: 'remarks',
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
              }, params.row.state === '0' ? '未审核' : (params.row.state === '1' ? '审核中' : (params.row.state === '2' ? '审核通过' : (params.row.state === '3' ? '审核驳回' : '未知'))))
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
        del: false,
        subm: false,
        resId: null,
        resTitle: '',
        resState: null,
        resInstId: null
      }
    }
  },
  created () {
    this.resProKey()
  },
  computed: {
    ...mapGetters([
      'usersInfo'
    ])
  },
  methods: {
    resProKey () {
      axios.post('/OAReq/processKey').then(res => {
        let _data = res.data.data
        this.search.processKeyList = _data === null ? [] : _data
        if (_data.length !== 0) {
          this.search.processKey = _data[0].oaItemKey
        }
        this.resCaseList()
      }).catch(e => {
        this.resMessage('error', '错误信息:' + e + ' 稍后再试')
      })
    },
    resCaseList () {
      this.spinShow = true
      axios.post('/OAReq/oaList', {
        userId: this.usersInfo.id,
        userName: this.usersInfo.name,
        pageIndex: (this.pageObj.pageNum - 1) * this.pageObj.pageSize,
        pageSize: this.pageObj.pageSize,
        state: this.search.status === 'all' ? '' : this.search.status,
        moduleKey: this.search.processKey
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
        case 'editAppr':
          this.alertObj.resTitle = '修改'
          this.alertObj.resId = data.id
          this.alertObj.add = true
          break
        case 'seeAppr':
          this.alertObj.resTitle = '查看'
          this.alertObj.resId = data.id
          this.alertObj.add = true
          break
        case 'submAppr':
          this.alertObj.resId = data.id
          this.alertObj.resState = data.state
          this.alertObj.resInstId = data.procInstId
          this.alertObj.subm = true
          break
        case 'delAppr':
          this.alertObj.resId = data.id
          this.alertObj.del = true
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
        case 'submAppr':
          this.alertObj.subm = false
          this.alertObj.resId = null
          this.alertObj.resState = null
          this.resSearch()
          break
        case 'delAppr':
          this.alertObj.del = false
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
        case 'submAppr':
          this.alertObj.subm = false
          this.alertObj.resId = null
          this.alertObj.resState = null
          break
        case 'delAppr':
          this.alertObj.del = false
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
