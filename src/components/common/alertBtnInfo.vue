<template>
  <div class="_alertBtnInfo" v-if="alertShow">
    <Modal
      v-model="alertShow"
      :title="alertTitle"
      :mask-closable="false"
      :closable="false"
      class="not_s">
      <div>
        <slot></slot>
      </div>
      <div slot="footer">
        <Button v-if="isCancBtn !== true" size="large" @click="alertCancel">取消</Button>
        <Button v-if="isSaveBtn !== true" type="primary" size="large" @click="alertConfirm">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  name: 'alert_btn_info',
  props: ['alertShow', 'alertTitle', 'isSaveBtn', 'isCancBtn'],
  data () {
    return {}
  },
  methods: {
    alertConfirm () {
      this.$emit('alertConfirm')
    },
    alertCancel () {
      this.$emit('alertCancel')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
