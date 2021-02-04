import { MessageBox } from 'element-ui'
import store from '@/store/index'
import router from '@/router/index'
import i18n from '@/setup/setupLocale'
import req from './auth' // 把request包裝

export const seeloveNodeServer = {
  // ip: '192.168.1.104',
  ip: '192.168.2.210',
  // ipHost: 'localhost',
  port: '3000', // backend server
  portReportingServices: '3002' // reporting services server
}

// 不要有LoadingMask的url
const urlNoMask = ['/basic/checkValidate', '/stock/checkValidate', '/login/version']

// 一般api使用
export const post = async (url, reqData = {}) => {
  // 檢查是否需要顯示LoadingMask
  let showLoadingCounter = true
  if (urlNoMask.find(item => { return item === url }) !== undefined) {
    showLoadingCounter = false
  }

  if (showLoadingCounter) { store.dispatch('increaseLoadingCounter') }
  let combineURL = 'http://' + seeloveNodeServer.ip + ':' + seeloveNodeServer.port + url
  return req('post', combineURL, reqData)
    .then(response => {
      if (showLoadingCounter) { store.dispatch('decreaseLoadingCounter') }
      return response
    })
    .catch((error) => {
      if (showLoadingCounter) { store.dispatch('decreaseLoadingCounter') }
      let { response } = error
      if (response === undefined) {
        response = {
          status: 404,
          data: error
        }
      }
      console.log(`%c 💩💩💩 API發生例外錯誤 💩💩💩${((response && response.status) ? `status code [${response.status}]` : '')}`, 'color: #BB2E29; font-size: 14px; font-weight: bold;')
      return Promise.reject(error)
    })
}
export const getFile = async (url, reqData = {}) => {
  // 檢查是否需要顯示LoadingMask
  let showLoadingCounter = true
  if (urlNoMask.find(item => { return item === url }) !== undefined) {
    showLoadingCounter = false
  }

  if (showLoadingCounter) { store.dispatch('increaseLoadingCounter') }
  let combineURL = 'http://' + seeloveNodeServer.ip + ':' + seeloveNodeServer.port + url
  return req('getFile', combineURL, reqData)
    .then(response => {
      if (showLoadingCounter) { store.dispatch('decreaseLoadingCounter') }
      return response
    })
    .catch(error => {
      if (showLoadingCounter) { store.dispatch('decreaseLoadingCounter') }
      const { response } = error
      console.log(`%c 💩💩💩 API發生例外錯誤 💩💩💩${((response && response.status) ? `status code [${response.status}]` : '')}`, 'color: #BB2E29; font-size: 14px; font-weight: bold;')
      console.log(error)
      return Promise.reject(error)
    })
}

// 錯誤訊息提示
export const errorMessage = (msg, title) => {
  title = title || ''
  MessageBox.alert(msg, title, {
    dangerouslyUseHTMLString: true,
    confirmButtonText: i18n.t('__ok')
  })
}

// 詢問小視窗
export const messageBoxYesNo = async (msg, title) => {
  msg = msg || ''
  title = title || ''
  let answer = await MessageBox.confirm(msg, title, {
    showCancelButton: true,
    confirmButtonText: i18n.t('__ok'),
    cancelButtonText: i18n.t('__cancel'),
    type: 'warning',
    closeOnPressEscape: true,
    dangerouslyUseHTMLString: true
  }).then((value) => {
    return value
  }).catch((error) => {
    return error
  })

  return answer
}

// 跳轉回首頁
export const toLogin = () => {
  router.replace({
    name: 'login',
    query: {
      redirect: router.currentRoute.fullPath
    }
  })
}
