<template>
  <div class="codeDiff">
    <div class="_center pr">
      <vue-code-diff :old-string="oldStr" :new-string="newStr" :context="10" outputFormat="side-by-side"/>
    </div>
  </div>
</template>

<script>
import vueCodeDiff from 'vue-code-diff'

export default {
  name: 'codeDiff',
  components: {vueCodeDiff},
  data () {
    return {
      oldStr: '',
      newStr: ''
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
}
</style>
