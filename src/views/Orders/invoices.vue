<template>
  <el-form>
    <el-button-group style="padding-bottom: 5px">
      <el-button class="hideButton" icon="el-icon-more"><!-- 排版用,避免沒按鈕跑版 --></el-button>
      <search-button :options="sortable.orderByList" :originOrderBy="sortable.orderBy" :originOrderByValue="sortable.orderByValue" @search="search" @reOrder="reOrder"></search-button>
    </el-button-group>
    <el-table
      :data="results"
      stripe
      border
      :height="tableHeight"
      @row-click="handleClick"
      :row-class-name="tableRowClassName"
      style="width: 100%">
      <el-table-column
        prop="InvoiceID"
        :label="$t('__invoice')+$t('__id')">
        <template slot-scope="scope">
          {{scope.row[scope.column.property] | VMask('AA-########')}}
        </template>
      </el-table-column>
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
      <el-table-column
        prop="Memo"
        :label="$t('__memo')">
      </el-table-column>
    </el-table>
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagination.currentPage"
      :page-sizes="pagination.pageSizeList"
      :page-size="pagination.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="originData.length">
    </el-pagination>
    <new-form
      v-if="dialogShow"
      :dialog-type="dialogType"
      :dialog-show="dialogShow"
      :invoiceHead="invoiceHead"
      :buttonsShowUser="buttonsShowUser"
      @dialog-cancel="dialogCancel"
      @dialog-save="dialogSave"></new-form>
  </el-form>
</template>

<script>
import newForm from './components/invoiceNewForm'
import searchButton from '@/components/searchButton'
import { formatMoney, formatDate } from '@/setup/format.js'

export default {
  name: 'Invoices',
  components: {
    newForm,
    searchButton
  },
  data () {
    return {
      dialogType: 'new',
      dialogShow: false,
      originData: [],
      invoiceHead: {},
      searchContent: {
        searchKeyWord: ''
      },
      tableHeight: (screen.height * 7 / 9), // Table高度
      pagination: { // 分頁
        currentPage: 1,
        pageSizeList: [20, 30, 50],
        pageSize: 20
      },
      sortable: {
        orderByList: [{ ID: 'InvoiceID', Value: this.$t('__invoice') + this.$t('__id') }, { ID: 'OrderID', Value: this.$t('__orderID') }], // 排序
        orderBy: 'desc', // 排序方式
        orderByValue: 'InvoiceID' // 預設排序欄位
      },
      // 使用者能看到的權限
      buttonsShowUser: {
        new: 1,
        edit: 1,
        save: 1,
        delete: 1,
        search: 1
      }
    }
  },
  computed: {
    results: function () {
      let tempData = this.originData

      // 排序依據
      switch (this.sortable.orderByValue) {
        case 'ID':
          tempData = tempData.slice().sort(function (x, y) {
            return x.ID - y.ID
          })
          break
        case 'OrderDate':
          tempData = tempData.slice().sort(function (x, y) {
            return new Date(x.OrderDate) - new Date(y.OrderDate)
          })
          break
      }

      // 遞增/遞減
      switch (this.sortable.orderBy) {
        case 'desc':
          tempData = tempData.slice().reverse()
          break
      }

      // 結果
      let result = tempData.slice((this.pagination.currentPage - 1) * this.pagination.pageSize, this.pagination.pageSize * this.pagination.currentPage)

      // 切換分頁
      return result
    }
  },
  mounted () {
    this.preLoading()
    this.userPermission()
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
    // 讀入系統清單
    preLoading: async function () {
      // 顯示專用
      this.search('')
    },
    // 使用者權限
    userPermission: async function () {
      let progPermission = this.$store.state.userProg.filter(item => { return item.Path === this.$route.fullPath })[0]
      this.buttonsShowUser.new = progPermission.fun1
      this.buttonsShowUser.edit = progPermission.fun2
      this.buttonsShowUser.save = progPermission.fun2
      this.buttonsShowUser.delete = progPermission.fun3
    },
    handleClick: async function (row, column, event) {
      // 取得可以用的選單
      this.invoiceHead = row

      // 權限管理
      this.buttonsShowUser.save = this.buttonsShowUser.edit

      // 進入修改
      this.dialogType = 'edit'
      this.dialogShow = true
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
      let response2 = await this.$api.orders.invoiceShow({ keyword: this.searchKeyWord })
      this.originData = response2.data.result
    },
    // 排序相關
    reOrder: function (searchButtonResult) {
      this.sortable.orderBy = searchButtonResult.orderBy
      this.sortable.orderByValue = searchButtonResult.orderByValue
    },
    // 分頁相關
    handleSizeChange: function (val) {
      this.pagination.pageSize = val
    },
    handleCurrentChange: function (val) {
      this.pagination.currentPage = val
    }
  }
}
</script>
