<template>
  <el-dialog :title="myTitle" :visible="dialogShow" center width="80vw" top="5vh" @close="cancel" append-to-body>
    <el-form>
      <el-table
        :data="projectInstallmentDetail"
        stripe
        border
        style="width: 100%">
        <el-table-column prop="Seq" :label="$t('__installmentSeq')" width="100px"></el-table-column>
        <el-table-column prop="InstallmentName" :label="$t('__installment')+$t('__name')"></el-table-column>
        <el-table-column prop="ScheduledAmount" :label="$t('__installmentScheduledAmount')"></el-table-column>
        <el-table-column prop="PaymentMethod" :label="$t('__paymentMethod')"></el-table-column>
        <el-table-column prop="PaymentFrequency" :label="$t('__installmentPaymentFrequency')"></el-table-column>
        <el-table-column prop="IncreaseMonth" :label="'Increase Month'"></el-table-column>
      </el-table>
    </el-form>
    <div slot="footer">
      <el-button @click="cancel">{{$t('__cancel')}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'ProjectInstallmentDetail',
  props: {
    dialogShow: { type: Boolean, default: false },
    projectID: { type: String }
  },
  data () {
    return {
      projectInstallmentDetail: [],
      myTitle: this.$t('__project') + this.$t('__installment')
    }
  },
  async mounted () {
    if (!this.projectID) {
      return
    }
    let responseRecords = await this.$api.basic.getObject({ type: 'projectInstallmentDetail', keyword: this.projectID })
    this.projectInstallmentDetail = responseRecords.data.result
  },
  methods: {
    // 檢查輸入
    checkValidate: function () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.save()
          return true
        } else {
          return false
        }
      })
    },
    // 取消
    cancel: function () {
      this.$emit('dialog-cancel')
    }
  }
}
</script>
