<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <div class="card">
          <div class="card-header bg-primary text-white">
            <h3 class="mb-0">用户控制台 - 注销页面</h3>
          </div>
          <div class="card-body">
            <!-- 用户信息显示 -->
            <div v-if="isFirebaseAuthenticated" class="mb-4">
              <h4 class="text-success">🟢 Firebase 用户已登录</h4>
              <div class="alert alert-info">
                <h5>当前用户信息：</h5>
                <div class="row">
                  <div class="col-md-6">
                    <strong>邮箱：</strong> {{ firebaseUser?.email }}<br>
                    <strong>用户ID：</strong> {{ firebaseUser?.uid }}<br>
                    <strong>显示名称：</strong> {{ firebaseUser?.displayName || '未设置' }}<br>
                    <strong>邮箱验证：</strong> 
                    <span :class="firebaseUser?.emailVerified ? 'text-success' : 'text-warning'">
                      {{ firebaseUser?.emailVerified ? '已验证' : '未验证' }}
                    </span>
                  </div>
                  <div class="col-md-6">
                    <strong>创建时间：</strong> {{ formatDate(firebaseUser?.createdAt) }}<br>
                    <strong>最后登录：</strong> {{ formatDate(firebaseUser?.lastLoginAt) }}<br>
                    <strong>头像：</strong> {{ firebaseUser?.photoURL || '无' }}
                  </div>
                </div>
              </div>
            </div>

            <div v-else-if="isAuthenticated" class="mb-4">
              <h4 class="text-warning">🟡 传统用户已登录</h4>
              <div class="alert alert-secondary">
                <strong>用户名：</strong> {{ currentUser?.username }}
              </div>
            </div>

            <div v-else class="mb-4">
              <h4 class="text-danger">🔴 无用户登录</h4>
              <div class="alert alert-warning">
                当前没有用户登录到系统
              </div>
            </div>

            <!-- 开发人员控制台 -->
            <div class="developer-console mb-4">
              <h5>🛠️ 开发人员控制台</h5>
              <div class="bg-dark text-light p-3 rounded">
                <div class="console-output" id="console">
                  <div v-for="(log, index) in consoleLogs" :key="index" class="console-line">
                    <span class="timestamp">[{{ log.timestamp }}]</span>
                    <span :class="'log-' + log.type">{{ log.message }}</span>
                  </div>
                </div>
              </div>
              <div class="mt-2">
                <button @click="logCurrentUser" class="btn btn-info btn-sm me-2">
                  记录当前用户
                </button>
                <button @click="logAuthState" class="btn btn-secondary btn-sm me-2">
                  记录认证状态
                </button>
                <button @click="clearConsole" class="btn btn-outline-light btn-sm">
                  清空控制台
                </button>
              </div>
            </div>

            <!-- 注销操作 -->
            <div class="logout-section">
              <h5>注销操作</h5>
              <div v-if="isFirebaseAuthenticated" class="mb-3">
                <button @click="handleFirebaseLogout" class="btn btn-danger me-2" :disabled="loggingOut">
                  {{ loggingOut ? '注销中...' : 'Firebase 注销' }}
                </button>
                <small class="text-muted">注销Firebase用户并清除会话</small>
              </div>
              
              <div v-if="isAuthenticated" class="mb-3">
                <button @click="handleTraditionalLogout" class="btn btn-warning me-2">
                  传统用户注销
                </button>
                <small class="text-muted">注销传统认证用户</small>
              </div>

              <div v-if="!isFirebaseAuthenticated && !isAuthenticated" class="text-center">
                <p class="text-muted">没有用户需要注销</p>
                <router-link to="/FireLogin" class="btn btn-primary me-2">
                  Firebase登录
                </router-link>
                <router-link to="/login" class="btn btn-outline-primary">
                  传统登录
                </router-link>
              </div>
            </div>

            <!-- 操作结果 -->
            <div v-if="message" :class="'alert alert-' + messageType" class="mt-3">
              {{ message }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { isAuthenticated, currentUser, logout } from '../auth.js'
import { isFirebaseAuthenticated, firebaseUser, firebaseLogout, getCurrentFirebaseUser } from '../firebaseAuth.js'

const router = useRouter()
const consoleLogs = ref([])
const message = ref('')
const messageType = ref('info')
const loggingOut = ref(false)

// 添加日志到控制台
const addLog = (message, type = 'info') => {
  const timestamp = new Date().toLocaleTimeString()
  consoleLogs.value.push({
    timestamp,
    message,
    type
  })
  
  // 限制日志数量
  if (consoleLogs.value.length > 50) {
    consoleLogs.value.shift()
  }
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '未知'
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN')
}

// 记录当前用户信息
const logCurrentUser = () => {
  addLog('=== 当前用户信息 ===', 'info')
  
  if (isFirebaseAuthenticated.value) {
    addLog(`Firebase用户: ${firebaseUser.value?.email}`, 'success')
    addLog(`用户ID: ${firebaseUser.value?.uid}`, 'info')
    addLog(`邮箱验证: ${firebaseUser.value?.emailVerified}`, 'info')
    
    const currentUser = getCurrentFirebaseUser()
    if (currentUser) {
      addLog(`Firebase Auth对象存在`, 'success')
      addLog(`刷新令牌: ${currentUser.refreshToken ? '存在' : '不存在'}`, 'info')
    }
  } else if (isAuthenticated.value) {
    addLog(`传统用户: ${currentUser.value?.username}`, 'warning')
  } else {
    addLog('无用户登录', 'error')
  }
}

// 记录认证状态
const logAuthState = () => {
  addLog('=== 认证状态检查 ===', 'info')
  addLog(`Firebase认证: ${isFirebaseAuthenticated.value}`, isFirebaseAuthenticated.value ? 'success' : 'error')
  addLog(`传统认证: ${isAuthenticated.value}`, isAuthenticated.value ? 'success' : 'error')
  addLog(`Firebase用户对象: ${firebaseUser.value ? '存在' : '不存在'}`, firebaseUser.value ? 'success' : 'error')
}

// 清空控制台
const clearConsole = () => {
  consoleLogs.value = []
  addLog('控制台已清空', 'info')
}

// Firebase注销
const handleFirebaseLogout = async () => {
  loggingOut.value = true
  addLog('开始Firebase注销...', 'info')
  
  try {
    const success = await firebaseLogout()
    if (success) {
      addLog('Firebase注销成功', 'success')
      showMessage('Firebase用户已成功注销', 'success')
      setTimeout(() => {
        router.push('/FireLogin')
      }, 2000)
    } else {
      addLog('Firebase注销失败', 'error')
      showMessage('注销失败，请重试', 'danger')
    }
  } catch (error) {
    addLog(`Firebase注销错误: ${error.message}`, 'error')
    showMessage('注销过程中发生错误', 'danger')
  } finally {
    loggingOut.value = false
  }
}

// 传统用户注销
const handleTraditionalLogout = () => {
  addLog('开始传统用户注销...', 'info')
  logout()
  addLog('传统用户注销成功', 'success')
  showMessage('传统用户已成功注销', 'success')
  setTimeout(() => {
    router.push('/login')
  }, 2000)
}

// 显示消息
const showMessage = (msg, type) => {
  message.value = msg
  messageType.value = type
  setTimeout(() => {
    message.value = ''
  }, 5000)
}

// 组件挂载时初始化
onMounted(() => {
  addLog('用户控制台已加载', 'info')
  logAuthState()
  logCurrentUser()
})
</script>

<style scoped>
.developer-console .console-output {
  height: 200px;
  overflow-y: auto;
  font-family: 'Courier New', monospace;
  font-size: 12px;
}

.console-line {
  display: block;
  margin-bottom: 2px;
}

.timestamp {
  color: #6c757d;
  margin-right: 8px;
}

.log-info {
  color: #17a2b8;
}

.log-success {
  color: #28a745;
}

.log-warning {
  color: #ffc107;
}

.log-error {
  color: #dc3545;
}

.card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.alert {
  border-radius: 0.375rem;
}
</style>
