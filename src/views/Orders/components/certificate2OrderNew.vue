/*
專門用於新增訂單自動產生換狀證明
*/
<template>
  <el-form>
    <h2 class="alignLeft">{{$t('__certificate2')}}</h2>
    <p/>
    <el-form-item :label="$t('__qty')">
      <el-input-number v-model="Qty" :disabled="true"></el-input-number>
    </el-form-item>
  </el-form>
</template>

<script>
import { formatDate } from '@/setup/format.js'

export default {
  name: 'Certificate2ForOrderNew',
  props: {
    orderID: { type: String },
    parentQty: { type: Number }
  },
  data () {
    return {
      form: {
        OrderID: this.orderID,
        ReportDuration: '',
        IssuanceDate: new Date()
      },
      Qty: 0,
      isExceedQtyLimit: false
    }
  },
  watch: {
    orderID: function (newValue) {
      if (newValue) {
        this.form.OrderID = newValue
      }
    },
    parentQty: function () {
      this.parentQtyChange()
    }
  },
  mounted () {
    let tempDate = new Date()
    this.form.IssuanceDate = this.formatterDate(null, null, tempDate.toISOString().slice(0, 10), null)

    this.preLoading()
  },
  methods: {
    formatterDate: function (row, column, cellValue, index) {
      return formatDate(cellValue)
    },
    preLoading: async function () {
      this.parentQtyChange()
    },
    // 父視窗: 變更明細商品數量
    parentQtyChange: function () {
      this.Qty = this.parentQty
    },
    // 檢查輸入
    checkValidate: function () {
      // 錯誤處理: 檢查總和數量有沒有超出上限
      if (this.isExceedQtyLimit) {
        return false
      }
      return true
    },
    beforeSave: async function () {
      // 錯誤處理: 沒有單號
      if (this.form.OrderID === '') {
        return false
      }

      for (let i = 0; i < this.Qty; i++) {
        await this.save(this.form)
      }

      return true
    },
    // 存檔
    save: async function (item) {
      await this.$api.orders.orderCertificate2New({ form: item })
    }
  }
}
</script>
<style lang="scss" scoped>
.alignLeft {
  text-align: left;
}
</style>
