<template>
  <el-dialog :title="myTitle" :visible="dialogShow" center width="80vw" top="5vh" @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="10vw" label-position="right">
      <el-form-item :label="$t('__installment')+$t('__name')">
        <el-col :span="16">
          <el-input v-model="form.InstallmentName" maxlength="40" show-word-limit :disabled="disableForm.InstallmentName"></el-input>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('__installmentSeq')">
            <el-input v-model="form.Seq" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item :label="$t('__installmentScheduledDate')" prop="ScheduledDate">
        <el-col :span="8">
          <el-date-picker
            v-model="form.ScheduledDate"
            type="date"
            value-format="yyyy-MM-dd"
            :placeholder="$t('__installmentScheduledDate')"
            :disabled="disableForm.ScheduledDate">
          </el-date-picker>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('__installmentScheduledAmount')">
            {{formatterMoney(form.ScheduledAmount)}}
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item :label="$t('__received')+$t('__date')">
        <el-col :span="8">
          <el-date-picker
            v-model="form.ReceivedDate"
            type="date"
            value-format="yyyy-MM-dd"
            :placeholder="$t('__cantUse')"
            disabled>
          </el-date-picker>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('__paidAmount')">
            {{formatterMoney(form.PaidAmount)}}
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item :label="$t('__paymentMethod')" prop="PaymentMethod">
        <el-col :span="8">
          <el-select v-model="form.PaymentMethod" default-first-option filterable clearable :placeholder="$t('__plzChoice')" :disabled="disableForm.PaymentMethod">
            <el-option v-for="item in ddlPaymentMethod" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
              <span style="float: left">{{ item.Value }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('__installmentPaymentFrequency')">
            <el-select v-model="form.PaymentFrequency" default-first-option filterable clearable :placeholder="$t('__plzChoice')" :disabled="disableForm.PaymentFrequency">
              <el-option v-for="item in ddlPaymentFrequency" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
                <span style="float: left">{{ item.Value }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item :label="$t('__memo')">
          <el-input v-model="form.Memo" maxlength="100" show-word-limit></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="cancel">{{$t('__cancel')}}</el-button>
      <el-button v-show="buttonsShowUser.save" type="primary" @click="checkValidate">{{$t('__save')}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { formatDate, formatMoney } from '@/setup/format.js'

export default {
  name: 'InstallmentNewForm',
  props: {
    dialogType: { type: String, default: 'new' },
    dialogShow: { type: Boolean, default: false },
    installment: { type: Object },
    fromOrderID: { type: String },
    buttonsShowUser: { type: Object }
  },
  data () {
    return {
      form: {
        OrderID: this.fromOrderID,
        Seq: 0,
        InstallmentName: '',
        ScheduledDate: '',
        ScheduledAmount: 0,
        ReceivedDate: '',
        PaidAmount: 0,
        PaymentMethod: 1,
        PaymentFrequency: 1,
        Memo: ''
      },
      rules: {
        InstallmentName: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        ScheduledDate: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        PaymentMethod: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }]
      },
      disableForm: {
        InstallmentName: false,
        ScheduledAmount: false,
        PaymentFrequency: false
      },
      myTitle: '',
      // 以下為下拉式選單專用
      ddlPaymentMethod: [],
      ddlPaymentFrequency: []
    }
  },
  mounted () {
    if (Object.keys(this.installment).length > 0) {
      this.form = JSON.parse(JSON.stringify(this.installment))
    } else {
      let tempDate = new Date()
      this.form.ScheduledDate = this.formatterDate(null, null, tempDate.toISOString().slice(0, 10), null)
    }

    switch (this.dialogType) {
      case 'edit':
        this.myTitle = this.$t('__edit') + this.$t('__installment')
        this.disableForm.InstallmentName = true
        this.disableForm.ScheduledAmount = true
        this.disableForm.PaymentFrequency = true
        break
    }
    this.preLoading()
  },
  methods: {
    formatterDate: function (row, column, cellValue, index) {
      return formatDate(cellValue)
    },
    formatterMoney: function (cellValue) {
      return formatMoney(cellValue)
    },
    // 讀取預設資料
    preLoading: function () {
      let response = this.$api.local.getDropdownList({ type: 'PaymentMethod' })
      this.ddlPaymentMethod = response
      response = this.$api.local.getDropdownList({ type: 'PaymentFrequency' })
      this.ddlPaymentFrequency = response
    },
    // 檢查輸入
    checkValidate: async function () {
      let isSuccess = false

      await this.$refs['form'].validate((valid) => { isSuccess = valid })
      if (isSuccess) {
        this.save(this.dialogType)
      }
    },
    // 取消
    cancel: function () {
      this.$emit('dialog-cancel')
    },
    // 存檔
    save: async function (type) {
      let isSuccess = false
      switch (type) {
        case 'edit':
          let responseEdit = await this.$api.orders.installmentDetailUpdate({ form: this.form })
          if (responseEdit.headers['code'] === '200') {
            this.$alert(responseEdit.data.result[0].message, responseEdit.data.result[0].code)
            isSuccess = true
          }
          break
      }

      if (isSuccess) {
        this.$emit('dialog-save')
      }
    }
  }
}
</script>
