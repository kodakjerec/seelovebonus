<template>
  <el-input
    class="defineCSS"
    v-model="searchValue"
    :placeholder="$t('__pleaseInputSearchValue')"
    maxlength="40">
    <el-button slot="suffix" icon="el-icon-search" @click="change"></el-button>
  </el-input>
</template>

<script>
export default {
  name: 'SearchButton',
  data () {
    return {
      searchValue: ''
    }
  },
  methods: {
    change: function () {
      this.$emit('search', this.searchValue)
    }
  }
}
</script>
<style lang="scss" scoped>
.defineCSS {
  position: absolute;
  right:0px;
  width: 30%
}
</style>
