<template>
  <div class="systMana">
    <div class="_center pr">
      <Tabs v-model="tabStatus">
        <TabPane name="systMark" label="系统水印">
          <syst-mark></syst-mark>
        </TabPane>
      </Tabs>
    </div>
  </div>
</template>

<script>
import systMark from '@/page/admin/systMana/systMark/systMark'

export default {
  name: 'syst_mana',
  components: { systMark },
  data () {
    return {
      tabStatus: 'systMark'
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
  ._caseList {
    margin-bottom: 20px;
  }
}
</style>
