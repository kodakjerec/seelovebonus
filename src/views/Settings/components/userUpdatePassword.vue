<template>
  <el-dialog :title="myTitle" :visible="dialogShow" center @close="cancel" append-to-body>
    <el-form ref="form" :model="form" :rules="rules" label-width="10vw">
      <el-form-item :label="$t('__userId')" prop="UserID">
        <el-input v-model="form.UserID" disabled maxlength="20" show-word-limit></el-input>
      </el-form-item>
      <el-form-item :label="$t('__pwd')" prop="Password">
        <el-input v-model="form.Password" maxlength="20" show-word-limit></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="cancel">{{$t('__cancel')}}</el-button>
      <el-button type="primary" @click="checkValidate">{{$t('__save')}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import validate from '@/setup/validate.js'

export default {
  name: 'UserUpdatePassword',
  props: {
    dialogType: { type: String, default: 'new' },
    dialogShow: { type: Boolean, default: false },
    user: { type: Object }
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
        Password: [{ required: true, validator: validate.validateUserIDAndPassword, trigger: 'blur' }]
      },
      myTitle: ''
    }
  },
  mounted () {
    this.form = JSON.parse(JSON.stringify(this.user))
    this.form.Password = ''

    switch (this.dialogType) {
      case 'new':
        this.myTitle = this.$t('__new') + this.$t('__pwd')
        break
      case 'edit':
        this.myTitle = this.$t('__edit') + this.$t('__pwd')
        break
    }
  },
  methods: {
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
          isSuccess = true
          break
        case 'edit':
          let responseEdit = await this.$api.settings.userUpdatePassword({ form: data })
          if (responseEdit.headers['code'] === '200') {
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
