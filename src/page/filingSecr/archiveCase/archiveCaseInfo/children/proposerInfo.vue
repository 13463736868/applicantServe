<template>
  <div class="proposerInfo">
    <div class="_proposer">
      <div class="_top">申请人</div>
      <div v-if="propShow.list">
        <div v-if="propData !== null" v-for="(item, index) in propData" :key="index">
          <prop-info :infoData="item" @seeInfo="seePropInfo(item)"></prop-info>
        </div>
      </div>
      <div v-if="propShow.see">
        <see-prop-info :seePropData="seePropData" @saveClick="seePropSave"></see-prop-info>
      </div>
    </div>
    <div class="_agent">
      <div class="_top">代理人</div>
      <div v-if="agenShow.list">
        <div v-if="agenData !== null"  v-for="(item, index) in agenData" :key="index">
          <agen-info :infoData="item" @seeInfo="seeAgenInfo(item)"></agen-info>
        </div>
      </div>
      <div v-if="agenShow.see">
        <see-agen-info :seeAgenData="seeAgenData" @saveClick="seeAgenSave"></see-agen-info>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import propInfo from '@/page/filingSecr/archiveCase/archiveCaseInfo/children/children/propInfo'
import agenInfo from '@/page/filingSecr/archiveCase/archiveCaseInfo/children/children/agenInfo'
import seePropInfo from '@/page/filingSecr/archiveCase/archiveCaseInfo/children/children/seePropInfo'
import seeAgenInfo from '@/page/filingSecr/archiveCase/archiveCaseInfo/children/children/seeAgenInfo'

export default {
  name: 'proposerInfo',
  props: ['caseId', 'caseState'],
  components: { propInfo, agenInfo, seePropInfo, seeAgenInfo },
  data () {
    return {
      propData: null,
      agenData: null,
      seePropData: null,
      seeAgenData: null,
      propShow: {
        list: true,
        see: false
      },
      agenShow: {
        list: true,
        see: false
      }
    }
  },
  created () {
    if (this.caseId !== null && this.caseState !== null) {
      this.resProp()
    }
  },
  methods: {
    resProp () {
      axios.post('/casesUnderLine/findCaseUnderLinePartyList', {
        caseId: this.caseId,
        partyType: 1
      }).then(res => {
        this.propData = res.data.data.partyList
        this.agenData = res.data.data.proxyList
      }).catch(e => {
        this.$Message.error({
          content: '错误信息:' + e,
          duration: 5
        })
      })
    },
    seePropInfo (obj) {
      this.seePropData = obj
      this.propShow.list = false
      this.propShow.see = true
    },
    seePropSave () {
      this.seePropData = null
      this.propShow.list = true
      this.propShow.see = false
    },
    seeAgenInfo (obj) {
      this.seeAgenData = obj
      this.agenShow.list = false
      this.agenShow.see = true
    },
    seeAgenSave () {
      this.seeAgenData = null
      this.agenShow.list = true
      this.agenShow.see = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/style/mixin';
.proposerInfo {
  ._agent {
    padding-top: 60px;
    padding-bottom: 60px;
  }
  ._proposer ._top, ._agent ._top{
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
