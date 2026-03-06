<template>
  <view class="content">
    <image class="logo" src="/static/logo.png" />
    <view class="text-area">
      <text class="title">{{ title }}</text>
    </view>
    <view class="text-area">
      <text class="title">{{ title }}</text>
    </view>

    <!-- uni-ui 集成测试区域 -->
    <view class="mx-4 my-4">
      <uni-card title="uni-ui 组件测试" thumbnail="/static/logo.png" extra="v1.5.11">
        <text class="text-sm text-gray-600">这是从 @dcloudio/uni-ui 自动按需引入的卡片组件。</text>
        <view class="mt-2 flex gap-2">
          <uni-badge text="Tailwind" type="primary"></uni-badge>
          <uni-badge text="SCSS" type="success"></uni-badge>
          <uni-badge text="uni-ui" type="warning"></uni-badge>
        </view>
      </uni-card>
    </view>

    <!-- SCSS 集成测试区域 -->
    <view class="scss-test-box">
      <view class="scss-test-inner">
        <text class="scss-title">SCSS 嵌套测试</text>
        <text class="scss-desc">这段样式由 <text class="highlight">lang="scss"</text> 渲染</text>
      </view>
    </view>

    <view class="nav-area">
      <button
        class="nav-btn bg-linear-to-r from-primary to-secondary"
        @click="goTo('/views/login/login')"
      >
        前往 登录 测试页 (新实现)
      </button>
      <button class="nav-btn" @click="goTo('/views/about/about')">前往 About 测试页</button>
      <button class="nav-btn" @click="goTo('/views/test/test')">前往 Test 测试页</button>
      <button class="nav-btn" @click="goTo('/views/camera/camera')">前往 Camera 相机测试</button>
      <button class="nav-btn" @click="goTo('/views/stability/stability')">
        前往 稳定性 测试页
      </button>
      <button class="nav-btn" style="background-color: #4cd964" @click="goTo('/views/test/test')">
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

<style lang="scss">
// 测试 SCSS 变量与嵌套
$test-color: #ff9900;

.scss-test-box {
  margin: 30rpx;
  padding: 20rpx;
  border: 4rpx dashed $test-color;
  border-radius: 12rpx;

  .scss-test-inner {
    text-align: center;

    .scss-title {
      display: block;
      font-size: 32rpx;
      font-weight: bold;
      color: $test-color;
    }

    .scss-desc {
      font-size: 24rpx;
      color: #666;

      .highlight {
        color: #007aff;
        font-weight: bold;
      }
    }
  }
}

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
