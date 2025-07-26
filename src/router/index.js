import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import LoginView from '../views/LoginView.vue'
import AccessDeniedView from '../views/AccessDeniedView.vue'
import FirebaseSigninView from '../views/FirebaseSigninView.vue'
import FirebaseRegisterView from '../views/FirebaseRegisterView.vue'
import LogoutView from '../views/LogoutView.vue'
import { isAuthenticated } from '../auth.js'
import { isFirebaseAuthenticated } from '../firebaseAuth.js'
import AddBookView from '../views/AddBookView.vue';



const routes = [
  {
    path: '/addbook',
    name: 'AddBook',
    component: AddBookView,
    meta: { requiresAuth: true } // 需要身份验证才能添加图书
  },
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/FireLogin',
    name: 'FireLogin',
    component: FirebaseSigninView
  },
  {
    path: '/FireRegister',
    name: 'FireRegister',
    component: FirebaseRegisterView
  },
  {
    path: '/logout',
    name: 'Logout',
    component: LogoutView
  },
  {
    path: '/about',
    name: 'About',
    component: AboutView,
    meta: { requiresAuth: true } // 需要身份验证
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/access-denied',
    name: 'AccessDenied',
    component: AccessDeniedView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 全局路由守卫
router.beforeEach((to, from, next) => {
  // 检查路由是否需要身份验证
  if (to.meta.requiresAuth) {
    // 检查Firebase身份验证或传统身份验证
    if (isFirebaseAuthenticated.value || isAuthenticated.value) {
      next() // 已通过任一方式认证，允许访问
    } else {
      // 未认证，重定向到Firebase登录页面（推荐）
      next('/FireLogin')
    }
  } else {
    // 不需要身份验证的路由，直接允许访问
    next()
  }
})

export default router