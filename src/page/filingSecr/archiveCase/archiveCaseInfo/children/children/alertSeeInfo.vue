<template>
  <div class="_alertSeeInfo" v-if="alertShow">
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
        <Button type="primary" size="large" @click="alertConfirm">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  name: 'alert_see_info',
  props: ['alertShow', 'alertTitle'],
  data () {
    return {}
  },
  methods: {
    alertConfirm () {
      this.$emit('alertConfirm')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/style/mixin';
</style>
