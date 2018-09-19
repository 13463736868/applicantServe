<template>
  <div class="tranRecoD">
    <head-top :isRegister="true">
      <span class="f36 fcf">交易记录</span>
    </head-top>
    <div class="_center pr">
      交易记录
    </div>
  </div>
</template>

<script>
import headTop from '@/components/header/head'

export default {
  name: 'tran_reco_d',
  components: { headTop },
  data () {
    return {}
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
  ._search {
    max-width: 450px;
    margin-bottom: 20px;
  }
  ._caseList {
    margin-bottom: 20px;
  }
}
</style>
