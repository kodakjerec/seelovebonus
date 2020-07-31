<template>
    <el-table
      :data="accountingList"
      stripe
      border
      style="width: 100%">
      <el-table-column
        prop="ID"
        :label="$t('__id')">
      </el-table-column>
      <el-table-column
        prop="Name"
        :label="$t('__name')">
      </el-table-column>
      <el-table-column prop="Level1" label="Level1"></el-table-column>
      <el-table-column prop="Level2" label="Level2"></el-table-column>
      <el-table-column prop="Level3" label="Level3"></el-table-column>
    </el-table>
</template>

<script>
export default {
  name: 'Accounting',
  data () {
    return {
      accountingList: []
    }
  },
  mounted () {
    this.preLoading()
  },
  methods: {
    // 讀入使用者清單
    preLoading: async function () {
      const response = await this.$api.settings.getDropdownList({ type: 'accounting' })
      this.accountingList = response.data.result
    },
    // 重整畫面
    refresh: function () {
      this.preLoading()
    }
  }
}
</script>
