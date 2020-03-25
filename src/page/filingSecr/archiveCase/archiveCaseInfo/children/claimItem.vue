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
    <!-- <div class="_reasonRev">
      <div class="_top">事实与理由 (反请求)</div>
      <div v-if="dataObjA !== null">
        <reas-info :infoData="dataObjA"></reas-info>
      </div>
    </div>
    <div class="_applicationBookRev">
      <div class="_top">仲裁申请书 (反请求)</div>
      <div v-if="dataObjB !== null">
        <appl-info :infoData="dataObjB"></appl-info>
      </div>
    </div> -->
  </div>
</template>

<script>
import axios from 'axios'
import claimInfo from '@/page/filingSecr/archiveCase/archiveCaseInfo/children/children/claimInfo'
import reasInfo from '@/page/filingSecr/archiveCase/archiveCaseInfo/children/children/reasInfo'
import applInfo from '@/page/filingSecr/archiveCase/archiveCaseInfo/children/children/applInfo'

export default {
  name: 'claimItem',
  props: ['caseId', 'caseState'],
  components: { claimInfo, reasInfo, applInfo },
  data () {
    return {
      claimData: null,
      reasData: null,
      applData: null,
      dataObjA: null,
      dataObjB: null
    }
  },
  created () {
    if (this.caseId !== null && this.caseState !== null) {
      this.resClaim()
      // this.resResClaim()
    }
  },
  methods: {
    resClaim () {
      axios.post('/casesUnderLine/findCaseUnderLineRequest', {
        caseId: this.caseId
      }).then(res => {
        this.claimData = res.data.data.requestMapList
        this.reasData = res.data.data.factMap
        this.applData = res.data.data.factMap
      }).catch(e => {
        this.$Message.error({
          content: '错误信息:' + e,
          duration: 5
        })
      })
    },
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
.claimInfo {
  ._applicationBook, ._claim, ._reason {
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
  ._reasonRev {
    padding-bottom: 60px;
  }
  ._applicationBookRev {
    padding-bottom: 60px;
  }
  ._reasonRev ._top, ._applicationBookRev ._top{
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
