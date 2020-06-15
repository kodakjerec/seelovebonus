import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import locale from 'element-ui/lib/locale/lang/en'

// setup
import './setup/setupVueProperties'

import './plugins/element.js'

Vue.config.productionTip = false

new Vue({
  store,
  router,
  locale,
  render: h => h(App)
}).$mount('#app')
