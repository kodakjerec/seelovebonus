<template>
  <el-form>
    <el-button-group>
      <el-button type="primary" icon="el-icon-plus" @click.prevent="showForm('new')">{{$t('__new')}}</el-button>
    </el-button-group>
    <search-button @search="search"></search-button>
    <p/>
    <el-table
      :data="companiesShow"
      stripe
      border
      @row-click="handleClick"
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
    <new-form
    v-if="dialogShow"
    :dialog-type="dialogType"
    :dialog-show="dialogShow"
    :company="company"
    @dialog-cancel="dialogCancel()"
    @dialog-save="dialogSave()"></new-form>
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
      companiesShow: [],
      company: {},
      searchKeyWord: ''
    }
  },
  mounted () {
    this.preLoading()
  },
  methods: {
    formatterDate: function (row, column, cellValue, index) {
      return formatDate(cellValue)
    },
    // 讀入系統清單
    preLoading: async function () {
      const response2 = await this.$api.basic.companiesShow({ keyword: this.searchKeyWord })
      this.companiesShow = response2.data.result
    },
    handleClick: async function (row, column, event) {
      // 取得可以用的選單
      let responseRow = await this.$api.basic.getObject({ type: 'company', ID: row.ID })
      this.company = responseRow.data.result[0]

      // 進入修改
      this.dialogType = 'edit'
      this.dialogShow = true
    },
    // 開啟表單
    showForm: function (eventType) {
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
      const response2 = await this.$api.basic.companiesShow({ keyword: this.searchKeyWord })
      this.companiesShow = response2.data.result
    }
  }
}
</script>
