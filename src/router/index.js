import Vue from 'vue'
import VueRouter from 'vue-router'

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
    path: '/Orders',
    name: 'Orders'
  },
  {
    path: '/Reports',
    name: 'Reports'
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
