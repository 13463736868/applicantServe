<template>
  <div class="resPass">
    <alert-btn-info :alertShow="alertShow" @alertConfirm="alertSave" @alertCancel="alertCanc" alertTitle="操作">
      <p>确定要通过吗？</p>
    </alert-btn-info>
  </div>
</template>
<script>
import axios from 'axios'
import alertBtnInfo from '@/components/common/alertBtnInfo'
import { resMess } from '@/components/common/mixin.js'

export default {
  name: 'res_pass',
  mixins: [resMess],
  props: ['resPassData'],
  components: { alertBtnInfo },
  data () {
    return {
      alertShow: true,
      resData: {}
    }
  },
  methods: {
    alertSave () {
      axios.post('/approve/updateGroupApproveToArbitrator', this.resPassData).then(res => {
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
