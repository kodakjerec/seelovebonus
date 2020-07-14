import Vue from 'vue'
import VueRouter from 'vue-router'

// 解決Element-UI 在 vue 3.0 中重複路徑報錯問題
// https://www.cnblogs.com/chenwan1218/p/13130410.html
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

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
    path: '/Orders/CollectionRecords',
    name: 'CollectionRecords',
    component: () => import('@/views/Orders/collectionRecords')
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
    path: '/Settings',
    name: 'Settings',
    component: () => import('@/views/Settings/setting')
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
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})
export default router
