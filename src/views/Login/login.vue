<template>
  <div>
    <el-image
    class="imageBlock"
    :src="require('@/assets/logo.png')"
    :fit="'contain'"
    ></el-image>
    <el-card class="box-card">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item :label="$t('__userId')" prop="id">
          <el-input v-model="form.id"></el-input>
        </el-form-item>
        <el-form-item :label="$t('__pwd')" prop="pwd">
          <el-input v-model="form.pwd"></el-input>
        </el-form-item>
      </el-form>
      <el-button class="submitButton" type="primary" @click="submit">{{$t('__login')}}</el-button>
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
  </div>
</template>

<script>
import router from '@/router'
import i18n from '@/setup/setupLocale'
export default {
  name: 'Login',
  data () {
    return {
      language: true,
      form: {
        id: '',
        pwd: ''
      },
      rules: {
        id: [
          { required: true, message: this.$t('__pleaseInputUserID'), trigger: 'blur' }
        ],
        pwd: [
          { required: true, message: this.$t('__pleaseInputPassword'), trigger: 'blur' }
        ]
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

    // 取得語言設定
    if (localStorage.getItem('locale')) {
      i18n.locale = localStorage.getItem('locale')
      switch (i18n.locale) {
        case 'en':
          this.language = false
          break
        case 'tw':
          this.language = true
          break
      }
    } else {
      i18n.locale = 'tw'
      localStorage.setItem('locale', 'tw')
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
          i18n.locale = 'tw'
          localStorage.setItem('locale', 'tw')
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
        UserID: this.form.id,
        Password: this.form.pwd
      })

      // 成功登入
      if (response.status === 200) {
        this.$store.dispatch('setAuth', {
          'token': response.data.token,
          'isLogin': true,
          'userID': response.data.result[0].UserID,
          'userName': response.data.result[0].Name
        })

        // 讀入menu
        const response2 = await this.$api.login.getMenu({
          UserID: this.form.id
        })

        this.$store.dispatch('setMenuList', response2.data)

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
