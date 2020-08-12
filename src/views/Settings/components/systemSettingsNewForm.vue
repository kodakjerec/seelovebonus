<template>
  <el-dialog :title="myTitle" :visible="dialogShow" center @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="30%">
      <el-form-item :label="$t('__systemSettingsCategory')" prop="Category">
        <el-select v-model="form.Category" :disabled="disableForm.Category" :placeholder="$t('__plzChoice')" @change="selectChange">
          <el-option v-for="item in ddlCategory" :key="item.ID" :label="item.Value" :value="item.ID">
            <span style="float: left">{{ item.Value }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('__systemSettingsParentID')" prop="ParentID">
        <el-select v-model="form.ParentID" value-key="value" :placeholder="$t('__plzChoice')">
          <el-option v-for="item in ddlParentID" :key="item.ID" :label="item.Value" :value="item.ID">
            <span style="float: left">{{ item.Value }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('__systemSettingsID')" prop="ID">
        <el-input v-model="form.ID" autocomplete="off" :disabled="disableForm.ID" maxlength="20" show-word-limit></el-input>
      </el-form-item>
      <el-form-item :label="$t('__systemSettingsValue')" prop="Value">
        <el-input v-model="form.Value" autocomplete="off" :disabled="disableForm.Value" maxlength="20" show-word-limit></el-input>
      </el-form-item>
      <el-form-item :label="$t('__systemSettingsLanguage')" prop="Language">
        <el-select v-model="form.Language" value-key="value" :placeholder="$t('__plzChoice')">
          <el-option v-for="item in ddlLanguages" :key="item.ID" :label="item.Value" :value="item.ID">
            <span style="float: left">{{ item.Value }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('__memo')">
          <el-input v-model="form.Memo" autocomplete="off" maxlength="200" show-word-limit></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button v-show="buttonsShow.delete && buttonsShowUser.delete" type="danger" @click="delRecord">{{$t('__delete')}}</el-button>
      <el-button @click="cancel">{{$t('__cancel')}}</el-button>
      <el-button v-show="buttonsShow.save && buttonsShowUser.save" type="primary" @click="checkValidate">{{$t('__save')}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'SystemSettingsNewForm',
  props: {
    dialogType: { type: String, default: 'new' },
    dialogShow: { type: Boolean, default: false },
    systemSettings: { type: Object }
  },
  data () {
    return {
      form: {
        Category: null,
        ParentID: '0',
        ID: null,
        Value: null,
        Language: 2,
        Memo: null
      },
      rules: {
        Category: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        ParentID: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        ID: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        Value: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        Language: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        Memo: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }]
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
      disableForm: {
        UserID: false,
        Password: false
      },
      myTitle: '',
      ddlCategory: [],
      ddlParentIDOrigin: [],
      ddlParentID: [],
      ddlLanguages: [
        { ID: 1, Value: this.$t('__language1') },
        { ID: 2, Value: this.$t('__language2') }]
    }
  },
  mounted () {
    switch (this.dialogType) {
      case 'new':
        this.myTitle = this.$t('__new') + this.$t('__systemSettingsID')
        break
      case 'edit':
        this.myTitle = this.$t('__edit') + this.$t('__systemSettingsID')
        this.form = JSON.parse(JSON.stringify(this.systemSettings))
        this.disableForm.Category = true
        this.disableForm.ID = true
        this.buttonsShow = {
          new: 1,
          edit: 1,
          save: 1,
          delete: 1,
          search: 1
        }
        break
    }

    // 取得下拉選單資料
    this.preLoading()
  },
  methods: {
    // 取得群組清單
    preLoading: async function () {
      const response2 = await this.$api.settings.getDropdownList({ type: 'settingsType' })
      this.ddlCategory = response2.data.result
      this.form.Category = this.ddlCategory[0].ID

      const response3 = await this.$api.settings.getDropdownList({ type: 'systemSettings' })
      this.ddlParentIDOrigin = response3.data.result
      this.selectChange()
    },
    // 篩選
    selectChange: function () {
      this.ddlParentID = this.ddlParentIDOrigin.filter(item => item.Category === this.form.Category).filter(item => item.Language === this.form.Language)
      this.ddlParentID.push({ ID: '0', Value: '0' })
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
    // 取消
    cancel: function () {
      this.$emit('dialog-cancel')
    },
    // 存檔
    save: async function (dialogType) {
      let isSuccess = false
      switch (dialogType) {
        case 'new':
          const responseNew = await this.$api.settings.settingsNew({ form: this.form })
          if (responseNew.status === 200) {
            this.$alert(responseNew.data.result[0].message, responseNew.data.result[0].code)
            isSuccess = true
          }
          break
        case 'edit':
          const responseEdit = await this.$api.settings.settingsEdit({ form: this.form })
          if (responseEdit.status === 200) {
            this.$alert(responseEdit.data.result[0].message, responseEdit.data.result[0].code)
            isSuccess = true
          }
          break
        case 'delete':
          const responseDelete = await this.$api.settings.settingsDelete({ form: this.form })
          if (responseDelete.status === 200) {
            this.$alert(responseDelete.data.result[0].message, responseDelete.data.result[0].code)
            isSuccess = true
          }
          break
      }
      if (isSuccess) { this.$emit('dialog-save') }
    },
    // 刪除
    delRecord: async function () {
      let answerAction = await this.$msgbox({
        message: this.$t('__delete') + this.$t('__systemSettingsID'),
        title: this.$t('__delete'),
        showCancelButton: true,
        confirmButtonText: this.$t('__ok'),
        cancelButtonText: this.$t('__cancel'),
        type: 'warning'
      }).then((value) => {
        return value
      }).catch((error) => {
        return error
      })

      switch (answerAction) {
        case 'confirm':
          this.save('delete')
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
