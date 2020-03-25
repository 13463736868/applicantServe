<template>
  <div class="resAgree">
    <alert-btn-info :alertShow="alertShow" @alertConfirm="alertSave" @alertCancel="alertCanc" alertTitle="操作">
      <p>确定要同意吗？</p>
    </alert-btn-info>
  </div>
</template>

<script>
import axios from 'axios'
import { resMess } from '@/components/common/mixin.js'
import alertBtnInfo from '@/components/common/alertBtnInfo'
export default {
  name: 'resAgree',
  mixins: [resMess],
  props: ['resPropsData'],
  components: { alertBtnInfo },
  data () {
    return {
      alertShow: true
    }
  },
  methods: {
    alertSave () {
      axios.post(this.resPropsData.url, {
        caseId: this.resPropsData.id
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
