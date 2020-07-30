import { MessageBox } from 'element-ui'
import router from '@/router/index'
import i18n from '@/setup/setupLocale'
import req from './auth' // 把request包裝

let seeloveNodeServer = {
  ipHost: '192.168.1.20:3000'
  // ipHost: 'localhost:3000'
}

// 一般api使用
export const post = async (url, reqData = {}) => {
  let combineURL = 'http://' + seeloveNodeServer.ipHost + url
  return req('post', combineURL, reqData)
    .then(response => {
      return response
    })
    .catch(error => {
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

// 跳轉回首頁
export const toLogin = () => {
  router.replace({
    name: 'login',
    query: {
      redirect: router.currentRoute.fullPath
    }
  })
}
