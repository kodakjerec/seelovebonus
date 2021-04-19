<template>
  <div>
    <el-divider>{{$t('__orderID')+$t('__prefix')}}</el-divider>
    <el-checkbox-group v-model="searchContent.selectedOrdersType">
      <el-checkbox v-for="item in searchContent.OrdersType"
        :key="item.Prefix"
        :label="item.Prefix">{{item.Prefix+'('+item.Qty+')'}}</el-checkbox>
    </el-checkbox-group>
    <el-divider>{{$t('__date')}}</el-divider>
    <el-form label-width="10vw" label-position="right">
      <el-form-item :label="$t('__startDate')">
        <el-col :span="8">
          <el-date-picker
            v-model="searchContent.StartDate"
            :placeholder="$t('__plzChoice')+$t('__startDate')"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-col>
        <el-col :span="2">
          <span>{{$t('__endDate')}}</span>
        </el-col>
        <el-col :span="8">
          <el-date-picker
            v-model="searchContent.EndDate"
            :placeholder="$t('__plzChoice')+$t('__endDate')"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item :label="$t('__companies')+$t('__id')">
        <el-col :span="8">
          <el-select v-model="searchContent.CompanyID" filterable :placeholder="$t('__plzChoice')" @change="ddlCompaniesChange">
            <el-option v-for="item in ddlCompanies" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
              <span style="float: left">{{ item.Value }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
            </el-option>
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button v-show="buttonsShowUser.edit" type="primary" icon="el-icon-printer" @click.prevent="print">{{$t('__print')}}</el-button>
      </el-form-item>
    </el-form>
    <iframeReportingService
      :reportPath="reportPath"
      :params="reportParams"></iframeReportingService>
  </div>
</template>

<script>
import iframeReportingService from '@/components/iframeReportingService'

export default {
  name: 'GlReportBonus1',
  components: {
    iframeReportingService
  },
  data () {
    return {
      searchContent: { // 搜尋
        OrdersType: [],
        selectedOrdersType: [],
        StartDate: new Date(),
        EndDate: new Date(),
        CompanyID: null
      },
      reportPath: 'reports_gl_OrderExportMGear',
      reportParams: {},
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
  async mounted () {
    await this.preLoading()
    this.userPermission()

    // 預設值
    let start = new Date()
    let year = start.getFullYear()
    let month = start.getMonth()
    start = new Date(year, month, 1, 12)
    this.startDateChange(start)
  },
  methods: {
    // 讀入系統清單
    preLoading: async function () {
      let response = await this.$api.reports.getDropdownList({ type: 'companies' })
      this.ddlCompanies = response.data.result

      // 顯示專用
      response = await this.$api.orders.ordersShowGroup()
      let filterSettings = response.data.result
      // 帶入數值
      this.searchContent.OrdersType = filterSettings.OrdersType

      if (localStorage.getItem('searchHistory:' + this.$route.name) !== null) {
        let oldSearchContent = JSON.parse(localStorage.getItem('searchHistory:' + this.$route.name))
        this.searchContent.selectedOrdersType = oldSearchContent.selectedOrdersType
        // 如果之前選項不在預設選項內, 移除
        this.searchContent.selectedOrdersType.forEach((item, index) => {
          let isItemExist = this.searchContent.OrdersType.find(item2 => { return item2.Prefix === item })
          if (isItemExist === undefined) {
            this.searchContent.selectedOrdersType.splice(index, 1)
          }
        })
      }

      // 抓取預設廠商
      response = this.$api.local.getDropdownList({ type: 'DefCompanyID' })
      let defaultCompany = response[0]

      if (defaultCompany) {
        this.searchContent.CompanyID = defaultCompany.Value
        this.ddlCompaniesChange(this.searchContent.CompanyID)
      }
    },
    // 使用者權限
    userPermission: async function () {
      let progPermission = this.$store.state.userProg.filter(item => { return item.Path === this.$route.fullPath })[0]
      this.buttonsShowUser.new = progPermission.fun1
      this.buttonsShowUser.edit = progPermission.fun2
      this.buttonsShowUser.save = progPermission.fun2
      this.buttonsShowUser.delete = progPermission.fun3
    },
    // 給予預設日期
    // 抓一季, 三個月
    startDateChange: function (value) {
      let start = new Date(value)
      let end = new Date()
      let year = start.getFullYear()
      let month = start.getMonth()
      switch (month) {
        case 11:
        case 12:
        case 1:
          month = 11
          year = year - 1
          break
        case 2:
        case 3:
        case 4:
          month = 2
          break
        case 5:
        case 6:
        case 7:
          month = 5
          break
        case 8:
        case 9:
        case 10:
          month = 8
          break
      }
      start = new Date(year, month, 1, 12)
      end = new Date(year, month + 3, 0, 12)

      this.searchContent.StartDate = start.toISOString().slice(0, 10)
      this.searchContent.EndDate = end.toISOString().slice(0, 10)
    },
    ddlCompaniesChange: function (value) {
      let item = this.ddlCompanies.find(item => { return item.ID === value })
      this.searchContent.CompanyName = item.Nickname
    },
    // SSRS列印
    print: function () {
      let strLocale = '2'
      switch (localStorage.getItem('locale')) {
        case 'en':
          strLocale = '1'
          break
        case 'zh':
          strLocale = '2'
          break
      }
      // 精簡查詢內容
      let passSearchContent = JSON.parse(JSON.stringify(this.searchContent))
      delete passSearchContent.OrdersType
      delete passSearchContent.ProjectName
      delete passSearchContent.CompanyName
      this.reportParams = {
        locale: strLocale,
        searchContent: JSON.stringify(passSearchContent) }

      // 紀錄Log
      this.$api.reports.ssrsReports({ reportParams: this.reportParams, reportName: this.reportPath })

      // 儲存內容
      localStorage.setItem('searchHistory:' + this.$route.name, JSON.stringify(this.searchContent))
    }
  }
}
</script>
