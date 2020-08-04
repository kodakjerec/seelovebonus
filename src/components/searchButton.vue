<template>
  <el-input
    class="defineCSS"
    v-model="searchValue"
    :placeholder="$t('__pleaseInputSearchValue')"
    @change="change"
    maxlength="40" show-word-limit>
    <i slot="prefix" class="el-input__icon el-icon-search"></i>
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
    change: function (value) {
      if (value && value.length > 0) { this.$emit('search', value) }
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
