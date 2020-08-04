<template>
  <div id="app"
    v-loading="isEnableLoadingMask">
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
    ...mapState(['isEnableLoadingMask'])
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
</style>
