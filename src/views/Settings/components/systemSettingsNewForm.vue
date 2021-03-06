<template>
  <el-dialog :title="myTitle" :visible="dialogShow" center width="80vw" top="5vh" @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="10vw">
      <el-form-item :label="$t('__systemSettingsCategory')" prop="Category">
        <el-select
          v-model="form.Category"
          default-first-option filterable clearable
          :disabled="disableForm.Category"
          :placeholder="$t('__plzChoice')">
          <el-option v-for="item in ddlCategory" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
            <span style="float: left">{{ item.Value }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('__systemSettingsParentCategory')">
        <el-select
          v-model="form.ParentCategory"
          default-first-option filterable clearable
          :placeholder="$t('__plzChoice')"
          @change="selectChange">
          <el-option v-for="item in ddlParentCategory" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
            <span style="float: left">{{ item.Value }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('__systemSettingsParentID')">
        <el-select v-model="form.ParentID" default-first-option filterable clearable :disabled="disableForm.ParentID" :placeholder="$t('__plzChoice')">
          <el-option v-for="item in ddlParentID" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
            <span style="float: left">{{ item.Value }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('__systemSettingsID')" prop="ID">
        <el-input v-model="form.ID" :disabled="disableForm.ID" maxlength="20" show-word-limit></el-input>
      </el-form-item>
      <el-form-item :label="$t('__systemSettingsValue')" prop="Value">
        <el-input v-model="form.Value" maxlength="20" show-word-limit></el-input>
      </el-form-item>
      <el-form-item :label="$t('__systemSettingsLanguage')" prop="Language">
        <el-select v-model="form.Language" default-first-option filterable clearable :disabled="disableForm.Language" :placeholder="$t('__plzChoice')">
          <el-option v-for="item in ddlLanguages" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
            <span style="float: left">{{ item.Value }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
          </el-option>
        </el-select>
        <br/>{{$t('__allSettingsWillNewTogether')}}
      </el-form-item>
      <el-form-item :label="$t('__memo')">
          <el-input type="textarea" v-model="form.Memo" maxlength="200" show-word-limit></el-input>
      </el-form-item>
      <el-form-item v-if="dialogType==='newSettingsType'">
        <el-checkbox v-model="form.Danger" :true-label="1" :false-label="0" border>{{$t('__systemSettingsVIP')}}</el-checkbox>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button v-show="buttonsShow.delete && buttonsShowUser.delete" type="danger" @click="delRecord">{{$t('__delete')}}</el-button>
      <el-button @click="cancel">{{$t('__cancel')}}</el-button>
      <el-button v-show="buttonsShow.save && buttonsShowUser.save" type="primary" @click="checkValidate">{{$t('__save')}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { messageBoxYesNo } from '@/services/utils'

export default {
  name: 'SystemSettingsNewForm',
  props: {
    dialogType: { type: String, default: 'new' },
    dialogShow: { type: Boolean, default: false },
    category: { type: String },
    systemSettings: { type: Object },
    fromDanger: { type: Number }
  },
  data () {
    return {
      form: {
        Category: null,
        ParentCategory: null,
        ParentID: '-1',
        ID: null,
        Value: null,
        Language: 2,
        Memo: null,
        Danger: 0
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
        Category: true,
        ParentID: true,
        ID: false,
        Language: true
      },
      myTitle: '',
      ddlCategory: [],
      ddlParentCategory: [],
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
      case 'newSettingsType':
        this.myTitle = this.$t('__systemSettingsSettingsType')
        break
      case 'edit':
        this.myTitle = this.$t('__edit') + this.$t('__systemSettingsID')
        this.form = JSON.parse(JSON.stringify(this.systemSettings))
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
      let response2 = this.$api.local.getDropdownList({ type: 'SettingsType' })
      this.ddlCategory = response2.filter(item => item.Danger === this.fromDanger)
      this.ddlParentCategory = JSON.parse(JSON.stringify(this.ddlCategory))
      this.form.Category = this.category

      // 父階層分類, 移除目前設定選項
      let findIndex = this.ddlCategory.findIndex(item => { return item.ID === this.form.Category })
      if (findIndex > -1) {
        this.ddlParentCategory.splice(findIndex, 1)
      }

      let response3 = await this.$api.settings.getDropdownList({ type: 'systemSettingsNewFormParentID' })
      this.ddlParentIDOrigin = response3.data.result
      this.selectChange()
    },
    // 父階層分類 篩選
    selectChange: function () {
      if (this.form.ParentCategory) {
        this.ddlParentID = this.ddlParentIDOrigin.filter(item => item.Category === this.form.ParentCategory).filter(item => item.Language === this.form.Language)
        this.disableForm.ParentID = false
      }
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
        case 'newSettingsType':
          let responseNew = await this.$api.settings.settingsNew({ form: this.form })
          if (responseNew.headers['code'] === '200') {
            this.$alert(responseNew.data.result[0].message, responseNew.data.result[0].code)
            isSuccess = true
          }
          break
        case 'edit':
          let responseEdit = await this.$api.settings.settingsEdit({ form: this.form })
          if (responseEdit.headers['code'] === '200') {
            this.$alert(responseEdit.data.result[0].message, responseEdit.data.result[0].code)
            isSuccess = true
          }
          break
        case 'delete':
          let responseDelete = await this.$api.settings.settingsDelete({ form: this.form })
          if (responseDelete.headers['code'] === '200') {
            this.$alert(responseDelete.data.result[0].message, responseDelete.data.result[0].code)
            isSuccess = true
          }
          break
      }
      if (isSuccess) { this.$emit('dialog-save') }
    },
    // 刪除
    delRecord: async function () {
      let answerAction = await messageBoxYesNo(this.$t('__delete') + this.$t('__systemSettingsID'), this.$t('__delete'))

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
