<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h3 class="text-center">Firebase 登录</h3>
          </div>
          <div class="card-body">
            <div v-if="errorMessage" class="alert alert-danger">
              {{ errorMessage }}
            </div>
            <div v-if="successMessage" class="alert alert-success">
              {{ successMessage }}
            </div>
            <form @submit.prevent="signin">
              <div class="mb-3">
                <label for="email" class="form-label">邮箱</label>
                <input 
                  type="email" 
                  class="form-control" 
                  id="email"
                  placeholder="请输入邮箱" 
                  v-model="email" 
                  required
                />
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">密码</label>
                <input 
                  type="password" 
                  class="form-control" 
                  id="password"
                  placeholder="请输入密码" 
                  v-model="password" 
                  required
                />
              </div>
              <div class="d-grid">
                <button type="submit" class="btn btn-primary" :disabled="loading">
                  {{ loading ? '登录中...' : '登录' }}
                </button>
              </div>
            </form>
            <div class="text-center mt-3">
              <small class="text-muted">
                还没有账户？ 
                <router-link to="/FireRegister" class="text-decoration-none">立即注册</router-link>
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const errorMessage = ref("");
const successMessage = ref("");
const loading = ref(false);
const router = useRouter();
const auth = getAuth();

const signin = () => {
  // 清除之前的消息
  errorMessage.value = "";
  successMessage.value = "";
  loading.value = true;

  // 基本验证
  if (!email.value || !password.value) {
    errorMessage.value = "请填写邮箱和密码";
    loading.value = false;
    return;
  }

  console.log("Attempting to sign in with:", email.value);

  signInWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      console.log("Firebase login Successful!", userCredential);
      const user = userCredential.user;
      successMessage.value = `欢迎回来，${user.email}！正在跳转...`;
      
      setTimeout(() => {
        router.push("/");
      }, 1500);
    })
    .catch((error) => {
      console.error("Firebase login error:", error);
      errorMessage.value = getErrorMessage(error.code);
    })
    .finally(() => {
      loading.value = false;
    });
};

const getErrorMessage = (errorCode) => {
  switch (errorCode) {
    case 'auth/user-not-found':
      return '用户不存在，请检查邮箱或先注册账户';
    case 'auth/wrong-password':
      return '密码错误，请重试';
    case 'auth/invalid-email':
      return '邮箱格式不正确';
    case 'auth/user-disabled':
      return '该账户已被禁用';
    case 'auth/too-many-requests':
      return '登录尝试次数过多，请稍后再试';
    case 'auth/invalid-api-key':
      return 'Firebase配置错误，请联系管理员';
    default:
      return `登录失败: ${errorCode}`;
  }
};
</script>

<style scoped>
.card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>