<template>
  <view class="container">
    <text class="header">这是分包测试页</text>
    <text class="desc">该页面位于 subpages 分包目录下，用于测试分包加载和路由是否正常工作。</text>
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
