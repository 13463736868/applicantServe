<template>
  <div class="resReject">
    <alert-btn-info :alertShow="alertShow" @alertConfirm="alertSave" @alertCancel="alertCanc" alertTitle="操作">
      <p class="mb10">确定要退回吗？</p>
      <Input v-model.trim="resData.rejeReason" type="textarea" :autosize="{minRows: 5,maxRows: 10}" placeholder="请输入退回原因..." />
    </alert-btn-info>
  </div>
</template>
<script>
import axios from 'axios'
import alertBtnInfo from '@/components/common/alertBtnInfo'
import { resMess } from '@/components/common/mixin.js'

export default {
  name: 'res_reject',
  mixins: [resMess],
  props: ['resRejectData'],
  components: { alertBtnInfo },
  data () {
    return {
      alertShow: true,
      resData: {
        rejeReason: ''
      }
    }
  },
  methods: {
    alertSave () {
      axios.post('/approve/rejectCourtRequest', {
        caseIds: this.resRejectData.caseIds.join(','),
        reason: this.resData.rejeReason
      }).then(res => {
        this.resMessage('success', '操作成功')
        this.$emit('alertConfirm')
      }).catch(e => {
        this.resMessage('error', '错误信息:' + e + ' 稍后再试')
      })
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
