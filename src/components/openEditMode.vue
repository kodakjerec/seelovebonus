<template>
  <el-dialog :title="myTitle" :visible="dialogShow" center @close="cancel" append-to-body>
    <el-form ref="form" :model="form" :rules="rules" label-width="10vw">
      <el-form-item :label="$t('__userId')" prop="UserID">
        <el-input v-model="form.UserID" autocomplete="off" disabled maxlength="20" show-word-limit></el-input>
      </el-form-item>
      <el-form-item :label="$t('__pwd')" prop="Password">
        <el-input v-model="form.Password" autocomplete="off" maxlength="20" show-word-limit></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{$t('__cancel')}}</el-button>
      <el-button type="primary" @click="checkValidate">{{$t('__save')}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import validate from '@/setup/validate.js'

export default {
  name: 'OpenEditMode',
  props: {
    dialogShow: { type: Boolean, default: false }
  },
  data () {
    return {
      form: {
        UserID: '',
        Password: ''
      },
      rules: {
        UserID: [{ required: true, validator: validate.validateUserIDAndPassword, trigger: 'blur' }],
        Password: [{ required: true, validator: validate.validateUserIDAndPassword, trigger: 'blur' }]
      },
      myTitle: ''
    }
  },
  mounted () {
    this.form.UserID = this.$store.state.userID
    this.form.Password = ''
    this.myTitle = this.$t('__openEditMode')
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
      let response = await this.$api.login.checkPwd({
        UserID: this.form.UserID,
        Password: this.form.Password
      })
      if (response.headers['code'] === '200') {
        this.$emit('dialog-save')
      }
    }
  }
}
</script>
