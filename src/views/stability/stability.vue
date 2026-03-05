<template>
  <view class="container">
    <view class="header">
      <text class="title">稳定性测试集 (uni-app + Electron)</text>
    </view>

    <!-- 1. 基础 API 测试 -->
    <view class="section">
      <text class="section-title">1. 基础 uni-app API</text>
      <view class="btn-group">
        <button class="btn" @click="testToast">原生 Toast</button>
        <button class="btn" @click="testModal">原生 Modal</button>
        <button class="btn" @click="testStorage">存储压力测试</button>
      </view>
    </view>

    <!-- 2. 环境与版本 (Preload 注入) -->
    <view class="section">
      <text class="section-title">2. 运行环境 (Preload 注入)</text>
      <view class="info-list">
        <text class="info-item">Platform: {{ envInfo.platform }}</text>
        <text class="info-item">Node: {{ envInfo.versions.node }}</text>
        <text class="info-item">Chrome: {{ envInfo.versions.chrome }}</text>
        <text class="info-item">Electron: {{ envInfo.versions.electron }}</text>
      </view>
    </view>

    <!-- 3. IPC 通信测试 -->
    <view class="section">
      <text class="section-title">3. IPC 通信验证</text>
      <button class="btn primary" @click="sendToMain">发送消息给主进程</button>
      <view class="log-box">
        <text class="log-text">{{ ipcLog }}</text>
      </view>
    </view>

    <!-- 4. Windows 底层交互 -->
    <view class="section">
      <text class="section-title">4. Windows 底层交互</text>
      <button class="btn danger" @click="openExplorer">打开资源管理器 (process.cwd)</button>
    </view>

    <view class="footer">
      <text class="status">System Status: Ready</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'

// 环境信息
const envInfo = reactive({
  platform: 'Loading...',
  versions: {
    node: 'N/A',
    chrome: 'N/A',
    electron: 'N/A',
  },
})

const ipcLog = ref('等待交互...')

// 获取注入的 Electron API
const electron = (window as any).electron

onMounted(() => {
  if (electron) {
    envInfo.platform = electron.platform
    envInfo.versions.node = electron.versions.node()
    envInfo.versions.chrome = electron.versions.chrome()
    envInfo.versions.electron = electron.versions.electron()

    // 监听主进程回复
    electron.ipcOn('from-main', (msg: string) => {
      ipcLog.value = msg
    })
  } else {
    envInfo.platform = 'Web / Non-Electron'
    ipcLog.value = '未检测到 Electron 环境'
  }
})

// --- 测试函数 ---

const testToast = () => {
  uni.showToast({ title: '稳定性测试中...', icon: 'loading' })
}

const testModal = () => {
  uni.showModal({
    title: '系统验证',
    content: '这是一个全端兼容的模态确认框',
    success: (res) => {
      if (res.confirm) console.log('用户点击确定')
    },
  })
}

const testStorage = () => {
  const start = Date.now()
  for (let i = 0; i < 100; i++) {
    uni.setStorageSync(`test_key_${i}`, `data_${Math.random()}`)
  }
  const end = Date.now()
  uni.showToast({ title: `100次写入耗时: ${end - start}ms`, icon: 'none' })
}

const sendToMain = () => {
  if (electron) {
    electron.ipcSend('to-main', 'Hello from Uni-App Renderer!')
  } else {
    uni.showToast({ title: '非 Electron 环境', icon: 'error' })
  }
}

const openExplorer = () => {
  if (electron) {
    electron.ipcSend('open-explorer')
  } else {
    uni.showToast({ title: '仅限桌面端使用', icon: 'none' })
  }
}
</script>

<style scoped>
.container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.header {
  margin-bottom: 30px;
  text-align: center;
}

.title {
  font-size: 20px;
  font-weight: bold;
  color: #2c3e50;
}

.section {
  background: #ffffff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.section-title {
  display: block;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 15px;
  color: #34495e;
  border-left: 4px solid #42b983;
  padding-left: 10px;
}

.btn-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.btn {
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.primary {
  background-color: #42b983;
  color: white;
}
.danger {
  background-color: #e74c3c;
  color: white;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item {
  font-family: monospace;
  font-size: 13px;
  color: #666;
}

.log-box {
  margin-top: 15px;
  padding: 10px;
  background: #f8f9fa;
  border: 1px dashed #ddd;
  border-radius: 4px;
}

.log-text {
  font-size: 12px;
  color: #e67e22;
}

.footer {
  text-align: center;
  margin-top: 40px;
  color: #999;
  font-size: 12px;
}
</style>
