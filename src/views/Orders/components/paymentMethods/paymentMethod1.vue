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
  </el-form>
</template>

<script>
import validator from '@/setup/validate'
export default {
  name: 'collectionRecordsPaymentMethod1',
  props: {
    form: { type: Object },
    disableForm: { type: Object }
  },
  data () {
    return {
      rules: {
        Amount: [{ required: true, validator: validator.validateInputNumber, trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 檢查輸入
    checkValidate: async function () {
      let isSuccess = false
      this.$refs['form'].validate((valid) => { isSuccess = valid })
      return isSuccess
    }
  }
}
</script>
