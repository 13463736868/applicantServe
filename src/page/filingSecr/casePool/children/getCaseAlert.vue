<template>
  <div>
    <alert-btn-info :alertShow="modalShow" @alertConfirm="alertSave" @alertCancel="alertCancel" alertTitle="操作">
      <p>确定要拉取编号为 [ {{getCaseId.join(';')}} ] 的案件吗？</p>
    </alert-btn-info>
  </div>
</template>
<script>
import axios from 'axios'
import alertBtnInfo from '@/components/common/alertBtnInfo'

export default {
  name: 'get_case_alert',
  components: { alertBtnInfo },
  props: ['getCaseId'],
  data () {
    return {
      modalShow: true
    }
  },
  methods: {
    alertSave () {
      axios.post('/case/addCaseUser', {
        caseId: this.getCaseId.join(','),
        caseFlag: 'L'
      }).then(res => {
        this.$Message.success({
          content: res.data.data,
          duration: 2
        })
        this.$emit('saveClick')
      }).catch(e => {
        this.$Message.error({
          content: '错误信息:' + e + ' 稍后再试',
          duration: 5
        })
        this.$emit('saveClick')
      })
    },
    alertCancel () {
      this.$emit('cancClick')
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
