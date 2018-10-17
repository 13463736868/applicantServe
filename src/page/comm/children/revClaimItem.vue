<template>
  <div class="revClaimInfo">
    <div class="_reason">
      <div class="_top">事实与理由</div>
      <div v-if="dataObjA !== null">
        <reas-info :infoData="dataObjA"></reas-info>
      </div>
    </div>
    <div class="_applicationBook">
      <div class="_top">仲裁申请书</div>
      <div v-if="dataObjB !== null">
        <appl-info :infoData="dataObjB"></appl-info>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import reasInfo from '@/page/comm/children/children/reasInfo'
import applInfo from '@/page/comm/children/children/applInfo'

export default {
  name: 'revClaimItem',
  props: ['caseId', 'caseState'],
  components: { reasInfo, applInfo },
  data () {
    return {
      dataObjA: null,
      dataObjB: null
    }
  },
  created () {
    if (this.caseId !== null && this.caseState !== null) {
      this.resResClaim()
    }
  },
  methods: {
    resResClaim () {
      axios.post('/case/findRequestMessageWeb', {
        caseId: this.caseId,
        partyType: 2
      }).then(res => {
        this.dataObjA = res.data.data.requestCase
        this.dataObjB = res.data.data.fileCase
      }).catch(e => {
        this.$Message.error({
          content: '错误信息:' + e,
          duration: 5
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/style/mixin';
.revClaimInfo {
  ._applicationBook {
    padding-top: 60px;
    padding-bottom: 60px;
  }
  ._reason ._top, ._applicationBook ._top{
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
