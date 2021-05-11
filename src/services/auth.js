import axios from 'axios'
import store from '../store'
import router from '@/router/index'
import { errorMessage, toLogin } from './utils'
import i18n from '@/setup/setupLocale'

// request 攔截器
axios.interceptors.request.use(config => {
  // 發送req前判斷vuex中是否存在token
  // 若存在則統一在http請求的header都加上token
  const token = store.state.token
  token && (config.headers.Authorization = token)
  switch (i18n.locale) {
    case 'en':
      config.headers.ClientLocale = 1
      break
    case 'zh':
      config.headers.ClientLocale = 2
      break
    default:
      config.headers.ClientLocale = 2
  }

  return config
}, (error) => {
  return Promise.reject(error)
})

// response 攔截器
axios.interceptors.response.use((response) => {
  // 成功發出請求且收到response, 有客製化的error
  if (response.headers['code'] !== '200') {
    let requestURL = response.request.responseURL
    errorMessage(response.data.result.message + '<br/>' + requestURL, response.headers['code'])
  }
  return response
}, (error) => {
  const { response } = error
  if (response) {
    // 成功發出請求且收到response, 但有error
    errorHandle(response.status, response)
    return Promise.reject(error)
  } else {
    // 成功發出請求但是沒收到 response
    if (!window.navigator.onLine) {
      errorMessage('網路問題或刷新網頁', 'Offline')
    } else {
      return Promise.reject(error)
    }
  }
})

const errorHandle = (status, response) => {
  let requestURL = response.request.responseURL
  switch (status) {
    case 400:
      errorMessage(i18n.t('__error400') + '<br/>' + requestURL, status)
      break
    case 401:
      let { name, message } = response.data
      let i18nID = ''
      switch (name) {
        case 'TokenExpiredError':
          i18nID = '__error401TokenExpiredError'
          break
        case 'JsonWebTokenError':
          i18nID = '__error401JsonWebTokenError'
          break
        case 'NotBeforeError':
          i18nID = '__error401NotBeforeError'
          break
        case 'MultipleLogin':
          i18nID = '__error401MultipleLogin'
          break
      }
      errorMessage(i18n.t(i18nID) + '<br/>' + requestURL + '<br/>' + message, status)
      // 清除token
      store.dispatch('setAuth', {
        'token': '',
        'isLogin': false
      })

      if (router.currentRoute.fullPath === '/') {
      } else {
        setTimeout(() => {
          toLogin()
        }, 3000)
      }
      break
    case 404:
      errorMessage(i18n.t('__error404') + '<br/>' + requestURL, status)
      break
    case 500:
      errorMessage(response.data + '<br/>' + requestURL, status)
      break
    default:
      errorMessage('錯誤狀況: ' + response.data, status)
  }
}

export default function (method, url, data = null) {
  method = method.toLowerCase()
  if (method === 'post') {
    return axios.post(url, data)
  } else if (method === 'postencrypt') {
    return axios.post(url, data, {
      headers: {
        'encrypt': 1
      }
    })
  } else if (method === 'get') {
    return axios.get(url, { params: data })
  } else if (method === 'getfile') {
    return axios.get(url, { params: data, responseType: 'blob' })
  } else if (method === 'uploadfile') {
    return axios.post(url, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  } else if (method === 'delete') {
    return axios.delete(url, { params: data })
  } else if (method === 'put') {
    return axios.put(url, data)
  } else {
    console.error('未知的method ' + method)
    return false
  }
}
