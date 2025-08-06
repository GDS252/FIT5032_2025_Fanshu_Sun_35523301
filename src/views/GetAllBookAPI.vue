<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header bg-primary text-white">
            <h3 class="mb-0">📚 Get All Books API</h3>
            <small>Display all books in JSON format from Firestore</small>
          </div>
          <div class="card-body">
            <!-- 控制按钮 -->
            <div class="mb-3">
              <button @click="fetchAllBooks" class="btn btn-success me-2" :disabled="loading">
                {{ loading ? '加载中...' : '获取所有书籍' }}
              </button>
              <button @click="clearResults" class="btn btn-secondary me-2">
                清空结果
              </button>
              <button @click="toggleFormat" class="btn btn-info">
                {{ isFormatted ? '压缩显示' : '格式化显示' }}
              </button>
            </div>

            <!-- 加载状态 -->
            <div v-if="loading" class="text-center">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">加载中...</span>
              </div>
              <p class="mt-2">正在从Firestore获取数据...</p>
            </div>

            <!-- 错误信息 -->
            <div v-if="error" class="alert alert-danger">
              <h5>❌ 错误</h5>
              <p>{{ error }}</p>
            </div>

            <!-- 统计信息 -->
            <div v-if="books.length > 0 && !loading" class="alert alert-info">
              <h5>📊 统计信息</h5>
              <ul class="mb-0">
                <li>总书籍数量: {{ books.length }}</li>
                <li>数据更新时间: {{ lastFetchTime }}</li>
                <li>数据格式: JSON</li>
              </ul>
            </div>

            <!-- JSON 数据显示 -->
            <div v-if="books.length > 0 && !loading">
              <h5>📋 JSON 数据</h5>
              <div class="json-container">
                <pre class="json-display">{{ displayJson }}</pre>
              </div>
              
              <!-- 复制到剪贴板按钮 -->
              <div class="mt-3">
                <button @click="copyToClipboard" class="btn btn-outline-primary">
                  📋 复制JSON到剪贴板
                </button>
                <span v-if="copySuccess" class="text-success ms-2">✓ 已复制！</span>
              </div>
            </div>

            <!-- 空状态 -->
            <div v-if="books.length === 0 && !loading && !error" class="text-center text-muted">
              <h5>📭 暂无数据</h5>
              <p>数据库中暂时没有书籍记录</p>
              <router-link to="/addbook" class="btn btn-primary">
                添加第一本书
              </router-link>
            </div>

            <!-- API信息 -->
            <div class="mt-4">
              <h6>🔧 API 信息</h6>
              <div class="bg-light p-3 rounded">
                <p><strong>数据源:</strong> Firebase Firestore</p>
                <p><strong>集合名称:</strong> books</p>
                <p><strong>返回格式:</strong> JSON</p>
                <p><strong>字段包含:</strong> id, name, isbn, createdAt</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import db from '../firebase/init.js'
import { collection, getDocs } from 'firebase/firestore'

// 响应式数据
const books = ref([])
const loading = ref(false)
const error = ref('')
const lastFetchTime = ref('')
const isFormatted = ref(true)
const copySuccess = ref(false)

// 计算属性 - 格式化JSON显示
const displayJson = computed(() => {
  if (books.value.length === 0) return ''
  
  const jsonData = {
    total: books.value.length,
    timestamp: lastFetchTime.value,
    books: books.value
  }
  
  return isFormatted.value 
    ? JSON.stringify(jsonData, null, 2) 
    : JSON.stringify(jsonData)
})

// 获取所有书籍
const fetchAllBooks = async () => {
  loading.value = true
  error.value = ''
  
  try {
    console.log('开始获取所有书籍数据...')
    
    const querySnapshot = await getDocs(collection(db, 'books'))
    const fetchedBooks = []
    
    querySnapshot.forEach((doc) => {
      const bookData = doc.data()
      fetchedBooks.push({
        id: doc.id,
        name: bookData.name || 'Unknown',
        isbn: bookData.isbn || 'Unknown',
        createdAt: bookData.createdAt ? bookData.createdAt.toDate().toISOString() : new Date().toISOString()
      })
    })
    
    books.value = fetchedBooks
    lastFetchTime.value = new Date().toLocaleString('zh-CN')
    
    console.log('成功获取书籍数据:', fetchedBooks.length, '本书')
    
  } catch (err) {
    console.error('获取书籍数据失败:', err)
    error.value = `获取数据失败: ${err.message}`
  } finally {
    loading.value = false
  }
}

// 清空结果
const clearResults = () => {
  books.value = []
  error.value = ''
  lastFetchTime.value = ''
  copySuccess.value = false
}

// 切换JSON格式化显示
const toggleFormat = () => {
  isFormatted.value = !isFormatted.value
}

// 复制到剪贴板
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(displayJson.value)
    copySuccess.value = true
    setTimeout(() => {
      copySuccess.value = false
    }, 2000)
  } catch (err) {
    console.error('复制失败:', err)
    // 降级方案
    const textArea = document.createElement('textarea')
    textArea.value = displayJson.value
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    copySuccess.value = true
    setTimeout(() => {
      copySuccess.value = false
    }, 2000)
  }
}

// 组件挂载时自动获取数据
// onMounted(() => {
//   fetchAllBooks()
// })
</script>

<style scoped>
.json-container {
  max-height: 500px;
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f8f9fa;
}

.json-display {
  background-color: #f8f9fa;
  border: none;
  padding: 1rem;
  margin: 0;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  line-height: 1.4;
  white-space: pre-wrap;
  word-wrap: break-word;
  color: #333;
}

.card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}

.btn {
  transition: all 0.2s;
}

.btn:hover {
  transform: translateY(-1px);
}

.alert {
  border-radius: 0.375rem;
}

.bg-light {
  background-color: #f8f9fa !important;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .json-display {
    font-size: 10px;
  }
  
  .btn {
    margin-bottom: 0.5rem;
  }
}
</style>
