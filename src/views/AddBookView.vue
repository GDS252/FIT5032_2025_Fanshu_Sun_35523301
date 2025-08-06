<template>
  <div class="container mt-4">
    <div class="row">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h3>📖 添加新书</h3>
          </div>
          <div class="card-body">
            <form @submit.prevent="addBook">
              <div class="mb-3">
                <label for="isbn" class="form-label">ISBN:</label>
                <input 
                  type="text" 
                  v-model="isbn" 
                  id="isbn" 
                  class="form-control"
                  required 
                  placeholder="输入ISBN号码"
                />
              </div>
              <div class="mb-3">
                <label for="name" class="form-label">书名:</label>
                <input 
                  type="text" 
                  v-model="name" 
                  id="name" 
                  class="form-control"
                  required 
                  placeholder="输入书名"
                />
              </div>
              <button type="submit" class="btn btn-primary" :disabled="isAdding">
                {{ isAdding ? '添加中...' : '添加图书' }}
              </button>
            </form>
            
            <!-- 成功/错误消息 -->
            <div v-if="message" :class="'alert alert-' + messageType" class="mt-3">
              {{ message }}
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-md-6">
        <!-- 图书列表组件 -->
        <BookList ref="bookListRef" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import db from '../firebase/init.js'
import { collection, addDoc } from 'firebase/firestore';
import BookList from '../components/BookList.vue';

// 响应式数据
const isbn = ref('');
const name = ref('');
const isAdding = ref(false);
const message = ref('');
const messageType = ref('success');
const bookListRef = ref(null);

// 显示消息
const showMessage = (msg, type = 'success') => {
  message.value = msg;
  messageType.value = type;
  setTimeout(() => {
    message.value = '';
  }, 3000);
};

// 添加图书
const addBook = async () => {
  isAdding.value = true;
  
  try {
    const isbnNumber = Number(isbn.value);
    if (isNaN(isbnNumber)) {
      showMessage('ISBN必须是一个有效的数字', 'danger');
      return;
    }

    await addDoc(collection(db, 'books'), {
      isbn: isbnNumber,
      name: name.value,
      createdAt: new Date()
    });
    
    // 清空表单
    isbn.value = '';
    name.value = '';
    
    showMessage('图书添加成功！', 'success');
    
    // 刷新图书列表
    if (bookListRef.value) {
      bookListRef.value.fetchBooks();
    }
    
  } catch (error) {
    console.error('添加图书时出错: ', error);
    showMessage('添加失败: ' + error.message, 'danger');
  } finally {
    isAdding.value = false;
  }
};
</script>