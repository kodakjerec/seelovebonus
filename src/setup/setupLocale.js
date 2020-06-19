import Vue from 'vue'
import VueI18n from 'vue-i18n'
import en from '../i18n/en/lang'
import tw from '../i18n/tw/lang'

Vue.use(VueI18n)

// 取得預設語系
const locale = localStorage.getItem('locale') || 'tw'

// Create VueI18n instance with options
const i18n = new VueI18n({
  locale, // set locale
  messages: { en, tw }
})

export default i18n
