import axios from 'axios'
import { mapGetters } from 'vuex'
import { archiveCaseInfo } from '@/config/common.js'

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

export const resCommSeleAll = {
  methods: {
    renderAllSele (h, params) {
      return h('div', [
        h('span', {
          style: {
            cursor: 'pointer',
            userSelect: 'none'
          },
          on: {
            click: () => {
              this.resAllSele()
            }
          }
        }, '全选')
      ])
    },
    resAllSele () {
      if (this.caseList.seleMap[this.pageObj.pageNum] === undefined) {
        this.caseList.seleMap[this.pageObj.pageNum] = true
      } else {
        this.caseList.seleMap[this.pageObj.pageNum] = !this.caseList.seleMap[this.pageObj.pageNum]
      }
      this.caseList.bodyList.forEach((item, index) => {
        this.resFactorA(item)
      })
    },
    renderCheck (h, params) {
      if (this.alertObj.ids.indexOf(params.row.id) === -1) {
        return h('div', [
          h('Icon', {
            props: {
              type: 'md-square-outline',
              size: '16'
            },
            style: {
              color: '#2d8cf0',
              cursor: 'pointer',
              verticalAlign: 'text-top'
            },
            on: {
              click: () => {
                this.seleArrChange(params.row, true)
              }
            }
          })
        ])
      } else {
        return h('div', [
          h('Icon', {
            props: {
              type: 'md-checkbox',
              size: '16'
            },
            style: {
              color: '#2d8cf0',
              cursor: 'pointer',
              verticalAlign: 'text-top'
            },
            on: {
              click: () => {
                this.seleArrChange(params.row, false)
              }
            }
          })
        ])
      }
    },
    seleArrChange (_data, bool) {
      let info = _data
      if (bool) {
        if (this.alertObj.ids.indexOf(info.id) === -1) {
          if (this.alertObj.ids.length >= 200) {
            this.resMessage('error', '最多只能选择二百个案件')
            return false
          } else {
            this.alertObj.ids.push(info.id)
          }
        }
      } else {
        if (this.alertObj.ids.indexOf(info.id) !== -1) {
          this.alertObj.ids.splice(this.alertObj.ids.indexOf(info.id), 1)
        }
      }
    }
  }
}

export const resComm = {
  methods: {
    resMessage (type, text) {
      this.$Message[type]({
        content: text,
        duration: type === 'success' ? 2 : 5
      })
    },
    resCaseList (url) {
      this.spinShow = true
      axios.post(url, {
        pageIndex: (this.pageObj.pageNum - 1) * this.pageObj.pageSize,
        pageSize: this.pageObj.pageSize,
        keyword: this.search.text,
        pageType: this.search.pageType,
        state: this.search.state === 0 ? null : this.search.state
      }).then(res => {
        let _data = res.data.data
        this.caseList.bodyList = _data.dataList === null ? [] : _data.dataList
        this.pageObj.total = _data.totalCount
        this.spinShow = false
      }).catch(e => {
        this.spinShow = false
        this.resMessage('error', '错误信息:' + e + ' 稍后再试')
      })
    },
    resSearch (type) {
      if (type !== 0) {
        this.pageObj.pageNum = 1
      }
      this.alertObj.ids = []
      this.caseList.seleMap = {}
      this.resCaseList('/casesUnderLine/findCasesUnderLineList')
    },
    reschangePage (page) {
      this.pageObj.pageNum = page
      this.resCaseList('/casesUnderLine/findCasesUnderLineList')
    },
    alertSave (type) {
      this.alertObj[type] = false
      this.alertObj[type + 'Data'] = null
      this.resSearch(0)
    },
    alertCanc (type) {
      this.alertObj[type] = false
      this.alertObj[type + 'Data'] = null
    },
    goArchiveCaseInfo (row) {
      let obj = {}
      obj.caseId = row.id
      obj.state = row.state
      archiveCaseInfo(obj)
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
