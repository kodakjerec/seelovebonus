<template>
  <div>
    <el-image
    class="imageBlock"
    :src="require('@/assets/logo.png')"
    :fit="'contain'"
    :alt="'logo'"
    ></el-image>
    <el-card class="box-card">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item :label="$t('__userId')" prop="UserID">
          <el-input v-model="form.UserID" autocomplete></el-input>
        </el-form-item>
        <el-form-item :label="$t('__pwd')" prop="Password">
          <el-input
            v-model="form.Password"
            show-password
            @keydown.native.enter="keyboardChange"></el-input>
        </el-form-item>
      </el-form>
      <el-button class="submitButton" type="primary" @click.native="submit">{{$t('__login')}}</el-button>
    </el-card>
    <div>
      <br>
      <span>{{$t('__languageSetting')}} </span>
      <el-switch
        v-model="language"
        active-text="中文"
        inactive-text="English"
        @change="changeLanguage"
        />
    </div>
    <div>{{$t('__version')+'：'+$store.state.version}}</div>
  </div>
</template>

<script>
import router from '@/router'
import i18n from '@/setup/setupLocale'
import validate from '@/setup/validate.js'
import { errorMessage } from '@/services/utils'

export default {
  name: 'Login',
  data () {
    return {
      language: true,
      form: {
        UserID: '',
        Password: ''
      },
      rules: {
        UserID: [{ required: true, validator: validate.validateUserIDAndPassword, trigger: 'blur' }],
        Password: [{ required: true, validator: validate.validateUserIDAndPassword, trigger: 'blur' }]
      },
      lock: false // 避免按著Enter, 重複發送查詢指令
    }
  },
  mounted () {
    // 刷新到首頁時, 強制清空
    this.$store.dispatch('resetAll')
    localStorage.removeItem('vuex')

    // 取得語言設定
    if (localStorage.getItem('locale')) {
      i18n.locale = localStorage.getItem('locale')
      switch (i18n.locale) {
        case 'en':
          this.language = false
          break
        case 'zh':
          this.language = true
          break
      }
    } else {
      i18n.locale = 'zh'
      localStorage.setItem('locale', 'zh')
    }

    this.checkVersion()
  },
  methods: {
    // 變更語言設定
    changeLanguage: function (status) {
      switch (status) {
        case false: // 英文
          i18n.locale = 'en'
          localStorage.setItem('locale', 'en')
          break
        case true: // 中文
          i18n.locale = 'zh'
          localStorage.setItem('locale', 'zh')
          break
      }
    },
    // 按下登入
    submit: function () {
      if (this.lock) {
        return
      }
      this.lock = true
      this.$refs['form'].validate((valid) => {
        if (valid) {
          // valid
          this.login()
        } else {
          // error
          this.lock = false
          return false
        }
      })
    },
    // 送出登入API
    login: async function () {
      let response = await this.$api.login.login({
        UserID: this.form.UserID,
        Password: this.form.Password
      })

      // 成功登入
      if (response.headers['code'] === '200') {
        this.$store.dispatch('setAuth', {
          'token': response.data.token,
          'isLogin': true,
          'userID': response.data.result[0].UserID,
          'userName': response.data.result[0].Name
        })

        // 讀入 menu
        let response2 = await this.$api.login.getMenu({
          UserID: this.form.UserID
        })
        this.$store.dispatch('setMenuList', response2.data)

        // 讀入 使用者權限
        let response3 = await this.$api.settings.getUserProg({
          UserID: this.form.UserID
        })
        this.$store.dispatch('setUserProg', response3.data.userProg)

        // 讀入 settings
        let response4 = await this.$api.settings.getDropdownList({ type: 'systemSettingsForLogin' })
        let settingsOrigin = response4.data.result
        this.$store.dispatch('setGlobalSettings', settingsOrigin)

        router.push('home')

        this.lock = false
      }
    },
    // 檢查版本
    checkVersion: async function () {
      let response = await this.$api.login.version()
      let dbVersion = response.data.result[0].Value
      if (dbVersion !== this.$store.state.version) {
        errorMessage(this.$t('__versionError'), this.$t('__warning'))
      }
    },
    // 按下Enter檢核登入
    keyboardChange: function () {
      this.submit()
    }
  }
}
</script>
<style lang="scss" scoped>
.imageBlock{
  width:60%
}
.box-card {
  width: 80%;
  margin-left: 10%;

  .submitButton {
    width:100%
  }
}
</style>
