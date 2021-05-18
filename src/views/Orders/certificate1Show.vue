<template>
  <div>
    <el-button-group style="padding-bottom: 5px">
      <el-button class="hideButton" icon="el-icon-more"><!-- 排版用,避免沒按鈕跑版 --></el-button>
      <search-button @search="search"></search-button>
    </el-button-group>
    <el-table
      :data="results"
      stripe
      border
      :span-method="objectSpanMethod"
      :height="tableHeight"
      @row-click="handleClick"
      :row-class-name="tableRowClassName"
      style="width: 100%">
      <el-table-column
        prop="Certificate1"
        :label="$t('__certificate1')"
        width="150">
      </el-table-column>
      <el-table-column
        prop="OrderID"
        :label="$t('__orderID')"
        width="120">
      </el-table-column>
      <el-table-column
        prop="PrintCount"
        :label="$t('__printCount')"
        width="100">
      </el-table-column>
      <el-table-column
        prop="StatusName"
        :label="$t('__status')">
      </el-table-column>
      <el-table-column
        prop="IssuanceDate"
        :label="$t('__issuanceDate')"
        :formatter="formatterDate">
      </el-table-column>
      <el-table-column
        :label="$t('__ref')+$t('__function')">
        <template slot-scope="scope">
          {{scope.row.refTypeName}}
        </template>
      </el-table-column>
      <el-table-column
        prop="refOrderID"
        :label="$t('__ref')+$t('__orderID')">
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
      :certificate1="certificate1"
      :orderID="orderID"
      :buttonsShowUser="buttonsShowUser"
      @dialog-cancel="dialogCancel"
      @dialog-save="dialogSave"></new-form>
  </div>
</template>

<script>
import newForm from './components/certificate1/certificate1NewForm'
import searchButton from '@/components/searchButton'
import { formatDate } from '@/setup/format.js'

export default {
  name: 'Certificate1',
  components: {
    newForm,
    searchButton
  },
  data () {
    return {
      dialogType: 'new',
      dialogShow: false,
      originData: [],
      certificate1: {},
      orderID: '', // 顯示修改視窗使用, 避免紅字報錯
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
        orderBy: 'asc', // 排序方式
        orderByValue: 'ID' // 預設排序欄位
      },
      // 使用者能看到的權限
      buttonsShowUser: {
        new: 1,
        edit: 1,
        save: 1,
        delete: 1,
        search: 1
      },
      // 以下為下拉式選單專用
      ddlCompanies: []
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
  watch: {
    results: function () {
      this.pageChange()
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
    // table 變更顏色
    tableRowClassName ({ row, rowIndex }) {
      if (row['Status'] === '0') {
        return 'disabled-row'
      }
    },
    // 讀入系統清單
    preLoading: async function () {
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
      this.certificate1 = row

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
      this.searchContent.searchKeyWord = value
      let response2 = await this.$api.orders.certificate1Show({ keyword: this.searchContent.searchKeyWord })
      this.originData = response2.data.result

      this.pageChange()
    },
    // 排序相關
    reOrder: function (searchButtonResult) {
      this.sortable.orderBy = searchButtonResult.orderBy
      this.sortable.orderByValue = searchButtonResult.orderByValue
    },
    // ===== 分頁相關 =====
    handleSizeChange: function (val) {
      this.pagination.pageSize = val
      this.pageChange()
    },
    handleCurrentChange: function (val) {
      this.pagination.currentPage = val
      this.pageChange()
    },
    pageChange: function (refTable) {
      // table span
      this.tableSpanList = []
      this.results.forEach(row => {
        let findObject = this.tableSpanList.find(row2 => { return row2.SpanID === row.Certificate1 })
        if (findObject === undefined) {
          let firstIndex = this.results.findIndex(row3 => row3.Certificate1 === row.Certificate1)
          this.tableSpanList.push({
            SpanID: row.Certificate1,
            rowIndex: firstIndex,
            Qty: 1
          })
        } else {
          findObject.Qty += 1
        }
      })
    },
    // table span method
    objectSpanMethod: function (row, column, rowIndex, columnIndex) {
      if (row.columnIndex === 0) {
        let findObject = this.tableSpanList.find(item => { return item.SpanID === row.row.Certificate1 })
        // 沒找到
        if (findObject === undefined) {
          return [1, 0]
        } else {
          // 有找到
          // 是第一筆, 就要做 colspan
          if (row.rowIndex === findObject.rowIndex) {
            return [findObject.Qty, 1]
          } else {
            // 其他筆
            return [1, 0]
          }
        }
      }
    }
  }
}
</script>
