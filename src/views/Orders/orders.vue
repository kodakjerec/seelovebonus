<template>
  <el-form>
    <el-button-group style="padding-bottom: 5px">
      <el-button v-show="buttonsShowUser.new" type="primary" icon="el-icon-plus" @click.prevent="showForm('new')">{{$t('__new')}}</el-button>
      <search-button @search="search"></search-button>
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
            {{item.Certificate1}}<template v-if="item['Status']==='0'">(停用)</template>
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
      originData: [],
      results: [],
      order: {},
      searchKeyWord: '',
      tableHeight: (screen.height * 7 / 9),
      pagination: {
        currentPage: 1,
        pageSizeList: [10, 20, 30],
        pageSize: 10
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
      let responseRow = await this.$api.orders.getObject({ type: 'orderHead', ID: row.ID })
      this.order = responseRow.data.result[0]

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
      this.originData = response2.data.result
      this.originData.forEach(item => {
        if (item.Certificate1List) { item.Certificate1List = JSON.parse(item.Certificate1List) }
        if (item.Certificate2List) { item.Certificate2List = JSON.parse(item.Certificate2List) }
        if (item.InvoiceList) { item.InvoiceList = JSON.parse(item.InvoiceList) }
      })

      this.pageChange()
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
    pageChange: function () {
      this.results = this.originData.slice((this.pagination.currentPage - 1) * this.pagination.pageSize, this.pagination.pageSize * this.pagination.currentPage)
    }
  }
}
</script>

<style lang="scss" scoped>
.hideButton {
  visibility: hidden;
}
</style>
