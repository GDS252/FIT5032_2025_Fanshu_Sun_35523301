import { ref } from 'vue'

// 全局身份验证状态
export const isAuthenticated = ref(false)
export const currentUser = ref(null)

// 硬编码的用户凭据
const validCredentials = {
  username: 'admin',
  password: 'password123'
}

// 登录函数
export const login = (username, password) => {
  if (username === validCredentials.username && password === validCredentials.password) {
    isAuthenticated.value = true
    currentUser.value = { username }
    return true
  }
  return false
}

// 注销函数
export const logout = () => {
  isAuthenticated.value = false
  currentUser.value = null
}
