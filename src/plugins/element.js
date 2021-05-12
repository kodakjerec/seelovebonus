import Vue from 'vue'
import Element from 'element-ui'
import i18n from '@/setup/setupLocale'
import './element-variables.scss'

let isDarkMode = localStorage.getItem('darkMode')
if (!isDarkMode) {
  isDarkMode = false
  localStorage.setItem('darkMode', JSON.stringify(isDarkMode))
} else {
  isDarkMode = JSON.parse(localStorage.getItem('darkMode'))
}
if (isDarkMode) {
  const darkMode = () => import('./darkmode-variables.scss')
  Vue.use(darkMode)
}

Vue.use(Element, {
  i18n: (key, value) => i18n.t(key, value)
})
