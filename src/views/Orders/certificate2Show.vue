<template>
  <div>
    <el-button-group>
      <el-button class="hideButton" type="info" icon="el-icon-printer"></el-button>
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
      :total="originData.length">
    </el-pagination>
    <new-form
      v-if="dialogShow"
      :dialog-type="dialogType"
      :dialog-show="dialogShow"
      :certificate2="certificate2"
      :orderID="orderID"
      :buttonsShowUser="buttonsShowUser"
      @dialog-cancel="dialogCancel()"
      @dialog-save="dialogSave()"></new-form>
  </div>
</template>

<script>
import newForm from './components/certificate2NewForm'
import searchButton from '@/components/searchButton'
import { formatDate } from '@/setup/format.js'

export default {
  name: 'Certificate2',
  components: {
    newForm,
    searchButton
  },
  data () {
    return {
      columns: [
        {
          header: this.$t('__orderID'),
          key: 'OrderID',
          width: 10
        },
        {
          header: this.$t('__certificate2'),
          key: 'Certificate2',
          width: 10
        },
        {
          header: this.$t('__printCount'),
          key: 'PrintCount',
          width: 10
        },
        {
          header: this.$t('__status'),
          key: 'StatusName',
          width: 10
        },
        {
          header: this.$t('__issuanceDate'),
          key: 'IssuanceDate',
          width: 30,
          formatter: 'date'
        }
      ],
      dialogType: 'new',
      dialogShow: false,
      originData: [],
      results: [],
      certificate2: {},
      orderID: '', // 顯示修改視窗使用, 避免紅字報錯
      searchKeyWord: '',
      tableHeight: (screen.height * 7 / 9),
      pagination: {
        currentPage: 1,
        pageSizeList: [10, 20, 30],
        pageSize: 20
      },
      // 以下為下拉式選單專用
      ddlCompanies: [],
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
      this.certificate2 = row

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
      const response2 = await this.$api.orders.certificate2Show({ keyword: this.searchKeyWord })
      this.originData = response2.data.result

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
