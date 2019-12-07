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

export const resPage = {
  methods: {
    reschangePageSize (obj) {
      this.pageObj.pageSize = obj
      this.resSearch()
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
