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

    <!-- GitHub Device Flow 弹窗 (小程序端) -->
    <view
      v-if="deviceFlowInfo.visible"
      class="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 animate-fade-in px-6"
    >
      <view
        class="bg-white rounded-2xl w-full max-w-[320px] p-6 shadow-2xl flex flex-col items-center text-center"
      >
        <uni-icons type="github" size="48" color="#24292e" class="mb-4"></uni-icons>
        <text class="text-xl font-bold text-gray-800 mb-2">GitHub 授权登录</text>
        <text class="text-sm text-gray-500 mb-6"
          >由于小程序环境限制，请复制下方授权码并在浏览器中打开授权页面完成登录。</text
        >

        <view class="bg-gray-100 rounded-lg p-4 mb-6 w-full shadow-inner border border-gray-200">
          <text class="block text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wider"
            >您的授权码</text
          >
          <text class="block text-2xl font-mono text-primary font-bold tracking-widest">{{
            deviceFlowInfo.userCode
          }}</text>
        </view>

        <button
          class="w-full h-11 bg-[#24292e] text-white rounded-xl shadow-md hover:bg-gray-800 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 font-medium mb-3"
          @click="openAndCopyLink"
        >
          <text>复制并前往授权</text>
        </button>

        <view class="flex items-center space-x-2 mb-4">
          <view
            class="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin"
          ></view>
          <text class="text-xs text-primary font-medium animate-pulse">等待授权中...</text>
        </view>

        <button
          class="w-full py-2 bg-transparent text-gray-400 text-sm hover:text-gray-600 transition-colors"
          @click="closeDeviceFlow"
        >
          取消登录
        </button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, onUnmounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { userApi } from '../../api/user'

const isLogin = ref(true)
const formData = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
})

// === Device Flow 状态 ===
const deviceFlowInfo = reactive({
  visible: false,
  userCode: '',
  deviceCode: '',
  verificationUri: '',
})
let pollingTimer: ReturnType<typeof setTimeout> | null = null

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

const handleGithubLogin = async () => {
  // #ifdef H5
  // H5 直接跳转到后端 OAuth2 授权地址
  const authUrl = userApi.getGithubAuthUrl()
  window.location.href = authUrl
  // #endif

  // #ifndef H5
  // 小程序端使用 Device Flow 工作流
  try {
    uni.showLoading({ title: '请求授权码...' })
    const res = await userApi.getGithubDeviceCode()
    if (res.code === 200 && res.data) {
      deviceFlowInfo.userCode = res.data.user_code || res.data.userCode
      deviceFlowInfo.deviceCode = res.data.device_code || res.data.deviceCode
      deviceFlowInfo.verificationUri = res.data.verification_uri || res.data.verificationUri
      deviceFlowInfo.visible = true
      startPollingDeviceToken()
    } else {
      uni.showToast({ title: '获取授权码失败', icon: 'none' })
    }
  } catch (e) {
    console.error('getGithubDeviceCode Error:', e)
  } finally {
    uni.hideLoading()
  }
  // #endif
}

// === Device Flow 相关方法 ===
const openAndCopyLink = () => {
  uni.setClipboardData({
    data: deviceFlowInfo.userCode,
    showToast: false, // 自定义提示
    success: () => {
      uni.showModal({
        title: '短码已复制',
        content: `请在即将打开的浏览器中粘贴该授权短码：${deviceFlowInfo.userCode}`,
        confirmText: '去浏览器',
        success: (res) => {
          if (res.confirm) {
            // 系统剪贴板有授权码了，再拷贝URL去浏览器。因为微信无法直接打开非业务域名浏览器
            uni.setClipboardData({
              data: deviceFlowInfo.verificationUri,
              success: () => {
                uni.showToast({ title: '链接已复制，请在浏览器中打开', icon: 'none' })
              },
            })
          }
        },
      })
    },
  })
}

const startPollingDeviceToken = (initialInterval = 5500) => {
  if (pollingTimer) clearTimeout(pollingTimer)

  let pollingAttempts = 0
  const maxAttempts = 120 // 120 * 5.5s = ~11 分钟超时
  let currentInterval = initialInterval

  const poll = async () => {
    pollingAttempts++
    if (pollingAttempts > maxAttempts) {
      closeDeviceFlow()
      uni.showToast({ title: '授权超时，请重试', icon: 'none' })
      return
    }

    try {
      const res = await userApi.pollGithubDeviceToken(deviceFlowInfo.deviceCode)
      // 如果 code 为 200，说明成功获取到 token
      if (res.code === 200 && res.data?.token) {
        uni.setStorageSync('token', res.data.token)
        deviceFlowInfo.visible = false
        uni.showToast({ title: 'GitHub 登录成功', icon: 'success' })
        setTimeout(() => {
          uni.reLaunch({ url: '/views/profile/profile' })
        }, 1500)
        return // 成功后不再继续轮询
      } else if (res.code === 202) {
        // 后端透传了等待错误，判断是否需要变频
        const msg = String((res as any).message || '')
        if (msg.includes('slow_down')) {
          currentInterval += 5000 // 被 GitHub 惩罚加时
        } else if (msg.includes('expired_token')) {
          closeDeviceFlow()
          uni.showToast({ title: '授权码已过期，请重试', icon: 'none' })
          return
        }
      }
    } catch {
      // 网络错误或者其他，静默，等待下一次轮询
    }

    // 没返回 200 或业务终止动作，只要弹窗还在就继续下一次轮询
    if (deviceFlowInfo.visible) {
      pollingTimer = setTimeout(poll, currentInterval)
    }
  }

  // 启动第一次轮询
  pollingTimer = setTimeout(poll, currentInterval)
}

const closeDeviceFlow = () => {
  deviceFlowInfo.visible = false
  if (pollingTimer) {
    clearTimeout(pollingTimer)
    pollingTimer = null
  }
}

onUnmounted(() => {
  if (pollingTimer) clearTimeout(pollingTimer)
})
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
