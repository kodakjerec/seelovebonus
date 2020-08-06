<template>
  <el-form>
    <el-button-group>
      <el-button class="hideButton" type="info" icon="el-icon-printer"></el-button>
    </el-button-group>
    <search-button @search="search"></search-button>
    <p/>
    <el-table
      :data="invoicesShow"
      stripe
      border
      @row-click="handleClick"
      style="width: 100%">
      <el-table-column
        prop="OrderID"
        :label="$t('__orderID')">
      </el-table-column>
      <el-table-column
        prop="InvoiceDate"
        :label="$t('__invoice')+$t('__date')"
        :formatter="formatterDate">
      </el-table-column>
      <el-table-column
        prop="InvoiceID"
        :label="$t('__invoice')+$t('__id')">
      </el-table-column>
      <el-table-column
        prop="Title"
        :label="$t('__title')">
      </el-table-column>
      <el-table-column
        prop="Amount"
        :label="$t('__amount')"
        :formatter="formatterMoney"
        width="100px">
      </el-table-column>
      <el-table-column
        prop="InvoiceStatusName"
        :label="$t('__status')">
      </el-table-column>
    </el-table>
  </el-form>
</template>

<script>
import searchButton from '@/components/searchButton'
import { formatMoney, formatDate } from '@/setup/format.js'

export default {
  name: 'Invoices',
  components: {
    searchButton
  },
  data () {
    return {
      dialogType: 'new',
      dialogShow: false,
      invoicesShow: [],
      order: {},
      searchKeyWord: ''
    }
  },
  mounted () {
    this.preLoading()
  },
  methods: {
    formatterDate: function (row, column, cellValue, index) {
      return formatDate(cellValue)
    },
    formatterMoney: function (row, column, cellValue, index) {
      return formatMoney(cellValue)
    },
    // 讀入系統清單
    preLoading: async function () {
      // 顯示專用
      const response2 = await this.$api.orders.invoiceShow({ keyword: this.searchKeyWord })
      this.invoicesShow = response2.data.result
    },
    handleClick: async function (row, column, event) {
      // 取得可以用的選單
      let responseRow = await this.$api.orders.getObject({ type: 'orderHead', ID: row.OrderID })
      this.order = responseRow.data.result[0]

      // 進入修改
      this.$router.push({
        name: 'OrderNewForm',
        params: {
          dialogType: 'edit',
          order: this.order,
          parent: 'Invoices'
        }
      })
    },
    // 開啟表單
    showForm: function (eventType) {
      this.$router.push({
        name: 'OrderNewForm',
        params: {
          dialogType: eventType,
          order: this.order,
          parent: 'Invoices'
        }
      })
    },
    dialogCancel: function () {
      this.dialogShow = false
    },
    dialogSave: function () {
      this.dialogShow = false
      this.preLoading()
    },
    // 搜尋
    search: async function (value) {
      this.searchKeyWord = value
      const response2 = await this.$api.orders.invoiceShow({ keyword: this.searchKeyWord })
      this.invoicesShow = response2.data.result
    }
  }
}
</script>

<style lang="scss" scoped>
.hideButton {
  visibility: hidden;
}
</style>
