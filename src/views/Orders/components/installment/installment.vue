<template>
  <el-form>
    <el-collapse v-if="this.installmentShow.length > 0" v-model="activeName" accordion>
      <el-collapse-item name='1'>
        <template slot="title">
          <h2>{{$t('__installment')}}<i class="el-icon-circle-plus" v-show="activeName===''"></i></h2>
        </template>
        <el-button-group>
          <el-button v-show="buttonsShowUser.new" type="primary" icon="el-icon-edit" @click.prevent="handleBatchEdit()">{{$t('__installmentChange')}}</el-button>
        </el-button-group>
        <p/>
        <el-table
          :data="installmentShow"
          stripe
          border
          @row-click="handleClick"
          :row-class-name="tableRowClassName"
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
            :label="$t('__installmentScheduledAmount')"
            :formatter="formatterMoney">
          </el-table-column>
          <el-table-column
            prop="PaidAmount"
            :label="$t('__paidAmount')"
            :formatter="formatterMoney">
          </el-table-column>
          <el-table-column
            prop="ReceivedDate"
            :label="$t('__received')+$t('__date')"
            :formatter="formatterDate">
          </el-table-column>
          <el-table-column
            prop="PaymentMethodName"
            :label="$t('__paymentMethod')"
            width="100px">
          </el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>
    <new-form
    v-if="dialogShow"
    :dialog-type="dialogType"
    :dialog-show="dialogShow"
    :installment="installment"
    :orderID="orderID"
    :buttonsShowUser="buttonsShowUser"
    @dialog-cancel="dialogCancel"
    @dialog-save="dialogSave"></new-form>
    <batch-edit
    v-if="dialogShowBatchEdit"
    :dialog-type="dialogTypeBatchEdit"
    :dialog-show="dialogShowBatchEdit"
    :fromInstallmentShow="installmentShow"
    :orderID="orderID"
    :buttonsShowUser="buttonsShowUser"
    @dialog-cancel="dialogCancel"
    @dialog-save="dialogSave"></batch-edit>
  </el-form>
</template>

<script>
import newForm from './installmentNewForm'
import batchEdit from './installmentBatchEdit'
import { formatMoney, formatDate } from '@/setup/format.js'

export default {
  name: 'Installment',
  components: {
    newForm,
    batchEdit
  },
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
    // 單筆修改
    handleClick: async function (row, column, event) {
      // 取得可以用的選單
      this.installment = row

      // 進入修改
      this.dialogType = 'edit'
      this.dialogShow = true
    },
    // 批次修改
    handleBatchEdit: async function () {
      // 進入修改
      this.dialogTypeBatchEdit = 'batch'
      this.dialogShowBatchEdit = true
    },
    dialogCancel: function () {
      this.dialogShow = false
      this.dialogShowBatchEdit = false
    },
    dialogSave: function () {
      this.dialogShow = false
      this.dialogShowBatchEdit = false

      this.preLoading()
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
