/*
專門用於新增訂單自動產生供奉憑證
*/
<template>
  <el-form>
    <h2 class="alignLeft">{{$t('__certificate1')}}</h2>
    <p/>
    <el-table
      :data="certificate1List"
      stripe
      border
      style="width: 100%">
      <el-table-column
        prop="ID"
        :label="$t('__certificate1Prefix')">
      </el-table-column>
      <el-table-column
        prop="qty"
        :label="$t('__qty')">
        <template slot-scope="scope">
          <el-input-number v-model="scope.row[scope.column.property]" @change="(currentValue, oldValue)=>{qtyChange(currentValue, oldValue, scope.row)}"></el-input-number>
        </template>
      </el-table-column>
    </el-table>
    <div style="color:red" v-show="isExceedQtyLimit">{{$t('__exceedQtyLimit')}}</div>
  </el-form>
</template>

<script>
import { formatDate } from '@/setup/format.js'

export default {
  name: 'Certificate1ForOrderNew',
  props: {
    orderID: { type: String },
    parentQty: { type: Number }
  },
  data () {
    return {
      form: {
        OrderID: this.orderID,
        Certificate1: '',
        PrintCount: 0,
        Status: '1',
        ReportDuration: '1',
        Prefix: '',
        IssuanceDate: new Date()
      },
      certificate1List: [],
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
      // 新增時憑證編號清單
      let responseCer1List = await this.$api.orders.getDropdownList({ type: 'certificate1Prefix' })
      responseCer1List.data.result.forEach(row => {
        this.certificate1List.push(row)
      })

      this.parentQtyChange()
    },
    // 更改數量
    qtyChange: function (currentValue, oldValue, row) {
      // 檢查總和數量有沒有超出上限
      let count = 0
      this.certificate1List.forEach(row => {
        count += row.qty
      })

      // 超過了, 彈出警示訊息
      // (回復舊數值發現前端不會跟著更新, 因此不採用)
      if (count > this.parentQty) {
        this.$message({
          message: this.$t('__exceedQtyLimit'),
          type: 'warning'
        })
        this.isExceedQtyLimit = true
      } else {
        this.isExceedQtyLimit = false
      }
    },
    // 父視窗: 變更明細商品數量
    parentQtyChange: function () {
      let index = 0

      this.certificate1List.forEach(row => {
        if (index === 0) {
          row.qty = this.parentQty
        } else {
          row.qty = 0
        }

        index++
      })

      this.refreshList()
    },
    // 強制觸發vue.js更新機制
    refreshList: function () {
      let tempList = JSON.parse(JSON.stringify(this.certificate1List))
      this.certificate1List = []

      tempList.forEach(row => {
        this.certificate1List.push(row)
      })
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

      for (let index = 0; index < this.certificate1List.length; index++) {
        let row = this.certificate1List[index]
        this.form.Prefix = row.ID
        for (let i = 0; i < row.qty; i++) {
          await this.save(this.form)
        }
      }

      return true
    },
    // 存檔
    save: async function (item) {
      await this.$api.orders.orderCertificate1New({ form: item })
    }
  }
}
</script>
<style lang="scss" scoped>
.alignLeft {
  text-align: left;
}
</style>
