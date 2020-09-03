<template>
  <div>
    <el-form ref="form" :model="form" label-width="20%">
      <el-form-item :label="$t('__startDate')">
        <el-date-picker
          v-model="form.StartDate"
          type="month"
          :placeholder="$t('__plzChoice')+$t('__startDate')"
          value-format="yyyy-MM-dd"
          @change="startDateChange">
        </el-date-picker>
      </el-form-item>
      <el-form-item :label="$t('__companies')+$t('__id')">
        <el-select v-model="form.CompanyID" filterable :placeholder="$t('__plzChoice')" @change="ddlCompaniesChange">
          <el-option v-for="item in ddlCompanies" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
            <span style="float: left">{{ item.Value }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('__project')+$t('__id')">
        <el-select v-model="form.ProjectID" filterable :placeholder="$t('__plzChoice')" @change="ddlProjectsChange">
          <el-option v-for="item in ddlProjects" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
            <span style="float: left">{{ item.Value }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-button-group>
      <el-button type="primary" icon="el-icon-printer" @click.prevent="print">{{$t('__print')}}</el-button>
    </el-button-group>
    <el-footer>
      <iframeReportingService
       :reportPath="reportPath"
       :params="reportParams"></iframeReportingService>
    </el-footer>
  </div>
</template>

<script>
import iframeReportingService from '@/components/iframeReportingService'

export default {
  name: 'ReportsBonus2',
  components: {
    iframeReportingService
  },
  data () {
    return {
      form: {
        StartDate: null,
        EndDate: null,
        ProjectID: null,
        ProjectName: null,
        CompanyID: null,
        CompanyName: null
      },
      reportPath: 'reports_Bonus2',
      reportParams: {},
      // 以下為下拉式選單專用
      ddlCompanies: [],
      ddlProjects: []
    }
  },
  async mounted () {
    await this.preLoading()

    // 預設值
    let start = new Date()
    let year = start.getFullYear()
    let month = start.getMonth() - 3
    start = new Date(year, month, 1, 12)
    this.startDateChange(start)

    let defaultCompany = this.ddlCompanies.find(item => { return item.ID === '83799023' })
    if (defaultCompany) {
      this.form.CompanyID = defaultCompany.ID
      this.ddlCompaniesChange(this.form.CompanyID)
    }

    this.form.ProjectID = this.ddlProjects[0].ID
    this.ddlProjectsChange(this.form.ProjectID)
  },
  methods: {
    // 讀入系統清單
    preLoading: async function () {
      const response = await this.$api.reports.getDropdownList({ type: 'companies' })
      this.ddlCompanies = response.data.result

      const response2 = await this.$api.reports.getDropdownList({ type: 'projects' })
      this.ddlProjects = response2.data.result
    },
    startDateChange: function (value) {
      let start = new Date(value)
      let end = new Date()
      let year = start.getFullYear()
      let month = start.getMonth()
      start = new Date(year, month, 1, 12)
      end = new Date(year, month + 1, 0, 12)

      this.form.StartDate = start.toISOString().slice(0, 10)
      this.form.EndDate = end.toISOString().slice(0, 10)
    },
    ddlCompaniesChange: function (value) {
      let item = this.ddlCompanies.find(item => { return item.ID === value })
      this.form.CompanyName = item.Nickname
    },
    ddlProjectsChange: function (value) {
      let item = this.ddlProjects.find(item => { return item.ID === value })
      this.form.ProjectName = item.Value
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
        DefaultProjectID: this.form.ProjectID,
        CompanyID: this.form.CompanyID,
        MasterName: this.form.CompanyName,
        ProjectName: this.form.ProjectName }

      // 紀錄Log
      this.$api.reports.bonus2ToExcel({ reportParams: this.reportParams })
    }
  }
}
</script>
