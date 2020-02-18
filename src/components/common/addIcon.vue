<template>
  <div class="_addIcon not_s">
    <img class="_img" :src="imgUrl" alt="添加" @click="addClick">
    <div class="_text"><span v-text="addText" @click="addClick"></span></div>
  </div>
</template>

<script>
export default {
  name: 'add_icon',
  props: ['addText', 'imgStatus'],
  data () {
    return {}
  },
  computed: {
    imgUrl () {
      return require('../../static/images/addIcon' + this.imgStatus + '.png')
    }
  },
  methods: {
    addClick () {
      this.$emit('addClick')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/style/mixin';
._addIcon {
  padding-top: 40px;
  text-align: center;
  ._img {
    @include hand;
  }
  ._text {
    padding-top: 5px;
    font-size: 15px;
    color: #337BB5;
    span {
      @include hand;
    }
  }
}
</style>
