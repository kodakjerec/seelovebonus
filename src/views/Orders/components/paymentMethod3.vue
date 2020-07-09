
<template>
  <el-form ref="form" :model="form" :rules="rules">
    <el-form-item :label="$t('__received')+$t('__amount')" prop="Amount" label-position="left" label-width="100px">
        <el-input v-model.number="form.Amount"></el-input>
    </el-form-item>
    <el-form-item :label="$t('__cheque')+$t('__id')" prop="BankID" label-position="left" label-width="100px">
      <el-col :span="10">
        <el-form-item prop="Account">
          <el-input v-model="form.Account" :placeholder="$t('__pleaseInput')" maxlength="20" show-word-limit></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="4" class="el-form-item__label">
        {{$t('__expire')+$t('__date')}}
      </el-col>
      <el-col :span="10">
        <el-form-item prop="ChequeDate">
            <el-date-picker
              v-model="form.ChequeDate"
              type="date"
              :placeholder="$t('__plzChoice')+$t('__expire')+$t('__date')"
              format="yyyy - MM - dd">
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
      this.$refs['form'].validate((valid) => { return valid })
    }
  }
}
</script>
