<template>
  <div>
    <el-button-group style="padding-bottom: 5px">
      <el-button class="hideButton" icon="el-icon-more"><!-- 排版用,避免沒按鈕跑版 --></el-button>
      <search-button @search="search">
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
      @header-click="tableHeaderClick"
      style="width: 100%">
        <el-table-column
          prop="OrderID">
          <template slot="header">
            {{$t('__orderID')}}
            <table-sort-arrow :prop="'OrderID'" :sortable="sortable"></table-sort-arrow>
          </template>
          <template slot-scope="scope">
            <div style="font-weight:1000">{{scope.row[scope.column.property]}}</div>
            <div>{{scope.row.ProjectName}}</div>
            <el-button-group>
              <el-button
                v-if="buttonsShowUser.edit && scope.row.FlagRenew === 1"
                size="mini" type="info"
                @click.native.stop="operateRenew(scope.$index, scope.row, 'anzaRenew')">{{$t('__anzaRenew')}}</el-button>
              <el-button
                v-if="buttonsShowUser.edit && scope.row.FlagExtend === 1"
                size="mini" type="info"
                @click.native.stop="operateRenew(scope.$index, scope.row, 'anzaExtend')">{{$t('__anzaExtend')}}</el-button>
              <el-button
                v-if="buttonsShowUser.edit && scope.row.FlagTransfer === 1"
                size="mini"
                @click.native.stop="operateRenew(scope.$index, scope.row, 'anzaTransfer')">{{$t('__anzaTransfer')}}</el-button>
              <el-button
                v-if="buttonsShowUser.edit"
                size="mini"
                @click.native.stop="operateRenew(scope.$index, scope.row, 'anzaInherit')">{{$t('__anzaInherit')}}</el-button>
            </el-button-group>
          </template>
        </el-table-column>
        <el-table-column
          width="130px">
          <template slot-scope="scope">
          <div v-for="item in scope.row.OrderIDList" :key="item.OrderID">
              {{item.OrderID}}<template v-if="item.ModifyType!==''">{{'('+item.ModifyType+')'}}</template>
            </div>
          </template>
        </el-table-column>
        <!-- 安座作業 -->
        <el-table-column
          width="160px">
          <template slot="header">
            <el-button
            type="text"
            size="mini" @click.prevent="openSignOffManual">{{$t('__anzaOperation')}}</el-button>
          </template>
          <template slot-scope="scope">
            <el-button
              v-if="buttonsShowUser.edit && scope.row.canAnza === 1"
              size="mini"
              @click.native.stop="operateModify(scope.$index, scope.row)">{{$t('__edit')}}</el-button>
            <el-button
              v-if="buttonsShowUser.edit && scope.row.canAnza === 1"
              size="mini" type="primary"
              @click.native.stop="operateAnza(scope.$index, scope.row)">{{$t('__anza')}}</el-button>
            <el-button
              v-if="buttonsShowUser.edit && scope.row.Status === '2'"
              size="mini"
              @click.native.stop="operateComplete(scope.$index, scope.row)">{{$t('__yuanman')}}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="AnzaOrderID"
          width="100px">
          <template slot="header">
            {{$t('__anzaOrder')}}
            <table-sort-arrow :prop="'AnzaOrderID'" :sortable="sortable"></table-sort-arrow>
            <br/>{{$t('__status')}}
          </template>
          <template slot-scope="scope">
            {{scope.row.AnzaOrderID}}<br/>{{scope.row.StatusName}}
          </template>
        </el-table-column>
        <!-- 安座位別 -->
        <el-table-column
          prop="CustomerName">
          <template slot="header">
            {{$t('__anzaCustomer')}}
            <table-sort-arrow :prop="'CustomerName'" :sortable="sortable"></table-sort-arrow>
            <br/>{{$t('__anzaStorageID')}}
          </template>
          <template slot-scope="scope">
            {{scope.row.CustomerName}}<br/>
            <span v-if="scope.row.Status==='2'">{{scope.row.StorageID}}</span>
            <span v-else style="text-decoration:line-through">{{scope.row.StorageID}}</span>
          </template>
        </el-table-column>
        <!-- 個資 -->
        <el-table-column>
          <template slot="header">
            {{$t('__gender')}}<br/>
            {{$t('__birth')+'('+$t('__solarCalendar')+')'}}<br/>
            {{$t('__lunarDate')+'('+$t('__lunarCalendar')+')'+' '+$t('__lunarTime')}}
          </template>
          <template slot-scope="scope">
            {{scope.row.GenderName}}<br/>
            {{scope.row.Birth}}<br/>
            {{scope.row.BirthLunarDate+' '+scope.row.BirthLunarTimeName}}
          </template>
        </el-table-column>
        <el-table-column>
          <template slot="header">
            {{$t('__tel')}}<br/>
            {{$t('__address')}}
          </template>
          <template slot-scope="scope">
            {{scope.row.Tel}}<br/>
            {{scope.row.Address}}
          </template>
        </el-table-column>
        <!-- 預定安座日 -->
        <el-table-column
          prop="ScheduledDate">
          <template slot="header">
            {{$t('__scheduled')+$t('__anza')+$t('__date')}}
            <table-sort-arrow :prop="'ScheduledDate'" :sortable="sortable"></table-sort-arrow>
            <br/>{{$t('__real')+$t('__anza')+$t('__date')}}
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
        <!-- 到期日期 -->
        <el-table-column
          prop="ExpirationDate"
          :formatter="formatterDate">
          <template slot="header">
            {{$t('__expire') + this.$t('__date')}}
            <table-sort-arrow :prop="'ExpirationDate'" :sortable="sortable"></table-sort-arrow>
          </template>
        </el-table-column>
        <el-table-column
          prop="CompleteDate"
          :formatter="formatterDate">
          <template slot="header">
            {{$t('__yuanman') + this.$t('__date')}}
            <table-sort-arrow :prop="'CompleteDate'" :sortable="sortable"></table-sort-arrow>
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
      @dialog-save="dialogShowSearchContentSave">
      <template slot="body">
        <el-divider>{{$t('__orderID')+$t('__function')}}</el-divider>
        <el-checkbox-group v-model="searchContent.selectedButton">
          <el-checkbox key="FlagRenew" label="FlagRenew">{{$t('__anzaRenew')}}</el-checkbox>
          <el-checkbox key="FlagExtend" label="FlagExtend">{{$t('__anzaExtend')}}</el-checkbox>
          <el-checkbox key="FlagTransfer" label="FlagTransfer">{{$t('__anzaTransfer')}}</el-checkbox>
        </el-checkbox-group>
      </template>
    </orders-search-content>
  </div>
</template>

<script>
import operateAnzaMode from './components/anza/operateAnza'
import searchButton from '@/components/searchButton'
import ordersSearchContent from './components/ordersSearchContent'
import { formatDate } from '@/setup/format.js'
import tableSortArrow from './components/tableSortArrow'

export default {
  name: 'AnzaOrderShow',
  components: {
    operateAnzaMode,
    searchButton,
    ordersSearchContent,
    tableSortArrow
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
        EndDate: new Date(),
        // 安座單特製
        selectedButton: []
      },
      tableHeight: (screen.height * 7 / 9), // Table高度
      pagination: { // 分頁
        currentPage: 1,
        pageSizeList: [20, 30, 50],
        pageSize: 20
      },
      tableSpanList: [],
      sortable: {
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
      let response = await this.$api.orders.anzaShowGroup()
      let filterSettings = response.data.result
      // 帶入數值
      this.searchContent.OrdersType = filterSettings.OrdersType
      this.searchContent.StatusType = filterSettings.StatusType

      if (localStorage.getItem('searchHistory:' + this.$route.name) !== null) {
        let oldSearchContent = JSON.parse(localStorage.getItem('searchHistory:' + this.$route.name))
        this.searchContent.selectedOrdersType = oldSearchContent.selectedOrdersType
        this.searchContent.selectedStatusType = oldSearchContent.selectedStatusType
        this.searchContent.selectedButton = oldSearchContent.selectedButton
        // 如果之前選項不在預設選項內, 移除
        this.searchContent.selectedOrdersType.forEach((item, index) => {
          let isItemExist = this.searchContent.OrdersType.find(item2 => { return item2.Prefix === item })
          if (isItemExist === undefined) {
            this.searchContent.selectedOrdersType.splice(index, 1)
          }
        })
        this.searchContent.selectedStatusType.forEach((item, index) => {
          let isItemExist = this.searchContent.StatusType.find(item2 => { return item2.Status === item })
          if (isItemExist === undefined) {
            this.searchContent.selectedStatusType.splice(index, 1)
          }
        })
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
      // 精簡查詢內容
      let passSearchContent = JSON.parse(JSON.stringify(this.searchContent))
      delete passSearchContent.OrdersType
      delete passSearchContent.StatusType
      let passSortable = JSON.parse(JSON.stringify(this.sortable))

      let response2 = await this.$api.orders.anzaOrderShow2({
        searchContent: JSON.stringify(passSearchContent),
        pagination: JSON.stringify(this.pagination),
        sortable: JSON.stringify(passSortable),
        ID: this.$store.state.userID })
      this.originData = response2.data.result

      // 儲存內容
      localStorage.setItem('searchHistory:' + this.$route.name, JSON.stringify(this.searchContent))

      if (this.originData.length > 0) {
        // 重構清單
        this.originData.forEach(row => {
          if (row.OrderIDList) {
            row.OrderIDList = JSON.parse(row.OrderIDList)
          }
          if (row.Birth) {
            row.Birth = row.Birth.slice(0, 10)
          }
          if (row.BirthLunarDate) {
            row.BirthLunarDate = row.BirthLunarDate.slice(0, 10)
          }
        })

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
    // 變更排序
    tableHeaderClick: function (column, event) {
      if (this.sortable.orderByValue !== column.property) {
        this.sortable.orderByValue = column.property
        this.sortable.orderBy = 'desc'
      } else {
        if (this.sortable.orderBy === 'asc') {
          this.sortable.orderBy = 'desc'
        } else {
          this.sortable.orderBy = 'asc'
        }
      }
      this.search()
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
    // 開啟 修改作業
    operateModify: function (index, row) {
      this.anzaOrder = row
      this.operateType = 'modify'
      this.dialogShowAnza = true
    },
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

      // 等等會用到的OrderID, 都是最新的契約單號
      let myOrderID = row.OrderIDList[row.OrderIDList.length - 1].OrderID

      // 取得可以用的選單
      let responseRow = await this.$api.orders.getObject({ type: 'orderHead', keyword: myOrderID })
      let myOrder = responseRow.data.result[0]
      // 以上抄襲orders.vue

      // 整理待移轉的安座單list
      let findAnzaList = this.originData.filter(item => { return item.OrderID === row.OrderID })

      switch (operateType) {
        case 'anzaRenew':
        case 'anzaExtend':
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
          break
        case 'anzaTransfer':
        case 'anzaInherit':
          // 進入新增
          this.$router.push({
            name: 'AnzaOrderRenew',
            params: {
              dialogType: 'edit',
              order: myOrder,
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
}
</script>
