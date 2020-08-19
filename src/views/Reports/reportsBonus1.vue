<template>
  <div>
    <el-form ref="form" :model="form" label-width="20%">
      <el-form-item :label="$t('__startDate')">
        <el-col :span="10">
          <el-form-item prop="StartDate">
            <el-date-picker
              v-model="form.StartDate"
              type="date"
              :placeholder="$t('__plzChoice')+$t('__startDate')"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="4" class="el-form-item__label">
          {{$t('__endDate')}}
        </el-col>
        <el-col :span="8">
          <el-form-item prop="EndDate">
            <el-date-picker
              v-model="form.EndDate"
              type="date"
              :placeholder="$t('__plzChoice')+$t('__endDate')"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-col>
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
  name: 'ReportsBonus1',
  components: {
    iframeReportingService
  },
  data () {
    return {
      form: {
        StartDate: null,
        EndDate: null
      },
      reportPath: 'reports_Bonus1',
      reportParams: {}
    }
  },
  mounted () {
    this.preLoading()
  },
  methods: {
    // 讀入系統清單
    preLoading: async function () {
      this.form.EndDate = new Date()
      this.form.EndDate = this.form.EndDate.toISOString().slice(0, 10)

      this.form.StartDate = new Date()
      this.form.StartDate.setMonth(this.form.StartDate.getMonth() - 3)
      this.form.StartDate = this.form.StartDate.toISOString().slice(0, 10)
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
        EndDate: this.form.EndDate }

      // 紀錄Log
      this.$api.reports.bonus1ToExcel({ StartDate: this.form.StartDate, EndDate: this.form.EndDate })
    }
  }
}
</script>
