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
      <el-form-item :label="$t('__invoice')+$t('__name')">
        <el-select
          allow-create
          default-first-option
          filterable
          v-model="form.InvoiceName" value-key="value"
          :placeholder="$t('__plzChoice')"
          :disabled="disableForm.ReceivedID">
          <el-option v-for="item in ddlInvoiceName" :key="item.ID" :label="item.Value" :value="item.ID">
            <span style="float: left">{{ item.Value }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
          </el-option>
        </el-select>
        {{$t('__anzaOperateWarning')}}
      </el-form-item>
      <el-form-item :label="$t('__memo')">
          <el-input v-model="form.Memo" maxlength="200" show-word-limit></el-input>
      </el-form-item>
      <el-form-item :label="$t('__received')+$t('__operator')" prop="ReceivedID">
        <el-col :span="8">
        <el-select v-model="form.ReceivedID" value-key="value" :placeholder="$t('__plzChoice')" :disabled="disableForm.ReceivedID">
          <el-option v-for="item in ddlCreateID" :key="item.ID" :label="item.Value" :value="item.ID">
            <span style="float: left">{{ item.Value }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
          </el-option>
        </el-select>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('__invoice')+$t('__number')">
            <el-input v-model="form.InvoiceID" disabled></el-input>
      </el-form-item>
        </el-col>
      </el-form-item>
    </el-form>
    <!-- 發票明細 -->
    <el-collapse v-model="activeNames">
      <!-- 收款資訊 -->
      <el-collapse-item :title="$t('__binding')+$t('__installment')" name="2">
        <template slot="title">
          <h2>{{$t('__binding')+$t('__installment')}}<i class="el-icon-circle-plus" v-show="!activeNames.includes('2')"></i></h2>
        </template>
        <el-table
        ref="multipleTable"
        :data="selectCollectionRecords"
        stripe
        border
        @selection-change="handleSelectionChange"
        style="width: 100%">
          <el-table-column
            type="selection"
            :selectable="checkSelectable"
            width="55">
          </el-table-column>
          <el-table-column
            prop="Seq"
            :label="$t('__seq')"
            width="55px">
          </el-table-column>
          <el-table-column
            prop="InstallmentName"
            :label="$t('__installment')+$t('__name')">
          </el-table-column>
          <el-table-column
            prop="ScheduledDate"
            :label="$t('__installmentScheduledDate')"
            :formatter="formatterDate">
          </el-table-column>
          <el-table-column
            prop="ScheduledAmount"
            :label="$t('__installmentScheduledAmount')"
            :formatter="formatterMoneyUS">
          </el-table-column>
          <el-table-column
            prop="PaidAmount"
            :label="$t('__paidAmount')">
            <template slot-scope="scope">
              <span v-if="disableForm.selectCollectionRecords">{{formatterMoneyUS(null,null,scope.row[scope.column.property],null)}}</span>
              <el-input-number v-else v-model="scope.row.PaidAmount" :min="0" :max="scope.row.MaxAmount" @change="maxAmountChange"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column
            prop="ReceivedDate"
            :label="$t('__received')+$t('__date')"
            :formatter="formatterDate">
          </el-table-column>
          <el-table-column
            prop="PaymentMethodName"
            :label="$t('__paymentMethod')"
            width="100px">
          </el-table-column>
        </el-table>
        <div style="color:red" v-show="multipleSelection.length <= 0">{{$t('__pleaseSelectAtLeastOne')+$t('__installment')}}</div>
      </el-collapse-item>
    </el-collapse>
    <div slot="footer">
      <el-button v-show="buttonsShow.delete && buttonsShowUser.delete" type="danger" @click="delRecord">{{$t('__delete')}}</el-button>
      <el-button @click="cancel">{{$t('__cancel')}}</el-button>
      <el-button v-show="buttonsShow.save && buttonsShowUser.save" type="primary" @click="checkValidate">{{$t('__save')}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import method1 from './paymentMethods/paymentMethod1'
import method2 from './paymentMethods/paymentMethod2'
import method3 from './paymentMethods/paymentMethod3'
import method4 from './paymentMethods/paymentMethod4'
import method5 from './paymentMethods/paymentMethod5'
import { messageBoxYesNo } from '@/services/utils'
import { formatMoney, formatDate } from '@/setup/format.js'

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
    fromOrderID: { type: String },
    buttonsShowUser: { type: Object }
  },
  data () {
    return {
      form: {
        OrderID: this.fromOrderID,
        Seq: 0,
        InvoiceID: '',
        PaymentMethod: '1',
        ReceivedDate: '',
        Amount: 0,
        Account: null,
        BankID: null,
        Memo: null,
        ReceivedID: this.$store.state.userID,
        ChequeDate: null,
        InvoiceName: ''
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
        Amount: true,
        Account: false,
        BankID: false,
        ReceivedID: false,
        ChequeDate: false
      },
      myTitle: '',
      activeNames: ['2'],
      selectCollectionRecords: [],
      multipleSelection: [],
      // 以下為下拉式選單專用
      ddlPaymentMethod: [],
      ddlBankID: [],
      ddlCreateID: [],
      ddlInvoiceName: []
    }
  },
  async mounted () {
    if (Object.keys(this.collectionRecord).length > 0) {
      this.form = JSON.parse(JSON.stringify(this.collectionRecord))
    } else {
      let tempDate = new Date()
      this.form.ReceivedDate = formatDate(tempDate.toISOString().slice(0, 10))
    }

    switch (this.dialogType) {
      case 'new':
        this.myTitle = this.$t('__new') + this.$t('__collectionRecords')
        break
      case 'edit':
        this.myTitle = this.$t('__edit') + this.$t('__collectionRecords')
        this.disableForm.PaymentMethod = true
        this.disableForm.Account = true
        this.disableForm.BankID = true
        this.disableForm.ReceivedID = true
        this.disableForm.ChequeDate = true
        this.disableForm.selectCollectionRecords = true
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
    await this.preLoading()
  },
  methods: {
    formatterDate: function (row, column, cellValue, index) {
      return formatDate(cellValue)
    },
    formatterMoneyUS: function (row, column, cellValue, index) {
      return formatMoney(cellValue, 'US')
    },
    // 讀取預設資料
    preLoading: async function () {
      // 預先帶入發票名稱
      let response = await this.$api.orders.collectionRecordsFunctions({ type: 'collectionRecordsNewInvoiceName', OrderID: this.fromOrderID, Seq: this.Seq })
      this.ddlInvoiceName = response.data.result
      if (this.dialogType === 'new') { this.form.InvoiceName = this.ddlInvoiceName[0].ID }

      response = await this.$api.orders.getDropdownList({ type: 'employee' })
      this.ddlCreateID = response.data.result
      response = this.$api.local.getDropdownList({ type: 'PaymentMethod' })
      this.ddlPaymentMethod = response
      response = this.$api.local.getDropdownList({ type: 'BankID' })
      this.ddlBankID = response

      switch (this.dialogType) {
        case 'new':
          let responseRecords = await this.$api.orders.collectionRecordsFunctions({ type: 'recordsNotSelect', OrderID: this.form.OrderID, Seq: this.form.Seq })
          this.selectCollectionRecords = responseRecords.data.result
          break
        case 'edit':
          let responseRecordsSelected = await this.$api.orders.collectionRecordsFunctions({ type: 'recordsSelected', OrderID: this.form.OrderID, Seq: this.form.Seq })
          this.selectCollectionRecords = responseRecordsSelected.data.result
          // 只選出已關聯的Row, 預設全部選取
          this.$nextTick(() => {
            this.$refs.multipleTable.tableData.forEach(row => {
              this.$refs.multipleTable.toggleRowSelection(row)
            })
          })
          break
      }
    },
    // 收款紀錄檢查是否能選擇
    checkSelectable: function (row) {
      return !this.disableForm.selectCollectionRecords
    },
    // 選擇收款紀錄
    handleSelectionChange: function (selection) {
      this.multipleSelection = selection
      this.reCalAmount()
    },
    // 變更應繳金額
    maxAmountChange: function () {
      this.reCalAmount()
    },
    // 計算應繳總額
    reCalAmount: function () {
      let totalAmount = 0

      this.multipleSelection.forEach(item => {
        totalAmount += item.PaidAmount
      })
      this.form.Amount = totalAmount
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

      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          await this.save(this.dialogType)

          // 勾選的分期付款
          let seqList = []
          let seqString = ''
          this.multipleSelection.forEach(item => {
            seqList.push({
              IDSeq: item.Seq,
              PaidAmount: item.PaidAmount })
          })
          seqString = JSON.stringify(seqList)
          await this.$api.orders.collectionRecordsFunctions({ type: 'cRecordsBindInstallments', OrderID: this.form.OrderID, Seq: this.form.Seq, BindSeq: seqString })

          this.$emit('dialog-save')
        }
      })
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
            // 取得單號回填後續資料
            this.form.Seq = responseNew.data.result[0].Seq
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

      return isSuccess
    },
    // 刪除
    delRecord: async function () {
      if (this.form.InvoiceID !== '') {
        this.$alert(this.$t('__collectioRecordsDeleteNo') + this.$t('__invoice') + this.$t('__number'), this.$t('__warning'))
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
          await this.save('delete')

          this.$emit('dialog-save')
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
