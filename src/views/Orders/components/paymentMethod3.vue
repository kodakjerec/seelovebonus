
<template>
  <el-form ref="form" :model="form" :rules="rules" label-width="10vw" label-position="right">
    <el-form-item :label="$t('__received')+$t('__date')" required>
      <el-date-picker
        v-model="form.ReceivedDate"
        type="date"
        value-format="yyyy-MM-dd"
        :placeholder="$t('__plzChoice')+$t('__received')+$t('__date')"
        :disabled="disableForm.ReceivedDate">
      </el-date-picker>
    </el-form-item>
    <el-form-item :label="$t('__received')+$t('__amount')" prop="Amount">
        <el-input v-model.number="form.Amount" :disabled="disableForm.Amount"></el-input>
    </el-form-item>
    <el-form-item :label="$t('__cheque')+$t('__id')" prop="BankID">
      <el-col :span="8">
        <el-form-item prop="Account">
          <el-input v-model="form.Account" :placeholder="$t('__pleaseInput')" maxlength="20" show-word-limit :disabled="disableForm.Account"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="16">
        <el-form-item :label="$t('__expire')+$t('__date')" prop="ChequeDate">
          <el-date-picker
            v-model="form.ChequeDate"
            type="date"
            :placeholder="$t('__plzChoice')+$t('__expire')+$t('__date')"
            value-format="yyyy-MM-dd"
              :disabled="disableForm.ChequeDate">
          </el-date-picker>
        </el-form-item>
      </el-col>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'collectionRecordsPaymentMethod3',
  props: {
    form: { type: Object },
    disableForm: { type: Object },
    ddlBankID: { type: Array }
  },
  data () {
    return {
      rules: {
        Account: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        Amount: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        ChequeDate: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 檢查輸入
    checkValidate: function () {
      let isSuccess = false
      this.$refs['form'].validate((valid) => { isSuccess = valid })
      return isSuccess
    }
  }
}
</script>
