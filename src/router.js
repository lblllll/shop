import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginPage from './components/LoginPage.vue'
import HomePage from './components/HomePage.vue'
// import {from} from 'core-js/core/array'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginPage },
  { path: '/home', component: HomePage }
]

const router = new VueRouter({
  routes
})
// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to是将来访问的路径
  // from代表从哪个路径来的
  // next是一个函数表示放行
  // 如果用户访问登录页放行
  if (to.path === '/login') return next()
  // 并且获取保存的token值
  const tokenStr = window.sessionStorage.getItem('token')
  // 没有token，就要强制跳转到登陆页.
  if (!tokenStr) return next('/login')
  next()
})
export default router
