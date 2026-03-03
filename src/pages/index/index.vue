<template>
  <view class="content">
    <image class="logo" src="/static/logo.png" />
    <view class="text-area">
      <text class="title">{{ title }}</text>
    </view>
    <view class="nav-area">
      <button class="nav-btn" @click="goTo('/pages/about/about')">前往 About 测试页</button>
      <button class="nav-btn" @click="goTo('/pages/test/test')">前往 Test 测试页</button>
      <button class="nav-btn" @click="goTo('/pages/stability/stability')">
        前往 稳定性 测试页
      </button>
      <button
        class="nav-btn"
        style="background-color: #4cd964"
        @click="goTo('/subpages/test-sub/test-sub')"
      >
        前往 分包 测试页
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const title = ref('Uniapp H5 Hash Mode Test')

const goTo = (url: string) => {
  uni.navigateTo({ url })
}
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 100rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
  margin-bottom: 50rpx;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}

.nav-area {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  width: 80%;
}

.nav-btn {
  background-color: #007aff;
  color: #fff;
  border-radius: 8rpx;
  padding: 10rpx 0;
  font-size: 28rpx;
}
</style>
