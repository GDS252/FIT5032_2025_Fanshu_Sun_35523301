<template>
  <!-- Using Bootstrap's Header template (starter code) -->
  <!-- https://getbootstrap.com/docs/5.0/examples/headers/ -->
  <div class="container">
    <header class="d-flex justify-content-between align-items-center py-3">
      <ul class="nav nav-pills">
        <li class="nav-item">
          <router-link to="/" class="nav-link" active-class="active" aria-current="page"
            >Home (Week 5)</router-link
          >
        </li>
        <li class="nav-item">
          <router-link to="/about" class="nav-link" active-class="active">About</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/addbook" class="nav-link" active-class="active">Add Book</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/login" class="nav-link" active-class="active">Login</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/FireLogin" class="nav-link" active-class="active">Firebase Login</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/FireRegister" class="nav-link" active-class="active">Firebase Register</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/logout" class="nav-link" active-class="active">User Console</router-link>
        </li>
      </ul>
      
      <!-- 用户状态和认证相关的导航 -->
      <div class="auth-section">
        <!-- Firebase用户状态 -->
        <div v-if="isFirebaseAuthenticated" class="d-flex align-items-center">
          <span class="me-3 text-success">
            欢迎, {{ firebaseUser?.displayName || firebaseUser?.email }}!
          </span>
          <button @click="handleFirebaseLogout" class="btn btn-outline-danger btn-sm">
            注销
          </button>
        </div>
        <!-- 传统认证用户状态 -->
        <div v-else-if="isAuthenticated" class="d-flex align-items-center">
          <span class="me-3 text-success">
            欢迎, {{ currentUser?.username }}!
          </span>
          <button @click="handleLogout" class="btn btn-outline-danger btn-sm">
            注销
          </button>
        </div>
        <!-- 未登录状态 -->
        <div v-else class="d-flex align-items-center">
          <router-link to="/FireLogin" class="btn btn-primary btn-sm me-2">
            Firebase登录
          </router-link>
          <router-link to="/login" class="btn btn-outline-primary btn-sm">
            传统登录
          </router-link>
        </div>
      </div>
    </header>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { isAuthenticated, currentUser, logout } from '../auth.js'
import { isFirebaseAuthenticated, firebaseUser, firebaseLogout } from '../firebaseAuth.js'

const router = useRouter()

const handleLogout = () => {
  logout()
  router.push('/login')
}

const handleFirebaseLogout = async () => {
  const success = await firebaseLogout()
  if (success) {
    router.push('/FireLogin')
  }
}
</script>

<style scoped>
.b-example-divider {
  height: 3rem;
  background-color: rgba(0, 0, 0, 0.1);
  border: solid rgba(0, 0, 0, 0.15);
  border-width: 1px 0;
  box-shadow:
    inset 0 0.5em 1.5em rgba(0, 0, 0, 0.1),
    inset 0 0.125em 0.5em rgba(0, 0, 0, 0.15);
}

.form-control-dark {
  color: #fff;
  background-color: var(--bs-dark);
  border-color: var(--bs-gray);
}
.form-control-dark:focus {
  color: #fff;
  background-color: var(--bs-dark);
  border-color: #fff;
  box-shadow: 0 0 0 0.25rem rgba(255, 255, 255, 0.25);
}

.bi {
  vertical-align: -0.125em;
  fill: currentColor;
}

.text-small {
  font-size: 85%;
}

.dropdown-toggle {
  outline: 0;
}
</style>
