<template>
  <el-form ref="form" :model="form" :rules="rules">
    <el-form-item :label="$t('__received')+$t('__amount')" prop="Amount" label-position="left" label-width="100px">
        <el-input v-model.number="form.Amount"></el-input>
    </el-form-item>
    <el-form-item :label="$t('__bank')+$t('__id')" prop="BankID" label-position="left" label-width="100px">
      <el-col :span="10">
        <el-select v-model="form.BankID" filterable :filter-method="bankIDFilter" :placeholder="$t('__plzChoice')">
          <el-option v-for="item in ddlBankIDFilter" :key="item.ID" :label="item.Value" :value="item.ID">
            <span style="float: left">{{ item.Value }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="4" class="el-form-item__label">
        {{$t('__account')}}
      </el-col>
      <el-col :span="10">
        <el-form-item prop="Account">
          <el-input v-model="form.Account" :placeholder="$t('__plzInputCardNumber')" maxlength="20" show-word-limit></el-input>
        </el-form-item>
      </el-col>
    </el-form-item>
  </el-form>
</template>

<script>
import validate from '@/setup/validate'

export default {
  name: 'collectionRecordsPaymentMethod2',
  props: {
    form: { type: Object },
    ddlBankID: { type: Array }
  },
  data () {
    return {
      rules: {
        Account: [{ required: true, trigger: 'blur', validator: validate.validateCard }],
        Amount: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        BankID: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }]
      },
      ddlBankIDFilter: []
    }
  },
  watch: {
    ddlBankID: function () {
      if (this.ddlBankID) {
        this.ddlBankIDFilter = this.ddlBankID
      }
    }
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
      this.$refs['form'].validate((valid) => { return valid })
    }
  }
}
</script>
