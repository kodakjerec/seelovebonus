import Vue from 'vue'
import api from '@/services/api'
import VueExcelXlsx from 'vue-excel-xlsx'

Vue.use(VueExcelXlsx)
Vue.prototype.$api = api
