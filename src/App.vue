<template>
  <div id="app"
    v-loading.fullscreen="isEnableLoadingMask"
    element-loading-text="Loading..."
    element-loading-background="rgba(0, 0, 0, 0.1)">
    <app-header></app-header>
    <router-view></router-view>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import appHeader from '@/components/header'
export default {
  name: 'app',
  components: {
    appHeader
  },
  computed: {
    ...mapState(['isEnableLoadingMask']) // 監控隨時更新的系統變數,用mapState
  }
}
</script>

<style>
body {
  margin: 0px;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
</style>
