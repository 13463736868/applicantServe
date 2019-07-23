<template>
  <div>
    <Modal
      :mask-closable="false"
      v-model="iframeShow"
      @on-cancel="rescancel"
      fullscreen
      footer-hide
      title="操作"
      class="not_s clearfix ofh"
      class-name="resWrap">
      <iframe class="wmax hmax" :src="resSrc" frameborder="0"></iframe>
    </Modal>
  </div>
</template>
<script>

export default {
  name: 'iframe_alert',
  props: ['modelId'],
  data () {
    return {
      iframeShow: true
    }
  },
  computed: {
    resSrc () {
      return 'http://192.168.1.25:8091/modeler.html?modelId=' + this.modelId
    }
  },
  methods: {
    rescancel () {
      this.$emit('alertCancel')
    }
  }
}
</script>
<style lang="scss">
.resWrap {
  .ivu-modal-body {
    overflow: hidden;
  }
}
</style>
