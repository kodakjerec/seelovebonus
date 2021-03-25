<template>
  <el-table
    :data="log"
    stripe
    border
    style="width: 100%">
    <el-table-column
      prop="LogTime"
      :label="$t('__logTime')"
      :formatter="formatterDateTime">
    </el-table-column>
    <el-table-column
      prop="StartDate"
      :label="$t('__startDate')"
      :formatter="formatterDate">
    </el-table-column>
    <el-table-column
      prop="EndDate"
      :label="$t('__endDate')"
      :formatter="formatterDate">
    </el-table-column>
  </el-table>
</template>

<script>
import { formatDate, formatDateTime } from '@/setup/format.js'

export default {
  name: 'ExceedingDateLog',
  props: {
    companyID: { type: String }
  },
  data () {
    return {
      log: []
    }
  },
  mounted () {
    this.preLoading()
  },
  methods: {
    formatterDate: function (row, column, cellValue, index) {
      return formatDate(cellValue)
    },
    formatterDateTime: function (row, column, cellValue, index) {
      return formatDateTime(cellValue)
    },
    // 讀取預設資料
    preLoading: async function () {
      // 取得所有原始資料
      let response = await this.$api.basic.getObject({ type: 'companyExceedingDateLog', keyword: this.companyID })
      this.log = response.data.result
    }
  }
}
</script>
