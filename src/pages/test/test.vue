<template>
  <view class="container">
    <text class="header">这是 Test 页面</text>
    <text class="desc">路由传递的参数：{{ paramsText }}</text>
    <button class="back-btn" @click="goBack">返回首页</button>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const paramsText = ref('无参数')

onLoad((options) => {
  if (options && Object.keys(options).length > 0) {
    paramsText.value = JSON.stringify(options)
  }
})

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
}
.back-btn {
  margin-top: 40rpx;
  background-color: #eee;
  padding: 0 40rpx;
}
</style>
