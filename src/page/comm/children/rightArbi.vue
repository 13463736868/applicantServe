<template>
  <div class="rightArbi">
    <div class="_arbiInfo">
      <div class="_top">仲裁委信息</div>
      <div class="_mid">
        <Row>
          <Col span="22" offset="1">
            <div class="_logo">
              <img :src="logo.url" alt="">
              <div class="f14 pt5"><b>中国盐城仲裁委员会</b></div>
              <div><b>YanCheng Arbitration Commission</b></div>
            </div>
            <p>
              <span class="mr10"><b>电话 :</b></span>
              <span class="mr10">0515-88123589</span>
            </p>
            <p>
              <span class="mr10"><b>地址 :</b></span>
              <span class="mr10">江苏省盐城市人民南路106号</span>
            </p>
          </Col>
        </Row>
      </div>
    </div>
    <div class="_caseInfo">
      <div class="_top">案件信息</div>
      <div class="_mid">
        <Row v-if="dataInfoShow">
          <Col span="22" offset="1">
            <p>
              <span class="mr10"><b>仲裁机构 :</b></span>
              <span class="mr10" v-text="dataInfo.carbitrationNameode"></span>
            </p>
            <p>
              <span class="mr10"><b>案件案号 :</b></span>
              <span class="mr10" v-text="dataInfo.code"></span>
            </p>
            <p>
              <span class="mr10"><b>纠纷类型 :</b></span>
              <span class="mr10" v-text="dataInfo.caseType"></span>
            </p>
            <p>
              <span class="mr10"><b>案件状态 :</b></span>
              <span class="mr10" v-text="dataInfo.caseState"></span>
            </p>
            <p>
              <span class="mr10"><b>仲裁员 :</b></span>
              <span class="mr10" v-text="dataInfo.arbitrationName"></span>
            </p>
            <p>
              <span class="mr10"><b>秘书 :</b></span>
              <span class="mr10" v-text="dataInfo.secretaryName"></span>
            </p>
            <p>
              <span class="mr10"><b>电话 :</b></span>
              <span class="mr10" v-text="dataInfo.secretaryPhone"></span>
            </p>
          </Col>
        </Row>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'right_arbi',
  props: ['caseId', 'caseState'],
  data () {
    return {
      spinShow: false,
      progressText: null,
      logo: {
        url: '../../static/images/logoR.png'
      },
      dataInfoShow: false,
      dataInfo: null
    }
  },
  created () {
    if (this.caseId !== null && this.caseState !== null) {
      this.resCaseItem()
    }
  },
  methods: {
    resCaseItem () {
      axios.post('/case/findBaseCaseMessage', {
        caseId: this.caseId
      }).then(res => {
        this.dataInfo = res.data.data
        this.dataInfoShow = true
      }).catch(e => {
        this.dataInfoShow = false
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
.rightArbi {
  padding-left: 6px;
  ._caseInfo {
    padding-top: 60px;
    padding-bottom: 60px;
  }
  ._arbiInfo ._top, ._caseInfo ._top {
    @include backgroundLine(right, #1a2b58, #126eaf);
    @include borderRadius(5px);
    text-align: center;
    height: 44px;
    line-height: 44px;
    color: #fff;
    font-size: 20px;
  }
  ._arbiInfo ._mid, ._caseInfo ._mid {
    @include borderRadius(3px);
    @include boxShadow(0 1px 6px -1px #bbb);
    margin-top: 10px;
    background: #fff;
    padding: 10px 0;
    p {
      padding: 5px 0;
    }
  }
  ._myCaseSub {
    ._saveBtn {
      @include btn(#126eaf, 140px, 13px, 40px);
      @include boxShadow(0 1px 6px -1px #bbb);
      @include borderRadius(4px);
      margin-bottom: 20px;
    }
    ._saveBtn._disabled {
      @include btn(#ccc, 140px, 13px, 40px);
    }
    ._saveBtn:focus {
      outline: 0px;
    }
  }
  ._logo {
    padding: 5px 0;
    text-align: center;
  }
}
</style>
