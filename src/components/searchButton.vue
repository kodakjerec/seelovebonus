<template>
  <div class="defineCSS">
    <el-input
      class="searchButton"
      v-model="searchValue"
      @keydown.native.enter="keyboardChange"
      @keyup.native.enter="lockChange"
      :placeholder="$t('__pleaseInputSearchValue')"
      maxlength="40">
      <i class="el-icon-search el-input__icon" slot="suffix" @click="mouseChange">
      </i>
    </el-input>
    <slot name="body"></slot>
  </div>
</template>

<script>
export default {
  name: 'SearchButton',
  data () {
    return {
      searchValue: '',
      lock: false // 避免按著Enter, 重複發送查詢指令
    }
  },
  methods: {
    mouseChange: function () {
      this.$emit('search', this.searchValue)
    },
    keyboardChange: function () {
      if (this.lock === false) {
        this.$emit('search', this.searchValue)
      }
      this.lock = true
    },
    // 避免按著Enter, 重複發送查詢指令
    lockChange: function () {
      this.lock = false
    },
    optionsChange: function () {
      this.reOder()
    }
  }
}
</script>
<style lang="scss" scoped>
.defineCSS {
  position: absolute;
  right:0px;
  width: 40vw;

  .searchButton {
    width: 40%;

    span {
      right: 0px;
    }
  }
}
</style>
