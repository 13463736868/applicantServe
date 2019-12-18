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
  props: ['caseId', 'docuType'],
  data () {
    return {
      alertShow: true,
      randomId: 'editor_' + (Math.random() * 100000000000000000),
      editor: null,
      alertContent: ''
    }
  },
  created () {
    this.resDict()
  },
  methods: {
    resMessage (type, text) {
      this.$Message[type]({
        content: text,
        duration: type === 'success' ? 2 : 5
      })
    },
    resDict () {
      axios.post('/batchCaseDocument/selectCaseDocumentContent', {
        caseId: this.caseId,
        documentType: this.docuType
      }).then(res => {
        this.alertContent = res.data.data.content
        this.initEditor()
      }).catch(e => {
        this.resMessage('error', '错误信息:' + e + ' 稍后再试')
      })
    },
    initEditor () {
      this.editor = window.UE.getEditor(this.randomId)
      this.editor.addListener('ready', () => {
        if (this.alertContent === null) {
          this.editor.setContent('')
        } else {
          this.editor.setContent(this.alertContent)
        }
      })
    },
    alertConfirm () {
      this.editor.execCommand('selectall')
      this.editor.execCommand('fontfamily', 'SimSun')
      let content = this.editor.getContent()
      axios.post('/batchCaseDocument/editCaseDocumentContent', {
        caseId: this.caseId,
        documentType: this.docuType,
        htmlContent: content
      }).then(res => {
        this.resMessage('success', '操作成功')
        this.$emit('alertConfirm')
      }).catch(e => {
        this.resMessage('error', '错误信息:' + e + ' 稍后再试')
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
