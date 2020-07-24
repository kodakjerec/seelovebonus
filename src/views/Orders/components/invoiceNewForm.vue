<template>
  <el-dialog :title="myTitle" :visible="dialogShow" center width="80%" @close="cancel">
    <el-form ref="invoiceForm" :model="form" :rules="rules">
      <el-form-item :label="$t('__orderID')" label-width="100px" label-position="left">
          <el-input v-model="form.OrderID" autocomplete="off" disabled></el-input>
      </el-form-item>
      <el-form-item :label="$t('__invoice')+$t('__kind')" prop="InvoiceKind" label-width="100px" label-position="left">
        <el-col :span="6">
          <el-select v-model="form.InvoiceKind" value-key="value" :placeholder="$t('__plzChoice')" :disabled="disableForm.InvoiceKind">
            <el-option v-for="item in ddlInvoiceKind" :key="item.ID" :label="item.Value" :value="item.ID">
              <span style="float: left">{{ item.Value }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4" class="el-form-item__label">
          {{$t('__invoice')+$t('__status')}}
        </el-col>
        <el-col :span="6">
          <el-select v-model="form.Status" value-key="value" :placeholder="$t('__plzChoice')" :disabled="disableForm.Status">
            <el-option v-for="item in ddlInvoiceStatus" :key="item.ID" :label="item.Value" :value="item.ID">
              <span style="float: left">{{ item.Value }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
            </el-option>
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item :label="$t('__invoice')+$t('__date')" prop="InvoiceDate" label-width="100px" label-position="left">
        <el-date-picker
          v-model="form.InvoiceDate"
          type="date"
          :placeholder="$t('__plzChoice')+$t('__invoice')+$t('__date')"
          format="yyyy - MM - dd"
           :disabled="disableForm.InvoiceDate">
        </el-date-picker>
      </el-form-item>
      <el-form-item :label="$t('__invoice')+$t('__number')" prop="InvoiceID" label-width="100px" label-position="left">
        <el-col :span="10">
          <el-input v-model="form.InvoiceID" autocomplete="off" :disabled="disableForm.InvoiceID"></el-input>
        </el-col>
        <el-col :span="4" class="el-form-item__label">
          {{$t('__randomCode')}}
        </el-col>
        <el-col :span="10">
          <el-form-item>
            <el-input v-model="form.RandomCode" autocomplete="off" :disabled="disableForm.RandomCode"></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item :label="$t('__title')" label-width="100px" label-position="left">
          <el-input v-model="form.Title" autocomplete="off" maxlength="40" show-word-limit></el-input>
      </el-form-item>
      <el-form-item :label="$t('__uniformNumber')" label-width="100px" label-position="left">
          <el-input v-model="form.UniformNumber" autocomplete="off" maxlength="8" show-word-limit></el-input>
      </el-form-item>
      <el-form-item :label="$t('__carrierNumber')" label-width="100px" label-position="left">
          <el-input v-model="form.CarrierNumber" autocomplete="off" maxlength="64" show-word-limit></el-input>
      </el-form-item>
      <el-form-item :label="$t('__received')+$t('__operator')" prop="CreateID" label-width="100px" label-position="left">
        <el-col :span="6">
          <el-select v-model="form.CreateID" value-key="value" :placeholder="$t('__plzChoice')" :disabled="disableForm.CreateID">
            <el-option v-for="item in ddlCreateID" :key="item.ID" :label="item.Value" :value="item.ID">
              <span style="float: left">{{ item.Value }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4" class="el-form-item__label">
          {{$t('__tax')+$t('__status')}}
        </el-col>
        <el-col :span="6">
          <el-select v-model="form.Tax" value-key="value" :placeholder="$t('__plzChoice')" :disabled="disableForm.Tax">
            <el-option v-for="item in ddlTax" :key="item.ID" :label="item.Value" :value="item.ID">
              <span style="float: left">{{ item.Value }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
            </el-option>
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item :label="$t('__memo')" label-width="100px" label-position="left">
          <el-input v-model="form.Memo" autocomplete="off" maxlength="200" show-word-limit></el-input>
      </el-form-item>
      <el-form-item>
        <el-collapse v-model="activeName" accordion="">
          <el-collapse-item :title="$t('__invoice')+$t('__detail')" name="1">
          </el-collapse-item>
          <el-collapse-item :title="$t('__binding')+$t('__collectionRecords')" name="2">
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
                width="100px">
              </el-table-column>
            </el-table>
          </el-collapse-item>
          <div style="color:red" v-show="multipleSelection.length <= 0">{{$t('__pleaseSelectAtLeastOne')+$t('__collectionRecords')}}</div>
        </el-collapse>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <br/>
      <el-button @click="cancel">{{$t('__cancel')}}</el-button>
      <el-button v-show="buttonsShow.save" type="primary" @click="checkValidate">{{$t('__save')}}</el-button>
      <el-button v-show="buttonsShow.delete && dialogType !== 'new'" type="danger" @click="delInvoice">{{$t('__invalid')+$t('__invoice')}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import validate from '@/setup/validate.js'
import { formatMoney, formatDate } from '@/setup/format.js'

export default {
  name: 'InvoiceNewForm',
  props: {
    dialogType: { type: String, default: 'new' },
    dialogShow: { type: Boolean, default: false },
    invoiceHead: { type: Object }
  },
  data () {
    return {
      form: {
        InvoiceID: null,
        InvoiceDate: null,
        OrderID: null,
        Title: null,
        UniformNumber: null,
        Amount: null,
        ReceivedDate: null,
        InvoiceKind: '6',
        Tax: '1',
        CarrierNumber: null,
        Memo: null,
        InvoiceIDFirst: null,
        RandomCode: null,
        CreateID: null,
        Status: '2',
        SalesReturnDate: null,
        multipleSelection: [{ name: 'q' }]
      },
      rules: {
        InvoiceKind: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        InvoiceDate: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        InvoiceID: [{ trigger: 'blur', validator: validate.validateInvoiceID }],
        CreateID: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }]
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
        InvoiceKind: false,
        InvoiceDate: false,
        InvoiceID: false,
        RandomCode: false,
        Tax: true,
        Status: false,
        CreateID: true,
        SalesReturnDate: true,
        selectCollectionRecords: false
      },
      myTitle: '',
      activeName: '2',
      selectCollectionRecords: [],
      multipleSelection: [],
      // 以下為下拉式選單專用
      ddlInvoiceKind: [],
      ddlInvoiceStatus: [],
      ddlTax: [],
      ddlCreateID: []
    }
  },
  mounted () {
    this.form = JSON.parse(JSON.stringify(this.invoiceHead))

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
    formatterDate: function (row, column, cellValue, index) {
      return formatDate(cellValue)
    },
    formatterMoney: function (row, column, cellValue, index) {
      return formatMoney(cellValue)
    },
    preLoading: async function () {
      const response1 = await this.$api.orders.getDropdownList({ type: 'invoiceKind' })
      this.ddlInvoiceKind = response1.data.result
      const response2 = await this.$api.orders.getDropdownList({ type: 'invoiceStatus' })
      this.ddlInvoiceStatus = response2.data.result
      const response3 = await this.$api.orders.getDropdownList({ type: 'tax' })
      this.ddlTax = response3.data.result
      const response4 = await this.$api.orders.getDropdownList({ type: 'employee' })
      this.ddlCreateID = response4.data.result

      switch (this.dialogType) {
        case 'new':
          const responseRecords = await this.$api.orders.invoiceFunctions({ type: 'recordsNotSelect', OrderID: this.form.OrderID, InvoiceID: this.form.InvoiceID })
          this.selectCollectionRecords = responseRecords.data.result
          break
        case 'edit':
          const responseRecordsSelected = await this.$api.orders.invoiceFunctions({ type: 'recordsSelected', OrderID: this.form.OrderID, InvoiceID: this.form.InvoiceID })
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
    // 檢查輸入
    checkValidate: async function () {
      let isSuccess = false
      await this.$refs['invoiceForm'].validate((valid) => { isSuccess = valid })

      // 檢察收款紀錄, 必定要選取
      if (this.multipleSelection.length <= 0) {
        isSuccess = false
      }

      if (isSuccess) {
        this.save(this.dialogType)
        for (let i = 0; i < this.multipleSelection.length; i++) {
          let row = this.multipleSelection[i]
          this.$api.orders.invoiceFunctions({ type: 'invoiceBindRecords', OrderID: row.OrderID, InvoiceID: this.form.InvoiceID, Seq: row.Seq })
        }
      }
    },
    // 收款紀錄檢查是否能選擇
    checkSelectable: function (row) {
      return !this.disableForm.selectCollectionRecords
    },
    // 選擇收款紀錄
    handleSelectionChange: function (selection) {
      this.multipleSelection = selection
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
          const responseNew = await this.$api.orders.invoiceHeadNew({ form: this.form })
          if (responseNew.status === 200) {
            this.$alert(responseNew.data.result[0].message, responseNew.data.result[0].code)
            isSuccess = true
          }
          break
        case 'edit':
          const responseEdit = await this.$api.orders.invoiceHeadEdit({ form: this.form })
          if (responseEdit.status === 200) {
            this.$alert(responseEdit.data.result[0].message, responseEdit.data.result[0].code)
            isSuccess = true
          }
          break
        case 'delete':
          const responseInvalid = await this.$api.orders.invoiceHeadInvalid({ form: this.form })
          if (responseInvalid.status === 200) {
            this.$alert(responseInvalid.data.result[0].message, responseInvalid.data.result[0].code)
            isSuccess = true
          }
          break
      }

      if (isSuccess) {
        this.$emit('dialog-save')
      }
    },
    // 作廢發票
    delInvoice: async function () {
      // if (this.form.InvoiceID !== '') {
      //   this.$alert(this.$t('__collectioRecordsDeleteNo') + this.$t('__invoice') + this.$t('__number'), this.$t('__warrning'))
      //   return
      // }
      let myObject = this
      this.$msgbox({
        message: this.$t('__invalid') + this.$t('__invoice'),
        title: this.$t('__invalid'),
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
