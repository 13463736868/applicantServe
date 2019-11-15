<template>
  <div class="resFind">
    <alert-btn-info :alertShow="alertShow" :resWidth="600" @alertConfirm="alertSave" @alertCancel="alertCanc" alertTitle="操作">
      <Row>
        <Col span="24">
          <Table stripe align="center" :loading="seleList.loading" :columns="seleList.header" :data="seleList.bodyList">
            <template slot-scope="{ row, index }" slot="action">
              <Button class="mr5" type="primary" size="small" @click="resAction('editAfter', row)">查看修改前</Button>
              <Button class="mr5" type="primary" size="small" @click="resAction('editBefore', row)">查看修改后</Button>
            </template>
          </Table>
        </Col>
      </Row>
    </alert-btn-info>
    <see-editor v-if="seeEditor" :htmlData="resData" @alertCancel="alertClose"></see-editor>
  </div>
</template>
<script>
import axios from 'axios'
import { resMess } from '@/components/common/mixin.js'
import alertBtnInfo from '@/components/common/alertBtnInfo'
import seeEditor from '@/page/arbitratComm/docuAudit/children/seeEditor'

export default {
  name: 'resFind',
  mixins: [resMess],
  props: ['documentId'],
  components: { alertBtnInfo, seeEditor },
  data () {
    return {
      alertShow: true,
      seeEditor: false,
      resData: null,
      seleList: {
        loading: false,
        header: [
          {
            title: '用户名称',
            key: 'userName',
            align: 'center'
          },
          {
            title: '角色名称',
            key: 'roleName',
            align: 'center'
          },
          {
            title: '操作',
            key: 'id',
            align: 'center',
            minWidth: 50,
            slot: 'action'
          }
        ],
        bodyList: []
      }
    }
  },
  created () {
    this.dictionary()
  },
  methods: {
    dictionary () {
      axios.post('/batchCaseDocument/findCaseDocumentEditLog', {
        documentId: this.documentId
      }).then(res => {
        this.seleList.bodyList = res.data.data
      }).catch(e => {
        this.resMessage('error', '错误信息:' + e + ' 稍后再试')
      })
    },
    resAction (type, data) {
      switch (type) {
        case 'editAfter':
          this.resData = data.htmlAfter
          this.seeEditor = true
          break
        case 'editBefore':
          this.resData = data.htmlBefore
          this.seeEditor = true
          break
      }
    },
    alertClose () {
      this.seeEditor = false
      this.resData = null
    },
    alertSave () {
      this.$emit('alertConfirm')
    },
    alertCanc () {
      this.$emit('alertCancel')
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
