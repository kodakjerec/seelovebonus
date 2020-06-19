import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './setup/setupLocale'

// setup
import './setup/setupVueProperties'

import './plugins/element.js'

Vue.config.productionTip = false

new Vue({
  store,
  router,
  i18n,
  render: h => h(App)
}).$mount('#app')
