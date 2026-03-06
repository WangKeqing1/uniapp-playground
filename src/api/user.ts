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
   * 上传头像
   * @param filePath 临时文件路径
   */
  uploadAvatar(filePath: string) {
    const token = uni.getStorageSync('token')
    return new Promise((resolve, reject) => {
      uni.uploadFile({
        url: 'http://localhost:8080/api/v1/users/me/avatar',
        filePath: filePath,
        name: 'file',
        header: {
          Authorization: `Bearer ${token}`,
        },
        success: (res) => {
          if (res.statusCode === 200) {
            resolve(res.data) // 返回的是头像地址字符串
          } else {
            reject(res)
          }
        },
        fail: (err) => reject(err),
      })
    })
  },

  /**
   * 获取头像上传预签名 URL (支持直传 R2)
   */
  getPresignedUrl() {
    return request({
      url: '/api/v1/users/me/avatar/presigned-url',
      method: 'GET',
    })
  },

  /**
   * OAuth2 登录 URL
   */
  getGithubAuthUrl() {
    return 'http://localhost:8080/oauth2/authorization/github'
  },
}
