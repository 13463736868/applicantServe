<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
@import './style/common';
html {
  width: 100%;
  height: 100%;
  body {
    width: 100%;
    height: 100%;
    background: #fdfdfd;
    #app {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
