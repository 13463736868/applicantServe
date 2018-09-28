<template>
  <div class="arbiEvas">
    <head-top :isRegister="true">
      <span class="f36 fcf">仲裁员回避</span>
    </head-top>
    <div class="_center pr">
      <spin-comp :spinShow="spinShow"></spin-comp>
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
    <alert-btn-info :alertShow="alertShow.reje" @alertConfirm="rejeSave" @alertCancel="alertCanc('reje')" alertTitle="操作">
      <Input v-model="alertShow.rejeReason" type="textarea" :autosize="{minRows: 3,maxRows: 10}" placeholder="请输入驳回原因..." />
    </alert-btn-info>
    <alert-btn-info :alertShow="alertShow.agre" @alertConfirm="agreSave" @alertCancel="alertCanc('agre')" alertTitle="操作">
      <p>仲裁员列表</p>
    </alert-btn-info>
  </div>
</template>

<script>
import axios from 'axios'
import headTop from '@/components/header/head'
import spinComp from '@/components/common/spin'
import alertBtnInfo from '@/components/common/alertBtnInfo'

export default {
  name: 'arbi_evas',
  components: { headTop, spinComp, alertBtnInfo },
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
            align: 'center'
          },
          {
            title: '被申请人',
            key: 'respondentName',
            align: 'center'
          },
          {
            title: '被回避仲裁员',
            key: 'approver',
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
            title: '操作',
            key: 'id',
            align: 'center',
            render: (h, params) => {
              return this.renderBtn(h, params)
            }
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
        rejeReason: '',
        agre: false,
        avoidRequestId: null
      }
    }
  },
  created () {
    this.resCaseList()
  },
  methods: {
    renderBtn (h, params) {
      let _obj = params.row
      if (_obj.avoidState === null || _obj.avoidState === 3) {
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
                this.resSaveEvas(params.index)
              }
            }
          }, '同意'),
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
                this.resCancEvas(params.index)
              }
            }
          }, '驳回')
        ])
      } else {
        return h('div', [
        ])
      }
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
        this.$Message.error({
          content: '错误信息:' + e + ' 稍后再试',
          duration: 5
        })
      })
    },
    reschangePage (page) {
      this.pageObj.pageNum = page
      this.resCaseList()
    },
    goCaseInfo (index) {
      console.log(this.caseList.bodyList[index])
    },
    resSaveEvas (index) {
      this.alertShow.agre = true
      this.alertShow.avoidRequestId = this.caseList.bodyList[index].avoidRequestId
    },
    agreSave () {
      console.log('同意_axios仲裁员列表_选择仲裁员...')
    },
    resCancEvas (index) {
      this.alertShow.reje = true
      this.alertShow.avoidRequestId = this.caseList.bodyList[index].avoidRequestId
    },
    rejeSave () {
      if (this.alertShow.rejeReason === '') {
        this.$Message.warning({
          content: '请填写驳回原因',
          duration: 5
        })
      } else {
        axios.post('/approve/updateAvoidRequestAppover', {
          avoidRequestId: this.alertShow.avoidRequestId,
          content: this.alertShow.rejeReason,
          avoidState: 2
        }).then(res => {
          this.alertCanc('reje')
          this.$Message.success({
            content: '操作成功',
            duration: 2
          })
          this.resCaseList()
        }).catch(e => {
          this.alertCanc('reje')
          this.$Message.error({
            content: '错误信息:' + e + ' 稍后再试',
            duration: 5
          })
        })
      }
    },
    alertCanc (type) {
      if (type === 'reje') {
        this.alertShow.reje = false
        this.alertShow.rejeReason = ''
        this.alertShow.avoidRequestId = null
      } else if (type === 'agre') {
        this.alertShow.agre = false
        this.alertShow.avoidRequestId = null
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
</style>
