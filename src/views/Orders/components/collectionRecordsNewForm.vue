<template>
  <el-dialog :title="myTitle" :visible="dialogShow" center width="80%" @close="cancel">
    <el-form ref="form" :model="form" :rules="rules">
      <el-form-item :label="$t('__paymentMethod')" prop="PaymentMethod" label-width="100px" label-position="left">
        <el-col :span="4">
          <el-select v-model="form.PaymentMethod" value-key="value" :placeholder="$t('__plzChoice')" :disabled="disableForm.PaymentMethod">
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
              value-format="yyyy-MM-dd"
              :placeholder="$t('__plzChoice')+$t('__received')+$t('__date')"
              :disabled="disableForm.ReceivedDate">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="4" class="el-form-item__label">
          {{$t('__received')+$t('__operator')}}
        </el-col>
        <el-col :span="6">
          <el-form-item prop="ReceivedID">
              <el-select v-model="form.ReceivedID" value-key="value" :placeholder="$t('__plzChoice')" :disabled="disableForm.ReceivedID">
                <el-option v-for="item in ddlCreateID" :key="item.ID" :label="item.Value" :value="item.ID">
                  <span style="float: left">{{ item.Value }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
                </el-option>
              </el-select>
            </el-form-item>
        </el-col>
      </el-form-item>
      <method1 ref="method1" v-if="form.PaymentMethod === '1'" :form="form" :disableForm="disableForm"></method1>
      <method2 ref="method2" v-if="form.PaymentMethod === '2'" :form="form" :disableForm="disableForm" :ddlBankID="ddlBankID"></method2>
      <method3 ref="method3" v-if="form.PaymentMethod === '3'" :form="form" :disableForm="disableForm"></method3>
      <method4 ref="method4" v-if="form.PaymentMethod === '4'" :form="form" :disableForm="disableForm" :ddlBankID="ddlBankID"></method4>
      <method5 ref="method5" v-if="form.PaymentMethod === '5'" :form="form" :disableForm="disableForm" :ddlBankID="ddlBankID"></method5>
      <el-form-item :label="$t('__memo')" label-width="100px" label-position="left">
          <el-input v-model="form.Memo" autocomplete="off" maxlength="200" show-word-limit></el-input>
      </el-form-item>
      <el-form-item :label="$t('__invoice')+$t('__number')" label-width="100px" label-position="left">
          <el-input v-model="form.InvoiceID" autocomplete="off" maxlength="200" show-word-limit disabled></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{$t('__cancel')}}</el-button>
      <el-button v-show="buttonsShow.save" type="primary" @click="checkValidate">{{$t('__save')}}</el-button>
      <el-button v-show="buttonsShow.delete" type="danger" @click="delRecord">{{$t('__delete')}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import method1 from './paymentMethod1'
import method2 from './paymentMethod2'
import method3 from './paymentMethod3'
import method4 from './paymentMethod4'
import method5 from './paymentMethod5'

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
    collectionRecord: { type: Object }
  },
  data () {
    return {
      form: {
        InvoiceID: '',
        OrderID: null,
        PaymentMethod: '4',
        ReceivedDate: null,
        Amount: null,
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
    this.form = JSON.parse(JSON.stringify(this.collectionRecord))
    switch (this.dialogType) {
      case 'new':
        this.myTitle = this.$t('__new') + this.$t('__collectionRecords')
        break
      case 'edit':
        this.myTitle = this.$t('__edit') + this.$t('__collectionRecords')
        this.disableForm.PaymentMethod = true
        this.disableForm.ReceivedDate = true
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
    this.preloading()
  },
  methods: {
    // 讀取預設資料
    preloading: async function () {
      const response3 = await this.$api.orders.getDropdownList({ type: 'employee' })
      this.ddlCreateID = response3.data.result
      const response1 = await this.$api.orders.getDropdownList({ type: 'paymentMethod' })
      this.ddlPaymentMethod = response1.data.result
      const response2 = await this.$api.orders.getDropdownList({ type: 'bankID' })
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
          const responseNew = await this.$api.orders.collectionRecordsNew({ form: this.form })
          if (responseNew.status === 200) {
            this.$alert(responseNew.data.result[0].message, responseNew.data.result[0].code)
            isSuccess = true
          }
          break
        case 'edit':
          const responseEdit = await this.$api.orders.collectionRecordsEdit({ form: this.form })
          if (responseEdit.status === 200) {
            this.$alert(responseEdit.data.result[0].message, responseEdit.data.result[0].code)
            isSuccess = true
          }
          break
        case 'delete':
          const responseDelete = await this.$api.orders.collectionRecordsDelete({ form: this.form })
          if (responseDelete.status === 200) {
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
      let myObject = this
      this.$msgbox({
        message: this.$t('__delete') + this.$t('__collectionRecords'),
        title: this.$t('__delete'),
        showCancelButton: true,
        confirmButtonText: this.$t('__ok'),
        cancelButtonText: this.$t('__cancel'),
        type: 'warning',
        closeOnPressEscape: true,
        callback: function (action, instance, done) {
          switch (action) {
            case 'confirm':
              myObject.form.Status = '0'
              myObject.buttonsShow = {
                new: 0,
                edit: 0,
                save: 0,
                delete: 0,
                search: 0
              }
              setTimeout(() => {
                myObject.save('delete')
              }, 300)
              break
            case 'cancel':
              break
            case 'close':
              break
          }
        }
      })
    }
  }
}
</script>
