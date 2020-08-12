import { MessageBox } from 'element-ui'
import store from '@/store/index'
import router from '@/router/index'
import i18n from '@/setup/setupLocale'
import req from './auth' // 把request包裝

let seeloveNodeServer = {
  ipHost: '192.168.1.20:3000'
  // ipHost: 'localhost:3000'
}

// 一般api使用
export const post = async (url, reqData = {}) => {
  store.dispatch('increaseLoadingCounter')
  let combineURL = 'http://' + seeloveNodeServer.ipHost + url
  return req('post', combineURL, reqData)
    .then(response => {
      store.dispatch('decreaseLoadingCounter')
      return response
    })
    .catch(error => {
      store.dispatch('decreaseLoadingCounter')
      const { response } = error
      console.log(`%c 💩💩💩 API發生例外錯誤 💩💩💩${((response && response.status) ? `status code [${response.status}]` : '')}`, 'color: #BB2E29; font-size: 14px; font-weight: bold;')
      return Promise.reject(error)
    })
}
export const getFile = async (url, reqData = {}) => {
  store.dispatch('increaseLoadingCounter')
  let combineURL = 'http://' + seeloveNodeServer.ipHost + url
  return req('getFile', combineURL, reqData)
    .then(response => {
      store.dispatch('decreaseLoadingCounter')
      return response
    })
    .catch(error => {
      store.dispatch('decreaseLoadingCounter')
      const { response } = error
      console.log(`%c 💩💩💩 API發生例外錯誤 💩💩💩${((response && response.status) ? `status code [${response.status}]` : '')}`, 'color: #BB2E29; font-size: 14px; font-weight: bold;')
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
    closeOnPressEscape: true
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
