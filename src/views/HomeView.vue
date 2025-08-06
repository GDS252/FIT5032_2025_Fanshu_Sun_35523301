<template>
  <div class="container mt-5">
    <!-- 欢迎信息 -->
    <div class="jumbotron bg-primary text-white p-5 rounded mb-4">
      <h1 class="display-4">欢迎来到NoMash图书馆</h1>
      <p class="lead">
        <span v-if="isAuthenticated">
          欢迎回来，{{ currentUser?.username }}！您可以访问所有功能。
        </span>
        <span v-else>
          发现知识的无限可能，探索我们丰富的数字资源。
        </span>
      </p>
      <hr class="my-4">
      <p v-if="!isAuthenticated">请登录以访问完整功能，包括图书馆注册和会员专区。</p>
      <div v-if="!isAuthenticated">
        <router-link to="/login" class="btn btn-light btn-lg">立即登录</router-link>
      </div>
      <div v-else>
        <router-link to="/about" class="btn btn-light btn-lg me-3">了解更多</router-link>
        <button @click="showRegistrationForm = !showRegistrationForm" class="btn btn-outline-light btn-lg">
          {{ showRegistrationForm ? '隐藏' : '显示' }}注册表单
        </button>
      </div>
    </div>

    <!-- 功能介绍 -->
    <div class="row mb-4">
      <div class="col-md-4">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">📚 丰富藏书</h5>
            <p class="card-text">超过10万册图书，涵盖各个学科领域。</p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">💻 数字资源</h5>
            <p class="card-text">在线数据库、电子期刊和多媒体资源。</p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">🎓 学习支持</h5>
            <p class="card-text">研究指导、学习空间和专业咨询服务。</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 未认证用户提示 -->
    <div v-if="!isAuthenticated" class="alert alert-info">
      <h4>需要注册图书馆会员？</h4>
      <p>请先登录您的账户以访问图书馆注册表单和其他会员功能。</p>
      <router-link to="/login" class="btn btn-primary">前往登录</router-link>
    </div>

    <!-- 已认证用户的额外功能 -->
    <div v-if="isAuthenticated" class="mt-4">
      <div class="alert alert-success">
        <h4>会员专享功能</h4>
        <p>作为已登录的会员，您可以：</p>
        <ul>
          <li>访问 <router-link to="/about">关于页面</router-link> 的详细信息</li>
          <li>查看会员专享内容</li>
          <li>使用图书馆的高级功能</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { isAuthenticated, currentUser } from '../auth.js'

const showRegistrationForm = ref(false)
</script>

<style scoped>
.jumbotron {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.card {
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-5px);
}
</style>