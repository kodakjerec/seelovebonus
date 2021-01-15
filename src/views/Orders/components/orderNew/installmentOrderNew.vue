<template>
  <span></span>
</template>

<script>
import { formatMoney, formatDate } from '@/setup/format.js'

export default {
  name: 'Installment',
  props: {
    buttonsShow: { type: Object },
    buttonsShowUser: { type: Object },
    orderID: { type: String },
    parentInstallment: { type: Object }
  },
  data () {
    return {
      dialogType: 'new',
      dialogShow: false,
      dialogTypeBatchEdit: 'new',
      dialogShowBatchEdit: false,
      installmentShow: [],
      installment: {},
      activeName: ''
    }
  },
  watch: {
    orderID: function (newValue) {
      if (newValue) { this.preLoading() }
    }
  },
  mounted () {
    if (this.orderID) { this.preLoading() }
  },
  methods: {
    formatterDate: function (row, column, cellValue, index) {
      return formatDate(cellValue)
    },
    formatterMoney: function (row, column, cellValue, index) {
      return formatMoney(cellValue)
    },
    // table 變更顏色
    tableRowClassName ({ row, rowIndex }) {
      if (row['Status'] === '0') {
        return 'disabled-row'
      }
    },
    preLoading: async function () {
      let responseRecords = await this.$api.orders.getObject({ type: 'installmentDetail', keyword: this.orderID })
      this.installmentShow = responseRecords.data.result
      if (this.installmentShow && this.installmentShow.length > 0) {
        this.activeName = '1'
      }
    },
    // 父 -> 子
    // 新增一筆躉繳, 只有訂單新增會用到
    beforeSave: async function () {
      let isSuccess = false

      let newObject = {
        OrderID: this.orderID,
        Seq: 1,
        InstallmentName: this.parentInstallment.InstallmentName,
        ScheduledDate: this.parentInstallment.ScheduledDate,
        ScheduledAmount: this.parentInstallment.ScheduledAmount,
        ReceivedDate: null,
        PaidAmount: null,
        PaymentMethod: 1,
        PaymentFrequency: 1,
        Memo: ''
      }

      isSuccess = await this.$api.orders.installmentDetailUpdate({ form: newObject })

      return isSuccess
    }
  }
}
</script>
