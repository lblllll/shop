import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginPage from './components/LoginPage.vue'
import HomePage from './components/HomePage.vue'
import WelcomePage from './components/WelcomePage.vue'
import UsersList from './components/user/UsersPage.vue'
import RightstPage from './components/power/RightstPage.vue'
import RolusPage from './components/power/RolusPage.vue'
import CatePage from './components/goods/CatePage.vue'
import Params from './components/goods/ParamsPage.vue'
// import {from} from 'core-js/core/array'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginPage },
  {
    path: '/home',
    component: HomePage,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: WelcomePage },
      { path: '/users', component: UsersList },
      { path: '/rights', component: RightstPage },
      { path: '/roles', component: RolusPage },
      { path: '/categories', component: CatePage },
      { path: '/params', component: Params }
    ]
  }
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
