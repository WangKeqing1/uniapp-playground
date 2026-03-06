<template>
  <view
    class="login-container min-h-screen flex items-center justify-center p-6 bg-linear-to-br from-primary/10 via-white to-secondary/10"
  >
    <!-- 背景装饰 -->
    <view
      class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[100px] rounded-full animate-pulse"
    ></view>
    <view
      class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 blur-[100px] rounded-full animate-pulse delay-1000"
    ></view>

    <view
      class="login-card w-full max-w-[400px] bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl shadow-2xl p-8 transform transition-all duration-500 hover:scale-[1.01]"
    >
      <!-- 头部 Logo -->
      <view class="flex flex-col items-center mb-8">
        <image src="/static/logo.png" mode="aspectFit" class="w-20 h-20 mb-4 drop-shadow-lg" />
        <text class="text-2xl font-bold text-gray-800 tracking-tight">{{
          isLogin ? '欢迎回来' : '创建账户'
        }}</text>
        <text class="text-sm text-gray-500 mt-1">{{
          isLogin ? '请登录您的账号以继续' : '加入我们的创意游乐场'
        }}</text>
      </view>

      <!-- 表单区域 -->
      <view class="space-y-6">
        <view class="group">
          <text class="block text-xs font-semibold text-gray-400 mb-1 ml-1 uppercase tracking-wider"
            >用户名</text
          >
          <view class="relative">
            <input
              v-model="formData.username"
              placeholder="请输入用户名"
              class="w-full h-12 px-4 bg-gray-50/50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary focus:bg-white transition-all outline-none"
            />
          </view>
        </view>

        <!-- 注册状态下的额外字段：邮箱 -->
        <view v-if="!isLogin" class="group animate-fade-in">
          <text class="block text-xs font-semibold text-gray-400 mb-1 ml-1 uppercase tracking-wider"
            >电子邮箱</text
          >
          <view class="relative">
            <input
              v-model="formData.email"
              type="text"
              placeholder="请输入邮箱"
              class="w-full h-12 px-4 bg-gray-50/50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary focus:bg-white transition-all outline-none"
            />
          </view>
        </view>

        <view class="group">
          <text class="block text-xs font-semibold text-gray-400 mb-1 ml-1 uppercase tracking-wider"
            >密码</text
          >
          <view class="relative">
            <input
              v-model="formData.password"
              type="password"
              placeholder="请输入密码"
              class="w-full h-12 px-4 bg-gray-50/50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary focus:bg-white transition-all outline-none"
            />
          </view>
        </view>

        <!-- 注册状态下的额外字段：确认密码 -->
        <view v-if="!isLogin" class="group animate-fade-in">
          <text class="block text-xs font-semibold text-gray-400 mb-1 ml-1 uppercase tracking-wider"
            >确认密码</text
          >
          <view class="relative">
            <input
              v-model="formData.confirmPassword"
              type="password"
              placeholder="请再次输入密码"
              class="w-full h-12 px-4 bg-gray-50/50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary focus:bg-white transition-all outline-none"
            />
          </view>
        </view>

        <!-- 按钮组 -->
        <button
          class="w-full h-12 bg-linear-to-r from-primary to-secondary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
          @click="handleSubmit"
        >
          <text>{{ isLogin ? '立即登录' : '立即注册' }}</text>
        </button>

        <!-- 切换登录/注册 -->
        <view class="flex justify-center text-sm">
          <text class="text-gray-400">{{ isLogin ? '还没有账号？' : '已有账号？' }}</text>
          <text class="text-primary font-semibold ml-1 cursor-pointer" @click="toggleMode">
            {{ isLogin ? '去注册' : '去登录' }}
          </text>
        </view>
      </view>

      <!-- 分割线 -->
      <view class="relative my-8">
        <view class="absolute inset-0 flex items-center">
          <view class="w-full border-t border-gray-100"></view>
        </view>
        <view class="relative flex justify-center text-xs uppercase">
          <span class="bg-white/0 px-2 text-gray-400">其他登录方式</span>
        </view>
      </view>

      <!-- 第三方登录 -->
      <view class="grid grid-cols-1 gap-4">
        <button
          class="flex items-center justify-center space-x-3 w-full h-12 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 active:bg-gray-100 transition-all shadow-sm"
          @click="handleGithubLogin"
        >
          <uni-icons type="github" size="24" color="#24292e"></uni-icons>
          <text class="text-sm font-medium text-gray-700">使用 GitHub 登录</text>
        </button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { userApi } from '../../api/user'

const isLogin = ref(true)
const formData = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
})

// 处理 OAuth2 回调 Token
onLoad((options) => {
  const token = options?.token || options?.['?token']
  if (token) {
    console.log('Detected OAuth2 token in URL, logging in...')
    uni.setStorageSync('token', token)
    uni.showToast({
      title: 'GitHub 登录成功',
      icon: 'success',
    })
    setTimeout(() => {
      uni.reLaunch({ url: '/views/profile/profile' })
    }, 1500)
  }
})

const toggleMode = () => {
  isLogin.value = !isLogin.value
}

const handleSubmit = async () => {
  const { username, password, email, confirmPassword } = formData

  if (!username || !password) {
    uni.showToast({ title: '请填写用户名和密码', icon: 'none' })
    return
  }

  if (!isLogin.value) {
    if (!email) {
      uni.showToast({ title: '请填写邮箱', icon: 'none' })
      return
    }
    if (password !== confirmPassword) {
      uni.showToast({ title: '两次密码输入不一致', icon: 'none' })
      return
    }
  }

  uni.showLoading({ title: isLogin.value ? '登录中...' : '注册中...' })

  try {
    if (isLogin.value) {
      const res = await userApi.login({ username, password })
      // 处理登录成功
      // 假设后端返回 Result<String>，data 是 token
      if (res.data) {
        uni.setStorageSync('token', res.data)
        uni.showToast({ title: '登录成功', icon: 'success' })
        setTimeout(() => {
          uni.reLaunch({ url: '/views/profile/profile' })
        }, 1500)
      }
    } else {
      await userApi.register({ username, email, password })
      uni.showToast({ title: '注册成功，请登录', icon: 'success' })
      isLogin.value = true
    }
  } catch (err: any) {
    console.error('Auth Error:', err)
  } finally {
    uni.hideLoading()
  }
}

const handleGithubLogin = () => {
  // 直接跳转到后端 OAuth2 授权地址
  const authUrl = userApi.getGithubAuthUrl()

  // #ifdef H5
  window.location.href = authUrl
  // #endif

  // #ifndef H5
  uni.showModal({
    title: '提示',
    content: '小程序端 GitHub 登录建议使用 WebView 或通过后端代理跳转。',
    showCancel: false,
  })
  // #endif
}
</script>

<style scoped>
.login-container {
  overflow: hidden;
  position: relative;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out forwards;
}

/* 消除小程序 button 默认边框 */
button::after {
  border: none;
}
</style>
