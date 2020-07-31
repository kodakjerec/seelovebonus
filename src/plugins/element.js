import Vue from 'vue'
import Element from 'element-ui'
import i18n from '@/setup/setupLocale'
import './element-variables.scss'

Vue.use(Element, {
  i18n: (key, value) => i18n.t(key, value)
})
