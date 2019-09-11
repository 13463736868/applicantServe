<template>
  <div class="oaProcList">
    <div class="_center pr">
      oaProcList
    </div>
  </div>
</template>

<script>

export default {
  name: 'oa_proc_list',
  data () {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/style/mixin.scss';
._center {
  background: transparent;
  width: 80%;
  @include mw(1180px);
  @include bc;
  padding-top: 40px;
}
</style>
