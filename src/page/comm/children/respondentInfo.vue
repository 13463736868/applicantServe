<template>
  <div class="respondentInfo">
    <div class="_respondent">
      <div class="_top">被申请人</div>
      <div v-if="respShow.list">
        <div v-if="respData !== null" v-for="(item, index) in respData" :key="index">
          <prop-info :infoData="item" @seeInfo="seeRespInfo(item)"></prop-info>
        </div>
      </div>
      <div v-if="respShow.see">
        <see-prop-info :seePropData="seeRespData" @saveClick="seeRespSave"></see-prop-info>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import {resMess} from '@/components/common/mixin.js'
import propInfo from '@/page/comm/children/children/propInfo'
import seePropInfo from '@/page/comm/children/children/seePropInfo'

export default {
  name: 'respondentInfo',
  mixins: [resMess],
  props: ['caseId', 'caseState'],
  components: { propInfo, seePropInfo },
  data () {
    return {
      respData: null,
      seeRespData: null,
      respShow: {
        list: true,
        see: false
      }
    }
  },
  created () {
    if (this.caseId !== null && this.caseState !== null) {
      this.resResp()
    }
  },
  methods: {
    resResp () {
      axios.post('/case/findCaseDetailsRespondentByCaseid', {
        caseId: this.caseId
      }).then(res => {
        this.respData = res.data.data
      }).catch(e => {
        this.resMessage('error', '错误信息:' + e + ' 稍后再试')
      })
    },
    seeRespInfo (obj) {
      this.seeRespData = obj
      this.respShow.list = false
      this.respShow.see = true
    },
    seeRespSave () {
      this.seeRespData = null
      this.respShow.list = true
      this.respShow.see = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/style/mixin';
.respondentInfo {
  ._respondent {
    padding-bottom: 60px;
  }
  ._respondent ._top{
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
