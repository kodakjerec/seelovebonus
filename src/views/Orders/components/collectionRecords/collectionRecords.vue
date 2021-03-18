<template>
  <el-form>
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item name='1'>
        <template slot="title">
          <h2>{{$t('__collectionRecords')}}<i class="el-icon-circle-plus" v-show="activeName===''"></i></h2>
        </template>
        <el-button-group>
          <el-button v-show="buttonsShow.new && buttonsShowUser.new" type="primary" icon="el-icon-plus" @click.prevent="showForm('new')">{{$t('__new')+$t('__collectionRecords')}}</el-button>
        </el-button-group>
        <p/>
        <el-table
          :data="collectionRecordsShow"
          stripe
          border
          @row-click="handleClick"
          :row-class-name="tableRowClassName"
          style="width: 100%">
          <el-table-column
            prop="Seq"
            :label="$t('__seq')">
          </el-table-column>
          <el-table-column
            prop="ReceivedDate"
            :label="$t('__received')+$t('__date')"
            :formatter="formatterDate">
          </el-table-column>
          <el-table-column
            prop="PaymentMethodName"
            :label="$t('__paymentMethod')">
          </el-table-column>
          <el-table-column
            prop="Amount"
            :label="$t('__amount')"
            :formatter="formatterMoney">
          </el-table-column>
          <el-table-column
            prop="InvoiceName"
            :label="$t('__invoice')+$t('__name')">
          </el-table-column>
          <el-table-column
            prop="InvoiceID"
            :label="$t('__invoice')+$t('__number')">
          </el-table-column>
          <el-table-column
            prop="Memo"
            :label="$t('__memo')">
          </el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>
    <new-form
    v-if="dialogShow"
    :dialog-type="dialogType"
    :dialog-show="dialogShow"
    :collectionRecord="collectionRecord"
    :fromOrderID="fromOrderID"
    :buttonsShowUser="buttonsShowUser"
    @dialog-cancel="dialogCancel"
    @dialog-save="dialogSave"></new-form>
  </el-form>
</template>

<script>
import newForm from './collectionRecordsNewForm'
import { formatMoney, formatDate } from '@/setup/format.js'

export default {
  name: 'CollectionRecords',
  components: {
    newForm
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
      collectionRecordsShow: [],
      collectionRecord: {},
      activeName: '',
      orderAmount: 0,
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
    // 系統簽核過程權限
    switch (this.fromOrderStatus) {
      case '1':
      case '2':
      case '3':
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
      if (row.InvoiceID !== '') {
        return 'disabled-row'
      }
    },
    preLoading: async function () {
      let responseRecords = await this.$api.orders.getObject({ type: 'collectionRecords', keyword: this.fromOrderID })
      this.collectionRecordsShow = responseRecords.data.result
      if (this.collectionRecordsShow && this.collectionRecordsShow.length > 0) {
        this.activeName = '1'
      }
    },
    handleClick: async function (row, column, event) {
      // 取得可以用的選單
      this.collectionRecord = row

      // 進入修改
      this.dialogType = 'edit'
      this.dialogShow = true
    },
    // 開啟表單
    showForm: async function (eventType) {
      this.collectionRecord = {}

      this.dialogType = eventType
      this.dialogShow = true
    },
    dialogCancel: function () {
      this.dialogShow = false
    },
    dialogSave: function () {
      this.dialogShow = false
      this.preLoading()
      this.$emit('refreshInstallment')
    }
  }
}
</script>
