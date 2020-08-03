<template>
  <el-form>
      <el-collapse v-model="activeName" accordion>
      <el-collapse-item :title="$t('__invoice')" name='1'>
        <el-button-group>
          <el-button type="primary" icon="el-icon-plus" @click.prevent="showForm('new')" v-show="buttonsShow.new && buttonsShowUser.new">{{$t('__new')+$t('__invoice')}}</el-button>
        </el-button-group>
        <p/>
        <el-table
          :data="invoiceHeadShow"
          stripe
          border
          @row-click="handleClick"
          style="width: 100%">
          <el-table-column
            prop="InvoiceID"
            :label="$t('__invoice')+$t('__number')">
          </el-table-column>
          <el-table-column
            prop="InvoiceDate"
            :label="$t('__invoice')+$t('__date')"
            :formatter="formatterDate">
          </el-table-column>
          <el-table-column
            prop="StatusName"
            :label="$t('__status')">
          </el-table-column>
          <el-table-column
            prop="Amount"
            :label="$t('__amount')"
            :formatter="formatterMoney">
          </el-table-column>
          <el-table-column
            prop="Memo"
            :label="$t('__memo')"
            width="100px">
          </el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>
    <new-form
    v-if="dialogShow"
    :dialog-type="dialogType"
    :dialog-show="dialogShow"
    :invoiceHead="invoiceHead"
    @dialog-cancel="dialogCancel()"
    @dialog-save="dialogSave()"></new-form>
  </el-form>
</template>

<script>
import newForm from './invoiceNewForm'
import { formatMoney, formatDate } from '@/setup/format.js'

export default {
  name: 'Invoice',
  components: {
    newForm
  },
  props: {
    buttonsShow: { type: Object },
    buttonsShowUser: { type: Object },
    orderID: { type: String }
  },
  data () {
    return {
      dialogType: 'new',
      dialogShow: false,
      invoiceHeadShow: [],
      invoiceHead: {},
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
    preLoading: async function () {
      const responseRecords = await this.$api.orders.getObject({ type: 'invoiceHead', ID: this.orderID })
      this.invoiceHeadShow = responseRecords.data.result
      if (this.invoiceHeadShow && this.invoiceHeadShow.length > 0) {
        this.activeName = '1'
      }
    },
    handleClick: async function (row, column, event) {
      // 取得可以用的選單
      this.invoiceHead = row

      // 進入修改
      this.dialogType = 'edit'
      this.dialogShow = true
    },
    // 開啟表單
    showForm: function (eventType) {
      this.invoiceHead = {
        InvoiceID: null,
        InvoiceDate: new Date(),
        OrderID: this.orderID,
        Title: '',
        UniformNumber: '',
        Amount: null,
        ReceivedDate: new Date(),
        InvoiceKind: '6',
        Tax: '1',
        CarrierNumber: null,
        Memo: null,
        InvoiceIDFirst: '',
        RandomCode: null,
        CreateID: this.$store.state.userID,
        Status: '2',
        SalesReturnDate: null
      }

      this.dialogType = eventType
      this.dialogShow = true
    },
    dialogCancel: function () {
      this.dialogShow = false
    },
    dialogSave: function () {
      this.dialogShow = false
      this.preLoading()
      this.$emit('refreshCollectionRecords')
    }
  }
}
</script>
