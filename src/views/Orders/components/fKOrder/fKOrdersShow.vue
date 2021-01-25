<template>
  <div>
    <el-button-group style="padding-bottom: 5px">
      <el-button class="hideButton" icon="el-icon-more"><!-- 排版用,避免沒按鈕跑版 --></el-button>
      <search-button :options="sortable.orderByList" :originOrderBy="sortable.orderBy" :originOrderByValue="sortable.orderByValue" @search="search" @reOrder="reOrder"></search-button>
    </el-button-group>
    <el-table
      :data="originData"
      stripe
      border
      :height="tableHeight"
      @row-click="handleClick"
      :row-class-name="tableRowClassName"
      style="width: 100%">
      <template  v-for="column in columns">
        <el-table-column
          v-if="column.formatter === 'date'"
          :key="column.key"
          :prop="column.key"
          :label="column.header"
          :formatter="formatterDate">
        </el-table-column>
        <el-table-column
          v-else
          :key="column.key"
          :prop="column.key"
          :label="column.header">
        </el-table-column>
      </template>
    </el-table>
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagination.currentPage"
      :page-sizes="pagination.pageSizeList"
      :page-size="pagination.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pagination.totalPage">
    </el-pagination>
    <new-form
      v-if="dialogShow"
      :dialog-show="dialogShow"
      :fKOrder="fKOrder"
      @dialog-cancel="dialogCancel()"
      @dialog-save="dialogSave()"></new-form>
  </div>
</template>

<script>
import newForm from './components/fKOrderPrint'
import searchButton from '@/components/searchButton'
import { formatDate } from '@/setup/format.js'

export default {
  name: 'FKOrdersShow',
  components: {
    newForm,
    searchButton
  },
  data () {
    return {
      columns: [
        {
          header: this.$t('__orderID'),
          key: 'ID',
          width: 10
        },
        {
          header: this.$t('__customer') + this.$t('__name'),
          key: 'CustomerName',
          width: 10
        },
        {
          header: this.$t('__qty'),
          key: 'Qty',
          width: 10
        },
        {
          header: this.$t('__status'),
          key: 'StatusName',
          width: 10
        },
        {
          header: this.$t('__order') + this.$t('__date'),
          key: 'OrderDate',
          width: 30,
          formatter: 'date'
        }
      ],
      dialogType: 'new',
      dialogShow: false,
      originData: [],
      fKOrder: {},
      searchContent: { // 搜尋
        searchKeyWord: '',
        OrdersType: [],
        StatusType: [],
        selectedOrdersType: [],
        selectedStatusType: [],
        StartDate: '1900-01-01',
        EndDate: new Date()
      },
      tableHeight: (screen.height * 7 / 9), // Table高度
      pagination: { // 分頁
        currentPage: 1,
        pageSize: 20,
        pageSizeList: [20, 30, 50],
        totalPage: 1,
        totalCount: 20
      },
      sortable: {
        orderByList: [{ ID: 'ID', Value: this.$t('__orderID') }, { ID: 'OrderDate', Value: this.$t('__order') + this.$t('__date') }], // 排序
        orderBy: 'desc', // 排序方式
        orderByValue: 'ID' // 預設排序欄位
      },
      // 使用者能看到的權限
      buttonsShowUser: {
        new: 1,
        edit: 1,
        save: 1,
        delete: 1,
        search: 1
      }
      // 以下為下拉式選單專用
    }
  },
  mounted () {
    this.preLoading()
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
      // 顯示專用
      let response = await this.$api.orders.ordersShowGroup()
      let filterSettings = response.data.result

      // 帶入數值
      this.searchContent.OrdersType = filterSettings.OrdersType
      this.searchContent.StatusType = filterSettings.StatusType

      // 預設全選
      // 這裡特別指定 FG
      this.searchContent.OrdersType.forEach(item => {
        if (item.Prefix === 'FG') {
          this.searchContent.selectedOrdersType.push(item.Prefix)
        }
      })
      this.searchContent.StatusType.forEach(item => {
        this.searchContent.selectedStatusType.push(item.Status)
      })

      this.search()
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
      this.fKOrder = row

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
      if (value !== undefined) {
        this.searchContent.searchKeyWord = value
      }
      let response2 = await this.$api.orders.fKOrdersShow({
        searchContent: JSON.stringify(this.searchContent),
        pagination: JSON.stringify(this.pagination),
        sortable: JSON.stringify(this.sortable),
        ID: this.$store.state.userID })
      this.originData = response2.data.result

      // 分頁篩選
      if (this.originData.length > 0 && this.originData[0].pagination) {
        let resultPagination = JSON.parse(this.originData[0].pagination)[0]
        this.pagination.totalCount = resultPagination.totalCount
        this.pagination.totalPage = Math.ceil(this.pagination.totalCount / this.pagination.pageSize)
      }
    },
    // 排序相關
    reOrder: function (searchButtonResult) {
      this.sortable.orderBy = searchButtonResult.orderBy
      this.sortable.orderByValue = searchButtonResult.orderByValue

      this.search()
    },
    // ===== 分頁相關 =====
    handleSizeChange: function (val) {
      this.pagination.pageSize = val

      this.search()
    },
    handleCurrentChange: function (val) {
      this.pagination.currentPage = val

      this.search()
    }
  }
}
</script>
