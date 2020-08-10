<template>
  <el-form>
    <el-button-group>
      <el-button type="primary" icon="el-icon-plus" @click.prevent="showForm('new')">{{$t('__new')}}</el-button>
    </el-button-group>
    <search-button @search="search"></search-button>
    <p/>
    <el-table
      :data="ordersShow"
      stripe
      border
      @row-click="handleClick"
      style="width: 100%">
      <el-table-column
        prop="ID"
        :label="$t('__orderID')">
      </el-table-column>
      <el-table-column
        prop="OrderDate"
        :label="$t('__order')+$t('__date')"
        :formatter="formatterDate">
      </el-table-column>
      <el-table-column
        prop="CustomerName"
        :label="$t('__orderCustomer')+$t('__name')">
      </el-table-column>
      <el-table-column
        prop="Certificate1List"
        :label="$t('__certificate1')">
        <template slot-scope="scope">
          <div v-for="item in scope.row.Certificate1List" :key="item.Certificate1">
            {{item.Certificate1}}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="Certificate2List"
        :label="$t('__certificate2')">
        <template slot-scope="scope">
          <div v-for="item in scope.row.Certificate2List" :key="item.Certificate2">
            {{item.Certificate2}}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="InvoiceList"
        :label="$t('__invoice')">
        <template slot-scope="scope">
          <div v-for="item in scope.row.InvoiceList" :key="item.InvoiceID">
            {{item.InvoiceID}}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="ReferrerName"
        :label="$t('__referrer')">
      </el-table-column>
      <el-table-column
        prop="ProjectName"
        :label="$t('__project')+$t('__name')">
      </el-table-column>
      <el-table-column
        prop="StatusName"
        :label="$t('__status')">
      </el-table-column>
      <el-table-column
        prop="Amount"
        :label="$t('__amount')"
        :formatter="formatterMoney"
        width="100px">
      </el-table-column>
    </el-table>
  </el-form>
</template>

<script>
import searchButton from '@/components/searchButton'
import { formatMoney, formatDate } from '@/setup/format.js'

export default {
  name: 'Orders',
  components: {
    searchButton
  },
  data () {
    return {
      dialogType: 'new',
      dialogShow: false,
      ordersShow: [],
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
      const response2 = await this.$api.orders.ordersShow({ keyword: this.searchKeyWord })
      this.ordersShow = response2.data.result
      this.ordersShow.forEach(item => {
        if (item.Certificate1List) { item.Certificate1List = JSON.parse(item.Certificate1List) }
        if (item.Certificate2List) { item.Certificate2List = JSON.parse(item.Certificate2List) }
        if (item.InvoiceList) { item.InvoiceList = JSON.parse(item.InvoiceList) }
      })
    },
    handleClick: async function (row, column, event) {
      // 取得可以用的選單
      let responseRow = await this.$api.orders.getObject({ type: 'orderHead', ID: row.ID })
      this.order = responseRow.data.result[0]

      // 進入修改
      this.$router.push({
        name: 'OrderNewForm',
        params: {
          dialogType: 'edit',
          order: this.order,
          parent: 'Orders'
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
          parent: 'Orders'
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
      const response2 = await this.$api.orders.ordersShow({ keyword: this.searchKeyWord })
      this.ordersShow = response2.data.result
      this.ordersShow.forEach(item => {
        if (item.Certificate1List) { item.Certificate1List = JSON.parse(item.Certificate1List) }
        if (item.Certificate2List) { item.Certificate2List = JSON.parse(item.Certificate2List) }
        if (item.InvoiceList) { item.InvoiceList = JSON.parse(item.InvoiceList) }
      })
    }
  }
}
</script>
