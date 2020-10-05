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
  </el-form>
</template>

<script>
export default {
  name: 'collectionRecordsPaymentMethod1',
  props: {
    form: { type: Object },
    disableForm: { type: Object }
  },
  data () {
    return {
      rules: {
        Amount: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }]
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
