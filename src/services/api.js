import loginApi from './apiList/login'
import basicApi from './apiList/basic'
import ordersApi from './apiList/orders'
import reportsApi from './apiList/reports'
import settingsApi from './apiList/settings'
import signOffApi from './apiList/signOff'
import stockApi from './apiList/stock'

const { ...loginItems } = loginApi
const { ...basicItems } = basicApi
const { ...ordersItems } = ordersApi
const { ...reportsItems } = reportsApi
const { ...settingsItems } = settingsApi
const { ...signOffItems } = signOffApi
const { ...stockItems } = stockApi

export default {
  ...loginItems,
  ...basicItems,
  ...ordersItems,
  ...reportsItems,
  ...settingsItems,
  ...signOffItems,
  ...stockItems
}
