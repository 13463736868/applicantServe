<template>
  <div class="resClose">
    <alert-btn-info :alertShow="alertShow" @alertConfirm="sendClose" @alertCancel="alertCanc" alertTitle="操作">
      <p>确定要关闭庭室？</p>
    </alert-btn-info>
  </div>
</template>

<script>
import axios from 'axios'
import { resMess } from '@/components/common/mixin.js'
import alertBtnInfo from '@/components/common/alertBtnInfo'
export default {
  name: 'res_ervation',
  mixins: [resMess],
  props: ['resCloseData'],
  components: { alertBtnInfo },
  data () {
    return {
      alertShow: true
    }
  },
  methods: {
    sendClose () {
      axios.post('/approve/closeCourtyard', {
        caseId: this.resCloseData.id
      }).then(res => {
        this.$emit('alertConfirm')
        this.resMessage('success', '操作成功')
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
