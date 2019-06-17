<template>
  <div class="_alertEditor">
    <Modal
      v-model="alertShow"
      :title="alertTitle"
      :mask-closable="false"
      :closable="false"
      width='960'
      class="not_s">
      <div>
        <div :id="randomId" :key="randomId" style="width:100%;"></div>
      </div>
      <div slot="footer">
        <Button size="large" @click="alertCancel">取消</Button>
        <Button type="primary" size="large" @click="alertConfirm">保存</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import axios from 'axios'
import '../../../static/ueditor/ueditor.config.js'
import '../../../static/ueditor/ueditor.all.min.js'
import '../../../static/ueditor/lang/zh-cn/zh-cn.js'
import '../../../static/ueditor/ueditor.parse.min.js'

export default {
  name: 'alert_editor',
  props: ['alertShow', 'alertTitle', 'editorId'],
  data () {
    return {
      randomId: 'editor_' + (Math.random() * 100000000000000000),
      editor: null,
      value: '',
      sendTimeOut: null,
      oldLen: 0
    }
  },
  mounted () {
    this.initEditor()
  },
  methods: {
    initEditor () {
      axios.post('/case/operationTrialRecordTask', {
        caseId: this.editorId,
        operationType: '2'
      }).then(res => {
        this.editor = window.UE.getEditor(this.randomId)
        this.editor.addListener('ready', () => {
          this.editor.setContent(res.data.data)
        })
        this.sendContent()
      }).catch(e => {
        this.$Message.error({
          content: '错误信息:' + e + ' 稍后再试',
          duration: 5
        })
      })
    },
    sendContent () {
      let _this = this
      this.sendTimeOut = setTimeout(() => {
        let obj = _this.editor.getContent()
        if (obj === '') {
          clearTimeout(_this.sendTimeOut)
          _this.sendContent()
          return false
        } else if (obj.length === _this.oldLen) {
          clearTimeout(_this.sendTimeOut)
          _this.sendContent()
          return false
        } else {
          axios.post('/case/operationTrialRecordTask', {
            caseId: _this.editorId,
            content: obj,
            operationType: '1'
          }).then(res => {
            _this.oldLen = obj.length
            clearTimeout(_this.sendTimeOut)
            _this.sendContent()
          }).catch(e => {
            clearTimeout(_this.sendTimeOut)
            _this.$Message.error({
              content: '错误信息:' + e + ' 稍后再试',
              duration: 5
            })
          })
        }
      }, 5000)
    },
    stringToByte (str) {
      if (str === '') {
        return []
      }
      let bytes = []
      let len, c
      len = str.length
      for (let i = 0; i < len; i++) {
        c = str.charCodeAt(i)
        if (c >= 0x010000 && c <= 0x10FFFF) {
          bytes.push(((c >> 18) & 0x07) | 0xF0)
          bytes.push(((c >> 12) & 0x3F) | 0x80)
          bytes.push(((c >> 6) & 0x3F) | 0x80)
          bytes.push((c & 0x3F) | 0x80)
        } else if (c >= 0x000800 && c <= 0x00FFFF) {
          bytes.push(((c >> 12) & 0x0F) | 0xE0)
          bytes.push(((c >> 6) & 0x3F) | 0x80)
          bytes.push((c & 0x3F) | 0x80)
        } else if (c >= 0x000080 && c <= 0x0007FF) {
          bytes.push(((c >> 6) & 0x1F) | 0xC0)
          bytes.push((c & 0x3F) | 0x80)
        } else {
          bytes.push(c & 0xFF)
        }
      }
      return bytes
    },
    alertConfirm () {
      clearTimeout(this.sendTimeOut)
      this.$emit('alertConfirm', this.editor.getAllHtml(), this.editor.getContent())
    },
    alertCancel () {
      clearTimeout(this.sendTimeOut)
      this.$emit('alertCancel')
    }
  },
  destroyed () {
    this.editor.destroy()
  }
}
</script>

<style lang="scss">
._alertEditor .ivu-modal-mask {
  z-index: 10;
}
</style>
