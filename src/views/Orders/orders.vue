<template>
  <el-form>
    <el-button-group style="padding-bottom: 5px">
      <el-button v-show="buttonsShowUser.new" type="primary" icon="el-icon-plus" @click.prevent="showForm('new')">{{$t('__new')}}</el-button>
      <search-button :options="sortable.orderByList" :originOrderBy="sortable.orderBy" :originOrderByValue="sortable.orderByValue" @search="search" @reOrder="reOrder">
      <el-tooltip slot="body" effect="light" :content="$t('__filter')" placement="top-start">
      <el-popover
        placement="top"
        v-model="searchContent.searchShowMore">
        <el-form-item :label="$t('__startDate')">
          <el-date-picker
            v-model="searchContent.StartDate"
            type="date"
            :placeholder="$t('__plzChoice')+$t('__startDate')"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('__endDate')">
          <el-date-picker
            v-model="searchContent.EndDate"
            type="date"
            :placeholder="$t('__plzChoice')+$t('__endDate')"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-button class="el-icon-s-operation" slot="reference"></el-button>
      </el-popover>
      </el-tooltip>
      </search-button>
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
        align="left"
        width="150px">
        <template slot="header">
          {{$t('__batch')}}<br/>
          <el-button
            size="mini"
            @click="batchSignOffAgree()">{{$t('__signOffAgree')}}</el-button>
          <el-button
            size="mini"
            @click="batchSignOffDeny()">{{$t('__signOffDeny')}}</el-button>
        </template>
        <template slot-scope="scope">
          <el-button
            v-show="scope.row.StatusSignOff === 1"
            size="mini"
            type="primary"
            @click.native.stop="signOffAgree(scope.$index, scope.row)">{{$t('__signOffAgree')}}</el-button>
          <el-button
            v-show="scope.row.StatusSignOff === 1"
            size="mini"
            type="danger"
            @click.native.stop="signOffDeny(scope.$index, scope.row)">{{$t('__signOffDeny')}}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="StatusName"
        :label="$t('__status')">
      </el-table-column>
      <el-table-column>
        <template slot="header">
          {{$t('__orderID')}}<br/>{{$t('__customer')+$t('__name')}}<br/>{{$t('__referrer')}}
        </template>
        <template slot-scope="scope">
          {{scope.row.ID}}<br/>{{scope.row.CustomerName}}<br/>{{scope.row.ReferrerName}}
        </template>
      </el-table-column>
      <el-table-column
        prop="OrderDate"
        :label="$t('__order')+$t('__date')"
        :formatter="formatterDate">
      </el-table-column>
      <el-table-column
        prop="Certificate1List"
        :label="$t('__certificate1')">
        <template slot-scope="scope">
          <div v-for="item in scope.row.Certificate1List" :key="item.Certificate1">
            {{item.Certificate1}}<template v-if="item['Status']==='0'">(停用)</template>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="Certificate2List"
        :label="$t('__certificate2')">
        <template slot-scope="scope">
          <div v-for="item in scope.row.Certificate2List" :key="item.Certificate2">
            {{item.Certificate2}}<template v-if="item['Status']==='0'">(停用)</template>
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
        prop="ProjectName"
        :label="$t('__project')+$t('__name')">
      </el-table-column>
      <el-table-column
        prop="Amount"
        :label="$t('__amount')"
        :formatter="formatterMoney"
        width="100px">
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
      :total="originData.length">
    </el-pagination>
    <!-- 簽核 -->
    <sign-off-dialog
      :dialogShow="dialogShowSignOff"
      :signOffList="signOffList"
      :signOffChoice="signOffChoice"
      @finish="signOffFinish"
      @cancel="signOffCancel"
    ></sign-off-dialog>
  </el-form>
</template>

<script>
import searchButton from '@/components/searchButton'
import signOffDialog from './components/signOffDialog'
import { formatMoney, formatDate } from '@/setup/format.js'

export default {
  name: 'Orders',
  components: {
    searchButton,
    signOffDialog
  },
  data () {
    return {
      originData: [],
      order: {},
      searchContent: { // 搜尋
        searchKeyWord: '',
        searchShowMore: false,
        StartDate: new Date(),
        EndDate: new Date()
      },
      tableHeight: (screen.height * 7 / 9), // Table高度
      pagination: { // 分頁
        currentPage: 1,
        pageSizeList: [10, 20, 30],
        pageSize: 10
      },
      sortable: { // 排序
        orderByList: [{ ID: 'ID', Value: this.$t('__orderID') }, { ID: 'OrderDate', Value: this.$t('__order') + this.$t('__date') }], // 排序
        orderBy: 'descending', // 排序方式
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
      // 簽核
      dialogShowSignOff: false,
      signOffList: [],
      signOffChoice: 0
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
        case 'descending':
          tempData = tempData.slice().reverse()
          break
      }

      // 切換分頁
      return tempData.slice((this.pagination.currentPage - 1) * this.pagination.pageSize, this.pagination.pageSize * this.pagination.currentPage)
    }
  },
  mounted () {
    // 預設值
    let start = new Date()
    let end = new Date()
    let year = start.getFullYear()
    let month = start.getMonth() - 3
    start = new Date(year, month, 1, 12)
    this.searchContent.StartDate = start.toISOString().slice(0, 10)
    this.searchContent.EndDate = end.toISOString().slice(0, 10)

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
      let responseRow = await this.$api.orders.getObject({ type: 'orderHead', ID: row.ID })
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
    // 搜尋
    search: async function (value) {
      this.searchContent.searchKeyWord = value
      const response2 = await this.$api.orders.ordersShow({
        keyword: this.searchContent.searchKeyWord,
        StartDate: this.searchContent.StartDate,
        EndDate: this.searchContent.EndDate,
        ID: this.$store.state.userID })
      this.originData = response2.data.result
      this.originData.forEach(item => {
        if (item.Certificate1List) { item.Certificate1List = JSON.parse(item.Certificate1List) }
        if (item.Certificate2List) { item.Certificate2List = JSON.parse(item.Certificate2List) }
        if (item.InvoiceList) { item.InvoiceList = JSON.parse(item.InvoiceList) }
      })
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
      this.search('')
    },
    // 取消 批次視窗
    signOffCancel: function () {
      this.signOffList = []
      this.dialogShowSignOff = false
    }
  }
}
</script>
