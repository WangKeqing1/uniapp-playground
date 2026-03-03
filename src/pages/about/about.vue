<template>
  <view class="container">
    <text class="header">这是 About 测试页</text>
    <text class="desc">用于测试 Electron 中基于 file:// 协议的 Hash 路由跳转是否工作正常。</text>
    <button class="back-btn" @click="goBack">返回首页</button>
  </view>
</template>

<script setup lang="ts">
const goBack = () => {
  uni.navigateBack()
}
</script>

<style scoped>
.container {
  padding: 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30rpx;
}
.header {
  font-size: 40rpx;
  font-weight: bold;
}
.desc {
  font-size: 28rpx;
  color: #666;
  text-align: center;
}
.back-btn {
  margin-top: 40rpx;
  background-color: #eee;
  padding: 0 40rpx;
}
</style>
