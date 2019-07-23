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
import axios from 'axios'

export default {
  name: 'iframe_alert',
  props: ['modelId'],
  data () {
    return {
      iframeShow: false,
      resSrc: null
    }
  },
  created () {
    this.resUrl('MODEL_EDIT_URL')
  },
  methods: {
    resMessage (type, text) {
      this.$Message[type]({
        content: text,
        duration: type === 'success' ? 2 : 5
      })
    },
    resUrl (type) {
      axios.post('/arbitration/constant').then(res => {
        this.resSrc = res.data.data[type] + this.modelId
        this.iframeShow = true
      }).catch(e => {
        this.resMessage('error', '错误信息:' + e + ' 稍后再试')
      })
    },
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
