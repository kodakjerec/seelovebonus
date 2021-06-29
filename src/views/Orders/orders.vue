<template>
  <el-form>
    <el-button-group class="defineCSS_LeftButtons">
      <el-button v-show="buttonsShowUser.new" @click.prevent="orderTransfer">{{$t('__orderTransfer')}}</el-button>
    </el-button-group>
    <el-button-group style="padding-bottom: 5px">
      <el-button class="hideButton" icon="el-icon-more"><!-- 排版用,避免沒按鈕跑版 --></el-button>
      <el-button v-show="buttonsShowUser.new" type="primary" icon="el-icon-plus" @click.prevent="showForm('new')">{{$t('__new')}}</el-button>
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
      :height="tableHeight"
      @row-click="handleClick"
      :row-class-name="tableRowClassName"
      @header-click="tableHeaderClick"
      style="width: 100%">
      <el-table-column
        align="left"
        width="160px">
        <template slot="header">
          <el-button
            v-show="buttonsShowUser.delete"
            type="text"
            size="mini"
            @click.prevent="openSignOffManual">{{$t('__signOffSettings')}}</el-button>
          <br/>{{$t('__batch')+$t('__signOff')}}
          <br/>
          <el-button size="mini" @click.prevent="batchSignOffAgree()">{{$t('__signOffAgree')}}</el-button>
          <el-button size="mini" @click.prevent="batchSignOffDeny()">{{$t('__signOffDeny')}}</el-button>
        </template>
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click.stop="openSignOffLog(scope.row)">{{$t('__signOffLog')}}</el-button>
          <br/>
          <el-button v-show="scope.row.StatusSignOff === 1" size="mini" type="primary" @click.stop="signOffAgree(scope.$index, scope.row)">{{$t('__signOffAgree')}}</el-button>
          <el-button v-show="scope.row.StatusSignOff === 1" size="mini" type="danger" @click.stop="signOffDeny(scope.$index, scope.row)">{{$t('__signOffDeny')}}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="ID">
        <template slot="header">
          {{$t('__orderID')}}
          <table-sort-arrow :prop="'ID'" :sortable="sortable"></table-sort-arrow>
          <br/>{{$t('__project')+$t('__name')}}<br/>{{$t('__status')}}
        </template>
        <template slot-scope="scope">
          <div style="font-weight:1000">{{scope.row.ID}}</div>
          {{scope.row.ProjectName}}<br/>{{scope.row.StatusName}}
        </template>
      </el-table-column>
      <el-table-column
        prop="CustomerName">
        <template slot="header">
          {{$t('__customer')+$t('__name')}}
          <table-sort-arrow :prop="'CustomerName'" :sortable="sortable"></table-sort-arrow>
          <br/>{{$t('__referrer')+'/'+$t('__company')}}
        </template>
        <template slot-scope="scope">
          {{scope.row.CustomerName}}<br/>{{scope.row.ReferrerName+'/'+scope.row.CompanyName}}
        </template>
      </el-table-column>
      <el-table-column
        prop="OrderDate">
        <template slot="header">
          {{$t('__order')+$t('__date')}}
          <table-sort-arrow :prop="'OrderDate'" :sortable="sortable"></table-sort-arrow>
          <br/>{{$t('__amount')}}
        </template>
        <template slot-scope="scope">
          {{formatterDate(null,null,scope.row.OrderDate,null)}}<br/>
          {{formatterMoney(null,null,scope.row.Amount,null)}}<br/>
          <el-tag v-if="scope.row.Amount!==scope.row.InstallmentAmount" type="danger">{{$t('__orderDetailNotEqualInstallmentDetail')}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column>
        <template slot="header">
          {{$t('__notReceived')}}<br/>{{$t('__haveReceived')}}<br/>{{$t('__invoice')+$t('__amount')}}
        </template>
        <template slot-scope="scope">
          {{formatterMoneyUS(null,null,scope.row.InstallmentAmount-scope.row.CollectionsAmount,null)}}<br/>{{formatterMoneyUS(null,null,scope.row.CollectionsAmount,null)}}<br/>{{formatterMoneyUS(null,null,scope.row.InvoicesAmount,null)}}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('__certificate1')">
        <template slot-scope="scope">
          <div v-for="item in scope.row.Certificate1List" :key="item.Certificate1">
            {{item.Certificate1}}<template v-if="item['Status']==='0'">(停用)</template>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('__certificate2')">
        <template slot-scope="scope">
          <div v-for="item in scope.row.Certificate2List" :key="item.Certificate2">
            {{item.Certificate2}}<template v-if="item['Status']==='0'">(停用)</template>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('__invoice')">
        <template slot-scope="scope">
          <div v-for="item in scope.row.InvoiceList" :key="item.InvoiceID">
            {{item.InvoiceID | VMask('AA-########')}}
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分頁 -->
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagination.currentPage"
      :page-sizes="pagination.pageSizeList"
      :page-size="pagination.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pagination.totalCount">
    </el-pagination>
    <!-- 簽核小視窗 -->
    <sign-off-dialog
      :dialogShow="dialogShowSignOff"
      :signOffList="signOffList"
      :signOffChoice="signOffChoice"
      @finish="signOffFinish"
      @cancel="signOffCancel"></sign-off-dialog>
    <!-- 進階查詢選項 -->
    <orders-search-content
      :dialogShow="dialogShowSearchContent"
      :fromContent="searchContent"
      @dialog-save="dialogShowSearchContentSave"></orders-search-content>
  </el-form>
</template>

<script>
import searchButton from '@/components/searchButton'
import signOffDialog from './components/signOff/signOffDialog'
import ordersSearchContent from './components/ordersSearchContent'
import { formatMoney, formatDate } from '@/setup/format.js'
import tableSortArrow from './components/tableSortArrow'

export default {
  name: 'Orders',
  components: {
    searchButton,
    signOffDialog,
    ordersSearchContent,
    tableSortArrow
  },
  data () {
    return {
      originData: [],
      order: {},
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
        pageSize: 20,
        pageSizeList: [20, 30, 50],
        totalPage: 1,
        totalCount: 20
      },
      sortable: { // 排序
        orderBy: 'desc', // 排序方式
        orderByValue: 'ID' // 預設排序欄位
      },
      // 使用者能看到的權限
      buttonsShowUser: {
        new: 0,
        edit: 0,
        save: 0,
        delete: 0,
        search: 0
      },
      // 簽核
      dialogShowSignOff: false,
      signOffList: [],
      signOffChoice: 0,
      // 查詢區塊
      dialogShowSearchContent: false
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
    formatterMoney: function (row, column, cellValue, index) {
      return formatMoney(cellValue)
    },
    formatterMoneyUS: function (row, column, cellValue, index) {
      return formatMoney(cellValue, 'US')
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

      if (localStorage.getItem('searchHistory:' + this.$route.name) !== null) {
        let oldSearchContent = JSON.parse(localStorage.getItem('searchHistory:' + this.$route.name))
        this.searchContent.selectedOrdersType = oldSearchContent.selectedOrdersType
        this.searchContent.selectedStatusType = oldSearchContent.selectedStatusType
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
    // 點選訂單編號
    handleClick: async function (row, column, event) {
      if (!row.ID) {
        return
      }
      // 取得可以用的選單
      let responseRow = await this.$api.orders.getObject({ type: 'orderHead', keyword: row.ID })
      this.order = responseRow.data.result[0]

      // 簽核管理
      if (row.StatusSignOff === 0) {
        this.buttonsShowUser.new = 0
        this.buttonsShowUser.edit = 0
        this.buttonsShowUser.save = 0
        this.buttonsShowUser.delete = 0
      }
      // 權限管理
      this.buttonsShowUser.save = this.buttonsShowUser.edit

      // 進入修改
      this.$router.push({
        name: 'OrderNewForm',
        params: {
          dialogType: 'edit',
          order: this.order,
          parent: 'Orders',
          buttonsShowUser: this.buttonsShowUser
        }
      })
    },
    // 開啟表單
    showForm: function (eventType) {
      // 權限管理
      this.buttonsShowUser.save = this.buttonsShowUser.new

      this.$router.push({
        name: 'OrderNewForm',
        params: {
          dialogType: eventType,
          order: this.order,
          parent: 'Orders',
          buttonsShowUser: this.buttonsShowUser
        }
      })
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

      let response2 = await this.$api.orders.ordersShow({
        searchContent: JSON.stringify(passSearchContent),
        pagination: JSON.stringify(this.pagination),
        sortable: JSON.stringify(passSortable),
        ID: this.$store.state.userID })
      this.originData = response2.data.result

      // 儲存內容
      localStorage.setItem('searchHistory:' + this.$route.name, JSON.stringify(this.searchContent))

      if (this.originData.length > 0) {
        // 重構cer1,cer2清單
        this.originData.forEach(item => {
          if (item.Certificate1List) { item.Certificate1List = JSON.parse(item.Certificate1List) }
          if (item.Certificate2List) { item.Certificate2List = JSON.parse(item.Certificate2List) }
          if (item.InvoiceList) { item.InvoiceList = JSON.parse(item.InvoiceList) }
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
    },
    // 變更排序
    tableHeaderClick: function (column, event) {
      if (column.property) {
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
      }
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
    // 簽核相關
    // 送簽
    signOffAgree: function (index, row) {
      this.signOffList.push({
        OrderID: row.ID,
        Type: 'order',
        Prefix: row.Prefix,
        Status: row.Status
      })
      this.signOffChoice = 1
      this.dialogShowSignOff = true
    },
    // 否決
    signOffDeny: function (index, row) {
      this.signOffList.push({
        OrderID: row.ID,
        Type: 'order',
        Prefix: row.Prefix,
        Status: row.Status
      })
      this.signOffChoice = 0
      this.dialogShowSignOff = true
    },
    // 批次送簽
    batchSignOffAgree: function () {
      this.originData.filter(row => { return row.StatusSignOff === 1 })
        .forEach(row => {
          this.signOffList.push({
            OrderID: row.ID,
            Type: 'order',
            Prefix: row.Prefix,
            Status: row.Status
          })
        })
      this.signOffChoice = 1
      this.dialogShowSignOff = true
    },
    // 批次否決
    batchSignOffDeny: function () {
      this.originData
        .filter(row => { return row.StatusSignOff === 1 })
        .forEach(row => {
          this.signOffList.push({
            OrderID: row.ID,
            Type: 'order',
            Prefix: row.Prefix,
            Status: row.Status
          })
        })
      this.signOffChoice = 0
      this.dialogShowSignOff = true
    },
    // 關閉 批次視窗
    signOffFinish: function () {
      this.signOffList = []
      this.dialogShowSignOff = false
      this.preLoading()
    },
    // 取消 批次視窗
    signOffCancel: function () {
      this.signOffList = []
      this.dialogShowSignOff = false
    },
    // 開啟 簽核說明
    openSignOffManual: function () {
      this.$router.push({
        name: 'OrderSignOffManual',
        params: {
          orderType: 'order',
          parent: 'Orders'
        }
      })
    },
    // 開啟 簽核歷程
    openSignOffLog: function (row) {
      this.$router.push({
        name: 'OrderSignOffLog',
        params: {
          ID: row.ID,
          parent: 'Orders'
        }
      })
    },
    // 過戶
    // 過戶按鈕
    orderTransfer: function () {
      this.$router.push({
        name: 'OrderTransfer',
        params: {
          dialogType: 'edit',
          parent: 'Orders'
        }
      })
    }
  }
}
</script>
