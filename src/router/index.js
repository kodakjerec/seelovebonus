import Vue from 'vue'
import store from '@/store/index'
import Router from 'vue-router'

Vue.use(Router)

// 解決Element-UI 在 vue 3.0 中重複路徑報錯問題
// https://www.cnblogs.com/chenwan1218/p/13130410.html
// https://juejin.im/post/6854573221439045640
const VueRouterPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return VueRouterPush.call(this, location).catch(err => err)
}
const VueRouterReplace = Router.prototype.replace
Router.prototype.replace = function replace (location) {
  return VueRouterReplace.call(this, location).catch(err => err)
}

const routes = [
  {
    path: '/',
    name: 'login',
    meta: { title: '登入' },
    component: () => import('@/views/Login/login')
  },
  {
    path: '/home',
    name: 'home',
    meta: { title: '首頁' },
    component: () => import('@/views/Home/home')
  },
  {
    path: '/Basic',
    name: 'Basic'
  },
  {
    path: '/Basic/Customers',
    name: 'Customers',
    component: () => import('@/views/Basic/customers')
  },
  {
    path: '/Basic/Companies',
    name: 'Companies',
    component: () => import('@/views/Basic/companies')
  },
  {
    path: '/Basic/Employees',
    name: 'Employees',
    component: () => import('../views/Basic/employees')
  },
  {
    path: '/Basic/Products',
    name: 'Products',
    component: () => import('@/views/Basic/products')
  },
  {
    path: '/Basic/Projects',
    name: 'Projects',
    component: () => import('../views/Basic/projects')
  },
  {
    path: '/Basic/Stock',
    name: 'Stock',
    component: () => import('../views/Basic/storageAddress')
  },
  {
    path: '/Orders/Orders',
    name: 'Orders',
    component: () => import('@/views/Orders/orders'),
    props: true
  },
  {
    path: '/Orders/OrderNewForm',
    name: 'OrderNewForm',
    component: () => import('@/views/Orders/components/orderNewForm'),
    props: true
  },
  {
    path: '/Orders/Invoices',
    name: 'Invoices',
    component: () => import('@/views/Orders/invoices')
  },
  {
    path: '/Orders/Certificate1Show',
    name: 'Certificate1Show',
    component: () => import('@/views/Orders/certificate1Show')
  },
  {
    path: '/Orders/Certificate2Show',
    name: 'Certificate2Show',
    component: () => import('@/views/Orders/certificate2Show')
  },
  {
    path: '/Orders/OrderSignOffManual',
    name: 'OrderSignOffManual',
    component: () => import('@/views/Orders/components/orderSignOffManual')
  },
  {
    path: '/Reports',
    name: 'Reports'
  },
  {
    path: '/Reports/Employees',
    name: 'ReportsEmployees',
    component: () => import('@/views/Reports/reportsEmployees')
  },
  {
    path: '/Reports/Bonus2',
    name: 'ReportsBonus2',
    component: () => import('@/views/Reports/reportsBonus2')
  },
  {
    path: '/Reports/Bonus1',
    name: 'ReportsBonus1',
    component: () => import('@/views/Reports/reportsBonus1')
  },
  {
    path: '/Settings/SystemSettings',
    name: 'SystemSettings',
    component: () => import('@/views/Settings/systemSettings')
  },
  {
    path: '/Settings/Users',
    name: 'Users',
    component: () => import('@/views/Settings/users')
  },
  {
    path: '/Settings/Accounting',
    name: 'Accounting',
    component: () => import('@/views/Settings/accounting')
  },
  {
    path: '/Settings/Announcement',
    name: 'Announcement',
    component: () => import('@/views/Settings/announcementShow')
  }
]

const router = new Router({
  routes
})

let tempMenuList = JSON.parse(JSON.stringify(store.state.menuList))
let subMenuList = []
tempMenuList.forEach(menu => {
  menu.subMenu.forEach(submenu => {
    subMenuList.push(submenu)
  })
})

router.beforeEach((to, from, next) => {
  // 重新進入頁面的時候, 清空讀取中視窗, 避免影響使用者操作
  store.dispatch('resetLoadingMask')
  if (to.meta.title) {
    document.title = to.meta.title
  } else {
    let submenu = subMenuList.find(submenu => { return submenu.Path === to.path })
    if (submenu) {
      document.title = submenu.Name
    }
  }
  next()
})

// // 強迫重新整理網頁
// router.afterEach((to, from, next) => {
//   if (to.path === '/' && from.path !== '/') {
//     window.location.reload(true)
//   }
// })
export default router
