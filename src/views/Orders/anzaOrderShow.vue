<template>
  <div>
    <el-button-group style="padding-bottom: 5px">
      <el-button class="hideButton" icon="el-icon-more"><!-- 排版用,避免沒按鈕跑版 --></el-button>
      <search-button :options="sortable.orderByList" :originOrderBy="sortable.orderBy" :originOrderByValue="sortable.orderByValue" @search="search" @reOrder="reOrder"></search-button>
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
          prop="OrderID"
          :label="this.$t('__orderID')">
        </el-table-column>
        <el-table-column
          :label="this.$t('__anzaOperation')">
          <template slot="header">
            <el-button
            type="text"
            size="mini" @click.prevent="openSignOffManual">{{$t('__signOffSettings')}}</el-button>
          </template>
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.Status === '1'"
              size="mini"
              type="primary"
              @click.native.stop="operateAnza(scope.$index, scope.row)">{{$t('__anza')}}</el-button>
            <el-button
              v-if="scope.row.Status === '2'"
              size="mini"
              type="success"
              @click.native.stop="operateComplete(scope.$index, scope.row)">{{$t('__yuanman')}}</el-button>
            <el-button
              v-if="scope.row.Status === '2' && scope.row.FlagReNew === 1"
              size="mini"
              @click.native.stop="operateComplete(scope.$index, scope.row)">{{$t('__reNew')}}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="StatusName"
          :label="this.$t('__status')">
        </el-table-column>
        <el-table-column
          prop="AnzaOrderID"
          :label="this.$t('__anzaOrder')">
        </el-table-column>
        <el-table-column
          prop="CustomerName"
          :label="this.$t('__customer')">
        </el-table-column>
        <el-table-column
          prop="StorageID"
          :label="this.$t('__storageAddress')">
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
              <el-tag type="danger" v-if="scope.row.FlagAnza === 1">{{$t('__notAnza')}}</el-tag>
              <el-tag type="warning" v-else>{{$t('__notAnza')}}</el-tag>
            </template>
          </template>
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
      :anzaOrder="anzaOrder"
      :orderID="orderID"
      :buttonsShowUser="buttonsShowUser"
      @dialog-cancel="dialogCancel"
      @dialog-save="dialogSave"></new-form>
    <!-- 安座作業 -->
    <operate-anza-mode
      :dialog-show="dialogShowAnza"
      :operateType="operateType"
      :fromAnzaOrder="anzaOrder"
      @dialog-cancel="dialogCancel"
      @dialog-save="dialogSave"
      ></operate-anza-mode>
  </div>
</template>

<script>
import newForm from './components/certificate1NewForm'
import operateAnzaMode from './anza/operateAnza'
import searchButton from '@/components/searchButton'
import { formatDate } from '@/setup/format.js'

export default {
  name: 'AnzaOrderShow',
  components: {
    newForm,
    operateAnzaMode,
    searchButton
  },
  data () {
    return {
      dialogType: 'new',
      dialogShow: false,
      dialogShowAnza: false,
      originData: [],
      anzaOrder: {},
      operateType: '', // 安座單操作類型
      searchContent: {
        searchKeyWord: ''
      },
      tableHeight: (screen.height * 7 / 9), // Table高度
      pagination: { // 分頁
        currentPage: 1,
        pageSizeList: [10, 20, 30],
        pageSize: 20
      },
      sortable: {
        orderByList: [{ ID: 'OrderID', Value: this.$t('__orderID') }, { ID: 'AnzaOrderID', Value: this.$t('__anzaOrder') }], // 排序
        orderBy: 'descending', // 排序方式
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
      // 以下為下拉式選單專用
      ddlCompanies: []
    }
  },
  computed: {
    results: function () {
      let tempData = this.originData

      // 排序依據
      switch (this.sortable.orderByValue) {
        case 'OrderID':
          tempData = tempData.slice().sort(function (x, y) {
            return x.OrderID - y.OrderID
          })
          break
        case 'AnzaOrderID':
          tempData = tempData.slice().sort(function (x, y) {
            return new Date(x.AnzaOrderID) - new Date(y.AnzaOrderID)
          })
          break
      }

      // 遞增/遞減
      switch (this.sortable.orderBy) {
        case 'descending':
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
      this.anzaOrder = row

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
      this.dialogType = 'edit'
      this.dialogShow = true
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
    // 搜尋
    search: async function (value) {
      this.searchContent.searchKeyWord = value
      let response2 = await this.$api.orders.anzaOrderShow({ keyword: this.searchContent.searchKeyWord })
      this.originData = response2.data.result

      this.pageChange()
    },
    // 排序相關
    reOrder: function (searchButtonResult) {
      this.sortable.orderBy = searchButtonResult.orderBy
      this.sortable.orderByValue = searchButtonResult.orderByValue
    },
    // 分頁相關
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
        let findObject = this.tableSpanList.find(row2 => { return row2.SpanID === row.OrderID })
        if (findObject === undefined) {
          let firstIndex = this.results.findIndex(row3 => row3.OrderID === row.OrderID)
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
    operateComplete: function (index, row) {
      this.anzaOrder = row
      this.operateType = 'complete'
      this.dialogShowAnza = true
    }
  }
}
</script>
