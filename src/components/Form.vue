<template>
  <!-- 响应式测试控制器 -->
  <div class="responsive-tester" v-if="showTester">
    <div class="tester-header">
      <h5>响应式测试工具</h5>
      <button class="btn btn-sm btn-outline-secondary" @click="toggleTester">×</button>
    </div>
    <div class="tester-content">
      <label>屏幕宽度: {{ currentWidth }}px</label>
      <input 
        type="range" 
        v-model="currentWidth" 
        min="320" 
        max="1920" 
        step="10"
        class="form-range"
        @input="updateViewport"
      >
      <div class="preset-buttons">
        <button class="btn btn-sm btn-outline-primary" @click="setWidth(375)">手机</button>
        <button class="btn btn-sm btn-outline-primary" @click="setWidth(768)">平板</button>
        <button class="btn btn-sm btn-outline-primary" @click="setWidth(1024)">桌面</button>
        <button class="btn btn-sm btn-outline-primary" @click="setWidth(1920)">大屏</button>
      </div>
    </div>
  </div>

  <!-- 测试工具切换按钮 -->
  <div class="toggle-tester">
    <button class="btn btn-sm btn-primary" @click="toggleTester">
      {{ showTester ? '隐藏' : '显示' }}测试工具
    </button>
  </div>

  <div class="container mt-5" :style="{ maxWidth: currentWidth + 'px', margin: '0 auto' }">
    <div class="row">
      <div class="col-12 col-sm-10 col-md-8 col-lg-6 offset-sm-1 offset-md-2 offset-lg-3">
        <h1 class="text-center">User Information Form</h1>
        <form @submit.prevent="submitForm">
          <div class="row mb-3">
            <div class="col-12 col-md-6 mb-3 mb-md-0">
              <label for="username" class="form-label">Username</label>
              <input type="text" class="form-control" id="username" v-model="formData.username">
            </div>
            <div class="col-12 col-md-6">
              <label for="password" class="form-label">Password</label>
              <input type="password" class="form-control" id="password" v-model="formData.password">
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-12 col-md-6 mb-3 mb-md-0">
              <div class="form-check">
                <input type="checkbox" class="form-check-input" id="isAustralian" v-model="formData.isAustralian">
                <label class="form-check-label" for="isAustralian">Australian Resident?</label>
              </div>
            </div>
            <div class="col-12 col-md-6">
              <label for="gender" class="form-label">Gender</label>
              <select class="form-select" id="gender" v-model="formData.gender">
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div class="mb-3">
            <label for="reason" class="form-label">Reason for joining</label>
            <textarea class="form-control" id="reason" rows="3" v-model="formData.reason"></textarea>
          </div>
          <div class="text-center">
            <button type="submit" class="btn btn-primary me-2 mb-2 mb-sm-0">Submit</button>
            <button type="button" class="btn btn-secondary" @click="clearForm">Clear</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <div class="container mt-5" v-if="submittedCards.length">
    <div class="row">
      <div class="col-12">
        <div class="d-flex flex-wrap justify-content-center justify-content-md-start">
          <div v-for="(card, index) in submittedCards" :key="index" 
               class="card m-2 col-12 col-sm-6 col-md-4 col-lg-3" 
               style="max-width: 18rem;">
            <div class="card-header">
              User Information
            </div>
            <ul class="list-group list-group-flush">
              <li class="list-group-item">Username: {{ card.username }}</li>
              <li class="list-group-item">Password: {{ card.password }}</li>
              <li class="list-group-item">Australian Resident: {{ card.isAustralian ? 'Yes' : 'No' }}</li>
              <li class="list-group-item">Gender: {{ card.gender }}</li>
              <li class="list-group-item">Reason: {{ card.reason }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>



<script setup>
// Our logic will go here
import { ref } from 'vue';
  
const formData = ref({
    username: '',
    password: '',
    isAustralian: false,
    reason: '',
    gender: ''
});

const submittedCards = ref([]);

// 响应式测试工具
const showTester = ref(false);
const currentWidth = ref(1200);

const toggleTester = () => {
    showTester.value = !showTester.value;
};

const setWidth = (width) => {
    currentWidth.value = width;
    updateViewport();
};

const updateViewport = () => {
    // 这里可以添加额外的逻辑来响应宽度变化
    console.log('当前测试宽度:', currentWidth.value + 'px');
};

const clearForm = () => {
    formData.value = {
        username: '',
        password: '',
        isAustralian: false,
        reason: '',
        gender: ''
    };
};

const submitForm = () => {
    submittedCards.value.push({
        ...formData.value
    });
    clearForm();
};
</script>

<style scoped>
/* 响应式测试工具样式 */
.responsive-tester {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #fff;
  border: 2px solid #007bff;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  min-width: 280px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.tester-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e9ecef;
}

.tester-header h5 {
  margin: 0;
  color: #007bff;
  font-size: 16px;
  font-weight: 600;
}

.tester-content label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #495057;
  font-size: 14px;
}

.form-range {
  width: 100%;
  margin-bottom: 15px;
}

.preset-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.preset-buttons .btn {
  font-size: 12px;
  padding: 6px 12px;
  border-radius: 6px;
}

.toggle-tester {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 999;
}

.toggle-tester .btn {
  border-radius: 20px;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.3);
}

/* Card styling */
.card {
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-width: 0; /* Prevent card from growing too wide */
}

.card-header {
  background-color: #275FDA;
  color: white;
  padding: 10px;
  border-radius: 10px 10px 0 0;
}

.list-group-item {
  padding: 10px;
  word-wrap: break-word; /* Handle long text */
}

/* Responsive adjustments */
@media (max-width: 576px) {
  .container {
    padding-left: 15px;
    padding-right: 15px;
  }
  
  h1 {
    font-size: 1.5rem;
  }
  
  .btn {
    width: 100%;
    margin-bottom: 10px;
  }
  
  .btn:last-child {
    margin-bottom: 0;
  }

  .responsive-tester {
    position: relative;
    top: auto;
    right: auto;
    margin: 10px;
    min-width: auto;
    width: calc(100% - 20px);
  }

  .toggle-tester {
    position: relative;
    top: auto;
    right: auto;
    text-align: center;
    margin: 10px 0;
  }
}

@media (min-width: 577px) and (max-width: 768px) {
  .card {
    min-width: 250px;
  }
}

@media (min-width: 769px) {
  .card {
    min-width: 280px;
  }
}
</style>