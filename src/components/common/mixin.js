import axios from 'axios'
import { mapGetters } from 'vuex'

export const resBtn = {
  data () {
    return {
      btnMap: null
    }
  },
  created () {
    this.resBtnMap(this.$route.path.split('/')[1])
  },
  computed: {
    ...mapGetters([
      'buttonMap'
    ])
  },
  methods: {
    resBtnMap (type) {
      let _type = '/' + type
      // this.btnMap = this.buttonMap === null ? null : this.buttonMap[type]
      for (let k in this.buttonMap) {
        if (this.buttonMap[k].route === _type) {
          this.btnMap = this.buttonMap[k]
        }
      }
    },
    resBtnDis (type) {
      if (this.btnMap) {
        return this.btnMap.buttonMap[type] === true ? '' : 'none'
      } else {
        return ''
      }
    }
  }
}

export const resMess = {
  methods: {
    resMessage (type, text) {
      this.$Message[type]({
        content: text,
        duration: type === 'success' ? 2 : 5
      })
    }
  }
}

export const resTimeOut = {
  methods: {
    debounce (fn, idle) {
      let setTm
      if (!idle || idle <= 0) return fn
      return () => {
        clearTimeout(setTm)
        setTm = setTimeout(fn.bind(this, ...arguments), idle)
      }
    }
  }
}

export const resSearFind = {
  methods: {
    resActionFind (type) {
      this.alertShow.find = true
    },
    alertSaveFind (type, data) {
      this.alertShow.find = false
      this.alertCanc('clearIds')
      this.search.requestName = data.requestName
      this.search.caseType = data.caseType
      this.pageObj.pageNum = 1
      this.resCaseList()
    },
    alertCancFind (type) {
      this.alertShow.find = false
      this.search.requestName = ''
      this.search.caseType = ''
    }
  }
}

export const resEditEditor = {
  data () {
    return {
      editorObj: {
        id: null,
        disType: false,
        editor: false,
        editorDest: false,
        editorName: null,
        editorCode: null,
        editorToken: null,
        editorTypeId: null,
        editorContent: null,
        editorTempId: null,
        documentType: null
      }
    }
  },
  methods: {
    resActionFind (data) {
      this.editorObj.editorName = data.tempName
      this.editorObj.editorCode = data.tempCode
      this.editorObj.editorToken = data.userToken
      this.editorObj.editorTypeId = data.caseTypeId
      this.editorObj.editorContent = data.tempContent
      this.editorObj.editorTempId = data.id
      this.editorObj.documentType = data.documentType
      this.editorObj.disType = true
      this.editorObj.editorDest = true
      this.editorObj.editor = true
    },
    alertSaveEditor (tempId, type, name, token, tokenName, id, cont, docuType, ids) {
      if (type === 'add') {
        axios.post('/batchCaseDocument/saveTemplate', {
          tempName: name,
          userToken: token,
          userName: tokenName,
          caseTypeId: id,
          tempContent: cont,
          templateId: this.editorObj.editorTempId === null ? tempId : this.editorObj.editorTempId,
          caseDocumentType: docuType,
          caseFields: ids
        }).then(res => {
          this.alertCancEditor('editor')
          this.$Message.success({
            content: '操作成功',
            duration: 2
          })
          this.resCaseList()
        }).catch(e => {
          this.$Message.error({
            content: '错误信息:' + e + ' 稍后再试',
            duration: 5
          })
        })
      } else if (type === 'see') {
        axios.post('/batchCaseDocument/saveTemplate', {
          previewflag: 1,
          tempName: name,
          userToken: token,
          userName: tokenName,
          caseTypeId: id,
          tempContent: cont,
          templateId: this.editorObj.editorTempId,
          caseDocumentType: docuType,
          caseFields: ids
        }).then(res => {
          window.open(res.data.data, '_blank')
        }).catch(e => {
          this.$Message.error({
            content: '错误信息:' + e + ' 稍后再试',
            duration: 5
          })
        })
      }
    },
    alertCancEditor (type) {
      switch (type) {
        case 'editor':
          this.editorObj.editor = false
          this.editorObj.editorDest = false
          this.editorObj.editorContent = null
          this.editorObj.editorName = null
          this.editorObj.editorCode = null
          this.editorObj.editorToken = null
          this.editorObj.editorTypeId = null
          this.editorObj.editorTempId = null
          this.editorObj.documentType = null
          break
      }
    }
  }
}
