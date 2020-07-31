import Vue from 'vue'
import VueI18n from 'vue-i18n'
import enDefine from '../i18n/en/lang'
import zhDefine from '../i18n/zh/lang'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-TW'

Vue.use(VueI18n)

// 取得預設語系
const locale = localStorage.getItem('locale') || 'zh'
// 組合語系
const messages = {
  en: {
    ...enDefine,
    ...enLocale
  },
  zh: {
    ...zhDefine,
    ...zhLocale
  }
}

// Create VueI18n instance with options
const i18n = new VueI18n({
  locale, // set locale
  messages
})

export default i18n
