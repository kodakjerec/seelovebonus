<template>
  <span :class="checkCss">
    <i class="sort-caret ascending"></i>
    <i class="sort-caret descending"></i>
  </span>
</template>

<script>
export default {
  name: 'TableSortArrow',
  props: {
    prop: { type: String },
    sortable: { type: Object }
  },
  computed: {
    checkCss: function () {
      let result = 'caret-wrapper'
      let orderBy = this.sortable.orderBy
      let orderByValue = this.sortable.orderByValue
      if (this.prop === orderByValue) {
        if (orderBy === 'asc') {
          result += ' ascending'
        } else {
          result += ' descending'
        }
      }
      return result
    }
  }
}
</script>
