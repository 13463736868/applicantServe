<template>
  <div class="_spin" v-if="spinShow">
    <Spin fix>
      <Icon type="load-c" size="60" class="spin-icon-load"></Icon>
      <slot></slot>
    </Spin>
  </div>
</template>

<script>
export default {
  name: 'spin_comp',
  props: ['spinShow']
}
</script>

<style lang="scss" scoped>
.spin-icon-load{
  animation: ani-demo-spin 1s linear infinite;
}
@keyframes ani-demo-spin {
  from { transform: rotate(0deg);}
  50%  { transform: rotate(180deg);}
  to   { transform: rotate(360deg);}
}
</style>
