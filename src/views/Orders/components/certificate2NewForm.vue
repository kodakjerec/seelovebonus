<template>
  <el-dialog :title="myTitle" :visible="dialogShow" center width="80%" @close="cancel">
    <el-form ref="form" :model="form" :rules="rules">
      <el-form-item :label="$t('__orderID')" label-width="100px" label-position="left">
          <el-input v-model="form.OrderID" :disabled="disableForm.OrderID"></el-input>
      </el-form-item>
      <el-form-item :label="$t('__certificate2')" label-width="100px" label-position="left">
          <el-input v-model="form.Certificate2" :placeholder="$t('__afterSaveWillShow')" :disabled="disableForm.Certificate2"></el-input>
      </el-form-item>
      <el-form-item :label="$t('__printCount')" label-width="100px" label-position="left">
          <el-input-number v-model="form.PrintCount" :disabled="disableForm.PrintCount"></el-input-number>
      </el-form-item>
      <el-form-item :label="$t('__status')" label-width="100px" label-position="left">
          <el-select v-model="form.Status" value-key="value" :placeholder="$t('__plzChoice')" :disabled="disableForm.Status">
          <el-option v-for="item in ddlStatus" :key="item.ID" :label="item.Value" :value="item.ID">
            <span style="float: left">{{ item.Value }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('__createDate')" label-width="100px" label-position="left">
          <el-date-picker
            v-model="form.CreateDate"
            type="date"
            value-format="yyyy-MM-dd"
            :disabled="disableForm.CreateDate">
          </el-date-picker>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
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
  name: 'Certificate2NewForm',
  components: {
    iframeReportingService
  },
  props: {
    dialogType: { type: String, default: 'new' },
    dialogShow: { type: Boolean, default: false },
    certificate2: { type: Object },
    orderID: { type: String },
    buttonsShowUser: { type: Object }
  },
  data () {
    return {
      form: {
        OrderID: this.orderID,
        Certificate2: '',
        PrintCount: 0,
        Status: '1',
        CreateDate: new Date()
      },
      rules: {
        Certificate2: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }]
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
        Certificate2: true,
        PrintCount: true,
        Status: false,
        CreateDate: false
      },
      myTitle: '',
      reportPath: 'reports_Certificate2ToExcel',
      reportParams: {},
      // 以下為下拉式選單專用
      ddlStatus: []
    }
  },
  mounted () {
    if (Object.keys(this.certificate2).length > 0) {
      this.form = JSON.parse(JSON.stringify(this.certificate2))
      this.form.CreateDate = this.formatterDate(null, null, this.form.CreateDate, null)
    }

    switch (this.dialogType) {
      case 'new':
        this.myTitle = this.$t('__new') + this.$t('__certificate2')
        this.buttonsShow = {
          new: 1,
          edit: 0,
          save: 1,
          delete: 0,
          search: 1
        }
        break
      case 'edit':
        this.myTitle = this.$t('__edit') + this.$t('__certificate2')
        this.disableForm.Certificate2 = true
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
    this.preLoading()
  },
  methods: {
    formatterDate: function (row, column, cellValue, index) {
      return formatDate(cellValue)
    },
    // 讀取預設資料
    preLoading: async function () {
      const response3 = await this.$api.basic.getDropdownList({ type: 'status' })
      this.ddlStatus = response3.data.result
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
          const responseNew = await this.$api.orders.orderCertificate2New({ form: this.form })
          if (responseNew.headers['code'] === '200') {
            this.$alert(responseNew.data.result[0].message, responseNew.data.result[0].code)
            isSuccess = true
          }
          break
        case 'edit':
          const responseEdit = await this.$api.orders.orderCertificate2Edit({ form: this.form })
          if (responseEdit.headers['code'] === '200') {
            this.$alert(responseEdit.data.result[0].message, responseEdit.data.result[0].code)
            isSuccess = true
          }
          isSuccess = true
          break
        case 'delete':
          const responseDelete = await this.$api.orders.orderCertificate2Delete({ form: this.form })
          if (responseDelete.headers['code'] === '200') {
            this.$alert(responseDelete.data.result[0].message, responseDelete.data.result[0].code)
            isSuccess = true
          }
          break
        case 'retakeID':
          // 停用舊單據
          this.form.Status = '0'
          await this.$api.orders.orderCertificate2Edit({ form: this.form })
          // 新增單據
          this.form.Status = '1'
          const responseRetakeID = await this.$api.orders.orderCertificate2New({ form: this.form })
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
      let answerAction = await messageBoxYesNo(this.$t('__delete') + this.$t('__certificate2'), this.$t('__delete'))

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
        keyword: this.form.Certificate2 }

      // 紀錄Log
      this.$api.reports.certificate2ToExcel({ Certificate2: this.form.Certificate2 })

      this.form.PrintCount += 1
    },
    // 重新取號
    retakeID: async function () {
      let answerAction = await messageBoxYesNo(this.$t('__retakeID') + '：' + this.$t('__certificate2') + '<br/>' + this.$t('__retakeIDWarning'), this.$t('__retakeID'))

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
