<template>
  <div class="_defenceInfo">
    <Row>
      <Col class="_listL" span="24">
        <Row>
          <Col span="22" offset="1">
            <p>
              <Row>
                <Col class="tr" span="3"><span class="mr10">{{resText}} :</span></Col>
                <Col span="20">
                  <span v-if="this.seeType === 3" v-text="infoData.finalStatement"></span>
                  <span v-if="this.seeType === 2" v-text="infoData.mediateCompromise"></span>
                  <span v-if="this.seeType === 1" v-text="infoData.replyOpinion"></span>
                </Col>
              </Row>
            </p>
          </Col>
        </Row>
      </Col>
    </Row>
  </div>
</template>

<script>
export default {
  name: 'defence_info',
  props: ['infoData', 'seeType'],
  data () {
    return {}
  },
  computed: {
    resText () {
      if (this.seeType === 1) {
        return '答辩描述'
      } else if (this.seeType === 3) {
        return '最后陈述'
      } else if (this.seeType === 2) {
        return '调解与和解'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/style/mixin';
._defenceInfo {
  margin-top: 10px;
  ._listL {
    @include borderRadius(3px);
    @include boxShadow(0 1px 6px -1px #bbb);
    background: #fff;
    padding: 10px 0;
    p {
      word-break: break-all;
      padding: 5px 0;
    }
  }
}
</style>
