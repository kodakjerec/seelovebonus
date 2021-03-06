<template>
  <el-form>
    <el-button-group style="padding-bottom: 5px">
      <el-button class="hideButton" icon="el-icon-more"><!-- 排版用,避免沒按鈕跑版 --></el-button>
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
        :label="$t('__company')+$t('__id')">
        <template slot-scope="scope">
          {{scope.row.ID}}
          <el-tag
            v-show="scope.row.DefaultCompanyID === '1'"
            :type="scope.row.DefaultCompanyID === '1' ? 'primary' : 'success'"
            disable-transitions>{{$t('__default')}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="Name"
        :label="$t('__company')+$t('__name')">
      </el-table-column>
      <el-table-column
        prop="Nickname"
        :label="$t('__nickname')">
      </el-table-column>
      <el-table-column
        prop="Principal"
        :label="$t('__principal')">
      </el-table-column>
      <el-table-column
        prop="EmployeeName"
        :label="$t('__refEmployeeID')">
      </el-table-column>
      <el-table-column
        prop="StartDate"
        :label="$t('__startDate')"
        :formatter="formatterDate">
      </el-table-column>
      <el-table-column
        prop="EndDate"
        :label="$t('__endDate')"
        :formatter="formatterDate">
      </el-table-column>
      <el-table-column
        prop="RefferIDName"
        :label="$t('__sponsor')">
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
    :company="company"
    :buttonsShowUser="buttonsShowUser"
    @dialog-cancel="dialogCancel"
    @dialog-save="dialogSave"></new-form>
  </el-form>
</template>

<script>
import searchButton from '@/components/searchButton'
import newForm from './components/companyNewForm'
import { formatDate } from '@/setup/format.js'

export default {
  name: 'Companies',
  components: {
    searchButton,
    newForm
  },
  data () {
    return {
      dialogType: 'new',
      dialogShow: false,
      originData: [],
      results: [],
      company: {},
      searchKeyWord: '',
      tableHeight: (screen.height * 7 / 9),
      pagination: {
        currentPage: 1,
        pageSizeList: [20, 30, 50],
        pageSize: 20
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
      let responseRow = await this.$api.basic.getObject({ type: 'company', keyword: row.ID })
      this.company = responseRow.data.result[0]

      // 權限管理
      this.buttonsShowUser.save = this.buttonsShowUser.edit

      // 進入修改
      this.dialogType = 'edit'
      this.dialogShow = true
    },
    // 開啟表單
    showForm: function (eventType) {
      // 權限管理
      this.buttonsShowUser.save = this.buttonsShowUser.new

      this.dialogType = eventType
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
      let response2 = await this.$api.basic.companiesShow({ keyword: this.searchKeyWord })
      this.originData = response2.data.result

      this.pageChange()
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
    pageChange: function () {
      this.results = this.originData.slice((this.pagination.currentPage - 1) * this.pagination.pageSize, this.pagination.pageSize * this.pagination.currentPage)
    }
  }
}
</script>
