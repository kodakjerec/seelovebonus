<template>
  <div>
    <el-form ref="form" :model="form" label-width="20%">
      <el-form-item :label="$t('__date')">
        <el-col :span="8">
          <el-date-picker
            v-model="form.StartDate"
            type="month"
            :placeholder="$t('__plzChoice')+$t('__startDate')"
            value-format="yyyy-MM-dd"
            @change="startDateChange">
          </el-date-picker>
        </el-col>
      </el-form-item>
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
      <el-form-item>
        <el-button type="primary" icon="el-icon-printer" @click.prevent="print">{{$t('__print')}}</el-button>
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
  name: 'FKOrderPrint',
  components: {
    iframeReportingService
  },
  data () {
    return {
      form: {
        StartDate: null,
        EndDate: null
      },
      reportPath: 'reports_fk_FKOrderRpt',
      reportParams: {}
    }
  },
  mounted () {
    // 預設值
    let start = new Date()
    let year = start.getFullYear()
    let month = start.getMonth() - 1
    start = new Date(year, month, 1, 12)
    this.startDateChange(start)
  },
  methods: {
    // 給予預設日期
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
    // SSRS列印
    print: function () {
      this.reportParams = {
        StartDate: this.form.StartDate,
        EndDate: this.form.EndDate }

      // 紀錄Log
      this.$api.reports.ssrsReports({ reportParams: this.reportParams, reportName: this.reportPath })
    }
  }
}
</script>
