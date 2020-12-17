<template>
  <el-dialog :title="myTitle" :visible="dialogShow" center width="80vw" @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="10vw" label-position="right">
      <el-form-item :label="$t('__paymentMethod')" prop="PaymentMethod">
        <el-select v-model="form.PaymentMethod" value-key="value" :placeholder="$t('__plzChoice')" :disabled="disableForm.PaymentMethod">
          <el-option v-for="item in ddlPaymentMethod" :key="item.ID" :label="item.Value" :value="item.ID">
            <span style="float: left">{{ item.Value }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <method1 ref="method1" v-if="form.PaymentMethod === '1'" :form="form" :disableForm="disableForm"></method1>
      <method2 ref="method2" v-if="form.PaymentMethod === '2'" :form="form" :disableForm="disableForm" :ddlBankID="ddlBankID"></method2>
      <method3 ref="method3" v-if="form.PaymentMethod === '3'" :form="form" :disableForm="disableForm"></method3>
      <method4 ref="method4" v-if="form.PaymentMethod === '4'" :form="form" :disableForm="disableForm" :ddlBankID="ddlBankID"></method4>
      <method5 ref="method5" v-if="form.PaymentMethod === '5'" :form="form" :disableForm="disableForm" :ddlBankID="ddlBankID"></method5>
      <el-form-item :label="$t('__memo')">
          <el-input v-model="form.Memo" maxlength="200" show-word-limit></el-input>
      </el-form-item>
      <el-form-item :label="$t('__invoice')+$t('__number')">
          <el-input v-model="form.InvoiceID" maxlength="200" show-word-limit disabled></el-input>
      </el-form-item>
      <el-form-item :label="$t('__received')+$t('__operator')" prop="ReceivedID">
        <el-select v-model="form.ReceivedID" value-key="value" :placeholder="$t('__plzChoice')" :disabled="disableForm.ReceivedID">
          <el-option v-for="item in ddlCreateID" :key="item.ID" :label="item.Value" :value="item.ID">
            <span style="float: left">{{ item.Value }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button v-show="buttonsShow.delete && buttonsShowUser.delete" type="danger" @click="delRecord">{{$t('__delete')}}</el-button>
      <el-button @click="cancel">{{$t('__cancel')}}</el-button>
      <el-button v-show="buttonsShow.save && buttonsShowUser.save" type="primary" @click="checkValidate">{{$t('__save')}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import method1 from './paymentMethod1'
import method2 from './paymentMethod2'
import method3 from './paymentMethod3'
import method4 from './paymentMethod4'
import method5 from './paymentMethod5'
import { messageBoxYesNo } from '@/services/utils'

export default {
  name: 'CollectionRecordsNewForm',
  components: {
    method1,
    method2,
    method3,
    method4,
    method5
  },
  props: {
    dialogType: { type: String, default: 'new' },
    dialogShow: { type: Boolean, default: false },
    collectionRecord: { type: Object },
    orderID: { type: String },
    orderAmount: { type: Number },
    buttonsShowUser: { type: Object }
  },
  data () {
    return {
      form: {
        InvoiceID: '',
        OrderID: this.orderID,
        PaymentMethod: '1',
        ReceivedDate: new Date(),
        Amount: this.orderAmount,
        Account: null,
        BankID: null,
        Memo: null,
        ReceivedID: this.$store.state.userID,
        ChequeDate: null
      },
      rules: {
        PaymentMethod: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        ReceivedDate: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        ReceivedID: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }]
      },
      // 系統目前狀態權限
      buttonsShow: {
        new: 1,
        edit: 0,
        save: 1,
        delete: 0,
        search: 1
      },
      disableForm: {
        PaymentMethod: false,
        ReceivedDate: false,
        Amount: false,
        Account: false,
        BankID: false,
        ReceivedID: false,
        ChequeDate: false
      },
      myTitle: '',
      // 以下為下拉式選單專用
      ddlPaymentMethod: [],
      ddlBankID: [],
      ddlCreateID: []
    }
  },
  mounted () {
    if (Object.keys(this.collectionRecord).length > 0) {
      this.form = JSON.parse(JSON.stringify(this.collectionRecord))
    }
    switch (this.dialogType) {
      case 'new':
        this.myTitle = this.$t('__new') + this.$t('__collectionRecords')
        break
      case 'edit':
        this.myTitle = this.$t('__edit') + this.$t('__collectionRecords')
        this.disableForm.PaymentMethod = true
        // this.disableForm.ReceivedDate = true
        this.disableForm.Amount = true
        this.disableForm.Account = true
        this.disableForm.BankID = true
        this.disableForm.ReceivedID = true
        this.disableForm.ChequeDate = true
        if (this.form.Status === '0') {
          this.buttonsShow = {
            new: 0,
            edit: 0,
            save: 0,
            delete: 0,
            search: 0
          }
        } else {
          this.buttonsShow = {
            new: 1,
            edit: 1,
            save: 1,
            delete: 1,
            search: 1
          }
        }
        break
    }
    this.preLoading()
  },
  methods: {
    // 讀取預設資料
    preLoading: async function () {
      let response3 = await this.$api.orders.getDropdownList({ type: 'employee' })
      this.ddlCreateID = response3.data.result
      let response1 = await this.$api.orders.getDropdownList({ type: 'paymentMethod' })
      this.ddlPaymentMethod = response1.data.result
      let response2 = await this.$api.orders.getDropdownList({ type: 'bankID' })
      this.ddlBankID = response2.data.result
    },
    // 檢查輸入
    checkValidate: async function () {
      let isSuccess = false
      switch (this.form.PaymentMethod) {
        case '1':
          isSuccess = await this.$refs['method1'].checkValidate()
          break
        case '2':
          isSuccess = await this.$refs['method2'].checkValidate()
          break
        case '3':
          isSuccess = await this.$refs['method3'].checkValidate()
          break
        case '4':
          isSuccess = await this.$refs['method4'].checkValidate()
          break
        case '5':
          isSuccess = await this.$refs['method5'].checkValidate()
          break
      }
      if (!isSuccess) { return }

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
        case 'new':
          let responseNew = await this.$api.orders.collectionRecordsNew({ form: this.form })
          if (responseNew.headers['code'] === '200') {
            this.$alert(responseNew.data.result[0].message, responseNew.data.result[0].code)
            isSuccess = true
          }
          break
        case 'edit':
          let responseEdit = await this.$api.orders.collectionRecordsEdit({ form: this.form })
          if (responseEdit.headers['code'] === '200') {
            this.$alert(responseEdit.data.result[0].message, responseEdit.data.result[0].code)
            isSuccess = true
          }
          break
        case 'delete':
          let responseDelete = await this.$api.orders.collectionRecordsDelete({ form: this.form })
          if (responseDelete.headers['code'] === '200') {
            this.$alert(responseDelete.data.result[0].message, responseDelete.data.result[0].code)
            isSuccess = true
          }
          break
      }

      if (isSuccess) {
        this.$emit('dialog-save')
      }
    },
    // 刪除
    delRecord: async function () {
      if (this.form.InvoiceID !== '') {
        this.$alert(this.$t('__collectioRecordsDeleteNo') + this.$t('__invoice') + this.$t('__number'), this.$t('__warrning'))
        return
      }
      let answerAction = await messageBoxYesNo(this.$t('__delete') + this.$t('__collectionRecords'), this.$t('__delete'))

      switch (answerAction) {
        case 'confirm':
          this.form.Status = '0'
          this.buttonsShow = {
            new: 0,
            edit: 0,
            save: 0,
            delete: 0,
            search: 0
          }
          this.save('delete')
          break
        case 'cancel':
          break
        case 'close':
          break
      }
    }
  }
}
</script>
