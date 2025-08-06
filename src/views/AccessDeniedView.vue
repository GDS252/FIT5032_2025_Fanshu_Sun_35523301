<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-8 text-center">
        <div class="card">
          <div class="card-body">
            <h1 class="card-title text-danger">
              <i class="fas fa-exclamation-triangle"></i>
              访问被拒绝
            </h1>
            <p class="card-text lead">
              抱歉，您需要登录才能访问此页面。
            </p>
            <p class="card-text">
              您当前没有访问此资源的权限。请先登录您的账户。
            </p>
            <div class="mt-4">
              <router-link to="/login" class="btn btn-primary me-3">
                前往登录
              </router-link>
              <router-link to="/" class="btn btn-secondary">
                返回首页
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 这个页面不需要额外的逻辑
</script>

<style scoped>
.card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: none;
}

.text-danger {
  color: #dc3545 !important;
}

i {
  font-size: 1.2em;
  margin-right: 0.5rem;
}
</style>
