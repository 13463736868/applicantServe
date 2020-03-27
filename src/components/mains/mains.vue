<template>
  <div class="_mains">
    <div class="mainHeader">
      <head-top :isRegister="true">
        <span class="f36 fcf _centerTitle">{{routerTitle}}</span>
      </head-top>
    </div>
    <div class="mainCont">
      <keep-alive exclude="archiveCase,archiveCaseInfo,case_info,payment_info,iden_info,ceshi_editor,alert_editor,iframe_alert">
        <router-view></router-view>
      </keep-alive>
    </div>
  </div>
</template>
<script>
import watermark from '@/config/waterMark.js'
import { mapGetters } from 'vuex'
import headTop from '@/components/header/head'
export default {
  name: 'mains',
  components: { headTop },
  data () {
    return {
      title: null
    }
  },
  computed: {
    ...mapGetters([
      'menu'
    ]),
    routerTitle () {
      return this.$route.meta.title
    }
  },
  mounted () {
    if (JSON.parse(window.localStorage.getItem('usersInfo')) !== null) {
      this.watermark = JSON.parse(window.localStorage.getItem('usersInfo')).loginname
      watermark.set(this.watermark)
    }
  },
  destroyed () {
    watermark.set('')
  }
}
</script>
<style lang="scss" scoped>
@import '@/style/mixin';
._mains {
  @include mw(1180px);
  ._centerTitle {
    font-size: 32px;
  }
}
</style>
