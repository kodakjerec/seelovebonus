<template>
  <el-dialog :title="myTitle" :visible="dialogShow" center width="80vw" top="5vh" @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="10vw" label-position="right">
      <el-form-item :label="$t('__orderID')">
        <el-col :span="4">
          <el-input v-model="form.OrderID" :disabled="disableForm.OrderID"></el-input>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('__ref')+$t('__function')">
            <el-input v-model="form.refTypeName" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('__ref')+$t('__orderID')">
            <el-input v-model="form.refOrderID" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item :label="$t('__certificate1')">
        <el-col :span="4">
          <el-input v-model="form.Certificate1" :placeholder="$t('__afterSaveWillShow')" :disabled="disableForm.Certificate1"></el-input>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('__certificate1Prefix')">
            <el-select v-model="form.Prefix" default-first-option filterable clearable :placeholder="$t('__plzChoice')" :disabled="disableForm.Prefix">
              <el-option v-for="item in ddlPrefix" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
                <span style="float: left">{{ item.Value }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item :label="$t('__status')">
        <el-col :span="4">
          <el-select v-model="form.Status" default-first-option filterable clearable :placeholder="$t('__plzChoice')" :disabled="!buttonsShowUser.edit">
            <el-option v-for="item in ddlStatus" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
              <span style="float: left">{{ item.Value }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('__printCount')">
              <el-input-number v-model="form.PrintCount" :disabled="disableForm.PrintCount"></el-input-number>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item :label="$t('__issuanceDate')">
          <el-date-picker
            :disabled="!buttonsShowUser.edit"
            v-model="form.IssuanceDate"
            type="date"
            value-format="yyyy-MM-dd">
          </el-date-picker>
      </el-form-item>
      <el-form-item label="Duration">
        <el-select v-model="form.ReportDuration" default-first-option filterable clearable :placeholder="$t('__plzChoice')" :disabled="!buttonsShowUser.edit">
          <el-option v-for="item in ddlReportDuration" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
            <span style="float: left">{{ item.Value }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button v-show="buttonsShow.edit && buttonsShowUser.save" icon="el-icon-printer" @click.prevent="print">{{$t('__print')}}</el-button>
      <p/>
      <el-button v-show="buttonsShow.delete && buttonsShowUser.delete" @click="retakeID">{{$t('__retakeID')}}</el-button>
      <el-button v-show="buttonsShow.delete && buttonsShowUser.delete" type="danger" @click="delRecord">{{$t('__delete')}}</el-button>
      <el-button @click="cancel">{{$t('__cancel')}}</el-button>
      <el-button v-show="buttonsShow.save && buttonsShowUser.save" type="primary" @click="checkValidate">{{$t('__save')}}</el-button>
      <p/>
      <iframeReportingService v-show="buttonsShow.edit && buttonsShowUser.save"
       :reportPath="reportPath"
       :params="reportParams"></iframeReportingService>
    </div>
  </el-dialog>
</template>

<script>
import iframeReportingService from '@/components/iframeReportingService'
import { formatDate } from '@/setup/format.js'
import { messageBoxYesNo } from '@/services/utils'

export default {
  name: 'Certificate1NewForm',
  components: {
    iframeReportingService
  },
  props: {
    dialogType: { type: String, default: 'new' },
    dialogShow: { type: Boolean, default: false },
    certificate1: { type: Object },
    fromOrderID: { type: String },
    buttonsShowUser: { type: Object }
  },
  data () {
    return {
      form: {
        OrderID: this.fromOrderID,
        Certificate1: null,
        PrintCount: 0,
        Status: '1',
        ReportDuration: '1',
        Prefix: '',
        IssuanceDate: ''
      },
      rules: {
        Certificate1: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }]
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
        OrderID: true,
        Certificate1: true,
        PrintCount: true,
        Status: false,
        Prefix: false
      },
      myTitle: '',
      reportPath: 'reports_Certificate1ToExcel',
      reportParams: {},
      // 以下為下拉式選單專用
      ddlStatus: [],
      ddlReportDuration: [],
      ddlPrefix: []
    }
  },
  mounted () {
    if (Object.keys(this.certificate1).length > 0) {
      this.form = JSON.parse(JSON.stringify(this.certificate1))
    } else {
      let tempDate = new Date()
      this.form.IssuanceDate = this.formatterDate(null, null, tempDate.toISOString().slice(0, 10), null)
    }

    switch (this.dialogType) {
      case 'new':
        this.myTitle = this.$t('__new') + this.$t('__certificate1')
        this.buttonsShow = {
          new: 1,
          edit: 0,
          save: 1,
          delete: 0,
          search: 1
        }
        break
      case 'edit':
        this.myTitle = this.$t('__edit') + this.$t('__certificate1')
        this.disableForm.Prefix = true
        if (this.form.Status === '0') {
          this.buttonsShow = {
            new: 0,
            edit: 0,
            save: 0,
            delete: 1,
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

    // 已經被其他單據交換過, 禁止操作
    if (this.form.refType !== '') {
      this.buttonsShow.delete = 0
    }

    this.preLoading()
  },
  methods: {
    formatterDate: function (row, column, cellValue, index) {
      return formatDate(cellValue)
    },
    // 讀取預設資料
    preLoading: function () {
      let response = this.$api.local.getDropdownList({ type: 'Cer1Duration' })
      this.ddlReportDuration = response
      response = this.$api.local.getDropdownList({ type: 'Status' })
      this.ddlStatus = response

      response = this.$api.local.getDropdownList({ type: 'Certificate1Prefix' })
      this.ddlPrefix = response
      this.form.Prefix = this.ddlPrefix[0].ID
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
        case 'new':
          let responseNew = await this.$api.orders.orderCertificate1New({ form: this.form })
          if (responseNew.headers['code'] === '200') {
            this.$alert(responseNew.data.result[0].message, responseNew.data.result[0].code)
            isSuccess = true
          }
          break
        case 'edit':
          let responseEdit = await this.$api.orders.orderCertificate1Edit({ form: this.form })
          if (responseEdit.headers['code'] === '200') {
            this.$alert(responseEdit.data.result[0].message, responseEdit.data.result[0].code)
            isSuccess = true
          }
          isSuccess = true
          break
        case 'delete':
          let responseDelete = await this.$api.orders.orderCertificate1Delete({ form: this.form })
          if (responseDelete.headers['code'] === '200') {
            this.$alert(responseDelete.data.result[0].message, responseDelete.data.result[0].code)
            isSuccess = true
          }
          break
        case 'retakeID':
          // 停用舊單據
          this.form.Status = '0'
          await this.$api.orders.orderCertificate1Edit({ form: this.form })
          // 新增單據
          this.form.Status = '1'
          let responseRetakeID = await this.$api.orders.orderCertificate1New({ form: this.form })
          if (responseRetakeID.headers['code'] === '200') {
            this.$alert(responseRetakeID.data.result[0].message, responseRetakeID.data.result[0].code)
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
      let answerAction = await messageBoxYesNo(this.$t('__delete') + this.$t('__certificate1'), this.$t('__delete'))

      switch (answerAction) {
        case 'confirm':
          this.save('delete')
          break
        case 'cancel':
          break
        case 'close':
          break
      }
    },
    // 列印
    print: function () {
      let strLocale = '2'
      switch (localStorage.getItem('locale')) {
        case 'en':
          strLocale = '1'
          break
        case 'zh':
          strLocale = '2'
          break
      }
      this.reportParams = {
        locale: strLocale,
        keyword: this.form.Certificate1,
        reportDuration: this.form.ReportDuration }

      // 紀錄Log
      this.$api.reports.ssrsReports({ reportParams: this.reportParams, reportName: this.reportPath })

      this.form.PrintCount += 1
    },
    // 重新取號
    retakeID: async function () {
      let answerAction = await messageBoxYesNo(this.$t('__retakeID') + '：' + this.$t('__certificate1') + '<br/>' + this.$t('__retakeIDWarning'), this.$t('__retakeID'))

      switch (answerAction) {
        case 'confirm':
          this.save('retakeID')
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
