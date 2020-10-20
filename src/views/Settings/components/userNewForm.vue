<template>
  <el-dialog :title="myTitle" :visible="dialogShow" center @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="10vw">
      <el-form-item :label="$t('__userId')" prop="UserID">
        <el-input v-model="form.UserID" autocomplete="off" :disabled="disableForm.UserID" maxlength="20" show-word-limit></el-input>
      </el-form-item>
      <el-form-item :label="$t('__pwd')" prop="Password">
        <el-input v-model="form.Password" autocomplete="off" :disabled="disableForm.Password" maxlength="20" show-word-limit></el-input>
      </el-form-item>
      <new-form
        v-if="dialogShowUpdatePassword"
        :dialog-type="dialogTypeUpdatePassword"
        :dialog-show="dialogShowUpdatePassword"
        :user="user"
        @dialog-cancel="dialogCancel()"
        @dialog-save="dialogSave()"></new-form>
      <el-form-item :label="$t('__groups')" prop="GroupID">
        <el-select v-model="form.GroupID" value-key="value" :placeholder="$t('__plzChoice')">
          <el-option v-for="item in ddlGroup" :key="item.ID" :label="item.Value" :value="item.ID">
            <span style="float: left">{{ item.Value }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('__refEmployeeIDForUser')" prop="refEmployeeID">
        <el-select v-model="form.refEmployeeID" value-key="value" :placeholder="$t('__plzChoice')">
          <el-option v-for="item in ddlEmployee" :key="item.ID" :label="item.Value" :value="item.ID">
            <span style="float: left">{{ item.Value }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('__status')">
        <el-select v-model="form.Status" value-key="value" :placeholder="$t('__plzChoice')">
          <el-option v-for="item in ddlStatus" :key="item.ID" :label="item.Value" :value="item.ID">
            <span style="float: left">{{ item.Value }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button v-show="buttonsShow.delete && buttonsShowUser.delete" type="danger" @click.prevent="showForm('edit')">{{$t('__edit')+$t('__pwd')}}</el-button>
      <el-button @click="cancel">{{$t('__cancel')}}</el-button>
      <el-button v-show="buttonsShow.save && buttonsShowUser.save" type="primary" @click="checkValidate">{{$t('__save')}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import validate from '@/setup/validate.js'
import newForm from './userUpdatePassword'

export default {
  name: 'UserNewForm',
  props: {
    dialogType: { type: String, default: 'new' },
    dialogShow: { type: Boolean, default: false },
    user: { type: Object }
  },
  components: {
    newForm
  },
  data () {
    return {
      form: {
        UserID: '',
        Password: '',
        GroupID: '',
        refEmployeeID: '',
        Status: '1'
      },
      rules: {
        UserID: [{ required: true, validator: validate.validateUserIDAndPassword, trigger: 'blur' }],
        Password: [{ required: true, validator: validate.validateUserIDAndPassword, trigger: 'blur' }],
        GroupID: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        refEmployeeID: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }]
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
      dialogTypeUpdatePassword: 'edit',
      dialogShowUpdatePassword: false,
      ddlGroup: [],
      ddlStatus: [],
      ddlEmployee: []
    }
  },
  mounted () {
    switch (this.dialogType) {
      case 'new':
        this.myTitle = this.$t('__new') + this.$t('__users')
        break
      case 'edit':
        this.myTitle = this.$t('__edit') + this.$t('__users')
        this.form = JSON.parse(JSON.stringify(this.user))
        this.disableForm.UserID = true
        this.disableForm.Password = true
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
    this.getDropDownList()

    // 已經有選擇的資料帶入
    // const rowsToToggle = this.progList.filter(row => row.checked === true)
    // this.$nextTick(() => { this.toggleSelection(rowsToToggle) })
  },
  methods: {
    // 取得群組清單
    getDropDownList: async function () {
      const response1 = await this.$api.settings.getDropdownList({ type: 'groupsList' })
      this.ddlGroup = response1.data.result
      const response2 = await this.$api.settings.getDropdownList({ type: 'employeesList' })
      this.ddlEmployee = response2.data.result
      const response3 = await this.$api.settings.getDropdownList({ type: 'status' })
      this.ddlStatus = response3.data.result
    },
    toggleSelection: function (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange: function (val) {
      this.multipleTable = val
    },
    // 檢查輸入
    checkValidate: function () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.save()
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
    save: async function () {
      // // 已經有最終的結果
      // // console.log(this.multipleTable)
      // // ProgList 比對 multipleTable
      // // proglist.checked = true => 有找到 => 本來就有權限
      // // proglist.checked = true => 沒找到 => 刪除現有權限 => Delete
      // // proglist.checked = false=> 有找到 => 表示新增權限 => Insert
      // // proglist.checked = false=> 沒找到 => 本來就沒有權限
      // this.progList.forEach(value => {
      //   if (value.checked) {
      //     let findMultipleTable = this.multipleTable.find(item => { return value.ProgID === item.ProgID })
      //     if (findMultipleTable === undefined) {
      //       console.log(' 刪除權限 ' + value.ProgID)
      //     }
      //   } else {
      //     let findMultipleTable = this.multipleTable.find(item => { return value.ProgID === item.ProgID })
      //     if (findMultipleTable) {
      //       console.log(' 新增權限 ' + value.ProgID)
      //     }
      //   }
      // })
      let data = JSON.parse(JSON.stringify(this.form))
      let isSuccess = false
      switch (this.dialogType) {
        case 'new':
          const responseNew = await this.$api.settings.userNew({ form: data })
          if (responseNew.status === 200) {
            this.$alert(responseNew.data.result[0].message, responseNew.data.result[0].code)
            isSuccess = true
          }
          break
        case 'edit':
          const responseEdit = await this.$api.settings.userEdit({ form: data })
          if (responseEdit.status === 200) {
            this.$alert(responseEdit.data.result[0].message, responseEdit.data.result[0].code)
            isSuccess = true
          }
          break
      }
      if (isSuccess) { this.$emit('dialog-save') }
    },
    // 開啟表單
    showForm: function (eventType) {
      this.dialogTypeUpdatePassword = eventType
      this.dialogShowUpdatePassword = true
    },
    dialogCancel: function () {
      this.dialogShowUpdatePassword = false
    },
    dialogSave: function () {
      this.dialogShowUpdatePassword = false
    }
  }
}
</script>
