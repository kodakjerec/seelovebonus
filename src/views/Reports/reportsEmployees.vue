<template>
  <div>
    <eChart @findCompany="findCompany"></eChart>
    <el-tabs v-model="activeName">
      <el-tab-pane :label="$t('__print')" name="first">
        <el-form :inline="true" ref="form" :model="form">
          <el-form-item :label="$t('__companies')+$t('__id')">
            <el-select v-model="form.CompanyID" filterable :placeholder="$t('__plzChoice')">
              <el-option v-for="item in ddlCompanies" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
                <span style="float: left">{{ item.Value }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-printer" @click.prevent="print">{{$t('__print')}}</el-button>
          </el-form-item>
        </el-form>
        <iframeReportingService
          :reportPath="reportPath"
          :params="reportParams"></iframeReportingService>
      </el-tab-pane>
      <el-tab-pane :label="$t('__graphical')" name="second">
        <eChart2 :companyID="form.CompanyID" ></eChart2>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import eChart from './components/reportsEmployeesEChart'
import eChart2 from './components/reportsEmployeesEChart2'
import iframeReportingService from '@/components/iframeReportingService'

export default {
  name: 'ReportsEmployee',
  components: {
    eChart,
    eChart2,
    iframeReportingService
  },
  data () {
    return {
      form: {
        CompanyID: ''
      },
      reportPath: 'reports_Employees',
      reportParams: {},
      activeName: 'first',
      // 以下為下拉式選單專用
      ddlCompanies: []
    }
  },
  mounted () {
    this.preLoading()
    this.findCompany('83799375')
  },
  methods: {
    // 讀入系統清單
    preLoading: async function () {
      const response = await this.$api.reports.getDropdownList({ type: 'companies' })
      this.ddlCompanies = response.data.result
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
