<template>
  <el-dialog :title="myTitle" :visible="dialogShow" center width="80vw" top="5vh" @close="cancel">
    <el-form ref="invoiceForm" :model="form" :rules="rules" label-width="10vw" label-position="right">
      <el-form-item :label="$t('__orderID')">
          <el-input v-model="form.OrderID" disabled></el-input>
      </el-form-item>
      <el-form-item :label="$t('__invoice')+$t('__kind')" prop="InvoiceKind">
        <el-col :span="8">
          <el-select v-model="form.InvoiceKind" default-first-option filterable clearable :placeholder="$t('__plzChoice')" :disabled="disableForm.InvoiceKind">
            <el-option v-for="item in ddlInvoiceKind" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
              <span style="float: left">{{ item.Value }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('__invoice')+$t('__status')">
            <el-select v-model="form.Status" default-first-option filterable clearable :placeholder="$t('__plzChoice')" :disabled="disableForm.Status">
              <el-option v-for="item in ddlInvoiceStatus" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
                <span style="float: left">{{ item.Value }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item :label="$t('__invoice')+$t('__date')" prop="InvoiceDate">
        <el-col :span="8">
          <el-date-picker
            v-model="form.InvoiceDate"
            type="date"
            :placeholder="$t('__plzChoice')+$t('__invoice')+$t('__date')"
            value-format="yyyy-MM-dd"
            :disabled="disableForm.InvoiceDate">
          </el-date-picker>
        </el-col>
        <el-col :span="10">
            <el-form-item :label="$t('__salesReturn')+$t('__date')">
              <el-date-picker
                v-model="form.SalesReturnDate"
                type="date"
                :placeholder="$t('__plzChoice')+$t('__salesReturn')+$t('__date')"
                value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item :label="$t('__invoice')+$t('__number')" prop="InvoiceID">
        <el-col :span="8">
          <el-input v-mask="'AA########'" v-model="form.InvoiceID" :disabled="disableForm.InvoiceID"></el-input>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('__randomCode')">
            <el-input v-model="form.RandomCode" :disabled="disableForm.RandomCode"></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item :label="$t('__title')">
        <el-col :span="8">
          <el-input v-model="form.Title" maxlength="40" show-word-limit :disabled="disableForm.CreateID"></el-input>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('__uniformNumber')">
            <el-input v-model="form.UniformNumber" maxlength="8" show-word-limit :disabled="disableForm.CreateID"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('__carrierNumber')">
            <el-input v-model="form.CarrierNumber" maxlength="64" show-word-limit :disabled="disableForm.CreateID"></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item :label="$t('__amount')+'/'+$t('__tax')">
        <el-col :span="4">
          <el-input v-model="form.Amount" disabled></el-input>
        </el-col>
        <el-col :span="4">
          <el-input v-model="form.Tax" disabled></el-input>
        </el-col>
        <el-col :span="10">
          <el-form-item :label="$t('__memo')">
            <el-input v-model="form.Memo" maxlength="200" show-word-limit :disabled="disableForm.CreateID"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="$t('__received')+$t('__operator')" prop="CreateID">
            <el-select v-model="form.CreateID" default-first-option filterable clearable :placeholder="$t('__plzChoice')" :disabled="disableForm.CreateID">
              <el-option v-for="item in ddlCreateID" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
                <span style="float: left">{{ item.Value }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form-item>
    </el-form>
    <!-- 發票明細 -->
    <el-collapse v-model="activeNames">
      <el-collapse-item :title="$t('__invoice')+$t('__detail')" name="1">
        <template slot="title">
          <h2>{{$t('__invoice')+$t('__detail')}}<i class="el-icon-circle-plus" v-show="!activeNames.includes('1')"></i></h2>
        </template>
        <el-table
          :data="invoiceDetails"
          stripe
          border
          style="width: 100%">
          <el-table-column
            prop="Seq"
            :label="$t('__seq')">
          </el-table-column>
          <el-table-column
            prop="InvoiceName"
            :label="$t('__invoice')+$t('__name')">
          </el-table-column>
          <el-table-column
            prop="Price"
            :label="$t('__price')"
            :formatter="formatterMoney">
          </el-table-column>
          <el-table-column
            prop="Qty"
            :label="$t('__qty')">
          </el-table-column>
          <el-table-column
            prop="Amount"
            :label="$t('__amount')"
            :formatter="formatterMoney">
          </el-table-column>
          <el-table-column
            prop="Tax"
            :label="$t('__tax')"
            :formatter="formatterMoney">
          </el-table-column>
        </el-table>
      </el-collapse-item>
      <!-- 收款資訊 -->
      <el-collapse-item :title="$t('__binding')+$t('__collectionRecords')" name="2">
        <template slot="title">
          <h2>{{$t('__binding')+$t('__collectionRecords')}}<i class="el-icon-circle-plus" v-show="!activeNames.includes('2')"></i></h2>
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
            :label="$t('__seq')">
          </el-table-column>
          <el-table-column
            prop="InvoiceName"
            :label="$t('__invoice')+$t('__name')">
          </el-table-column>
          <el-table-column
            prop="ReceivedDate"
            :label="$t('__received')+$t('__date')"
            :formatter="formatterDate">
          </el-table-column>
          <el-table-column
            prop="PaymentMethodName"
            :label="$t('__paymentMethod')">
          </el-table-column>
          <el-table-column
            prop="Amount"
            :label="$t('__amount')"
            :formatter="formatterMoney">
          </el-table-column>
          <el-table-column
            prop="Memo"
            :label="$t('__memo')"
            width="100">
          </el-table-column>
        </el-table>
        <div style="color:red" v-show="multipleSelection.length <= 0">{{$t('__pleaseSelectAtLeastOne')+$t('__collectionRecords')}}</div>
      </el-collapse-item>
    </el-collapse>

    <div slot="footer">
      <br/>
      <el-button v-show="fromButtonsShow.delete && buttonsShowUser.delete" type="danger" @click="delInvoice">{{$t('__delete')}}</el-button>
      <el-button v-show="fromButtonsShow.delete && buttonsShowUser.delete" type="danger" @click="invalidInvoice">{{$t('__invalid')}}</el-button>
      <el-button @click="cancel">{{$t('__cancel')}}</el-button>
      <el-button v-show="fromButtonsShow.save && buttonsShowUser.save" type="primary" @click="checkValidate">{{$t('__save')}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import validate from '@/setup/validate.js'
import { formatMoney, formatDate } from '@/setup/format.js'
import { messageBoxYesNo } from '@/services/utils'

export default {
  name: 'InvoiceNewForm',
  props: {
    dialogType: { type: String, default: 'new' },
    dialogShow: { type: Boolean, default: false },
    invoiceHead: { type: Object },
    fromOrderID: { type: String },
    buttonsShowUser: { type: Object },
    fromButtonsShow: { type: Object }
  },
  data () {
    let myValidate = async (rule, value, callback) => {
      // 新增時才檢驗
      if (this.dialogType !== 'new') {
        callback()
        return
      }

      // 1.驗證可用性
      let checkValidate = await validate.validateInvoiceID(rule, value, callback)
      if (checkValidate !== '') {
        callback(checkValidate)
      }

      callback()
    }
    return {
      form: {
        InvoiceID: null,
        InvoiceDate: '',
        OrderID: this.fromOrderID,
        Title: '',
        UniformNumber: '',
        Amount: null,
        ReceivedDate: '',
        InvoiceKind: '2',
        Tax: null,
        CarrierNumber: null,
        Memo: null,
        RandomCode: null,
        CreateID: this.$store.state.userID,
        Status: '2',
        SalesReturnDate: null,
        // 以下為顯示用部紀錄資料庫
        multipleSelection: [{ name: 'q' }]
      },
      rules: {
        InvoiceKind: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        InvoiceDate: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        InvoiceID: [{ required: true, trigger: 'blur', validator: myValidate }],
        CreateID: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }]
      },
      disableForm: {
        InvoiceKind: false,
        InvoiceDate: false,
        InvoiceID: false,
        RandomCode: false,
        Status: false,
        CreateID: false,
        SalesReturnDate: true,
        selectCollectionRecords: false
      },
      myTitle: '',
      activeNames: ['1', '2'],
      selectCollectionRecords: [],
      multipleSelection: [],
      // 發票明細
      invoiceDetail: {
        InvoiceID: null,
        Seq: 0,
        InvoiceName: '',
        Price: 0,
        Qty: 0,
        Amount: 0,
        Tax: 0
      },
      invoiceDetails: [],
      // 以下為下拉式選單專用
      ddlInvoiceKind: [],
      ddlInvoiceStatus: [],
      ddlCreateID: []
    }
  },
  mounted () {
    if (Object.keys(this.invoiceHead).length > 0) {
      this.form = JSON.parse(JSON.stringify(this.invoiceHead))
    } else {
      let tempDate = new Date()
      this.form.InvoiceDate = formatDate(tempDate.toISOString().slice(0, 10))
      this.form.ReceivedDate = formatDate(tempDate.toISOString().slice(0, 10))
    }

    switch (this.dialogType) {
      case 'new':
        this.myTitle = this.$t('__new') + this.$t('__invoice')
        break
      case 'edit':
        this.myTitle = this.$t('__edit') + this.$t('__invoice')
        this.disableForm.InvoiceKind = true
        this.disableForm.InvoiceDate = true
        this.disableForm.InvoiceID = true
        this.disableForm.RandomCode = true
        this.disableForm.Status = true
        this.disableForm.selectCollectionRecords = true
        if (this.fromButtonsShow.save === 0) {
          this.disableForm.CreateID = true
        }
        break
    }

    this.preLoading()
  },
  methods: {
    formatterDate: function (row, column, cellValue, index) {
      return formatDate(cellValue)
    },
    formatterMoney: function (row, column, cellValue, index) {
      return formatMoney(cellValue)
    },
    preLoading: async function () {
      let response = this.$api.local.getDropdownList({ type: 'InvoiceKind' })
      this.ddlInvoiceKind = response
      response = this.$api.local.getDropdownList({ type: 'InvoiceStatus' })
      this.ddlInvoiceStatus = response
      let response4 = await this.$api.orders.getDropdownList({ type: 'employee' })
      this.ddlCreateID = response4.data.result

      switch (this.dialogType) {
        case 'new':
          let responseRecords = await this.$api.orders.invoiceFunctions({ type: 'recordsNotSelect', OrderID: this.form.OrderID, InvoiceID: this.form.InvoiceID })
          this.selectCollectionRecords = responseRecords.data.result
          break
        case 'edit':
          let responseRecordsSelected = await this.$api.orders.invoiceFunctions({ type: 'recordsSelected', OrderID: this.form.OrderID, InvoiceID: this.form.InvoiceID })
          this.selectCollectionRecords = responseRecordsSelected.data.result
          // 只選出已關聯的Row, 預設全部選取
          this.$nextTick(() => {
            this.$refs.multipleTable.tableData.forEach(row => {
              this.$refs.multipleTable.toggleRowSelection(row)
            })
          })

          // 發票明細
          let responseInvoiceDetail = await this.$api.orders.getObject({ type: 'invoiceDetail', keyword: this.form.InvoiceID })
          this.invoiceDetails = responseInvoiceDetail.data.result
          break
      }
    },
    // 檢查輸入
    checkValidate: function () {
      // 檢察收款紀錄, 必定要選取
      if (this.multipleSelection.length <= 0) {
        return
      }

      // 新增時要一筆筆紀錄綁定資訊
      this.$refs['invoiceForm'].validate(async (valid) => {
        if (valid) {
          await this.save(this.dialogType)

          // 勾選的收款紀錄
          let seqList = []
          let seqString = ''
          this.multipleSelection.forEach(item => {
            seqList.push(item.Seq)
          })
          seqString = seqList.join(',')
          await this.$api.orders.invoiceFunctions({ type: 'invoiceBindRecords', OrderID: this.form.OrderID, InvoiceID: this.form.InvoiceID, Seq: seqString })

          // 發票明細
          for (let i = 0; i < this.invoiceDetails.length; i++) {
            let item = this.invoiceDetails[i]
            item.InvoiceID = this.form.InvoiceID
            await this.$api.orders.invoiceDetailUpdate({ form: item })
          }

          this.$emit('dialog-save')
        }
      })
    },
    // 收款紀錄檢查是否能選擇
    checkSelectable: function (row) {
      return !this.disableForm.selectCollectionRecords
    },
    // 選擇收款紀錄
    handleSelectionChange: function (selection) {
      this.multipleSelection = selection

      // reset
      let totalAmount = 0
      let totalTax = 0
      this.invoiceDetails = []

      this.multipleSelection.forEach(item => {
        totalAmount += item.Amount
        totalTax += item.Tax

        if (this.dialogType === 'new') {
          // 統計發票明細
          // 有相同發票名稱,單價 就疊加 數量,金額
          let findResult = this.invoiceDetails.find(item2 => { return item2.InvoiceName === item.InvoiceName && item2.Price === item.Amount })
          if (findResult === undefined) {
            let newObj = JSON.parse(JSON.stringify(this.invoiceDetail))
            // find Maximum Seq
            let nextSeq = 1
            if (this.invoiceDetails.length === 0) {
              nextSeq = 1
            } else {
              let amounts = this.invoiceDetails.map(item3 => item3.Seq)
              let highestSeq = Math.max(...amounts)
              nextSeq = highestSeq + 1
            }
            newObj.Seq = nextSeq
            newObj.InvoiceID = this.form.InvoiceID
            newObj.InvoiceName = item.InvoiceName
            newObj.Price = item.Amount
            newObj.Qty = 1
            newObj.Amount = item.Amount
            newObj.Tax = item.Tax
            this.invoiceDetails.push(newObj)
          } else {
            findResult.Qty += 1
            findResult.Amount += item.Amount
            findResult.Tax += item.Tax
          }
        }
      })
      this.form.Amount = totalAmount
      this.form.Tax = totalTax
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
        case 'edit':
          let responseEdit = await this.$api.orders.invoiceHeadUpdate({ form: this.form })
          if (responseEdit.headers['code'] === '200') {
            this.$alert(responseEdit.data.result[0].message, responseEdit.data.result[0].code)
            isSuccess = true
          }
          break
        case 'invalid':
          let responseInvalid = await this.$api.orders.invoiceHeadInvalid({ form: this.form })
          if (responseInvalid.headers['code'] === '200') {
            this.$alert(responseInvalid.data.result[0].message, responseInvalid.data.result[0].code)
            isSuccess = true
          }
          break
        case 'delete':
          let responseDelete = await this.$api.orders.invoiceHeadDelete({ form: this.form })
          if (responseDelete.headers['code'] === '200') {
            this.$alert(responseDelete.data.result[0].message, responseDelete.data.result[0].code)
            isSuccess = true
          }
          break
      }

      return isSuccess
    },
    // 作廢發票
    invalidInvoice: async function () {
      if (!this.form.SalesReturnDate) {
        this.$message.error(this.$t('__plzChoice') + this.$t('__salesReturn') + this.$t('__date'), this.$t('__invalid'))
        return
      }
      let answerAction = await messageBoxYesNo(this.$t('__invalid') + this.$t('__invoice'), this.$t('__invalid'))

      switch (answerAction) {
        case 'confirm':
          this.form.Status = '0'
          this.fromButtonsShow = {
            new: 0,
            edit: 0,
            save: 0,
            delete: 0,
            search: 0
          }
          await this.save('invalid')

          this.$emit('dialog-save')
          break
        case 'cancel':
          break
        case 'close':
          break
      }
    },
    // 刪除發票
    delInvoice: async function () {
      let answerAction = await messageBoxYesNo(this.$t('__delete') + this.$t('__invoice'), this.$t('__delete'))

      switch (answerAction) {
        case 'confirm':
          this.form.Status = '0'
          this.fromButtonsShow = {
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
