import Vue from 'vue'
import api from '@/services/api'
import VueMask, { VueMaskDirective, VueMaskFilter } from 'v-mask'

Vue.prototype.$api = api
Vue.use(VueMask)
Vue.directive('mask', VueMaskDirective)
Vue.filter('VMask', VueMaskFilter)
