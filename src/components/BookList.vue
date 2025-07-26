<template>
  <div class="book-list">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h3>📚 图书管理系统</h3>
      <button @click="showFilters = !showFilters" class="btn btn-outline-secondary btn-sm">
        {{ showFilters ? '隐藏筛选' : '显示筛选' }}
      </button>
    </div>

    <!-- 高级查询和筛选 -->
    <div v-if="showFilters" class="card mb-4">
      <div class="card-header">
        <h5>🔍 高级查询</h5>
      </div>
      <div class="card-body">
        <div class="row">
          <!-- 搜索筛选 -->
          <div class="col-md-4 mb-3">
            <label class="form-label">书名搜索</label>
            <input 
              type="text" 
              v-model="searchQuery" 
              class="form-control" 
              placeholder="输入书名关键词"
              @input="debouncedSearch"
            />
          </div>
          
          <!-- ISBN筛选 -->
          <div class="col-md-4 mb-3">
            <label class="form-label">ISBN筛选</label>
            <div class="input-group">
              <select v-model="isbnOperator" class="form-select" style="max-width: 80px;">
                <option value="==">=</option>
                <option value=">">&gt;</option>
                <option value=">=">&gt;=</option>
                <option value="<">&lt;</option>
                <option value="<=">&lt;=</option>
              </select>
              <input 
                type="number" 
                v-model="isbnFilter" 
                class="form-control" 
                placeholder="ISBN值"
              />
            </div>
          </div>

          <!-- 排序选项 -->
          <div class="col-md-4 mb-3">
            <label class="form-label">排序方式</label>
            <div class="input-group">
              <select v-model="sortField" class="form-select">
                <option value="createdAt">创建时间</option>
                <option value="name">书名</option>
                <option value="isbn">ISBN</option>
              </select>
              <select v-model="sortDirection" class="form-select" style="max-width: 80px;">
                <option value="desc">降序</option>
                <option value="asc">升序</option>
              </select>
            </div>
          </div>
        </div>

        <div class="row">
          <!-- 限制数量 -->
          <div class="col-md-3 mb-3">
            <label class="form-label">显示数量</label>
            <select v-model="limitCount" class="form-select">
              <option value="5">5条</option>
              <option value="10">10条</option>
              <option value="20">20条</option>
              <option value="50">50条</option>
              <option value="0">全部</option>
            </select>
          </div>

          <!-- 操作按钮 -->
          <div class="col-md-9 mb-3 d-flex align-items-end">
            <button @click="applyFilters" class="btn btn-primary me-2" :disabled="loading">
              应用筛选
            </button>
            <button @click="resetFilters" class="btn btn-outline-secondary me-2">
              重置筛选
            </button>
            <button @click="fetchBooks" class="btn btn-outline-info">
              刷新数据
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 统计信息 -->
    <div class="alert alert-info" v-if="books.length > 0">
      共找到 <strong>{{ books.length }}</strong> 本图书
      <span v-if="lastQuery"> (应用了筛选条件)</span>
    </div>
    
    <!-- 加载状态 -->
    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">加载中...</span>
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="alert alert-danger">
      错误: {{ error }}
      <button @click="fetchBooks" class="btn btn-outline-danger btn-sm ms-2">重试</button>
    </div>

    <!-- 图书列表 -->
    <div v-else-if="books.length > 0">
      <div class="row">
        <div v-for="book in books" :key="book.id" class="col-md-6 col-lg-4 mb-3">
          <div class="card h-100">
            <div class="card-body">
              <!-- 编辑模式 -->
              <div v-if="editingBook === book.id">
                <div class="mb-2">
                  <label class="form-label">书名</label>
                  <input 
                    v-model="editForm.name" 
                    class="form-control form-control-sm"
                    @keyup.enter="saveEdit(book.id)"
                    @keyup.escape="cancelEdit"
                  />
                </div>
                <div class="mb-2">
                  <label class="form-label">ISBN</label>
                  <input 
                    v-model="editForm.isbn" 
                    type="number" 
                    class="form-control form-control-sm"
                    @keyup.enter="saveEdit(book.id)"
                    @keyup.escape="cancelEdit"
                  />
                </div>
                <div class="btn-group btn-group-sm">
                  <button @click="saveEdit(book.id)" class="btn btn-success">
                    保存
                  </button>
                  <button @click="cancelEdit" class="btn btn-secondary">
                    取消
                  </button>
                </div>
              </div>

              <!-- 显示模式 -->
              <div v-else>
                <h5 class="card-title">{{ book.name }}</h5>
                <p class="card-text">
                  <strong>ISBN:</strong> {{ book.isbn }}
                </p>
                <p class="card-text" v-if="book.createdAt">
                  <small class="text-muted">
                    创建时间: {{ formatDate(book.createdAt) }}
                  </small>
                </p>
                <small class="text-muted d-block mb-2">
                  ID: {{ book.id }}
                </small>
                <div class="btn-group btn-group-sm">
                  <button @click="startEdit(book)" class="btn btn-outline-primary">
                    编辑
                  </button>
                  <button @click="deleteBook(book.id)" class="btn btn-outline-danger">
                    删除
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="text-center text-muted py-5">
      <p>暂无图书记录</p>
      <p>添加一些图书来开始吧！</p>
    </div>

    <!-- 操作成功/失败消息 -->
    <div v-if="message" :class="'alert alert-' + messageType" class="mt-3">
      {{ message }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import db from '../firebase/init.js'
import { 
  collection, 
  getDocs, 
  deleteDoc, 
  updateDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  limit 
} from 'firebase/firestore'

// 响应式数据
const books = ref([])
const loading = ref(false)
const error = ref(null)
const message = ref('')
const messageType = ref('success')

// 筛选和查询相关
const showFilters = ref(false)
const searchQuery = ref('')
const isbnFilter = ref('')
const isbnOperator = ref('==')
const sortField = ref('createdAt')
const sortDirection = ref('desc')
const limitCount = ref(10)
const lastQuery = ref(null)

// 编辑相关
const editingBook = ref(null)
const editForm = ref({
  name: '',
  isbn: ''
})

// 防抖搜索
let searchTimeout = null
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    if (searchQuery.value.length > 0) {
      applyFilters()
    }
  }, 500)
}

// 显示消息
const showMessage = (msg, type = 'success') => {
  message.value = msg
  messageType.value = type
  setTimeout(() => {
    message.value = ''
  }, 3000)
}

// 格式化日期
const formatDate = (date) => {
  if (!date) return '未知'
  if (date.toDate) {
    return date.toDate().toLocaleString('zh-CN')
  }
  return new Date(date).toLocaleString('zh-CN')
}

// 基础获取图书列表
const fetchBooks = async () => {
  loading.value = true
  error.value = null
  lastQuery.value = null
  
  try {
    const querySnapshot = await getDocs(collection(db, 'books'))
    books.value = []
    
    querySnapshot.forEach((doc) => {
      books.value.push({
        id: doc.id,
        ...doc.data()
      })
    })
    
    console.log('图书列表加载成功:', books.value)
    showMessage(`成功加载 ${books.value.length} 本图书`)
  } catch (err) {
    console.error('获取图书列表失败:', err)
    error.value = err.message
    showMessage('加载失败: ' + err.message, 'danger')
  } finally {
    loading.value = false
  }
}

// 应用筛选和查询
const applyFilters = async () => {
  loading.value = true
  error.value = null
  
  try {
    let q = collection(db, 'books')
    const constraints = []
    
    // 添加where条件
    if (isbnFilter.value) {
      const isbnValue = Number(isbnFilter.value)
      if (!isNaN(isbnValue)) {
        constraints.push(where('isbn', isbnOperator.value, isbnValue))
      }
    }
    
    // 添加orderBy条件
    if (sortField.value) {
      constraints.push(orderBy(sortField.value, sortDirection.value))
    }
    
    // 添加limit条件
    if (limitCount.value && limitCount.value > 0) {
      constraints.push(limit(Number(limitCount.value)))
    }
    
    // 构建查询
    if (constraints.length > 0) {
      q = query(q, ...constraints)
    }
    
    const querySnapshot = await getDocs(q)
    books.value = []
    
    querySnapshot.forEach((doc) => {
      const bookData = {
        id: doc.id,
        ...doc.data()
      }
      
      // 如果有搜索关键词，进行客户端筛选
      if (searchQuery.value) {
        if (bookData.name.toLowerCase().includes(searchQuery.value.toLowerCase())) {
          books.value.push(bookData)
        }
      } else {
        books.value.push(bookData)
      }
    })
    
    lastQuery.value = {
      search: searchQuery.value,
      isbn: isbnFilter.value,
      operator: isbnOperator.value,
      sort: `${sortField.value} ${sortDirection.value}`,
      limit: limitCount.value
    }
    
    console.log('筛选查询成功:', books.value)
    showMessage(`筛选结果: ${books.value.length} 本图书`)
    
  } catch (err) {
    console.error('查询失败:', err)
    error.value = err.message
    showMessage('查询失败: ' + err.message, 'danger')
  } finally {
    loading.value = false
  }
}

// 重置筛选条件
const resetFilters = () => {
  searchQuery.value = ''
  isbnFilter.value = ''
  isbnOperator.value = '=='
  sortField.value = 'createdAt'
  sortDirection.value = 'desc'
  limitCount.value = 10
  lastQuery.value = null
  fetchBooks()
}

// 开始编辑
const startEdit = (book) => {
  editingBook.value = book.id
  editForm.value = {
    name: book.name,
    isbn: book.isbn
  }
}

// 取消编辑
const cancelEdit = () => {
  editingBook.value = null
  editForm.value = {
    name: '',
    isbn: ''
  }
}

// 保存编辑
const saveEdit = async (bookId) => {
  try {
    const isbnNumber = Number(editForm.value.isbn)
    if (isNaN(isbnNumber)) {
      showMessage('ISBN必须是一个有效数字', 'danger')
      return
    }
    
    await updateDoc(doc(db, 'books', bookId), {
      name: editForm.value.name,
      isbn: isbnNumber,
      updatedAt: new Date()
    })
    
    // 更新本地数据
    const index = books.value.findIndex(book => book.id === bookId)
    if (index !== -1) {
      books.value[index] = {
        ...books.value[index],
        name: editForm.value.name,
        isbn: isbnNumber,
        updatedAt: new Date()
      }
    }
    
    editingBook.value = null
    showMessage('图书更新成功', 'success')
    console.log('图书更新成功:', bookId)
    
  } catch (err) {
    console.error('更新图书失败:', err)
    showMessage('更新失败: ' + err.message, 'danger')
  }
}

// 删除图书
const deleteBook = async (bookId) => {
  if (!confirm('确定要删除这本书吗？此操作无法撤销。')) {
    return
  }
  
  try {
    await deleteDoc(doc(db, 'books', bookId))
    // 从本地列表中移除
    books.value = books.value.filter(book => book.id !== bookId)
    showMessage('图书删除成功', 'success')
    console.log('图书删除成功:', bookId)
  } catch (err) {
    console.error('删除图书失败:', err)
    showMessage('删除失败: ' + err.message, 'danger')
  }
}

// 监听排序字段变化，自动应用筛选
watch([sortField, sortDirection], () => {
  if (lastQuery.value) {
    applyFilters()
  }
})

// 组件挂载时获取数据
onMounted(() => {
  fetchBooks()
})

// 暴露方法给父组件
defineExpose({
  fetchBooks,
  applyFilters
})
</script>

<style scoped>
.book-list {
  margin-top: 2rem;
  padding: 0 15px;
}

.card {
  transition: all 0.2s ease-in-out;
  border: 1px solid #e0e0e0;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  border-color: #007bff;
}

.card-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
  font-weight: 600;
}

.card-body {
  padding: 1.25rem;
}

.btn-group .btn {
  margin-right: 5px;
}

.btn-group .btn:last-child {
  margin-right: 0;
}

.btn-group-sm .btn {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.alert {
  border-radius: 8px;
  border: none;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.form-control:focus, .form-select:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
}

.spinner-border {
  color: #007bff;
  width: 3rem;
  height: 3rem;
}

.text-muted {
  color: #6c757d !important;
}

.py-5 {
  padding-top: 3rem !important;
  padding-bottom: 3rem !important;
}

/* 编辑表单样式 */
.card-body .form-label {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #495057;
}

/* 搜索和筛选区域 */
.card-header h5 {
  margin-bottom: 0;
  color: #495057;
}

.input-group .form-select {
  border-right: 1px solid #ced4da;
}

.input-group .form-control {
  border-left: none;
}

.input-group .form-select:focus + .form-control {
  border-left-color: #007bff;
}

/* 按钮样式增强 */
.btn-outline-primary:hover {
  color: #fff;
  background-color: #007bff;
  border-color: #007bff;
}

.btn-outline-danger:hover {
  color: #fff;
  background-color: #dc3545;
  border-color: #dc3545;
}

.btn-outline-secondary:hover {
  color: #fff;
  background-color: #6c757d;
  border-color: #6c757d;
}

.btn-outline-info:hover {
  color: #fff;
  background-color: #17a2b8;
  border-color: #17a2b8;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .book-list {
    padding: 0 10px;
  }
  
  .btn-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  
  .btn-group .btn {
    margin-right: 0;
    margin-bottom: 5px;
  }
  
  .btn-group .btn:last-child {
    margin-bottom: 0;
  }
  
  .input-group {
    flex-direction: column;
  }
  
  .input-group .form-select,
  .input-group .form-control {
    border: 1px solid #ced4da;
    margin-bottom: 10px;
  }
  
  .input-group .form-control {
    border-left: 1px solid #ced4da;
  }
}

/* 加载状态 */
.text-center .spinner-border {
  margin: 2rem auto;
}

/* 图书卡片内容样式 */
.card-title {
  color: #212529;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.card-text {
  margin-bottom: 0.5rem;
  line-height: 1.5;
}

.card-text strong {
  font-weight: 600;
  color: #495057;
}

/* 成功/错误消息样式 */
.alert-success {
  background-color: #d4edda;
  color: #155724;
  border-color: #c3e6cb;
}

.alert-danger {
  background-color: #f8d7da;
  color: #721c24;
  border-color: #f5c6cb;
}

.alert-info {
  background-color: #d1ecf1;
  color: #0c5460;
  border-color: #bee5eb;
}

/* 统计信息强调 */
.alert-info strong {
  font-weight: 700;
  color: #0c5460;
}
</style>
