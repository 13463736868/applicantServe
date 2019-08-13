<template>
  <div class="_startForm">
    <Modal
      v-model="alertShow"
      title="操作"
      :mask-closable="false"
      :closable="false"
      class="not_s">
      <p>确定要启动审核流程吗？</p>
      <div slot="footer">
        <Button size="large" @click="alertCancel">取消</Button>
        <Button type="primary" size="large" @click="alertConfirm">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'start_form',
  props: ['caseId', 'formType'],
  data () {
    return {
      alertShow: true
    }
  },
  methods: {
    alertConfirm (type) {
      axios.post('/closeCaseForm/submitAuditProcess', {
        caseId: this.caseId,
        formType: this.formType
      }).then(res => {
        this.$Message.success({
          content: res.data.data,
          duration: 2
        })
        this.$emit('alertConfirm')
      }).catch(e => {
        this.$Message.error({
          content: '错误信息:' + e + ' 稍后再试',
          duration: 5
        })
      })
    },
    alertCancel () {
      this.$emit('alertCancel')
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
