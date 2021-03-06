<template>
  <el-form>
    <el-collapse v-if="this.installmentShow.length > 0" v-model="activeName" accordion>
      <el-collapse-item name='1'>
        <template slot="title">
          <h2>{{$t('__installment')}}<i class="el-icon-circle-plus" v-show="activeName===''"></i></h2>
        </template>
        <el-button-group>
          <el-button v-show="buttonsShow.new && buttonsShowUser.new" type="primary" icon="el-icon-edit" @click.prevent="handleBatchEdit()">{{$t('__installmentChange')}}</el-button>
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
    :fromOrderID="fromOrderID"
    :buttonsShowUser="buttonsShowUser"
    @dialog-cancel="dialogCancel"
    @dialog-save="dialogSave"></new-form>
    <batch-edit
    v-if="dialogShowBatchEdit"
    :dialog-type="dialogTypeBatchEdit"
    :dialog-show="dialogShowBatchEdit"
    :fromInstallmentShow="installmentShow"
    :fromOrderID="fromOrderID"
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
    buttonsShowUser: { type: Object },
    fromOrderID: { type: String },
    fromOrderStatus: { type: String }
  },
  data () {
    return {
      dialogType: 'new',
      dialogShow: false,
      dialogTypeBatchEdit: 'new',
      dialogShowBatchEdit: false,
      installmentShow: [],
      installment: {},
      installmentAmount: 0, // 提醒明細價格與分期付款總額不同, 使用
      activeName: '',
      // 系統目前狀態權限
      buttonsShow: {
        new: 1,
        edit: 0,
        save: 1,
        delete: 0,
        search: 1
      }
    }
  },
  watch: {
    fromOrderID: function (newValue) {
      if (newValue) { this.preLoading() }
    }
  },
  mounted () {
    if (this.fromOrderID) { this.preLoading() }
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
      if (row.PaidAmount !== 0) {
        return 'disabled-row'
      }
    },
    preLoading: async function () {
      let responseRecords = await this.$api.orders.getObject({ type: 'installmentDetail', keyword: this.fromOrderID })
      this.installmentShow = responseRecords.data.result
      if (this.installmentShow && this.installmentShow.length > 0) {
        this.activeName = '1'
      }

      // 統計明細總額
      this.installmentShow.forEach(row => {
        this.installmentAmount += row.ScheduledAmount
      })

      // 系統簽核過程權限
      switch (this.fromOrderStatus) {
        case '1':
          this.buttonsShow = {
            new: 1,
            edit: 1,
            save: 1,
            delete: 1,
            search: 1
          }
          break
        default:
          this.buttonsShow = {
            new: 0,
            edit: 0,
            save: 0,
            delete: 0,
            search: 0
          }
          break
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
    }
  }
}
</script>
