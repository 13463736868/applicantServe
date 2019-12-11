<template>
  <div class="fl fcf">
    <Dropdown class="nav_more" v-if="resMenu.length > 0" @on-click="resToRoute">
      <span class="hand fcf f14">{{resTitle}} </span><Icon class="hand" color="#ffffff" type="ios-arrow-down"></Icon>
      <DropdownMenu class="tl" slot="list">
        <DropdownItem v-for="item in resMenu" :key="item.id" :name="item.url">{{item.text}}</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
export default {
  name: 'resdropdown',
  props: ['resTitle', 'resMenu'],
  data () {
    return {
    }
  },
  methods: {
    resToRoute (name) {
      this.$router.replace({
        path: name
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.nav_more {
  padding: 0 15px;
  height: 100%;
  line-height: 4rem;
}
</style>
