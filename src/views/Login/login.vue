<template>
  <div>
    <el-image
    class="imageBlock"
    :src="require('@/assets/logo.png')"
    :fit="'contain'"
    :alt="'logo'"
    ></el-image>
    <el-card class="box-card">
      <el-form ref="form" :model="form" :rules="rules" label-width="10vw" label-position="right">
        <el-form-item :label="$t('__userId')" prop="UserID">
          <el-input
            label="ID"
            v-model="form.UserID"
            autocomplete></el-input>
        </el-form-item>
        <el-form-item :label="$t('__pwd')" prop="Password">
          <el-input
            label="pwd"
            v-model="form.Password"
            show-password
            @keydown.native.enter="keyboardChange"></el-input>
        </el-form-item>
      </el-form>
      <el-button class="submitButton" type="primary" @click.native="submit">{{$t('__login')}}</el-button>
    </el-card>
    <br/>
    <!-- 語言 -->
    <span>{{this.$t('__languageSetting')+'：'}}</span>
    <el-select
      v-model="language"
      @change="changeLanguage">
      <el-option v-for="item in languages" :key="item.ID" :label="item.ID+' '+item.Value" :value="item.ID">
        <span style="float: left">{{ item.Value }}</span>
        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ID }}</span>
      </el-option>
    </el-select>
    <!-- 深色模式 -->
    <div>
      <span>{{$t('__darkMode')+'：'}}</span>
      <el-switch v-model="darkMode" @change="darkModeChange"></el-switch>
    </div>
    <!-- 版本號 -->
    <div>
      <span>{{this.$t('__version')+'：'+$store.state.version}}</span>
    </div>
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
      language: 'zh',
      form: {
        UserID: '',
        Password: ''
      },
      rules: {
        UserID: [{ required: true, validator: validate.validateUserIDAndPassword, trigger: 'blur' }],
        Password: [{ required: true, validator: validate.validateUserIDAndPassword, trigger: 'blur' }]
      },
      lock: false, // 避免按著Enter, 重複發送查詢指令
      darkMode: false, // 是否開啟darkMode
      // 下拉是選單
      languages: [
        { ID: 'zh', Value: '中文' },
        { ID: 'en', Value: 'English' }
      ]
    }
  },
  mounted () {
    // 刷新到首頁時, 強制清空
    this.$store.dispatch('resetAll')
    localStorage.removeItem('vuex')

    // 取得語言設定
    if (localStorage.getItem('locale')) {
      i18n.locale = localStorage.getItem('locale')
      this.language = i18n.locale
    } else {
      this.language = 'zh'
      i18n.locale = 'zh'
      localStorage.setItem('locale', 'zh')
    }

    // 取得darkmode
    this.darkMode = JSON.parse(localStorage.getItem('darkMode'))

    this.checkVersion()
  },
  methods: {
    // 變更語言設定
    changeLanguage: function (status) {
      i18n.locale = status
      localStorage.setItem('locale', status)
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
      this.lock = false
    },
    // 檢查版本, 比伺服器新則不檢查
    checkVersion: async function () {
      let response = await this.$api.login.version()
      let dbVersion = response.data.result[0].Value
      for (let i = 0; i < dbVersion.length; i++) {
        let dbChar = dbVersion[i].slice(-1)
        let nowChar = this.$store.state.version[i].slice(-1)
        if (dbChar !== nowChar) {
          if (parseInt(dbChar, 10) > parseInt(nowChar, 10)) {
            errorMessage(this.$t('__versionError') + '<br/><h1>New:' + dbVersion + '</h1>' + '<br/>Now:' + this.$store.state.version, this.$t('__warning'))
          } else {
            return
          }
        }
      }
    },
    // 按下Enter檢核登入
    keyboardChange: function () {
      this.submit()
    },
    // 切換 darkmode
    darkModeChange: function () {
      localStorage.setItem('darkMode', JSON.stringify(this.darkMode))
      errorMessage(this.$t('__pleaseRestartDarkMode'))
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
