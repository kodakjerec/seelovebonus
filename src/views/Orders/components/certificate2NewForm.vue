<template>
  <el-dialog :title="myTitle" :visible="dialogShow" center width="80%" @close="cancel">
    <el-form ref="form" :model="form" :rules="rules">
      <el-form-item :label="$t('__orderID')" label-width="100px" label-position="left">
          <el-input v-model="form.OrderID" autocomplete="off" maxlength="200" show-word-limit :disabled="disableForm.OrderID"></el-input>
      </el-form-item>
      <el-form-item :label="$t('__certificate2')" label-width="100px" label-position="left" prop="Certificate2">
          <el-input v-model="form.Certificate2" autocomplete="off" maxlength="40" show-word-limit :disabled="disableForm.Certificate2"></el-input>
      </el-form-item>
      <el-form-item :label="$t('__printCount')" label-width="100px" label-position="left">
          <el-input v-model="form.PrintCount" autocomplete="off" maxlength="200" show-word-limit :disabled="disableForm.PrintCount"></el-input>
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
          <el-input v-model="form.CreateDate" autocomplete="off" maxlength="200" show-word-limit :disabled="disableForm.CreateDate"></el-input>
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
import { formatDate } from '@/setup/format.js'

export default {
  name: 'Certificate2NewForm',
  props: {
    dialogType: { type: String, default: 'new' },
    dialogShow: { type: Boolean, default: false },
    certificate2: { type: Object }
  },
  data () {
    return {
      form: {
        OrderID: null,
        Certificate2: null,
        PrintCount: 0,
        Status: '1',
        CreateDate: null
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
        Certificate2: false,
        PrintCount: true,
        Status: true,
        CreateDate: true
      },
      myTitle: '',
      // 以下為下拉式選單專用
      ddlStatus: []
    }
  },
  mounted () {
    this.form = JSON.parse(JSON.stringify(this.certificate2))
    this.form.CreateDate = this.formatterDate(null, null, this.form.CreateDate, null)

    switch (this.dialogType) {
      case 'new':
        this.myTitle = this.$t('__new') + this.$t('__certificate2')
        break
      case 'edit':
        this.myTitle = this.$t('__edit') + this.$t('__certificate2')
        this.disableForm.Certificate2 = true
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
    formatterDate: function (row, column, cellValue, index) {
      return formatDate(cellValue)
    },
    // 讀取預設資料
    preloading: async function () {
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
          if (responseNew.status === 200) {
            this.$alert(responseNew.data.result[0].message, responseNew.data.result[0].code)
            isSuccess = true
          }
          break
        case 'edit':
          // const responseEdit = await this.$api.orders.orderCertificate2Edit({ form: this.form })
          // if (responseEdit.status === 200) {
          //   this.$alert(responseEdit.data.result[0].message, responseEdit.data.result[0].code)
          //   isSuccess = true
          // }
          isSuccess = true
          break
        case 'delete':
          const responseDelete = await this.$api.orders.orderCertificate2Delete({ form: this.form })
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
        message: this.$t('__delete') + this.$t('__certificate2'),
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
    }
  }
}
</script>
