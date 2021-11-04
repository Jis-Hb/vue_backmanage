import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login/login.vue'
import Home from '../components/home/home.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: login },
  { path: '/home', component: Home }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 从哪个路径跳转过来
  // next 是一个函数 表示放行
  // next() 放行
  // next('/login') 强行跳转
  if (to.path === '/login') return next()

  // 获取token
  const token = window.sessionStorage.getItem('token')

  if (!token) return next('login')
  next()
})

export default router
