<template>
  <el-form ref="form" :model="form" :rules="rules">
    <el-form-item :label="$t('__received')+$t('__amount')" prop="Amount" label-position="left" label-width="100px">
        <el-input v-model.number="form.Amount"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'collectionRecordsPaymentMethod1',
  props: {
    form: { type: Object }
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
    checkValidate: function () {
      this.$refs['form'].validate((valid) => { return valid })
    }
  }
}
</script>
