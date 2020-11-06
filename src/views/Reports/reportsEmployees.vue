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
            <el-button v-show="buttonsShowUser.edit" type="primary" icon="el-icon-printer" @click.prevent="print">{{$t('__print')}}</el-button>
          </el-form-item>
        </el-form>
        <iframeReportingService
          :reportPath="reportPath"
          :params="reportParams"></iframeReportingService>
      </el-tab-pane>
      <el-tab-pane :label="$t('__graphical')" name="second">
        <eChart2 :companyID="form.CompanyID" :companyNickname="form.CompanyNickname" ></eChart2>
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
        CompanyID: '',
        CompanyNickname: ''
      },
      reportPath: 'reports_Employees',
      reportParams: {},
      activeName: 'second',
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
    this.findCompany('83799375')
  },
  methods: {
    // 讀入系統清單
    preLoading: async function () {
      const response = await this.$api.reports.getDropdownList({ type: 'companies' })
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
    // canvas 點公司
    findCompany: function (value) {
      this.form.CompanyID = value
      this.form.CompanyNickname = this.ddlCompanies.find(item => { return item.ID === value }).Nickname
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
