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

const handleAvatarClick = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: async (chooseRes) => {
      const tempFilePath = chooseRes.tempFilePaths[0]
      uni.showLoading({ title: '准备上传...', mask: true })

      try {
        // 1. 获取预签名 URL (严格 HTTP PUT 方法)
        const res = (await userApi.getPresignedUrl()) as any
        if (!res.data || !res.data.uploadUrl) {
          throw new Error('无法获取上传地址')
        }

        const { uploadUrl, finalUrl } = res.data

        // 2. 原生层二进制直传 R2

        // #ifdef H5
        // H5：绝不能附带后端没包含在签名里的 Content-Type (如 signatureHeaders=host)
        // 我们将 File 转为 ArrayBuffer 以完全剥离自带的 MIME Type，防止浏览器自动加上未签名的 Content-Type
        const file = (chooseRes.tempFiles as any)[0]
        const arrayBuffer = await file.arrayBuffer()

        const fetchRes = await fetch(uploadUrl, {
          method: 'PUT',
          body: arrayBuffer, // 纯 ArrayBuffer 类型不会触发浏览器强制加 Content-Type 行为
          headers: {},
        })

        if (!fetchRes.ok) {
          let errText = ''
          try {
            errText = await fetchRes.text()
          } catch {
            /* ignore */
          }
          throw new Error(`H5 直传失败 (Status: ${fetchRes.status}): ${errText}`)
        }
        // #endif

        // #ifndef H5
        // 小程序/APP：严禁使用 uni.uploadFile，采用读文件转 ArrayBuffer + uni.request 直传
        await new Promise((resolve, reject) => {
          const fs = uni.getFileSystemManager()
          fs.readFile({
            filePath: tempFilePath,
            success: (readRes) => {
              uni.request({
                url: uploadUrl,
                method: 'PUT',
                data: readRes.data, // 原生 ArrayBuffer
                header: {
                  // 部分小程序强制附加的头如果导致 400，也应修改或清空
                },
                success: (uploadRes) => {
                  if (uploadRes.statusCode === 200 || uploadRes.statusCode === 204) {
                    resolve(uploadRes)
                  } else {
                    reject(new Error(`原生请求状态码异常: ${uploadRes.statusCode}`))
                  }
                },
                fail: () => reject(new Error('网络请求失败')),
              })
            },
            fail: () => reject(new Error('读取本地文件失败')),
          })
        })
        // #endif

        // 3. 上传完成，更新本地视图
        userInfo.value.avatarUrl = finalUrl
        editData.avatarUrl = finalUrl
        uni.showToast({ title: '更新成功', icon: 'success' })
      } catch (err) {
        console.error('R2 Direct Upload Failed:', err)
        uni.showToast({ title: '图片上传失败', icon: 'none' })
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
