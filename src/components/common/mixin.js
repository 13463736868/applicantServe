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
