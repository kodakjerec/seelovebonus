<template>
  <el-form ref="form" :model="form" :rules="rules">
    <h2>{{$t('__collectionRecords')}}</h2>
    <el-form-item :label="$t('__paymentMethod')" prop="PaymentMethod" label-width="100px" label-position="left">
      <el-col :span="10">
      <el-select v-model="form.PaymentMethod" value-key="value" :placeholder="$t('__plzChoice')">
        <el-option v-for="item in ddlPaymentMethod" :key="item.ID" :label="item.Value" :value="item.ID">
          <span style="float: left">{{ item.Value }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
        </el-option>
      </el-select>
      </el-col>
      <el-col :span="4" class="el-form-item__label">
        {{$t('__received')+$t('__date')}}
      </el-col>
      <el-col :span="10">
        <el-form-item prop="ReceivedDate">
            <el-date-picker
              v-model="form.ReceivedDate"
              type="date"
              :placeholder="$t('__plzChoice')+$t('__received')+$t('__date')"
              format="yyyy - MM - dd">
            </el-date-picker>
          </el-form-item>
      </el-col>
    </el-form-item>
    <method1 ref="method1" v-if="form.PaymentMethod === 1" :form="form"></method1>
    <method2 ref="method2" v-if="form.PaymentMethod === 2" :form="form" :ddlBankID="ddlBankID"></method2>
    <method3 ref="method3" v-if="form.PaymentMethod === 3" :form="form"></method3>
    <method4 ref="method4" v-if="form.PaymentMethod === 4" :form="form"></method4>
    <method5 ref="method5" v-if="form.PaymentMethod === 5" :form="form"></method5>
    <!-- 發票資訊 -->
    <invoice v-if="invoiceHead" ref="invoiceHead" :invoiceHead="invoiceHead"></invoice>
    <template v-else>
      <el-button-group>
        <el-button type="primary" icon="el-icon-plus" @click.prevent="addInvoice()">{{$t('__new')+$t('__invoice')}}</el-button>
      </el-button-group>
    </template>
  </el-form>
</template>

<script>
import invoice from './invoice'
import method1 from './paymentMethod1'
import method2 from './paymentMethod2'
import method3 from './paymentMethod3'
import method4 from './paymentMethod4'
import method5 from './paymentMethod5'

export default {
  name: 'CollectionRecords',
  components: {
    invoice,
    method1,
    method2,
    method3,
    method4,
    method5
  },
  props: {
    orderID: { type: String },
    collectionRecords: { type: Object }
  },
  data () {
    return {
      form: {
        InvoiceID: '',
        InvoiceDate: '',
        OrderID: '',
        PaymentMethod: 4,
        ReceivedDate: null,
        Amount: null,
        Account: null,
        BankID: null,
        Memo: null,
        ReceivedID: null,
        ExpireDate: null
      },
      rules: {
        PaymentMethod: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        ReceivedDate: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }]
      },
      invoiceHead: {},
      // 以下為下拉式選單專用
      ddlPaymentMethod: [],
      ddlBankID: []
    }
  },
  watch: {
    orderID: function (value) {
      if (value) {
        this.form.OrderID = value
      }
    },
    collectionRecords: function () {
      if (this.collectionRecords) {
        this.form = this.collectionRecords
      }
    }
  },
  mounted () {
    this.preLoading()
  },
  methods: {
    preLoading: async function () {
      const response1 = await this.$api.orders.getDropdownList({ type: 'paymentMethod' })
      this.ddlPaymentMethod = response1.data.result
      const response2 = await this.$api.orders.getDropdownList({ type: 'bankID' })
      this.ddlBankID = response2.data.result
      const responseInvoice = await this.$api.orders.getObject({ type: 'invoiceHead', ID: this.form.OrderID })
      this.invoiceHead = responseInvoice.data.result[0]
    },
    // 新增發票資訊
    addInvoice: function () {
      this.invoiceHead = {
        InvoiceID: '',
        InvoiceDate: null,
        OrderID: this.form.OrderID,
        Title: '',
        UniformNumber: '',
        Amount: null,
        ReceivedDate: null,
        InvoiceKind: null,
        Tax: null,
        CarrierNumber: null,
        Memo: null,
        InvoiceIDFirst: null,
        RandomCode: null,
        CreateID: null,
        Status: null,
        SalesReturnDate: null
      }
    },
    // 檢查輸入
    checkValidate: function () {
      let isSuccess = false
      switch (this.form.PaymentMethod) {
        case 1:
          this.$refs['method1'].checkValidate()
          break
        case 2:
          this.$refs['method2'].checkValidate()
          break
        case 3:
          this.$refs['method3'].checkValidate()
          break
        case 4:
          this.$refs['method4'].checkValidate()
          break
        case 5:
          this.$refs['method5'].checkValidate()
          break
      }
      this.$refs['form'].validate((valid) => { isSuccess = valid })
      return isSuccess
    },
    // 存檔
    save: async function () {
      let isSuccess = false
      switch (this.dialogType) {
        case 'new':
          const responseNew = await this.$api.orders.collectionRecordsNew({ form: this.form })
          if (responseNew.status === 200) {
            isSuccess = true
          }
          break
        case 'edit':
          const responseEdit = await this.$api.orders.collectionRecordsEdit({ form: this.form })
          if (responseEdit.status === 200) {
            isSuccess = true
          }
          break
      }

      return isSuccess
    }
  }
}
</script>
