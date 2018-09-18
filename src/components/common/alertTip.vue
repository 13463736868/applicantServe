<template>
  <div class="_alertTip" v-if="alertShow">
    <Modal
      v-model="alertShow"
      :title="alertTitle"
      :mask-closable="false"
      :closable="false"
      class="not_s">
      <div>
        <p v-text="alertText"></p>
      </div>
      <div slot="footer">
        <Button size="large" @click="alertCancel">取消</Button>
        <Button type="primary" size="large" @click="alertConfirm">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  name: 'alert_tip',
  props: ['alertShow', 'alertTitle', 'alertText'],
  data () {
    return {}
  },
  methods: {
    alertCancel () {
      this.$emit('alertCancel')
    },
    alertConfirm () {
      this.$emit('alertConfirm')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
