<template>
  <div>
    <el-form ref="form" :model="form" label-width="10vw" label-position="right">
      <el-form-item :label="$t('__startDate')">
        <el-col :span="8">
          <el-date-picker
            v-model="form.StartDate"
            :placeholder="$t('__plzChoice')+$t('__startDate')"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-col>
        <el-col :span="2">
          <span>{{$t('__endDate')}}</span>
        </el-col>
        <el-col :span="8">
          <el-date-picker
            v-model="form.EndDate"
            :placeholder="$t('__plzChoice')+$t('__endDate')"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item :label="$t('__companies')+$t('__id')">
        <el-col :span="8">
          <el-select v-model="form.CompanyID" default-first-option filterable clearable :placeholder="$t('__plzChoice')" @change="ddlCompaniesChange">
            <el-option v-for="item in ddlCompanies" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
              <span style="float: left">{{ item.Value }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
            </el-option>
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button v-show="buttonsShowUser.edit" type="primary" icon="el-icon-printer" @click.prevent="print">{{$t('__detail') + $t('__print')}}</el-button>
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
  name: 'ReportsBonus1Detail',
  components: {
    iframeReportingService
  },
  data () {
    return {
      form: {
        StartDate: null,
        EndDate: null,
        CompanyID: null,
        CompanyName: null
      },
      reportPath: 'reports_Bonus1',
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

    let response = this.$api.local.getDropdownList({ type: 'DefCompanyID' })
    let defaultCompany = response[0]

    if (defaultCompany) {
      this.form.CompanyID = defaultCompany.Value
      this.ddlCompaniesChange(this.form.CompanyID)
    }
  },
  methods: {
    // 讀入系統清單
    preLoading: async function () {
      let response = await this.$api.reports.getDropdownList({ type: 'companies' })
      this.ddlCompanies = response.data.result
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

      this.form.StartDate = start.toISOString().slice(0, 10)
      this.form.EndDate = end.toISOString().slice(0, 10)
    },
    ddlCompaniesChange: function (value) {
      let item = this.ddlCompanies.find(item => { return item.ID === value })
      this.form.CompanyName = item.Nickname
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
      this.reportParams = {
        locale: strLocale,
        StartDate: this.form.StartDate,
        EndDate: this.form.EndDate,
        CompanyID: this.form.CompanyID,
        MasterName: this.form.CompanyName }

      // 紀錄Log
      this.$api.reports.ssrsReports({ reportParams: this.reportParams, reportName: this.reportPath })
    }
  }
}
</script>
