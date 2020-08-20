<template>
  <div>
    <employeesCanvas
      @findCompany="findCompany"></employeesCanvas>
    <el-form ref="form" :model="form" label-width="20%">
      <el-form-item :label="$t('__companies')+$t('__id')">
        <el-select v-model="form.CompanyID" filterable value-key="value" :placeholder="$t('__plzChoice')">
          <el-option v-for="item in ddlCompanies" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
            <span style="float: left">{{ item.Value }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-button type="primary" icon="el-icon-printer" @click.prevent="print">{{$t('__print')}}</el-button>
    </el-form>
    <iframeReportingService
      :reportPath="reportPath"
      :params="reportParams"></iframeReportingService>
  </div>
</template>

<script>
import employeesCanvas from './reportsEmployeesCanvas'
import iframeReportingService from '@/components/iframeReportingService'

export default {
  name: 'ReportsEmployee',
  components: {
    employeesCanvas,
    iframeReportingService
  },
  data () {
    return {
      form: {
        CompanyID: ''
      },
      reportPath: 'reports_Employees',
      reportParams: {},
      // 以下為下拉式選單專用
      ddlCompanies: []
    }
  },
  mounted () {
    this.preLoading()
  },
  methods: {
    // 讀入系統清單
    preLoading: async function () {
      const response = await this.$api.reports.getDropdownList({ type: 'companies' })
      this.ddlCompanies = response.data.result
      this.form.CompanyID = this.ddlCompanies[0].ID
    },
    // canvas 點公司
    findCompany: function (value) {
      this.form.CompanyID = value
      this.print()
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
        CompanyID: this.form.CompanyID }

      // 紀錄Log
      this.$api.reports.employeesToExcel({ CompanyID: this.form.CompanyID, columns: this.columns })
    }
  }
}
</script>
