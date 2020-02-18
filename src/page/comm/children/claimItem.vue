<template>
  <div class="claimInfo">
    <div class="_claim">
      <div class="_top">仲裁请求</div>
      <div v-if="claimData !== null" v-for="(item, index) in claimData" :key="index">
        <claim-info :infoData="item"></claim-info>
      </div>
    </div>
    <div class="_reason">
      <div class="_top">事实与理由</div>
      <div v-if="reasData !== null">
        <reas-info :infoData="reasData"></reas-info>
      </div>
    </div>
    <div class="_applicationBook">
      <div class="_top">仲裁申请书</div>
      <div v-if="applData !== null">
        <appl-info :infoData="applData"></appl-info>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import {resMess} from '@/components/common/mixin.js'
import claimInfo from '@/page/comm/children/children/claimInfo'
import reasInfo from '@/page/comm/children/children/reasInfo'
import applInfo from '@/page/comm/children/children/applInfo'

export default {
  name: 'claimItem',
  mixins: [resMess],
  props: ['caseId', 'caseState'],
  components: { claimInfo, reasInfo, applInfo },
  data () {
    return {
      claimData: null,
      reasData: null,
      applData: null
    }
  },
  created () {
    if (this.caseId !== null && this.caseState !== null) {
      this.resClaim()
    }
  },
  methods: {
    resClaim () {
      axios.post('/case/findCaseDetailsRequestByCaseid', {
        caseId: this.caseId
      }).then(res => {
        this.claimData = res.data.data.requestMapList
        this.reasData = res.data.data.factMap
        this.applData = res.data.data.factMap
      }).catch(e => {
        this.resMessage('error', '错误信息:' + e + ' 稍后再试')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/style/mixin';
.claimInfo {
  ._reason, ._applicationBook {
    padding-top: 60px;
  }
  ._applicationBook {
    padding-bottom: 60px;
  }
  ._claim ._top, ._reason ._top, ._applicationBook ._top{
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
