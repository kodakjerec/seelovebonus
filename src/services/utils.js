import { MessageBox } from 'element-ui'
import router from '@/router/index'
import i18n from '@/setup/setupLocale'

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
