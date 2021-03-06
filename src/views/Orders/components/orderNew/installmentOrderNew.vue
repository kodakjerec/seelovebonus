<template>
  <el-form>
    <h2 class="alignLeft">{{$t('__installment')}}</h2>
    <p/>
    <el-table
      :data="subList"
      stripe
      border
      style="width: 100%">
      <el-table-column
        prop="Seq"
        :label="$t('__installmentSeq')"
        width="60px">
      </el-table-column>
      <el-table-column
        prop="InstallmentName"
        :label="$t('__installment')+$t('__name')">
      </el-table-column>
      <el-table-column
        prop="ScheduledDate"
        :label="$t('__installmentScheduledDate')"
        :formatter="formatterDate">
      </el-table-column>
      <el-table-column
        prop="ScheduledAmount"
        :label="$t('__installmentScheduledAmount')">
        <template slot-scope="scope">
          {{formatterMoney(scope.row[scope.column.property])}}
        </template>
      </el-table-column>
      <el-table-column
        prop="PaymentMethod"
        :label="$t('__paymentMethod')"
        width="100px">
        <template slot-scope="scope">
          <el-select v-model="scope.row[scope.column.property]" default-first-option filterable clearable :placeholder="$t('__plzChoice')" disabled>
            <el-option v-for="item in ddlPaymentMethod" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
              <span style="float: left">{{ item.Value }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
            </el-option>
          </el-select>
        </template>
      </el-table-column>
    </el-table>
  </el-form>
</template>

<script>
import { formatDate, formatMoney } from '@/setup/format.js'

export default {
  name: 'InstallmentOrderNew',
  props: {
    fromOrderID: { type: String },
    projectID: { type: String },
    parentQty: { type: Number },
    parentAmount: { type: Number },
    parentDate: { type: String }
  },
  data () {
    return {
      projectInstallmentDetail: [],
      subList: [],
      // 以下為下拉式選單專用
      ddlPaymentMethod: []
    }
  },
  watch: {
    projectID: function (newValue) {
      if (newValue) {
        this.reLoading()
      }
    },
    parentQty: function (newValue) { this.reCalculateSubList() },
    parentAmount: function (newValue) { this.reCalculateSubList() },
    parentDate: function (newValue) { if (newValue) { this.reCalculateSubList() } }
  },
  mounted () {
    this.preLoading()
  },
  methods: {
    formatterDate: function (row, column, cellValue, index) {
      return formatDate(cellValue)
    },
    formatterMoney: function (cellValue) {
      return formatMoney(cellValue)
    },
    preLoading: function () {
      let response = this.$api.local.getDropdownList({ type: 'PaymentMethod' })
      this.ddlPaymentMethod = response
      this.reLoading()
    },
    reLoading: async function () {
      if (!this.projectID) {
        return
      }
      let responseRecords = await this.$api.basic.getObject({ type: 'projectInstallmentDetail', keyword: this.projectID })
      this.projectInstallmentDetail = responseRecords.data.result
      this.reCalculateSubList()
    },
    reCalculateSubList: function () {
    // reset
      this.subList = []

      // 沒有設定值預設給躉繳
      if (this.projectInstallmentDetail.length === 0) {
        this.subList.push({
          Seq: 1,
          ScheduledDate: this.parentDate,
          InstallmentName: '躉繳',
          ScheduledAmount: this.parentAmount,
          PaymentMethod: '1',
          PaymentFrequency: '1'
        })
      } else {
        // 有給予預設值
        // Amount 與 qty 有誤差的金額, 全部灌在最後一筆
        let startDate = new Date(this.parentDate)
        let finalAmount = 0
        this.projectInstallmentDetail.forEach((row, index) => {
          // 計算
          finalAmount += row.ScheduledAmount * this.parentQty

          if (index > 0) {
            startDate = new Date(startDate.setMonth(startDate.getMonth() + row.IncreaseMonth))
            startDate = new Date(startDate.getFullYear(), startDate.getMonth(), row.fixedDay, 12)
          }
          let tempValue = startDate.toISOString().slice(0, 10)

          // 填入
          this.subList.push({
            Seq: row.Seq,
            ScheduledDate: tempValue,
            InstallmentName: row.InstallmentName,
            ScheduledAmount: row.ScheduledAmount * this.parentQty,
            PaymentMethod: row.PaymentMethod,
            PaymentFrequency: row.PaymentFrequency
          })
        })
        // 差異金額, 全部灌在最後一筆
        finalAmount = this.parentAmount - finalAmount
        this.subList[this.subList.length - 1].ScheduledAmount += finalAmount
      }
    },
    // 父 -> 子
    // 新增一筆躉繳, 只有訂單新增會用到
    beforeSave: async function () {
      let isSuccess = false

      for (let i = 0; i < this.subList.length; i++) {
        let row = this.subList[i]
        let newObject = {
          OrderID: this.fromOrderID,
          Seq: row.Seq,
          InstallmentName: row.InstallmentName,
          ScheduledDate: row.ScheduledDate,
          ScheduledAmount: row.ScheduledAmount,
          PaymentMethod: row.PaymentMethod,
          PaymentFrequency: row.PaymentFrequency,
          Memo: ''
        }
        isSuccess = await this.$api.orders.installmentDetailUpdate({ form: newObject })
      }

      return isSuccess
    }
  }
}
</script>
<style lang="scss" scoped>
.alignLeft {
  text-align: left;
}
</style>
