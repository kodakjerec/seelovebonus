<template>
  <el-dialog :title="myTitle" :visible="dialogShow" center @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="30%">
      <el-form-item :label="$t('__userId')" prop="UserID">
        <el-input v-model="form.UserID" autocomplete="off" :disabled="disableForm.UserID" maxlength="20" show-word-limit></el-input>
      </el-form-item>
      <el-form-item :label="$t('__pwd')" prop="Password">
        <el-input v-model="form.Password" autocomplete="off" :disabled="disableForm.Password" maxlength="20" show-word-limit></el-input>
      </el-form-item>
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
    </el-form>
    <!-- <el-table :data="progList" ref="multipleTable"  @selection-change="handleSelectionChange">
      <el-table-column
      type="selection"
      width="55"
      prop="checked">
      </el-table-column>
      <el-table-column
      prop="ProgID"
      label="ProgID">
    </el-table-column>
    <el-table-column
      prop="Name"
      label="Name">
    </el-table-column>
    </el-table>
     -->
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{$t('__cancel')}}</el-button>
      <el-button type="primary" @click="checkValidate">{{$t('__save')}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import validate from '@/setup/validate.js'
export default {
  name: 'UserNewForm',
  props: {
    dialogType: { type: String, default: 'new' },
    dialogShow: { type: Boolean, default: false },
    user: { type: Object },
    progList: { type: Array }
  },
  data () {
    return {
      form: {
        UserID: '',
        Password: '',
        GroupID: '',
        refEmployeeID: ''
      },
      rules: {
        UserID: [{ required: true, validator: validate.validateUserIDAndPassword, trigger: 'blur' }],
        Password: [{ required: true, validator: validate.validateUserIDAndPassword, trigger: 'blur' }],
        GroupID: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }],
        refEmployeeID: [{ required: true, message: this.$t('__pleaseInput'), trigger: 'blur' }]
      },
      disableForm: {
        UserID: false,
        Password: false
      },
      myTitle: '',
      ddlGroup: [],
      ddlEmployee: []
    }
  },
  mounted () {
    switch (this.dialogType) {
      case 'new':
        this.myTitle = this.$t('__new') + this.$t('__users')
        this.disableForm.UserID = false
        this.disableForm.Password = false
        break
      case 'edit':
        this.myTitle = this.$t('__edit') + this.$t('__users')
        this.form = JSON.parse(JSON.stringify(this.user))
        this.disableForm.UserID = true
        this.disableForm.Password = true
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
      const response1 = await this.$api.settings.getSetting({ type: 'groupsList' })
      this.ddlGroup = response1.data.result

      const response2 = await this.$api.settings.getSetting({ type: 'employeesList' })
      this.ddlEmployee = response2.data.result
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
    }
  }
}
</script>
