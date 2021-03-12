<template>
  <el-dialog :title="myTitle" :visible="dialogShow" center width="80vw" @close="cancel">
    <el-form ref="form" :model="form" label-width="10vw" label-position="right">
      <el-form-item :label="$t('__orderID')">
          <el-input v-model="form.ID" :disabled="true"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="cancel">{{$t('__cancel')}}</el-button>
      <p/>
      <iframeReportingService
       :reportPath="reportPath"
       :params="reportParams"></iframeReportingService>
    </div>
  </el-dialog>
</template>

<script>
import iframeReportingService from '@/components/iframeReportingService'
import { formatDate } from '@/setup/format.js'

export default {
  name: 'FKOrderPrint',
  components: {
    iframeReportingService
  },
  props: {
    dialogShow: { type: Boolean, default: false },
    fKOrder: { type: Object }
  },
  data () {
    return {
      myTitle: this.$t('__print') + this.$t('__fKOrder'),
      form: this.fKOrder,
      reportPath: 'reports_fk_FKOrderPrint',
      reportParams: {}
    }
  },
  mounted () {
    this.print()
  },
  methods: {
    // 列印
    print: function () {
      this.reportParams = {
        keyword: this.form.ID,
        Qty: this.form.Qty,
        OrderDate: formatDate(this.form.OrderDate),
        CustomerName: this.form.CustomerName }

      // 紀錄Log
      this.$api.reports.fKOrderPrint({ fKOrder: this.form.ID })

      this.form.PrintCount += 1
    },
    cancel: function () {
      this.$emit('dialog-cancel')
    }
  }
}
</script>
