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
      this.btnMap = this.buttonMap === null ? null : this.buttonMap[type]
    },
    resBtnDis (type) {
      if (this.btnMap) {
        return this.btnMap.buttonMap[type] === false ? 'none' : ''
      } else {
        return ''
      }
    }
  }
}