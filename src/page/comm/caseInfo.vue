<template>
  <div class="caseInfo">
    <div class="_center pr">
      <Row class="pb20" v-if="stepData !== null">
        <Steps :current="stepData.length">
          <Step v-for="(item,index) in stepData" :key="index" :title="item.processName" :content="item.processInfo === '' ? item.processTime : item.processTime + '；' + item.processInfo">
          </Step>
        </Steps>
      </Row>
      <Row>
        <Col span="4" offset="1" class="_center_left not_s">
          <router-link v-for="item in menuClaim" :to='{path: "/caseInfo" + item.url}' :key="item.id" tag="li" v-text="item.text"></router-link>
        </Col>
        <Col span="14" class="_center_right">
          <router-view :caseId="caseId" :caseState="caseState"></router-view>
        </Col>
        <Col span="4">
          <right-arbi :caseId="caseId" :caseState="caseState"></right-arbi>
        </Col>
      </Row>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
import rightArbi from '@/page/comm/children/rightArbi'

export default {
  name: 'case_info',
  components: { rightArbi },
  data () {
    return {
      menuClaim: [],
      menuClaimA: [
        {
          id: '0',
          text: '基本信息',
          url: '/basicInfo'
        },
        {
          id: '1',
          text: '申请方',
          url: '/proposerInfo'
        },
        {
          id: '2',
          text: '被申请方',
          url: '/respondentInfo'
        },
        {
          id: '3',
          text: '请求和答辩',
          url: '/claimItem'
        },
        {
          id: '5',
          text: '证据和质证',
          url: '/evidencesInfo'
        }
      ],
      menuClaimB: [
        {
          id: '0',
          text: '基本信息',
          url: '/basicInfo'
        },
        {
          id: '1',
          text: '申请方',
          url: '/proposerInfo'
        },
        {
          id: '2',
          text: '被申请方',
          url: '/respondentInfo'
        },
        {
          id: '3',
          text: '请求和答辩',
          url: '/claimItem'
        },
        {
          id: '4',
          text: '反请求和答辩',
          url: '/revClaimItem'
        },
        {
          id: '5',
          text: '证据和质证',
          url: '/evidencesInfo'
        },
        {
          id: '6',
          text: '送达',
          url: '/sendInfo'
        }
      ],
      menuClaimC: [
        {
          id: '0',
          text: '基本信息',
          url: '/basicInfo'
        },
        {
          id: '1',
          text: '申请方',
          url: '/proposerInfo'
        },
        {
          id: '2',
          text: '被申请方',
          url: '/respondentInfo'
        },
        {
          id: '3',
          text: '请求和答辩',
          url: '/claimItem'
        },
        {
          id: '4',
          text: '反请求和答辩',
          url: '/revClaimItem'
        },
        {
          id: '5',
          text: '证据和质证',
          url: '/evidencesInfo'
        },
        {
          id: '6',
          text: '送达',
          url: '/sendInfo'
        },
        {
          id: '7',
          text: '结案',
          url: '/endCaseInfo'
        }
      ],
      menuClaimD: [
        {
          id: '0',
          text: '基本信息',
          url: '/basicInfo'
        },
        {
          id: '1',
          text: '申请方',
          url: '/proposerInfo'
        },
        {
          id: '2',
          text: '被申请方',
          url: '/respondentInfo'
        },
        {
          id: '3',
          text: '请求和答辩',
          url: '/claimItem'
        },
        {
          id: '5',
          text: '证据和质证',
          url: '/evidencesInfo'
        },
        {
          id: '7',
          text: '结案',
          url: '/endCaseInfo'
        }
      ],
      stateA: [1, 2, 8, 9, '1', '2', '8', '9'],
      stateB: [3, 4, 99, '3', '4', '99'],
      stateC: [6, 7, 98, '6', '7', '98'],
      stateD: [5, '5'],
      stepData: null
    }
  },
  created () {
    if (this.caseId === null || this.caseState === null) {
      this.menuClaim = this.menuClaimA
      this.$router.go(-1)
      return
    }
    if (this.stateA.indexOf(this.caseState) !== -1) {
      this.menuClaim = this.menuClaimA
    } else if (this.stateB.indexOf(this.caseState) !== -1) {
      this.menuClaim = this.menuClaimB
    } else if (this.stateC.indexOf(this.caseState) !== -1) {
      this.menuClaim = this.menuClaimC
    } else if (this.stateD.indexOf(this.caseState) !== -1) {
      this.menuClaim = this.menuClaimD
    } else {
      this.menuClaim = this.menuClaimA
    }
  },
  mounted () {
    this.resStep()
  },
  computed: {
    ...mapGetters([
      'caseId',
      'caseState'
    ])
  },
  methods: {
    resStep () {
      axios.post('/case/findProcessByCaseId', {
        caseId: this.caseId
      }).then(res => {
        this.stepData = res.data.data
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
._center {
  background: transparent;
  width: 80%;
  @include mw(1180px);
  @include bc;
  padding-top: 40px;
  ._center_left {
    text-align: left;
    li {
      @include hand;
      margin-left: 75px;
      margin-bottom: 8px;
      padding-left: 8px;
      height: 44px;
      line-height: 44px;
      font-size: 14px;
      border-left: 4px solid transparent;
    }
    li.router-link-exact-active {
      border-left: 4px solid #1a2b58;
      padding-left: 8px;
    }
  }
}
</style>
