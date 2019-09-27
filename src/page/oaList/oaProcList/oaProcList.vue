<template>
  <div class="oaProcList">
    <div class="_center pr">
      <spin-comp :spinShow="spinShow"></spin-comp>
      <Tabs v-model="tabState">
        <TabPane label="待审核" name="notDeal">
          <div class="_caseList clearfix">
            <Table stripe border align="center" :loading="notDealList.loading" :columns="notDealList.header" :data="notDealList.bodyList">
              <template slot-scope="{ row, index }" slot="action">
                <Button class="mr5" type="primary" size="small" @click="resAction('seeAppr', row)">详情</Button>
              </template>
            </Table>
          </div>
          <div class="_page clearfix">
            <Row>
              <Col span="12" offset="6" class="tc">
                <Page :total="pageObj.notDeal.total" :current="pageObj.notDeal.pageNum" :page-size="pageObj.notDeal.pageSize" show-elevator show-total @on-change="reschangePage"></Page>
              </Col>
            </Row>
          </div>
        </TabPane>
        <TabPane label="已审核" name="task">
          <div class="_caseList clearfix">
            <Table stripe border align="center" :loading="taskList.loading" :columns="taskList.header" :data="taskList.bodyList">
              <template slot-scope="{ row, index }" slot="action">
                <Button class="mr5" type="primary" size="small" @click="resAction('seeAppr', row)">详情</Button>
              </template>
            </Table>
          </div>
          <div class="_page clearfix">
            <Row>
              <Col span="12" offset="6" class="tc">
                <Page :total="pageObj.task.total" :current="pageObj.task.pageNum" :page-size="pageObj.task.pageSize" show-elevator show-total @on-change="reschangePage"></Page>
              </Col>
            </Row>
          </div>
        </TabPane>
      </Tabs>
    </div>
    <res-see-appr v-if="alertObj.see" :resId="alertObj.resId" :resTabState="tabState" @alertConfirm="alertSave('seeAppr')" @alertCancel="alertCanc('seeAppr')"></res-see-appr>
  </div>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
import { resMess } from '@/components/common/mixin.js'
import spinComp from '@/components/common/spin'
import resSeeAppr from '@/page/oaList/oaProcList/children/resSeeAppr'

export default {
  name: 'oa_proc_list',
  mixins: [resMess],
  components: { spinComp, resSeeAppr },
  data () {
    return {
      spinShow: false,
      tabState: 'notDeal',
      notDealList: {
        loading: false,
        header: [
          {
            title: '任务编号',
            key: 'taskId',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '任务名称',
            key: 'taskName',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '任务创建时间',
            key: 'createTimeStr',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '任务结束时间',
            key: 'endTimeStr',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '任务办理人',
            key: 'taskAssignee',
            tooltip: 'true',
            align: 'center'
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
      taskList: {
        loading: false,
        header: [
          {
            title: '任务编号',
            key: 'taskId',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '任务名称',
            key: 'taskName',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '任务创建时间',
            key: 'createTimeStr',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '任务结束时间',
            key: 'endTimeStr',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '任务办理人',
            key: 'taskAssignee',
            tooltip: 'true',
            align: 'center'
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
        notDeal: {
          total: 0,
          pageNum: 1,
          pageSize: 10
        },
        task: {
          total: 0,
          pageNum: 1,
          pageSize: 10
        }
      },
      alertObj: {
        see: false,
        resId: null
      }
    }
  },
  created () {
    this.resNotDealList()
    this.resTaskList()
  },
  computed: {
    ...mapGetters([
      'usersInfo'
    ])
  },
  methods: {
    resNotDealList () {
      this.spinShow = true
      axios.post('/OAReq/notDealTask', {
        userId: this.usersInfo.id,
        userName: this.usersInfo.name,
        pageIndex: this.pageObj.notDeal.pageNum,
        pageSize: this.pageObj.notDeal.pageSize
      }).then(res => {
        let _data = res.data.data
        this.notDealList.bodyList = _data.dataList === null ? [] : _data.dataList
        this.pageObj.notDeal.total = _data.totalCount
        this.spinShow = false
      }).catch(e => {
        this.spinShow = false
        this.resMessage('error', '错误信息:' + e + ' 稍后再试')
      })
    },
    resTaskList () {
      this.spinShow = true
      axios.post('/OAReq/findHistoryTaskList', {
        userId: this.usersInfo.id,
        userName: this.usersInfo.name,
        pageIndex: this.pageObj.task.pageNum,
        pageSize: this.pageObj.task.pageSize
      }).then(res => {
        let _data = res.data.data
        this.taskList.bodyList = _data.dataList === null ? [] : _data.dataList
        this.pageObj.task.total = _data.totalCount
        this.spinShow = false
      }).catch(e => {
        this.spinShow = false
        this.resMessage('error', '错误信息:' + e + ' 稍后再试')
      })
    },
    resSearch () {
      this.pageObj.pageNum = 1
      if (this.tabState === 'notDeal') {
        this.resNotDealList()
      } else if (this.tabState === 'task') {
        this.resTaskList()
      }
    },
    reschangePage (page) {
      this.pageObj[this.tabState].pageNum = page
      if (this.tabState === 'notDeal') {
        this.resNotDealList()
      } else if (this.tabState === 'task') {
        this.resTaskList()
      }
    },
    resAction (type, data) {
      switch (type) {
        case 'seeAppr':
          if (this.tabState === 'notDeal') {
            this.alertObj.resId = data.taskId
          } else if (this.tabState === 'task') {
            this.alertObj.resId = data.procInstId
          }
          this.alertObj.see = true
          break
      }
    },
    alertSave (type) {
      switch (type) {
        case 'seeAppr':
          this.alertObj.see = false
          this.alertObj.resId = null
          this.resSearch()
          break
      }
    },
    alertCanc (type) {
      switch (type) {
        case 'seeAppr':
          this.alertObj.see = false
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
