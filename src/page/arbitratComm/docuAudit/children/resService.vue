<template>
  <div class="resService">
    <alert-btn-info :alertShow="alertShow" @alertConfirm="sendDocSave" @alertCancel="alertCanc" alertTitle="操作">
      <p>确定要发送邮件，短信通知吗？（确认内容无误后点击确定）</p>
    </alert-btn-info>
  </div>
</template>
<script>
import axios from 'axios'
import { resMess } from '@/components/common/mixin.js'
import alertBtnInfo from '@/components/common/alertBtnInfo'
export default {
  name: 'res_service',
  mixins: [resMess],
  props: ['resServiceData'],
  components: { alertBtnInfo },
  data () {
    return {
      alertShow: true
    }
  },
  methods: {
    alertCanc () {
      this.$emit('alertCancel')
    },
    sendDocSave () {
      axios.post('/electronic/service/103', {
        caseId: this.resServiceData.id,
        caseDocumentId: this.resServiceData.caseDocuemntId
      }).then(res => {
        this.$emit('alertConfirm')
        this.resMessage('success', '操作成功')
      }).catch(e => {
        this.resMessage('error', '错误信息:' + e + ' 稍后再试')
      })
    }
  }
}
</script>
