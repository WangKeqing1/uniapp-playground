<template>
  <view class="profile-container min-h-screen bg-gray-50/50 p-4 pb-10">
    <!-- 顶部导航占位 -->
    <view class="h-12 w-full"></view>

    <!-- 顶部卡片：用户信息 -->
    <view
      class="bg-white rounded-2xl shadow-sm p-6 mb-6 flex items-center space-x-4 border border-gray-100/50"
    >
      <view class="relative group">
        <image
          :src="userInfo.avatarUrl || '/static/logo.png'"
          class="w-20 h-20 rounded-full border-2 border-primary/20 bg-gray-100"
          mode="aspectFill"
          @click="handleAvatarClick"
        />
        <view class="absolute bottom-0 right-0 bg-primary rounded-full p-1 border-2 border-white">
          <uni-icons type="camera-filled" size="14" color="#fff"></uni-icons>
        </view>
      </view>
      <view class="flex-1">
        <text class="block text-xl font-bold text-gray-800">{{
          userInfo.displayName || '未设置昵称'
        }}</text>
        <text class="block text-sm text-gray-400 mt-1">ID: {{ userInfo.username || '-' }}</text>
      </view>
    </view>

    <!-- 提示完善信息 -->
    <view v-if="needsCompletion" class="mb-6 animate-pulse">
      <view class="bg-primary/10 border border-primary/20 rounded-xl p-4 flex items-center">
        <uni-icons type="info" size="20" color="var(--color-primary)"></uni-icons>
        <text class="ml-2 text-sm text-primary font-medium"
          >您的个人资料尚未完善，建议补全昵称和简介。</text
        >
      </view>
    </view>

    <!-- 表单区域 -->
    <view class="bg-white rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden">
      <view class="p-6 space-y-6">
        <view>
          <text class="block text-sm font-semibold text-gray-500 mb-2">昵称</text>
          <input
            v-model="editData.displayName"
            placeholder="请输入您的昵称"
            class="w-full h-11 px-4 bg-gray-50 rounded-xl border border-gray-100 focus:bg-white focus:border-primary transition-all outline-none"
          />
        </view>

        <view>
          <text class="block text-sm font-semibold text-gray-500 mb-2">头像链接</text>
          <input
            v-model="editData.avatarUrl"
            placeholder="请输入头像 URL"
            class="w-full h-11 px-4 bg-gray-50 rounded-xl border border-gray-100 focus:bg-white focus:border-primary transition-all outline-none"
          />
        </view>

        <view>
          <text class="block text-sm font-semibold text-gray-500 mb-2">个人简介</text>
          <textarea
            v-model="editData.bio"
            placeholder="向大家介绍一下自己吧"
            class="w-full h-24 p-4 bg-gray-50 rounded-xl border border-gray-100 focus:bg-white focus:border-primary transition-all outline-none"
          />
        </view>
      </view>

      <view class="p-6 bg-gray-50/50 border-t border-gray-100">
        <button
          class="w-full h-12 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center"
          :disabled="loading"
          @click="handleSave"
        >
          <text>{{ loading ? '保存中...' : '保存修改' }}</text>
        </button>
      </view>
    </view>

    <!-- 退出登录 -->
    <view class="mt-8 flex justify-center">
      <text
        class="text-sm text-gray-400 hover:text-danger transition-colors cursor-pointer"
        @click="handleLogout"
        >退出登录</text
      >
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { userApi } from '../../api/user'

interface UserInfo {
  username?: string
  email?: string
  displayName?: string
  avatarUrl?: string
  bio?: string
}

const loading = ref(false)
const userInfo = ref<UserInfo>({})
const editData = reactive<UserInfo>({
  displayName: '',
  avatarUrl: '',
  bio: '',
})

const needsCompletion = computed(() => {
  return userInfo.value.username && (!userInfo.value.displayName || !userInfo.value.bio)
})

const fetchUserInfo = async () => {
  try {
    const res = await userApi.getProfile()
    if (res.data) {
      userInfo.value = res.data
      editData.displayName = res.data.displayName || ''
      editData.avatarUrl = res.data.avatarUrl || ''
      editData.bio = res.data.bio || ''
    }
  } catch (err) {
    console.error('Fetch Profile Failed:', err)
  }
}

const handleSave = async () => {
  loading.value = true
  try {
    const res = await userApi.updateProfile({
      displayName: editData.displayName,
      avatarUrl: editData.avatarUrl,
      bio: editData.bio,
    })
    if (res.code === 0 || res.data) {
      uni.showToast({ title: '保存成功', icon: 'success' })
      await fetchUserInfo()
    }
  } catch (err) {
    console.error('Update Profile Failed:', err)
  } finally {
    loading.value = false
  }
}

/**
 * 跨平台读取本地文件为 ArrayBuffer 的工具函数
 * 兼容 H5、小程序、App 端的限制
 */
const getFileBuffer = (filePath: string): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    // #ifdef H5
    fetch(filePath)
      .then((res) => res.arrayBuffer())
      .then(resolve)
      .catch(reject)
    // #endif

    // #ifndef H5
    const fileSystemManager = uni.getFileSystemManager ? uni.getFileSystemManager() : null
    if (fileSystemManager) {
      fileSystemManager.readFile({
        filePath: filePath,
        success: (res) => resolve(res.data as ArrayBuffer),
        fail: reject,
      })
    } else {
      reject(new Error('当前环境不支持文件读取'))
    }
    // #endif
  })
}

const handleAvatarClick = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: async (chooseRes) => {
      const tempFilePath = chooseRes.tempFilePaths[0]
      uni.showLoading({ title: '准备上传...', mask: true })

      try {
        // 1. 获取直传配置 (包含带签名的 Worker 链接)
        const configRes = (await userApi.getAvatarUploadConfig()) as {
          code: number
          message: string
          data: { uploadUrl: string; finalUrl: string }
        }
        if (configRes.code !== 200 && configRes.code !== 0) {
          throw new Error(configRes.message || '获取上传配置失败')
        }

        const { uploadUrl, finalUrl } = configRes.data

        // 2. 读取本地文件为纯粹的二进制流
        const fileData = await getFileBuffer(tempFilePath)

        uni.showLoading({ title: '正在上传...', mask: true })

        // 3. 发送 PUT 请求强制绕开 multipart / form-data 的限制
        const uploadRes = await new Promise<UniApp.RequestSuccessCallbackResult>(
          (resolve, reject) => {
            uni.request({
              url: uploadUrl,
              method: 'PUT',
              data: fileData,
              header: {
                'Content-Type': 'image/jpeg',
              },
              success: resolve,
              fail: reject,
            })
          },
        )

        if (uploadRes.statusCode >= 200 && uploadRes.statusCode < 300) {
          // 4. 更新前端视图 (业务组件不再关心后续 API 保存逻辑，用户点 "保存修改" 时统一处理)
          userInfo.value.avatarUrl = finalUrl
          editData.avatarUrl = finalUrl
          uni.showToast({ title: '图片已上传至 Cloudflare!', icon: 'success' })
        } else {
          throw new Error(`Worker 上传失败，状态码: ${uploadRes.statusCode}`)
        }
      } catch (err) {
        console.error('Avatar Upload Failed:', err)
        uni.showToast({ title: (err as Error).message || '图片上传失败', icon: 'none' })
      } finally {
        uni.hideLoading()
      }
    },
  })
}

const handleLogout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        uni.removeStorageSync('token')
        uni.reLaunch({ url: '/views/login/login' })
      }
    },
  })
}

onMounted(() => {
  fetchUserInfo()
})
</script>

<style scoped>
/* 可以在此处添加样式 */
</style>
