<template>
  <div class="container mt-5">
    <div class="about">
      <div class="alert alert-success" role="alert">
        <h4 class="alert-heading">🎉 认证成功！</h4>
        <p>欢迎访问我们的关于页面！这是一个受保护的页面，只有登录用户才能查看。</p>
      </div>
      
      <h1>关于我们的图书馆</h1>
      <p class="lead">欢迎来到我们的数字图书馆！我们致力于为社区提供丰富的图书和资源收藏。</p>
      
      <div class="row mt-4">
        <div class="col-md-6">
          <h3>我们的使命</h3>
          <p>为所有用户提供高质量的学习资源和舒适的阅读环境，促进知识传播和终身学习。</p>
        </div>
        <div class="col-md-6">
          <h3>会员权益</h3>
          <ul>
            <li>无限制借阅图书</li>
            <li>访问数字资源库</li>
            <li>参加图书馆活动</li>
            <li>使用学习空间</li>
          </ul>
        </div>
      </div>
      
      <div class="mt-4 p-3 bg-light rounded">
        <h4>受保护内容</h4>
        <p>此页面的内容只对已认证的用户可见。感谢您的登录！</p>
        <small class="text-muted">当前登录用户: {{ currentUser?.username }}</small>
      </div>
    </div>
  </div>
</template>

<script setup>
import { currentUser } from '../auth.js'
</script>

<style scoped>
.about {
  max-width: 800px;
  margin: 0 auto;
}
</style>