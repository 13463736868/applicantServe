<template>
  <div class="_createDocu" v-if="alertShow">
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
        <Button size="large" @click="alertCancel">取消</Button>
        <Button v-if="seeHide !== true" size="large" @click="alertSee">预览</Button>
        <Button type="primary" size="large" @click="alertConfirm">提交</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  name: 'create_docu',
  props: ['alertShow', 'alertTitle', 'seeHide'],
  data () {
    return {}
  },
  methods: {
    alertConfirm () {
      this.$emit('alertConfirm')
    },
    alertCancel () {
      this.$emit('alertCancel')
    },
    alertSee () {
      this.$emit('alertSee')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
