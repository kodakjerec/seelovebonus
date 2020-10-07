<template>
  <div>
    <el-image
    class="imageBlock"
    :src="require('@/assets/logo.png')"
    :fit="'contain'"
    ></el-image>
    <el-card class="box-card">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item :label="$t('__userId')" prop="UserID">
          <el-input v-model="form.UserID" autocomplete></el-input>
        </el-form-item>
        <el-form-item :label="$t('__pwd')" prop="Password">
          <el-input v-model="form.Password" show-password></el-input>
        </el-form-item>
      </el-form>
      <el-button class="submitButton" type="primary" @click.prevent="submit">{{$t('__login')}}</el-button>
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
      }
    }
  },
  mounted () {
    // 刷新到首頁時, 強制清空
    this.$store.dispatch('setAuth', {
      'token': '',
      'isLogin': false,
      'userID': '',
      'userName': ''
    })
    this.$store.dispatch('setMenuList', {
      'menuList': []
    })
    this.$store.dispatch('setUserProg', {
      'userProg': []
    })
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
      this.$refs['form'].validate((valid) => {
        if (valid) {
          console.log('valid')
          this.login()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 送出登入API
    login: async function () {
      const response = await this.$api.login.login({
        UserID: this.form.UserID,
        Password: this.form.Password
      })

      // 成功登入
      if (response.status === 200) {
        this.$store.dispatch('setAuth', {
          'token': response.data.token,
          'isLogin': true,
          'userID': response.data.result[0].UserID,
          'userName': response.data.result[0].Name
        })

        // 讀入 menu
        const response2 = await this.$api.login.getMenu({
          UserID: this.form.UserID
        })
        this.$store.dispatch('setMenuList', response2.data)

        // 讀入 使用者權限
        const response3 = await this.$api.settings.getUserProg({
          UserID: this.form.UserID
        })
        this.$store.dispatch('setUserProg', response3.data.userProg)

        router.push('home')
      }
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
