<template>
  <el-dialog :title="myTitle" :visible="dialogShow" center width="80vw" @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="10vw" label-position="right">
      <h4 style="text-align:center;color:red">{{$t('__installmentBatchEditWarning')}}</h4>
      <el-form-item :label="$t('__installment')+$t('__name')" prop="InstallmentName">
        <el-col :span="8">
          <el-input v-model="form.InstallmentName" maxlength="10" show-word-limit :disabled="disableForm.InstallmentName"></el-input>
        </el-col>
        <el-col :span="8">
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
      <el-form-item :label="$t('__paymentMethod')" prop="PaymentMethod">
        <el-col :span="8">
          <el-select v-model="form.PaymentMethod" value-key="value" :placeholder="$t('__plzChoice')" :disabled="disableForm.PaymentMethod">
            <el-option v-for="item in ddlPaymentMethod" :key="item.ID" :label="item.Value" :value="item.ID">
              <span style="float: left">{{ item.Value }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('__installmentPaymentFrequency')">
            <el-select v-model="form.PaymentFrequency" value-key="value" :placeholder="$t('__plzChoice')" @change="paymentFrequencyChange">
              <el-option v-for="item in ddlPaymentFrequency" :key="item.ID" :label="item.Value" :value="item.ID">
                <span style="float: left">{{ item.Value }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('__installmentSeq')">
            <el-input-number v-model="form.Seq" :min="1" :disabled="disableForm.Seq"></el-input-number>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item :label="$t('__memo')">
          <el-input v-model="form.Memo" maxlength="100" show-word-limit></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click.prevent="installmentReCal">{{$t('__installmentReCal')}}</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="subList"
      stripe
      border
      :row-class-name="tableRowClassName"
      style="width: 100%">
      <el-table-column
        prop="Seq"
        :label="$t('__installmentSeq')"
        width="60px">
      </el-table-column>
      <el-table-column
        prop="InstallmentName"
        :label="$t('__installment')+$t('__name')">
        <template slot-scope="scope">
          <span v-if="scope.row.PaidAmount!==0">{{scope.row[scope.column.property]}}</span>
          <el-input v-else v-model="scope.row[scope.column.property]" @change="rowChange(scope.row)"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="ScheduledDate"
        :label="$t('__installmentScheduledDate')">
        <template slot-scope="scope">
          <span v-if="scope.row.PaidAmount!==0">{{formatterDate(null,null,scope.row[scope.column.property],null)}}</span>
          <el-date-picker
            v-else
            v-model="scope.row[scope.column.property]"
            type="date"
            value-format="yyyy-MM-dd"
            :placeholder="$t('__installmentScheduledDate')"
            :disabled="disableForm.ScheduledDate"
            @change="rowChange(scope.row)">
          </el-date-picker>
        </template>
      </el-table-column>
      <el-table-column
        prop="ScheduledAmount"
        :label="$t('__installmentScheduledAmount')">
        <template slot-scope="scope">
          {{formatterMoney(scope.row[scope.column.property])}}
        </template>
      </el-table-column>
      <el-table-column
        prop="PaidAmount"
        :label="$t('__paidAmount')">
        <template slot-scope="scope">
          {{formatterMoney(scope.row[scope.column.property])}}
        </template>
      </el-table-column>
      <el-table-column
        prop="PaymentMethod"
        :label="$t('__paymentMethod')"
        width="100px">
        <template slot-scope="scope">
          <span v-if="scope.row.PaidAmount!==0">{{scope.row.PaymentMethodName}}</span>
          <el-select v-else v-model="scope.row[scope.column.property]" value-key="value" :placeholder="$t('__plzChoice')" :disabled="disableForm.PaymentMethod" @change="rowChange(scope.row)">
            <el-option v-for="item in ddlPaymentMethod" :key="item.ID" :label="item.Value" :value="item.ID">
              <span style="float: left">{{ item.Value }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
            </el-option>
          </el-select>
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{$t('__cancel')}}</el-button>
      <el-button v-show="buttonsShowUser.save" type="primary" @click="checkValidate">{{$t('__save')}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { formatDate, formatMoney } from '@/setup/format.js'

export default {
  name: 'InstallmentBatchEdit',
  props: {
    dialogType: { type: String, default: 'new' },
    dialogShow: { type: Boolean, default: false },
    fromInstallmentShow: { type: Array },
    orderID: { type: String },
    buttonsShowUser: { type: Object }
  },
  data () {
    return {
      form: {
        OrderID: this.orderID,
        Seq: 0,
        InstallmentName: '',
        ScheduledDate: '',
        ScheduledAmount: 0,
        PaymentMethod: 1,
        PaymentFrequency: 1,
        Memo: '',
        // 顯示用
        PaymentFrequencyName: ''
      },
      rules: {
        InstallmentName: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        ScheduledDate: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        PaymentMethod: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }]
      },
      disableForm: {
        InstallmentName: false,
        ScheduledAmount: false,
        PaymentFrequency: false,
        Seq: false
      },
      myTitle: '',
      subList: [],
      installment: {},
      freezeCount: 1, // 已經繳款過的筆數, 預設為1, 躉繳
      // 以下為下拉式選單專用
      ddlPaymentMethod: [],
      ddlPaymentFrequency: []
    }
  },
  mounted () {
    this.subList = JSON.parse(JSON.stringify(this.fromInstallmentShow))
    this.subList.forEach(row => { row.Status = '' })
    let row = this.subList[0]
    this.form.OrderID = row.OrderID
    this.form.Seq = this.subList.length
    this.form.InstallmentName = row.InstallmentName.substring(0, row.InstallmentName.indexOf('-'))
    this.form.ScheduledDate = row.ScheduledDate
    this.form.ScheduledAmount = row.ScheduledAmount
    this.form.PaymentMethod = row.PaymentMethod
    this.form.PaymentFrequency = row.PaymentFrequency
    this.form.Memo = row.Memo
    this.form.PaymentFrequencyName = row.PaymentFrequencyName

    switch (this.dialogType) {
      case 'batch':
        this.myTitle = this.$t('__installmentChange')
    }
    this.preLoading()
    this.paymentFrequencyChange(this.form.PaymentFrequency)
  },
  methods: {
    formatterDate: function (row, column, cellValue, index) {
      return formatDate(cellValue)
    },
    formatterMoney: function (cellValue) {
      return formatMoney(cellValue)
    },
    // table 變更顏色
    tableRowClassName ({ row, rowIndex }) {
      if (row.Status === 'Deleted') {
        return 'hidden-row'
      } else if (row.PaidAmount !== 0) {
        return 'disabled-row'
      }
    },
    // 讀取預設資料
    preLoading: async function () {
      let response1 = await this.$api.orders.getDropdownList({ type: 'paymentMethod' })
      this.ddlPaymentMethod = response1.data.result
      let response2 = await this.$api.orders.getDropdownList({ type: 'paymentFrequency' })
      this.ddlPaymentFrequency = response2.data.result

      // 帶入訂單最大金額
      let responseRecords = await this.$api.orders.collectionRecordsFunctions({ type: 'installmentBatchEditNew', OrderID: this.orderID, Seq: null })
      let order = responseRecords.data.result[0]
      this.form.ScheduledAmount = order.Amount
    },
    // 分期頻率名稱
    paymentFrequencyChange: function (selected) {
      switch (selected) {
        case '1': // 躉繳
          this.form.Seq = 1
          this.disableForm.Seq = true
          break
        default:
          if (this.form.Seq === 1) {
            this.form.Seq = 2
          }
          this.disableForm.Seq = false
          break
      }
      let findItem = this.ddlPaymentFrequency.find(item => { return item.ID === selected })
      if (findItem !== undefined) {
        this.form.PaymentFrequencyName = findItem.Value
      }
    },
    // 分期金額計算
    reCalInstallmentAmount: function () {
      // 計算每個月金額
      // 已經繳款過的金額禁止更改
      let fullAmount = this.form.ScheduledAmount
      let freezeCount = 0 // 已繳款分期
      let lastCount = 0 // 未繳款分期
      let freezeScheduledAmount = 0
      this.subList.forEach(row => {
        if (row.PaidAmount !== 0) {
          freezeCount += 1
          freezeScheduledAmount += row.ScheduledAmount
        }
      })
      fullAmount -= freezeScheduledAmount
      lastCount = this.form.Seq - freezeCount
      // 計算一般款以及最後一期款項
      let partAmount = 0 // 未繳款分期款
      let finalAmount = 0 // 最後一期分期款
      if (lastCount > 0) {
        partAmount = Math.floor(fullAmount / lastCount)
        finalAmount = fullAmount - partAmount * (lastCount - 1)
      }

      // 開始填入應付金額
      let partAmountList = []
      for (let i = 1; i <= this.form.Seq; i++) {
        if (i !== this.form.Seq) {
          partAmountList.push(partAmount)
        } else {
          partAmountList.push(finalAmount)
        }
      }
      // 計算每個月金額 - end

      return partAmountList
    },
    // 分期日期計算
    reCalInstallmentDate: function () {
      let frequency = this.form.PaymentFrequency
      // 計算每個月日期
      let startDate = new Date(this.form.ScheduledDate)

      // 開始填入日期
      let partAmountList = []
      for (let i = 1; i <= this.form.Seq; i++) {
        if (i > 1) {
          switch (frequency) {
            case '2': // 月繳
              startDate = new Date(startDate.setMonth(startDate.getD() + 1))
              break
            case '3': // 季繳
              startDate = new Date(startDate.setMonth(startDate.getMonth() + 3))
              break
            case '4': // 年繳
              startDate = new Date(startDate.setMonth(startDate.getMonth() + 12))
              break
          }
        }
        let tempValue = startDate.toISOString().slice(0, 10)
        partAmountList.push(tempValue)
      }
      // 計算每個月日期 - end
      return partAmountList
    },
    // 變更分期頻率
    installmentReCal: function () {
      // Initial
      this.subList = JSON.parse(JSON.stringify(this.fromInstallmentShow))
      this.subList.forEach(row => {
        // 已付款禁止修改
        if (row.PaidAmount !== 0) {
          row.Status = ''
        } else {
          row.Status = 'Deleted'
        }
      })
      let sampleRow = JSON.parse(JSON.stringify(this.subList[0]))

      let partAmountList = this.reCalInstallmentAmount()
      let partDateList = this.reCalInstallmentDate()

      // 產生清單
      for (let i = 1; i <= this.form.Seq; i++) {
        let needInsertRow = false
        let row = this.subList[i - 1]

        if (row === undefined) {
          needInsertRow = true
          row = JSON.parse(JSON.stringify(sampleRow))
          row.Status = 'New'
          row.ReceivedDate = null
          row.PaidAmount = 0
        } else {
          // 已付款禁止修改
          if (row.PaidAmount !== 0) {
            continue
          }
          row.Status = 'Modified'
        }
        row.Seq = i
        row.ScheduledDate = partDateList[i - 1]
        row.ScheduledAmount = partAmountList[i - 1]
        row.PaymentMethod = this.form.PaymentMethod
        row.PaymentFrequency = this.form.PaymentFrequency
        row.Memo = this.form.Memo
        // 分期付款名稱
        if (this.form.PaymentFrequency === '1') {
          row.InstallmentName = this.form.InstallmentName + '-躉繳'
        } else {
          row.InstallmentName = this.form.InstallmentName + '-分期第' + this.form.Seq.toString() + '-' + i.toString() + '期'
        }

        if (needInsertRow) {
          this.subList.push(row)
        }
      }
    },
    // 有異動資料
    rowChange: function (row) {
      if (row.Status !== 'New') {
        row.Status = 'Modified'
      }
    },
    // 檢查輸入
    checkValidate: function () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.beforeSave()
        }
      })
    },
    // 存檔前先過濾
    beforeSave: async function () {
      let isSuccess = false

      for (let i = 0; i < this.subList.length; i++) {
        let row = this.subList[i]
        switch (row.Status) {
          case 'New':
            isSuccess = await this.save('new', row)
            break
          case 'Modified':
            isSuccess = await this.save('edit', row)
            break
          case 'Deleted':
            isSuccess = await this.save('delete', row)
            break
          default:
            isSuccess = true
            break
        }
        if (!isSuccess) { return isSuccess }
      }

      if (isSuccess) {
        this.$emit('dialog-save')
      }
    },
    // 取消
    cancel: function () {
      this.$emit('dialog-cancel')
    },
    // 存檔
    save: async function (type, row) {
      let isSuccess = false
      switch (type) {
        case 'new':
        case 'edit':
          let responseEdit = await this.$api.orders.installmentDetailUpdate({ form: row })
          if (responseEdit.headers['code'] === '200') {
            isSuccess = true
          }
          break
        case 'delete':
          let responseDelete = await this.$api.orders.installmentDetailDelete({ form: row })
          if (responseDelete.headers['code'] === '200') {
            isSuccess = true
          }
          break
      }
      return isSuccess
    }
  }
}
</script>
