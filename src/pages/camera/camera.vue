<template>
  <view class="content">
    <video
      v-if="stream"
      class="video-preview"
      :srcObject="stream"
      autoplay
      playsinline
      muted
    ></video>
    <view v-else class="placeholder">
      <text>相机未开启</text>
    </view>

    <view class="actions">
      <button v-if="!stream" class="btn primary" @click="startCamera">开启相机</button>
      <button v-else class="btn danger" @click="stopCamera">关闭相机</button>
    </view>
    <view v-if="errorMsg" class="error-msg">
      <text>{{ errorMsg }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'

const stream = ref<MediaStream | null>(null)
const errorMsg = ref<string>('')

const startCamera = async () => {
  errorMsg.value = ''
  try {
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    })
    stream.value = mediaStream
    console.log('Got MediaStream:', mediaStream)
  } catch (err: unknown) {
    console.error('Error accessing camera:', err)
    let errorMessage = '未知错误'
    if (err instanceof Error) {
      errorMessage = err.message
    } else if (typeof err === 'string') {
      errorMessage = err
    }
    errorMsg.value = `无法访问相机: ${errorMessage}`
  }
}

const stopCamera = () => {
  if (stream.value) {
    stream.value.getTracks().forEach((track) => {
      track.stop()
    })
    stream.value = null
  }
}

// 页面销毁时关闭相机，防止内存泄漏或设备占用
onUnmounted(() => {
  stopCamera()
})
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30rpx;
}

.video-preview {
  width: 100%;
  height: 600rpx;
  background-color: #000;
  border-radius: 12rpx;
  margin-bottom: 40rpx;
}

.placeholder {
  width: 100%;
  height: 600rpx;
  background-color: #f0f0f0;
  border-radius: 12rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 40rpx;
  color: #999;
}

.actions {
  display: flex;
  gap: 20rpx;
  width: 100%;
}

.btn {
  flex: 1;
  color: #fff;
  border-radius: 8rpx;
  font-size: 32rpx;
  height: 80rpx;
  line-height: 80rpx;
}

.primary {
  background-color: #007aff;
}

.danger {
  background-color: #dd524d;
}

.error-msg {
  margin-top: 30rpx;
  color: #dd524d;
  font-size: 28rpx;
  text-align: center;
}
</style>
