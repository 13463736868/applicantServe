<template>
  <div class="arbiEvas">
    <div class="_center pr">
      <spin-comp :spinShow="spinShow"></spin-comp>
      <div class="_caseList clearfix">
        <Row>
          <Col span="24" class="pl20 pr20">
            <Table stripe border align="center" :loading="caseList.loading" :columns="caseList.header" :data="caseList.bodyList">
              <template slot-scope="{ row, index }" slot="action">
                <Button :style="{display: resBtnDis('ARBIEVAS_PASS')}" class="mr5" type="primary" size="small" v-if="row.showButtonState === '1'" @click="resNewSaveEvas(index)">同意</Button>
                <Button :style="{display: resBtnDis('ARBIEVAS_NOPASS')}" class="mr5" type="primary" size="small" v-if="row.showButtonState === '1'" @click="resAction('resCancEvas', row)">驳回</Button>
                <Button :style="{display: resBtnDis('ARBIEVAS_REGEN')}" class="mr5" type="primary" size="small" v-if="row.showButtonState === '2'" @click="resAction('resCancEvas', row)">重新生成文书</Button>
                <span style="color: #2d8cf0" type="text" size="small" v-if="row.showButtonState === '3'">文书审核中</span>
                <span style="color: #2d8cf0" type="text" size="small" v-if="row.showButtonState === '4'">文书审核通过</span>
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
    <alert-btn-info :alertShow="alertShow.agreNew" :resRequId="alertShow.avoidRequestId" @alertConfirm="agreNewSave" @alertCancel="alertCanc('agreNew')" alertTitle="操作">
      <p>确定同意吗？</p>
    </alert-btn-info>
    <alert-btn-info :alertShow="alertShow.reas" :isSaveBtn="true" @alertCancel="alertCanc('reas')" alertTitle="仲裁员回避原因">
      <p class="t2" v-text="alertShow.reasText"></p>
    </alert-btn-info>
    <res-reje-docu v-if="alertShow.reje" :resCaseId="alertShow.id" :resRequId="alertShow.avoidRequestId" :partyType="alertShow.partyType" @alertConfirm="alertSave('reje')" @alertCancel="alertCanc('reje')"></res-reje-docu>
  </div>
</template>

<script>
import axios from 'axios'
import {resBtn, resPage, resMess} from '@/components/common/mixin.js'
import spinComp from '@/components/common/spin'
import alertBtnInfo from '@/components/common/alertBtnInfo'
import resRejeDocu from '@/page/arbitratComm/arbiEvas/children/resRejeDocu'
import { caseInfo } from '@/config/common.js'

export default {
  name: 'arbi_evas',
  mixins: [resBtn, resPage, resMess],
  components: { spinComp, alertBtnInfo, resRejeDocu },
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
        reje: false,
        id: null,
        avoidRequestId: null,
        partyType: null,
        infoUser: null,
        infoMoney: null,
        agreNew: false,
        reas: false,
        reasText: ''
      }
    }
  },
  created () {
    this.resCaseList()
  },
  methods: {
    resSearch () {
      this.pageObj.pageNum = 1
      this.resCaseList()
    },
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
        this.resMessage('error', '错误信息:' + e + ' 稍后再试')
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
    resNewSaveEvas (index) {
      this.alertShow.agreNew = true
      this.alertShow.avoidRequestId = this.caseList.bodyList[index].avoidRequestId
    },
    agreNewSave () {
      this.alertShow.agreNew = false
      axios.post('/approve/updateAvoidRequestAppover', {
        avoidRequestId: this.alertShow.avoidRequestId,
        avoidState: 1
      }).then(res => {
        this.alertCanc('agreNew')
        this.resMessage('success', '操作成功')
        this.resCaseList()
      }).catch(e => {
        this.alertCanc('agreNew')
        this.resMessage('error', '错误信息:' + e + ' 稍后再试')
      })
    },
    resAction (type, data) {
      switch (type) {
        case 'resCancEvas':
          this.alertShow.id = data.id
          this.alertShow.avoidRequestId = data.avoidRequestId
          this.alertShow.partyType = data.partyType
          this.alertShow.reje = true
          break
      }
    },
    alertSave (type, data) {
      switch (type) {
        case 'reje':
          this.alertShow.reje = false
          this.alertShow.id = null
          this.alertShow.avoidRequestId = null
          this.alertShow.partyType = null
          this.resCaseList()
          break
      }
    },
    alertCanc (type) {
      if (type === 'reje') {
        this.alertShow.reje = false
        this.alertShow.id = null
        this.alertShow.avoidRequestId = null
        this.alertShow.partyType = null
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
