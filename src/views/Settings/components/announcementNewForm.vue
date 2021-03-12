<template>
  <el-dialog :title="myTitle" :visible="dialogShow" center width="80vw" @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="10vw">
      <el-form-item :label="$t('__announcement')+$t('__startDate')" required>
        <el-col :span="10">
          <el-form-item prop="StartDate">
            <el-date-picker
              v-model="form.StartDate"
              type="date"
              :placeholder="$t('__plzChoice')+$t('__startDate')"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="14">
          <el-form-item :label="$t('__endDate')" prop="EndDate">
            <el-date-picker
              v-model="form.EndDate"
              type="date"
              :placeholder="$t('__plzChoice')+$t('__endDate')"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item :label="$t('__caption')" prop="Caption">
        <el-input v-model="form.Caption" maxlength="40" show-word-limit></el-input>
      </el-form-item>
      <el-form-item :label="$t('__content')" prop="Text">
        <el-input type="textarea" rows="10" v-model="form.Text" maxlength="200" show-word-limit></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button v-show="buttonsShow.delete && buttonsShowUser.delete" type="danger" @click.prevent="delRecord">{{$t('__delete')}}</el-button>
      <el-button @click="cancel">{{$t('__cancel')}}</el-button>
      <el-button v-show="buttonsShow.save && buttonsShowUser.save" type="primary" @click="checkValidate">{{$t('__save')}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { messageBoxYesNo } from '@/services/utils'

export default {
  name: 'AnnouncementNewForm',
  props: {
    dialogType: { type: String, default: 'new' },
    dialogShow: { type: Boolean, default: false },
    announcement: { type: Object }
  },
  data () {
    return {
      form: {
        ID: 0,
        StartDate: '',
        EndDate: '',
        CreateID: this.$store.state.userID,
        Caption: '',
        Text: ''
      },
      rules: {
        Caption: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        Text: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        StartDate: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        EndDate: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }]
      },
      // 系統目前狀態權限
      buttonsShow: {
        new: 1,
        edit: 0,
        save: 1,
        delete: 0,
        search: 1
      },
      // 使用者能看到的權限
      buttonsShowUser: {
        new: 1,
        edit: 1,
        save: 1,
        delete: 1,
        search: 1
      },
      myTitle: ''
    }
  },
  mounted () {
    switch (this.dialogType) {
      case 'new':
        this.myTitle = this.$t('__new') + this.$t('__announcement')

        // 預設值
        let start = new Date()
        let year = start.getFullYear()
        let month = start.getMonth()
        start = new Date(year, month, 1, 12)
        this.startDateChange(start)
        break
      case 'edit':
        this.myTitle = this.$t('__edit') + this.$t('__announcement')
        this.form = JSON.parse(JSON.stringify(this.announcement))
        this.buttonsShow = {
          new: 1,
          edit: 1,
          save: 1,
          delete: 1,
          search: 1
        }
        break
    }
  },
  methods: {
    // 給予預設日期
    startDateChange: function (value) {
      let start = new Date(value)
      let end = new Date()
      let year = start.getFullYear()
      let month = start.getMonth()
      start = new Date(year, month, 1, 12)
      end = new Date(year, month + 1, 0, 12)

      this.form.StartDate = start.toISOString().slice(0, 10)
      this.form.EndDate = end.toISOString().slice(0, 10)
    },
    // 檢查輸入
    checkValidate: function () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.save(this.dialogType)
          return true
        } else {
          return false
        }
      })
    },
    // 刪除
    delRecord: async function () {
      let answerAction = await messageBoxYesNo(this.$t('__delete') + this.$t('__announcement'), this.$t('__delete'))

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
    // 取消
    cancel: function () {
      this.$emit('dialog-cancel')
    },
    // 存檔
    save: async function (type) {
      let data = JSON.parse(JSON.stringify(this.form))
      let isSuccess = false
      switch (type) {
        case 'new':
          let responseNew = await this.$api.settings.announcementNew({ form: data })
          if (responseNew.headers['code'] === '200') {
            this.$alert(responseNew.data.result[0].message, responseNew.data.result[0].code)
            isSuccess = true
          }
          break
        case 'edit':
          let responseEdit = await this.$api.settings.announcementEdit({ form: data })
          if (responseEdit.headers['code'] === '200') {
            this.$alert(responseEdit.data.result[0].message, responseEdit.data.result[0].code)
            isSuccess = true
          }
          break
        case 'delete':
          let responseDelete = await this.$api.settings.announcementDelete({ form: data })
          if (responseDelete.headers['code'] === '200') {
            this.$alert(responseDelete.data.result[0].message, responseDelete.data.result[0].code)
            isSuccess = true
          }
          break
      }
      if (isSuccess) { this.$emit('dialog-save') }
    }
  }
}
</script>
