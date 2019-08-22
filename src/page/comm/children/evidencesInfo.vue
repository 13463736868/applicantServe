<template>
  <div class="evidencesInfo">
    <div class="_evidences">
      <div class="_top">申请人证据</div>
      <div v-if="evidObj.list">
        <div v-if="evidData !== null" v-for="(item, index) in evidData" :key="index">
          <evid-info :infoData="item"></evid-info>
        </div>
      </div>
    </div>
    <div class="_revEvidences">
      <div class="_top">被申请人证据</div>
      <div v-if="revEvidObj.list">
        <div v-if="revEvidData !== null" v-for="(item, index) in revEvidData" :key="index">
          <evid-info :infoData="item"></evid-info>
        </div>
      </div>
    </div>
    <div v-if="questionObj.list" class="_question">
      <div class="_top">问题清单</div>
      <div v-if="questionObj.list">
        <div v-for="(item, index) in questionData" :key="index">
          <question-info :infoData="item"></question-info>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import evidInfo from '@/page/comm/children/children/evidInfo'
import questionInfo from '@/page/comm/children/children/questionInfo'

export default {
  name: 'evidencesInfo',
  props: ['caseId', 'caseState'],
  components: { evidInfo, questionInfo },
  data () {
    return {
      evidObj: {
        list: false
      },
      revEvidObj: {
        list: false
      },
      questionObj: {
        list: false
      },
      evidData: null,
      revEvidData: null,
      questionData: null
    }
  },
  created () {
    if (this.caseId !== null && this.caseState !== null) {
      this.resEvid()
      this.resRevEvid()
      this.resQuestion()
    }
  },
  methods: {
    resEvid () {
      axios.post('/case/findCaseDetailsEvidenceApplicantByCaseid', {
        caseId: this.caseId,
        evidenceType: 1
      }).then(res => {
        this.evidData = res.data.data
        if (this.evidData !== null) {
          if (this.evidData.length === 0) {
            this.evidObj.list = false
          } else {
            this.evidObj.list = true
          }
        } else {
          this.evidObj.list = false
        }
      }).catch(e => {
        this.$Message.error({
          content: '错误信息:' + e,
          duration: 5
        })
      })
    },
    resRevEvid () {
      axios.post('/case/findCaseDetailsEvidenceApplicantByCaseid', {
        caseId: this.caseId,
        evidenceType: 2
      }).then(res => {
        this.revEvidData = res.data.data
        if (this.revEvidData !== null) {
          if (this.revEvidData.length === 0) {
            this.revEvidObj.list = false
          } else {
            this.revEvidObj.list = true
          }
        } else {
          this.revEvidObj.list = false
        }
      }).catch(e => {
        this.$Message.error({
          content: '错误信息:' + e,
          duration: 5
        })
      })
    },
    resQuestion () {
      axios.post('/case/findCaseQusetionList', {
        caseId: this.caseId
      }).then(res => {
        this.questionData = res.data.data
        if (this.questionData !== null) {
          if (this.questionData.length === 0) {
            this.questionObj.list = false
          } else {
            this.questionObj.list = true
          }
        } else {
          this.questionObj.list = false
        }
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
.evidencesInfo {
  ._evidences {
    padding-bottom: 60px;
  }
  ._revEvidences {
    padding-bottom: 60px;
  }
  ._question {
    padding-bottom: 60px;
  }
  ._evidences ._top, ._revEvidences ._top, ._question ._top {
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
