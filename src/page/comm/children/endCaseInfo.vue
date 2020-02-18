<template>
  <div class="endCaseInfo">
    <div class="_endCase">
      <div class="_top">结案</div>
      <div v-if="endCaseD !== null" v-for="(item, index) in endCaseD" :key="index">
        <end-info :infoData="item"></end-info>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import {resMess} from '@/components/common/mixin.js'
import endInfo from '@/page/comm/children/children/endInfo'

export default {
  name: 'endCaseInfo',
  mixins: [resMess],
  props: ['caseId', 'caseState'],
  components: { endInfo },
  data () {
    return {
      endCaseD: null
    }
  },
  created () {
    if (this.caseId !== null) {
      this.resCase()
    }
  },
  methods: {
    resCase () {
      axios.post('/clientRequest/findEndCaseMessage', {
        caseId: this.caseId
      }).then(res => {
        this.endCaseD = res.data.data
      }).catch(e => {
        this.resMessage('error', '错误信息:' + e + ' 稍后再试')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/style/mixin';
.endCaseInfo {
  ._endCase {
    padding-bottom: 60px;
  }
  ._endCase ._top {
    @include backgroundLine(right, #1a2b58, #126eaf);
    @include borderRadius(5px);
    text-align: center;
    height: 44px;
    line-height: 44px;
    color: #fff;
    font-size: 20px;
  }
}
</style>
