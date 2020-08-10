<template>
  <el-dialog :title="myTitle" :visible="dialogShow" center width="80%" @close="cancel">
    <el-form ref="form" :model="form" :rules="rules">
      <el-form-item :label="$t('__orderID')" label-width="100px" label-position="left">
          <el-input v-model="form.OrderID" autocomplete="off" maxlength="200" show-word-limit :disabled="disableForm.OrderID"></el-input>
      </el-form-item>
      <el-form-item :label="$t('__certificate1')" label-width="100px" label-position="left" prop="Certificate1">
          <el-input v-model="form.Certificate1" autocomplete="off" maxlength="40" show-word-limit :disabled="disableForm.Certificate1"></el-input>
      </el-form-item>
      <el-form-item :label="$t('__printCount')" label-width="100px" label-position="left">
          <el-input-number v-model="form.PrintCount" autocomplete="off" maxlength="200" show-word-limit :disabled="disableForm.PrintCount"></el-input-number>
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
      <el-button icon="el-icon-printer" @click.prevent="toExcel()">{{$t('__print')}}</el-button>
      <p/>
      <el-button @click="cancel">{{$t('__cancel')}}</el-button>
      <el-button v-show="buttonsShow.save" type="primary" @click="checkValidate">{{$t('__save')}}</el-button>
      <el-button v-show="buttonsShow.delete" type="danger" @click="delRecord">{{$t('__delete')}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { saveAs } from 'file-saver'
import { formatDate } from '@/setup/format.js'

export default {
  name: 'Certificate1NewForm',
  props: {
    dialogType: { type: String, default: 'new' },
    dialogShow: { type: Boolean, default: false },
    certificate1: { type: Object },
    orderID: { type: String }
  },
  data () {
    return {
      form: {
        OrderID: this.orderID,
        Certificate1: null,
        PrintCount: 0,
        Status: '1',
        CreateDate: new Date()
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
        Certificate1: false,
        PrintCount: false,
        Status: false,
        CreateDate: false
      },
      myTitle: '',
      // 以下為下拉式選單專用
      ddlStatus: []
    }
  },
  mounted () {
    if (Object.keys(this.certificate1).length > 0) {
      this.form = JSON.parse(JSON.stringify(this.certificate1))
      this.form.CreateDate = this.formatterDate(null, null, this.form.CreateDate, null)
    }

    switch (this.dialogType) {
      case 'new':
        this.myTitle = this.$t('__new') + this.$t('__certificate1')
        break
      case 'edit':
        this.myTitle = this.$t('__edit') + this.$t('__certificate1')
        this.disableForm.Certificate1 = true
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
          const responseNew = await this.$api.orders.orderCertificate1New({ form: this.form })
          if (responseNew.status === 200) {
            this.$alert(responseNew.data.result[0].message, responseNew.data.result[0].code)
            isSuccess = true
          }
          break
        case 'edit':
          const responseEdit = await this.$api.orders.orderCertificate1Edit({ form: this.form })
          if (responseEdit.status === 200) {
            this.$alert(responseEdit.data.result[0].message, responseEdit.data.result[0].code)
            isSuccess = true
          }
          isSuccess = true
          break
        case 'delete':
          const responseDelete = await this.$api.orders.orderCertificate1Delete({ form: this.form })
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
      let myObject = this
      this.$msgbox({
        message: this.$t('__delete') + this.$t('__certificate1'),
        title: this.$t('__delete'),
        showCancelButton: true,
        confirmButtonText: this.$t('__ok'),
        cancelButtonText: this.$t('__cancel'),
        type: 'warning',
        closeOnPressEscape: true,
        callback: function (action, instance, done) {
          switch (action) {
            case 'confirm':
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
    },
    toExcel: async function () {
      const response2 = await this.$api.reports.certificate1ToExcel({ Certificate1: this.form.Certificate1 })
      let blob = new Blob([response2.data], { type: response2.headers['content-type'] })
      saveAs(blob, '供奉憑證' + this.form.Certificate1 + '.xlsx')
    }
  }
}
</script>
