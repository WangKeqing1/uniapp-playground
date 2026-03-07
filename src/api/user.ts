import { request } from '../utils/request'

/**
 * 用户相关 API 接口
 * 匹配 Swagger 文档中的端点
 */

export const userApi = {
  /**
   * 登录
   * @param data { username, password }
   */
  login(data: any) {
    return request({
      url: '/api/v1/users/login',
      method: 'POST',
      data,
      noAuth: true,
    })
  },

  /**
   * 注册
   * @param data { username, email, password }
   */
  register(data: any) {
    return request({
      url: '/api/v1/users/register',
      method: 'POST',
      data,
      noAuth: true,
    })
  },

  /**
   * 获取当前用户信息
   */
  getProfile() {
    return request({
      url: '/api/v1/users/me',
      method: 'GET',
    })
  },

  /**
   * 更新个人资料
   * @param data { displayName, avatarUrl, bio }
   */
  updateProfile(data: { displayName?: string; avatarUrl?: string; bio?: string }) {
    return request({
      url: '/api/v1/users/me',
      method: 'PUT',
      data,
    })
  },

  /**
   * 获取头像直传配置 (R2 直传)
   */
  getAvatarUploadConfig() {
    return request({
      url: '/api/v1/users/me/avatar/upload-config',
      method: 'GET',
    })
  },

  /**
   * OAuth2 登录 URL
   */
  getGithubAuthUrl() {
    return 'http://localhost:8080/oauth2/authorization/github'
  },

  /**
   * 1. 请求 GitHub 设备验证码
   */
  getGithubDeviceCode() {
    return request({
      url: '/api/v1/auth/github/device/code',
      method: 'POST',
      noAuth: true,
    })
  },

  /**
   * 2. 轮询 GitHub 设备 Token
   * 后端可能返回 202 或业务状态表示 pending
   */
  pollGithubDeviceToken(deviceCode: string) {
    return request({
      url: `/api/v1/auth/github/device/token?deviceCode=${deviceCode}`,
      method: 'POST',
      noAuth: true,
    })
  },
}
