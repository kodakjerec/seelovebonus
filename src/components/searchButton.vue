<template>
  <div class="defineCSS">
    <el-tooltip effect="light" :content="$t('__orderByValue')" placement="top-start">
      <el-select class="orderByValue" v-model="orderByValue" filterable :placeholder="$t('__plzChoice')" @change="optionsChange">
        <el-option v-for="item in options" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
          <span style="float: left">{{ item.Value }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
        </el-option>
      </el-select>
    </el-tooltip>
    <el-tooltip class="orderBy" v-if="orderBy === 'descending'" effect="light" :content="$t('__descending')" placement="top-start">
      <i class="el-icon-bottom" @click="orderByChange"></i>
    </el-tooltip>
    <el-tooltip class="orderBy" v-else effect="light" :content="$t('__ascending')" placement="top-start">
      <i  class="el-icon-top" @click="orderByChange"></i>
    </el-tooltip>
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
  props: {
    options: {
      type: Array,
      default: function () {
        return []
      } },
    originOrderBy: { type: String, default: '' },
    originOrderByValue: { type: String, default: '' }
  },
  data () {
    return {
      searchValue: '',
      lock: false, // 避免按著Enter, 重複發送查詢指令
      orderBy: 'descending',
      orderByValue: ''
    }
  },
  mounted () {
    this.orderBy = this.originOrderBy
    this.orderByValue = this.originOrderByValue
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
    },
    orderByChange: function () {
      if (this.orderBy === 'descending') {
        this.orderBy = 'ascending'
      } else {
        this.orderBy = 'descending'
      }
      this.reOder()
    },
    reOder: function () {
      this.$emit('reOrder', {
        orderBy: this.orderBy,
        orderByValue: this.orderByValue })
    }
  }
}
</script>
<style lang="scss" scoped>
.defineCSS {
  position: absolute;
  right:0px;
  width: 40%;

  .orderByValue {
    width:30%
  }

  .orderBy {
    width:20px;
  }

  .searchButton {
    width: 40%;

    span {
      right: 0px;
    }
  }
}
</style>
