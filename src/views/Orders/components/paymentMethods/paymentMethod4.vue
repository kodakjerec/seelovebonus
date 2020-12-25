
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
      <el-input-number v-model="form.Amount" :disabled="disableForm.Amount" :min="0" :max="form.MaxAmount"></el-input-number>
    </el-form-item>
    <el-form-item prop="Account" :label="$t('__account')">
      <el-input v-model="form.Account" :placeholder="$t('__plzInputCardNumber')" maxlength="20" show-word-limit :disabled="disableForm.Account"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
import validator from '@/setup/validate'

export default {
  name: 'collectionRecordsPaymentMethod4',
  props: {
    form: { type: Object },
    disableForm: { type: Object },
    ddlBankID: { type: Array }
  },
  data () {
    return {
      rules: {
        Account: [{ required: true, trigger: 'blur', validator: validator.validateCard }],
        Amount: [{ required: true, trigger: 'blur', validator: validator.validateInputNumber }]
      },
      ddlBankIDFilter: []
    }
  },
  watch: {
    ddlBankID: function () {
      if (this.ddlBankID) {
        this.ddlBankIDFilter = JSON.parse(JSON.stringify(this.ddlBankID))
      }
    }
  },
  mounted () {
    this.bankIDFilter(null)
  },
  methods: {
    // 下拉是選單過濾銀行代號
    bankIDFilter: function (selected) {
      if (selected) {
        this.ddlBankIDFilter = this.ddlBankID.filter((item) => {
          if (item.ID.indexOf(selected) > -1 || item.Value.indexOf(selected) > -1) {
            return true
          }
        })
      } else {
        this.ddlBankIDFilter = this.ddlBankID
      }
    },
    // 檢查輸入
    checkValidate: function () {
      let isSuccess = false
      this.$refs['form'].validate((valid) => { isSuccess = valid })
      return isSuccess
    }
  }
}
</script>
