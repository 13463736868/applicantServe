<template>
  <div class="modelList">
    <div class="_center pr">
      <spin-comp :spinShow="spinShow"></spin-comp>
      <Row class="pb20">
        <Col span="2" offset="21">
          <Button type="primary" @click="resAddModel">添加</Button>
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
            <Page :total="pageObj.total" :current="pageObj.pageNum" :page-size="pageObj.pageSize" show-elevator show-total @on-change="reschangePage" @on-page-size-change="reschangePageSize" show-sizer></Page>
          </Col>
        </Row>
      </div>
    </div>
    <add-model-alert v-if="alertShow.addMode" @alertConfirm="addModelSave" @alertCancel="alertCanc('addModel')"></add-model-alert>
    <alert-btn-info :alertShow="alertShow.sendModel" @alertConfirm="alertSave('sendModel')" @alertCancel="alertCanc('sendModel')" alertTitle="操作">
      <p>确定要发布吗？</p>
    </alert-btn-info>
    <alert-btn-info :alertShow="alertShow.delModel" @alertConfirm="alertSave('delModel')" @alertCancel="alertCanc('delModel')" alertTitle="操作">
      <p>确定要删除吗？</p>
    </alert-btn-info>
    <iframe-alert v-if="alertShow.iframe" :modelId="alertShow.iframeId"  @alertCancel="alertCanc('iframeAlert')"></iframe-alert>
  </div>
</template>

<script>
import axios from 'axios'
import spinComp from '@/components/common/spin'
import { resPage, resMess } from '@/components/common/mixin.js'
import alertBtnInfo from '@/components/common/alertBtnInfo'
import addModelAlert from '@/page/admin/modelList/children/addModelAlert'
import iframeAlert from '@/page/admin/modelList/children/iframeAlert'

export default {
  name: 'model_list',
  mixins: [resPage, resMess],
  components: { spinComp, alertBtnInfo, addModelAlert, iframeAlert },
  data () {
    return {
      spinShow: false,
      search: {
        text: ''
      },
      caseList: {
        loading: false,
        header: [
          {
            title: '编号',
            key: 'id',
            align: 'center'
          },
          {
            title: '名称',
            key: 'name',
            align: 'center'
          },
          {
            title: 'Key',
            key: 'key',
            align: 'center'
          },
          {
            title: '版本',
            key: 'version',
            align: 'center'
          },
          {
            title: '创建时间',
            key: 'createTime',
            tooltip: 'true',
            align: 'center'
          },
          {
            title: '操作',
            key: 'id',
            minWidth: 70,
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
        sendModel: false,
        delModel: false,
        addMode: false,
        iframe: false,
        iframeId: null
      }
    }
  },
  created () {
    this.resCaseList()
  },
  methods: {
    resMessage (type, text) {
      this.$Message[type]({
        content: text,
        duration: type === 'success' ? 2 : 5
      })
    },
    renderBtn (h, params) {
      let _obj = params.row
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
              this.resEditModel(_obj)
            }
          }
        }, '编辑'),
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
              this.resSendModel(_obj)
            }
          }
        }, '发布'),
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
              this.resDelModel(_obj)
            }
          }
        }, '删除')
      ])
    },
    resCaseList () {
      this.spinShow = true
      axios.post('/activiti/selectAll', {
        startIndex: (this.pageObj.pageNum - 1) * this.pageObj.pageSize,
        pageSize: this.pageObj.pageSize
      }).then(res => {
        let _data = res.data.data
        this.caseList.bodyList = _data.dataList === null ? [] : _data.dataList
        this.pageObj.total = _data.total
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
    resAddModel () {
      this.alertShow.addMode = true
    },
    resEditModel (obj) {
      this.alertShow.iframeId = obj.id
      this.alertShow.iframe = true
    },
    resSendModel (obj) {
      this.alertShow.iframeId = obj.id
      this.alertShow.sendModel = true
    },
    resDelModel (obj) {
      this.alertShow.iframeId = obj.id
      this.alertShow.delModel = true
    },
    addModelSave (obj) {
      this.alertShow.addMode = false
      this.alertShow.iframeId = obj
      this.alertShow.iframe = true
    },
    alertSave (type) {
      switch (type) {
        case 'sendModel':
          this.alertShow.sendModel = false
          axios.post('/activiti/deploy/' + this.alertShow.iframeId).then(res => {
            this.resMessage('success', res.data.data)
            this.alertCanc('sendModel')
            this.resCaseList()
          }).catch(e => {
            this.resMessage('error', '错误信息:' + e + ' 稍后再试')
          })
          break
        case 'delModel':
          this.alertShow.delModel = false
          axios.post('/activiti/deleteById', {
            id: this.alertShow.iframeId
          }).then(res => {
            this.resMessage('success', res.data.data)
            this.alertCanc('delModel')
            this.resCaseList()
          }).catch(e => {
            this.resMessage('error', '错误信息:' + e + ' 稍后再试')
          })
          break
      }
    },
    alertCanc (type) {
      switch (type) {
        case 'sendModel':
          this.alertShow.iframeId = null
          this.alertShow.sendModel = false
          break
        case 'delModel':
          this.alertShow.iframeId = null
          this.alertShow.delModel = false
          break
        case 'addModel':
          this.alertShow.addMode = false
          break
        case 'iframeAlert':
          this.alertShow.iframeId = null
          this.alertShow.iframe = false
          this.resCaseList()
          break
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
