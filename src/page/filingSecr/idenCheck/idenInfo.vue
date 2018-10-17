<template>
  <div class="idenInfo">
    <head-top :isRegister="true">
      <span class="f36 fcf">身份信息详情</span>
    </head-top>
    <div class="_center pr">
      <Row v-if="idenCheckId !== null && idenCheckType !== null">
        <Col span="14" offset="5">
          <verify-c :userType="idenCheckType" :idenInfoId="idenCheckId"></verify-c>
        </Col>
      </Row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import headTop from '@/components/header/head'
import verifyC from '@/page/filingSecr/idenCheck/children/verifyC'

export default {
  name: 'iden_info',
  components: { headTop, verifyC },
  data () {
    return {}
  },
  computed: {
    ...mapGetters([
      'idenCheckId',
      'idenCheckType'
    ])
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
}
</style>
