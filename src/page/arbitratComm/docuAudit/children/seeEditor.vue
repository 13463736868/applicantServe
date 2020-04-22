<template>
  <div class="_alertEditor">
    <Modal
      v-model="alertShow"
      title="操作"
      :mask-closable="false"
      :closable="false"
      width='960'
      class="not_s">
      <div>
        <div :id="randomId" :key="randomId" style="width:21cm;margin: 0 auto;"></div>
      </div>
      <div slot="footer">
        <Button size="large" @click="alertCancel">关 闭</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import '_static/ueditor/ueditor.config.js'
import '_static/ueditor/ueditor.all.min.js'
import '_static/ueditor/lang/zh-cn/zh-cn.js'
import '_static/ueditor/ueditor.parse.min.js'

export default {
  name: 'alert_editor',
  props: ['htmlData'],
  data () {
    return {
      alertShow: true,
      randomId: 'editor_' + (Math.random() * 100000000000000000),
      editor: null,
      alertContent: ''
    }
  },
  mounted () {
    this.resDict()
  },
  methods: {
    resDict () {
      this.initEditor()
    },
    initEditor () {
      this.editor = window.UE.getEditor(this.randomId)
      this.editor.addListener('ready', () => {
        if (this.alertContent === null) {
          this.editor.setContent('')
        } else {
          this.editor.setContent(this.htmlData)
        }
      })
    },
    alertCancel () {
      this.$emit('alertCancel')
    }
  },
  destroyed () {
    this.editor.destroy()
  }
}
</script>

<style lang="scss" scoped>
.ivu-modal-mask {
  z-index: 999!important;
}
._labelFor {
  z-index: 1000;
  margin-bottom: 10px;
  p {
    padding: 7px 0;
  }
  ._span {
    color: #ff7a7a;
    vertical-align: text-top;
  }
}
</style>
