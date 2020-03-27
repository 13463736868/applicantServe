<template>
  <div class="archiveCaseInfo">
    <div class="_center pr">
      <Row class="pb20" v-if="stepData !== null">
        <Steps :current="stepData.length">
          <Step v-for="(item,index) in stepData" :key="index" :title="item.processName" :content="item.processTime + ' ; ' + item.processInfo">
          </Step>
        </Steps>
      </Row>
      <Row>
        <Col span="4" offset="1" class="_center_left not_s">
          <router-link v-for="item in menuClaim" :to='{path: "/archiveCaseInfo" + item.url}' :key="item.id" tag="li" v-text="item.text"></router-link>
        </Col>
        <Col span="14" class="_center_right">
          <router-view :caseId="archCaseObj.caseId" :caseState="archCaseObj.state"></router-view>
        </Col>
        <Col span="4">
          <right-arbi :caseId="archCaseObj.caseId" :caseState="archCaseObj.state"></right-arbi>
          <right-btn :caseId="archCaseObj.caseId" :caseState="archCaseObj.state"></right-btn>
        </Col>
      </Row>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
import rightArbi from '@/page/filingSecr/archiveCase/archiveCaseInfo/children/rightArbi'
import rightBtn from '@/page/filingSecr/archiveCase/archiveCaseInfo/children/rightBtn'

export default {
  name: 'archiveCaseInfo',
  components: { rightArbi, rightBtn },
  data () {
    return {
      menuClaim: [],
      menuClaimE: [
        {
          id: '0',
          text: '基本信息',
          url: '/basicInfoA'
        },
        {
          id: '1',
          text: '申请方',
          url: '/proposerInfoA'
        },
        {
          id: '2',
          text: '被申请方',
          url: '/respondentInfoA'
        },
        {
          id: '3',
          text: '请求答辩(反请求答辩)',
          url: '/claimItemA'
        },
        {
          id: '5',
          text: '仲裁审理',
          url: '/evidencesInfoA'
        }
      ],
      menuClaimF: [
        {
          id: '0',
          text: '基本信息',
          url: '/basicInfoA'
        },
        {
          id: '1',
          text: '申请方',
          url: '/proposerInfoA'
        },
        {
          id: '2',
          text: '被申请方',
          url: '/respondentInfoA'
        },
        {
          id: '3',
          text: '请求答辩(反请求答辩)',
          url: '/claimItemA'
        },
        {
          id: '5',
          text: '仲裁审理',
          url: '/evidencesInfoA'
        },
        {
          id: '6',
          text: '裁决书',
          url: '/endCaseInfoA'
        }
      ],
      stepData: null
    }
  },
  created () {
    // 删掉了 sendInfo.vue
    if (this.archCaseObj.caseId === 'null' || this.archCaseObj.caseId === null || this.archCaseObj.state === null) {
      this.menuClaim = this.menuClaimE
      this.$router.go(-1)
      return false
    }
    if ([7, '7'].indexOf(this.archCaseObj.state) !== -1) {
      this.menuClaim = this.menuClaimF
    } else {
      this.menuClaim = this.menuClaimE
    }
  },
  mounted () {
    // this.resStep()
  },
  computed: {
    ...mapGetters([
      'archCaseObj'
    ])
  },
  methods: {
    resStep () {
      if (this.archCaseObj.caseId === '' || this.archCaseObj.caseId === null) {
        return false
      }
      axios.post('/case/findProcessByCaseId', {
        caseId: this.archCaseObj.caseId
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
      margin-left: 30px;
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
