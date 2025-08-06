import { ref, onMounted } from 'vue'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'

// Firebase身份验证状态
export const isFirebaseAuthenticated = ref(false)
export const firebaseUser = ref(null)
export const isLoading = ref(true)

// 初始化Firebase身份验证监听器
export const initFirebaseAuth = () => {
  const auth = getAuth()
  
  onAuthStateChanged(auth, (user) => {
    isLoading.value = false
    if (user) {
      // 用户已登录
      isFirebaseAuthenticated.value = true
      firebaseUser.value = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email?.split('@')[0],
        emailVerified: user.emailVerified,
        photoURL: user.photoURL,
        createdAt: user.metadata.creationTime,
        lastLoginAt: user.metadata.lastSignInTime
      }
      console.log('Firebase user logged in:', firebaseUser.value)
    } else {
      // 用户已注销
      isFirebaseAuthenticated.value = false
      firebaseUser.value = null
      console.log('Firebase user logged out')
    }
  })
}

// Firebase注销函数
export const firebaseLogout = async () => {
  const auth = getAuth()
  try {
    await signOut(auth)
    console.log('Firebase logout successful')
    return true
  } catch (error) {
    console.error('Firebase logout error:', error)
    return false
  }
}

// 获取当前用户信息
export const getCurrentFirebaseUser = () => {
  const auth = getAuth()
  return auth.currentUser
}
