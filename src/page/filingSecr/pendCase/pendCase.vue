<template>
  <div class="pendCase">
    <head-top :isRegister="true">
      <span class="f36 fcf">待立案案件</span>
    </head-top>
    <div class="_center pr">
      待立案案件
    </div>
  </div>
</template>

<script>
import headTop from '@/components/header/head'

export default {
  name: 'pend_case',
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
