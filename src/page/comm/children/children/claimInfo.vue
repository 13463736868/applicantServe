<template>
  <div class="_claimInfo">
    <Row>
      <Col class="_listL" span="24">
        <Row>
          <Col span="22" offset="1">
            <p>
              <span class="mr10">申请人 :</span>
              <span v-text="infoData.name"></span>
            </p>
            <p>
              <span class="mr10">请求项内容 :</span>
              <span v-text="infoData.content"></span>
            </p>
            <p>
              <span class="mr10">请求金额(元) :</span>
              <span v-text="infoData.disputeFee"></span>
            </p>
          </Col>
        </Row>
      </Col>
    </Row>
  </div>
</template>

<script>
export default {
  name: 'claim_info',
  props: ['infoData'],
  data () {
    return {}
  },
  methods: {
    seeInfo () {
      this.$emit('seeInfo')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/style/mixin';
._claimInfo {
  margin-top: 10px;
  ._listL {
    @include borderRadius(3px);
    @include boxShadow(0 1px 6px -1px #bbb);
    background: #fff;
    padding: 10px 0;
    p {
      padding: 5px 0;
    }
  }
}
</style>
