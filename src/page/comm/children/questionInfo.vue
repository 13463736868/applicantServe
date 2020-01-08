<template>
  <div class="questionInfo">
    <div class="_question">
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
import questionInfo from '@/page/comm/children/children/questionInfo'

export default {
  name: 'questionInfo',
  props: ['caseId', 'caseState'],
  components: { questionInfo },
  data () {
    return {
      questionObj: {
        list: false
      },
      questionData: null
    }
  },
  created () {
    if (this.caseId !== null && this.caseState !== null) {
      this.resQuestion()
    }
  },
  methods: {
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
.questionInfo {
  ._question {
    padding-bottom: 60px;
  }
  ._question ._top {
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
