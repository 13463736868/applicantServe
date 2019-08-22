<template>
  <div class="_groupPassAlert">
    <alert-btn-info :alertShow="alertShow" @alertConfirm="alertSave" @alertCancel="alertCanc" alertTitle="操作">
      <p v-if="resState === 1">确定要同意吗？</p>
      <Input v-if="resState === 2" :autosize="{minRows: 5,maxRows: 7}" type="textarea" v-model="resData.caseDocumentReason" placeholder="输入驳回原因..." />
    </alert-btn-info>
  </div>
</template>
<script>
import axios from 'axios'
import alertBtnInfo from '@/components/common/alertBtnInfo'
import { resMess } from '@/components/common/mixin.js'

export default {
  name: 'group_pass_alert',
  mixins: [resMess],
  props: ['resCaseId', 'resState'],
  components: { alertBtnInfo },
  data () {
    return {
      alertShow: true,
      resData: {
        caseDocumentReason: ''
      }
    }
  },
  methods: {
    alertSave () {
      if (this.resState === 2 && this.resData.caseDocumentReason.length === 0) {
        this.resMessage('warning', '驳回原因不能为空')
        return false
      } else {
        axios.post('/approve/updateCourtAuditState', {
          state: this.resState,
          id: this.resDocuId
        }).then(res => {
          this.resMessage('success', '操作成功')
          this.$emit('alertConfirm')
        }).catch(e => {
          this.resMessage('succeerrorss', '错误信息:' + e + ' 稍后再试')
        })
      }
    },
    alertCanc () {
      this.$emit('alertCancel')
    }
  }
}
</script>
<style lang="scss" scoped>
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
