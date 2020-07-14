<template>
  <el-form ref="form" :model="form" :rules="rules">
    <h2 style="text-align:left">{{$t('__collectionRecords')}}</h2>
    <el-form-item :label="$t('__paymentMethod')" prop="PaymentMethod" label-width="100px" label-position="left">
      <el-col :span="4">
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
      <el-col :span="6">
        <el-form-item prop="ReceivedDate">
          <el-date-picker
            v-model="form.ReceivedDate"
            type="date"
            :placeholder="$t('__plzChoice')+$t('__received')+$t('__date')"
            format="yyyy - MM - dd">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="4" class="el-form-item__label">
        {{$t('__received')+$t('__operator')}}
      </el-col>
      <el-col :span="6">
        <el-form-item prop="ReceivedID">
            <el-select v-model="form.ReceivedID" value-key="value" :placeholder="$t('__plzChoice')">
              <el-option v-for="item in ddlCreateID" :key="item.ID" :label="item.Value" :value="item.ID">
                <span style="float: left">{{ item.Value }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
              </el-option>
            </el-select>
          </el-form-item>
      </el-col>
    </el-form-item>
    <method1 ref="method1" v-if="form.PaymentMethod === '1'" :form="form"></method1>
    <method2 ref="method2" v-if="form.PaymentMethod === '2'" :form="form" :ddlBankID="ddlBankID"></method2>
    <method3 ref="method3" v-if="form.PaymentMethod === '3'" :form="form"></method3>
    <method4 ref="method4" v-if="form.PaymentMethod === '4'" :form="form" :ddlBankID="ddlBankID"></method4>
    <method5 ref="method5" v-if="form.PaymentMethod === '5'" :form="form" :ddlBankID="ddlBankID"></method5>
    <el-form-item :label="$t('__memo')" label-width="100px" label-position="left">
        <el-input v-model="form.Memo" autocomplete="off" maxlength="200" show-word-limit></el-input>
    </el-form-item>
    <el-form-item :label="$t('__certificate1')" label-width="150px" label-position="left">
        <el-input v-model="form.Certificate1" autocomplete="off" maxlength="40" show-word-limit></el-input>
    </el-form-item>
    <el-form-item :label="$t('__certificate2')" label-width="150px" label-position="left">
        <el-input v-model="form.Certificate2" autocomplete="off" maxlength="40" show-word-limit></el-input>
    </el-form-item>
    <!-- 發票資訊 -->
    <template v-if="invoiceHead">
      <el-form-item :label="$t('__invoice')+$t('__id')" prop="InvoiceDate" label-width="100px" label-position="left">
        <el-col :span="10">
          <el-input v-model="invoiceHead.InvoiceID" autocomplete="off" disabled></el-input>
        </el-col>
        <el-col :span="4">
          <el-tag effect="plain" @click="showInvoce()"><i class="el-icon-full-screen"></i> {{$t('__clickToViewInvoice')}}</el-tag>
        </el-col>
      </el-form-item>
      <invoice
      ref="invoiceHead"
      v-if="dialogShowInvoice"
      :dialogType="dialogTypeInvoice"
      :dialogShow="dialogShowInvoice"
      :invoiceHead="invoiceHead"
      :ddlCreateID="ddlCreateID"
      @dialog-cancel="dialogCancel()"
      @dialog-save="dialogSave()"
      ></invoice>
    </template>
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
    dialogType: { type: String },
    orderID: { type: String },
    collectionRecords: { type: Object },
    ddlCreateIDBefore: { tpye: Array }
  },
  data () {
    return {
      form: {
        InvoiceID: '',
        InvoiceDate: null,
        OrderID: null,
        PaymentMethod: 4,
        ReceivedDate: null,
        Amount: null,
        Account: null,
        BankID: null,
        Memo: null,
        ReceivedID: null,
        ChequeDate: null
      },
      rules: {
        PaymentMethod: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        ReceivedDate: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        ReceivedID: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }]
      },
      invoiceHead: {},
      dialogTypeInvoice: 'new',
      dialogShowInvoice: false,
      // 以下為下拉式選單專用
      ddlPaymentMethod: [],
      ddlBankID: [],
      ddlCreateID: []
    }
  },
  watch: {
    orderID: function (value) {
      if (value) {
        this.form.OrderID = value
      }
    },
    collectionRecords: function (value) {
      if (this.collectionRecords) {
        this.form = this.collectionRecords
      }
    },
    ddlCreateIDBefore: function (value) {
      if (this.ddlCreateIDBefore) {
        this.ddlCreateID = this.ddlCreateIDBefore
      }
    }
  },
  mounted () {
    this.preLoading()
  },
  methods: {
    preLoading: async function () {
      if (this.collectionRecords) {
        this.form = this.collectionRecords
      }
      if (this.ddlCreateIDBefore) {
        this.ddlCreateID = this.ddlCreateIDBefore
      }

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
        InvoiceID: null,
        InvoiceDate: this.form.ReceivedDate,
        OrderID: this.form.OrderID,
        Title: '',
        UniformNumber: '',
        Amount: this.form.Amount,
        ReceivedDate: this.form.ReceivedDate,
        InvoiceKind: '6',
        Tax: '1',
        CarrierNumber: null,
        Memo: null,
        InvoiceIDFirst: '',
        RandomCode: null,
        CreateID: this.form.ReceivedID,
        Status: '2',
        SalesReturnDate: null
      }

      // 進入修改
      this.dialogTypeInvoice = 'new'
      this.dialogShowInvoice = true
    },
    // 修改發票資訊
    showInvoce: function () {
      // 進入修改
      this.dialogTypeInvoice = 'edit'
      this.dialogShowInvoice = true
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
    },
    dialogCancel: function () {
      this.dialogShowInvoice = false
    },
    dialogSave: function () {
      this.dialogShowInvoice = false
      this.preLoading()
    }
  }
}
</script>
