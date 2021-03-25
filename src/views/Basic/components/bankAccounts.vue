<template>
  <el-table
    :data="accounts"
    stripe
    border
    style="width: 100%">
    <el-table-column
      prop="Account"
      :label="$t('__bankAccountNo')">
    </el-table-column>
    <el-table-column
      prop="BankID"
      :label="$t('__bank')+$t('__id')">
    </el-table-column>
    <el-table-column
      prop="Branch"
      :label="$t('__bankBranch')">
    </el-table-column>
    <el-table-column
      prop="UserName"
      :label="$t('__bankUserName')">
    </el-table-column>
    <el-table-column
      prop="IsDefault"
      :label="$t('__default')">
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'BankAcoounts',
  props: {
    fromType: { type: String },
    fromID: { type: String }
  },
  data () {
    return {
      accounts: []
    }
  },
  mounted () {
    this.preLoading()
  },
  methods: {
    // 讀取預設資料
    preLoading: async function () {
      let response = await this.$api.basic.bankAccountShow({ fromType: this.fromType, fromID: this.fromID })
      this.accounts = response.data.result
    }
  }
}
</script>
