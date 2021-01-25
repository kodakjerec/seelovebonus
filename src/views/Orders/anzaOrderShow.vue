<template>
  <div>
    <el-button-group style="padding-bottom: 5px">
      <el-button class="hideButton" icon="el-icon-more"><!-- 排版用,避免沒按鈕跑版 --></el-button>
      <search-button :options="sortable.orderByList" :originOrderBy="sortable.orderBy" :originOrderByValue="sortable.orderByValue" @search="search" @reOrder="reOrder">
      <el-tooltip slot="body" effect="light" :content="$t('__filter')" placement="top-start">
        <el-button @click.prevent="dialogShowSearchContent = true">{{$t('__filter')}}</el-button>
      </el-tooltip>
      </search-button>
    </el-button-group>
    <el-table
      :data="originData"
      stripe
      border
      :span-method="objectSpanMethod"
      :height="tableHeight"
      :row-class-name="tableRowClassName"
      style="width: 100%">
        <el-table-column
          prop="OrderID"
          :label="this.$t('__orderID')">
          <template slot-scope="scope">
            <h3>{{scope.row[scope.column.property]}}</h3>
            <el-button
              v-if="buttonsShowUser.edit && scope.row.FlagReNew === 1"
              size="mini" type="success"
              @click.native.stop="operateRenew(scope.$index, scope.row, 'anzaRenew')">{{$t('__anzaRenew')}}</el-button>
            <el-button
              v-if="buttonsShowUser.edit && scope.row.FlagExtend === 1"
              size="mini" type="success"
              @click.native.stop="operateRenew(scope.$index, scope.row, 'anzaExtend')">{{$t('__anzaExtend')}}</el-button>
            <el-button
              v-if="buttonsShowUser.edit && scope.row.FlagTransfer === 1"
              size="mini"
              @click.native.stop="operateRenew(scope.$index, scope.row, 'anzaTransfer')">{{$t('__anzaTransfer')}}</el-button>
            <el-button
              v-if="buttonsShowUser.edit"
              size="mini"
              @click.native.stop="operateRenew(scope.$index, scope.row, 'anzaInherit')">{{$t('__anzaInherit')}}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          width="100px">
          <template slot="header">
            <el-button
            type="text"
            size="mini" @click.prevent="openSignOffManual">{{$t('__anzaOperation')}}</el-button>
          </template>
          <template slot-scope="scope">
            <el-button
              v-if="buttonsShowUser.edit && scope.row.Status === '1'"
              size="mini"
              type="primary"
              @click.native.stop="operateAnza(scope.$index, scope.row)">{{$t('__anza')}}</el-button>
            <el-button
              v-if="buttonsShowUser.edit && scope.row.Status === '2'"
              size="mini" type="success"
              @click.native.stop="operateComplete(scope.$index, scope.row)">{{$t('__yuanman')}}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="StatusName"
          :label="this.$t('__status')"
          width="100px">
        </el-table-column>
        <el-table-column
          prop="AnzaOrderID"
          :label="this.$t('__anzaOrder')">
        </el-table-column>
        <el-table-column
          prop="CustomerName"
          :label="this.$t('__anzaCustomer')">
        </el-table-column>
        <el-table-column
          prop="StorageID"
          :label="this.$t('__anzaStorageID')">
        </el-table-column>
        <el-table-column
          prop="ExpirationDate"
          :label="this.$t('__expire') + this.$t('__date')"
          :formatter="formatterDate">
        </el-table-column>
        <el-table-column>
          <template slot="header">
            {{$t('__scheduled')+$t('__anza')+$t('__date')}}<br/>{{$t('__real')+$t('__anza')+$t('__date')}}
          </template>
          <template slot-scope="scope">
            {{formatterDate(null,null,scope.row.ScheduledDate,null)}}<br/>
            <span v-if="scope.row.RealDate !== null">{{formatterDate(null,null,scope.row.RealDate,null)}}</span>
            <template v-else>
              <el-tag type="danger" effect="dark" v-if="scope.row.FlagAnza === 1">{{$t('__notAnza')}}</el-tag>
              <el-tag type="warning" effect="plain" v-else>{{$t('__notAnza')}}</el-tag>
            </template>
          </template>
        </el-table-column>
    </el-table>
    <!-- 分頁 -->
    <el-pagination
      background
      v-if="originData.length>0"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagination.currentPage"
      :page-sizes="pagination.pageSizeList"
      :page-size="pagination.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pagination.totalCount">
    </el-pagination>
    <!-- 安座作業 -->
    <operate-anza-mode
      v-if="dialogShowAnza"
      :dialog-show="dialogShowAnza"
      :operateType="operateType"
      :fromAnzaOrder="anzaOrder"
      @dialog-cancel="dialogCancel"
      @dialog-save="dialogSave"
      ></operate-anza-mode>
    <!-- 進階查詢選項 -->
    <orders-search-content
      :dialogShow="dialogShowSearchContent"
      :fromContent="searchContent"
      @dialog-save="dialogShowSearchContentSave"></orders-search-content>
  </div>
</template>

<script>
import operateAnzaMode from './components/anza/operateAnza'
import searchButton from '@/components/searchButton'
import ordersSearchContent from './components/ordersSearchContent'
import { formatDate } from '@/setup/format.js'

export default {
  name: 'AnzaOrderShow',
  components: {
    operateAnzaMode,
    searchButton,
    ordersSearchContent
  },
  data () {
    return {
      dialogType: 'new',
      dialogShow: false,
      dialogShowAnza: false,
      originData: [],
      anzaOrder: {},
      operateType: '', // 安座單操作類型
      searchContent: { // 搜尋
        searchKeyWord: '',
        OrdersType: [],
        StatusType: [],
        selectedOrdersType: [],
        selectedStatusType: [],
        StartDate: new Date(),
        EndDate: new Date()
      },
      tableHeight: (screen.height * 7 / 9), // Table高度
      pagination: { // 分頁
        currentPage: 1,
        pageSizeList: [20, 30, 50],
        pageSize: 20
      },
      tableSpanList: [],
      sortable: {
        orderByList: [{ ID: 'OrderID', Value: this.$t('__orderID') }, { ID: 'AnzaOrderID', Value: this.$t('__anzaOrder') }], // 排序
        orderBy: 'desc', // 排序方式
        orderByValue: 'OrderID' // 預設排序欄位
      },
      // 使用者能看到的權限
      buttonsShowUser: {
        new: 1,
        edit: 1,
        save: 1,
        delete: 1,
        search: 1
      },
      // 查詢區塊
      dialogShowSearchContent: false,
      // 以下為下拉式選單專用
      ddlCompanies: []
    }
  },
  mounted () {
    // 預設值
    let start = new Date()
    let end = new Date()
    let year = start.getFullYear()
    let month = start.getMonth() - 6
    start = new Date(year, month, 1, 12)
    this.searchContent.StartDate = start.toISOString().slice(0, 10)
    this.searchContent.EndDate = end.toISOString().slice(0, 10)

    // 使用者權限
    this.userPermission()

    // 帶入搜尋內容
    this.preLoading()

    // 帶入舊有分頁內容
    if (localStorage.getItem('paginationHistory:' + this.$route.name) === null) {
      // 儲存內容
      localStorage.setItem('paginationHistory:' + this.$route.name, JSON.stringify(this.pagination))
    } else {
      let pagination = JSON.parse(localStorage.getItem('paginationHistory:' + this.$route.name))
      this.pagination.currentPage = pagination.currentPage
      this.pagination.pageSize = pagination.pageSize
    }
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

      if (localStorage.getItem('searchHistory:' + this.$route.name) === null) {
        // 預設全選
        this.searchContent.OrdersType.forEach(item => {
          this.searchContent.selectedOrdersType.push(item.Prefix)
        })
        this.searchContent.StatusType.forEach(item => {
          this.searchContent.selectedStatusType.push(item.Status)
        })
      } else {
        let oldSearchContent = JSON.parse(localStorage.getItem('searchHistory:' + this.$route.name))
        this.searchContent.selectedOrdersType = oldSearchContent.selectedOrdersType
        this.searchContent.selectedStatusType = oldSearchContent.selectedStatusType
      }

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
    dialogCancel: function () {
      this.dialogShow = false
      this.dialogShowAnza = false
    },
    dialogSave: function () {
      this.dialogShow = false
      this.dialogShowAnza = false
      this.preLoading()
    },
    // 關閉進階搜尋
    dialogShowSearchContentSave: function (fromContent) {
      this.dialogShowSearchContent = false
      this.search()
    },
    // 搜尋
    search: async function (value) {
      if (value !== undefined) {
        this.searchContent.searchKeyWord = value
      }
      let response2 = await this.$api.orders.anzaOrderShow2({
        searchContent: JSON.stringify(this.searchContent),
        pagination: JSON.stringify(this.pagination),
        sortable: JSON.stringify(this.sortable),
        ID: this.$store.state.userID })
      this.originData = response2.data.result

      // 儲存內容
      localStorage.setItem('searchHistory:' + this.$route.name, JSON.stringify(this.searchContent))

      if (this.originData.length > 0) {
        // 分頁篩選
        let fromPagination = JSON.parse(this.originData[0].pagination)[0]
        this.pagination.totalCount = fromPagination.totalCount
        this.pagination.totalPage = fromPagination.totalPage
        this.pagination.currentPage = fromPagination.currentPage
        this.savePaginationData()
      } else {
        this.pagination.totalCount = 0
        this.pagination.totalPage = 0
        this.pagination.currentPage = 1
        this.savePaginationData()
      }

      this.pageChange(this.originData)
    },
    // 排序相關
    reOrder: function (searchButtonResult) {
      this.sortable.orderBy = searchButtonResult.orderBy
      this.sortable.orderByValue = searchButtonResult.orderByValue
    },
    // ===== 分頁相關 =====
    handleSizeChange: function (val) {
      this.pagination.pageSize = val
      this.savePaginationData()
      this.search()
    },
    handleCurrentChange: function (val) {
      this.pagination.currentPage = val
      this.savePaginationData()
      this.search()
    },
    savePaginationData: function () {
      // 儲存內容
      localStorage.setItem('paginationHistory:' + this.$route.name, JSON.stringify(this.pagination))
    },
    pageChange: function (refTable) {
      // table span
      this.tableSpanList = []
      refTable.forEach(row => {
        let findObject = this.tableSpanList.find(row2 => { return row2.SpanID === row.OrderID })
        if (findObject === undefined) {
          let firstIndex = refTable.findIndex(row3 => row3.OrderID === row.OrderID)
          this.tableSpanList.push({
            SpanID: row.OrderID,
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
        let findObject = this.tableSpanList.find(item => { return item.SpanID === row.row.OrderID })
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
    },
    // 開啟 簽核說明
    openSignOffManual: function () {
      this.$router.push({
        name: 'OrderSignOffManual',
        params: {
          orderType: 'anzaOrder',
          parent: 'AnzaOrderShow'
        }
      })
    },
    // ===== 安座單 =====
    // 開啟 安座作業
    operateAnza: function (index, row) {
      this.anzaOrder = row
      this.operateType = 'anza'
      this.dialogShowAnza = true
    },
    // 開啟 圓滿作業
    operateComplete: function (index, row) {
      this.anzaOrder = row
      this.operateType = 'complete'
      this.dialogShowAnza = true
    },
    // 續約, 移到訂單新增
    operateRenew: async function (index, row, operateType) {
      this.anzaOrder = row

      // 以下抄襲orders.vue

      // 使用者權限
      let mybuttonsShowUser = {
        new: 0,
        edit: 0,
        save: 0,
        delete: 0,
        search: 0
      }
      let progPermission = this.$store.state.userProg.filter(item => { return item.Path === '/Orders/Orders' })[0]
      mybuttonsShowUser.new = progPermission.fun1
      mybuttonsShowUser.edit = progPermission.fun2
      mybuttonsShowUser.save = progPermission.fun2
      mybuttonsShowUser.delete = progPermission.fun3

      // 取得可以用的選單
      let responseRow = await this.$api.orders.getObject({ type: 'orderHead', keyword: row.OrderID })
      let myOrder = responseRow.data.result[0]
      // 以上抄襲orders.vue

      // 整理待移轉的安座單list
      let findAnzaList = this.originData.filter(item => { return item.OrderID === row.OrderID })

      // 進入新增
      this.$router.push({
        name: 'AnzaOrderRenew',
        params: {
          dialogType: 'new',
          order: {},
          parent: 'AnzaOrderShow',
          buttonsShowUser: mybuttonsShowUser,
          fromParams: {
            fromType: operateType,
            fromOrder: myOrder,
            fromAnzaList: findAnzaList
          }
        }
      })
    }
  }
}
</script>
