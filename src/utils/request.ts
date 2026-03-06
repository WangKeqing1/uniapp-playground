/**
 * 基础请求封装
 * 遵循专业工程化规范：
 * 1. 自动处理 BASE_URL
 * 2. 统一拦截器处理 Token
 * 3. 统一错误处理
 */

const BASE_URL = 'http://localhost:8080'

interface RequestOptions extends UniApp.RequestOptions {
  noAuth?: boolean
}

export const request = <T = any>(options: RequestOptions): Promise<T> => {
  const { url, method = 'GET', data, header = {}, noAuth = false } = options

  // 拼接完整地址
  const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`

  // 注入 Token
  if (!noAuth) {
    const token = uni.getStorageSync('token')
    if (token) {
      header['Authorization'] = `Bearer ${token}`
    }
  }

  return new Promise((resolve, reject) => {
    uni.request({
      url: fullUrl,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        ...header,
      },
      success: (res) => {
        const { statusCode, data } = res as { statusCode: number; data: any }

        if (statusCode >= 200 && statusCode < 300) {
          // 这里假设后端返回的是 { code: 200, data: ..., message: ... }
          // 如果返回的是 ResultString 类型，通常包含 data 字段
          resolve(data as T)
        } else if (statusCode === 401) {
          uni.removeStorageSync('token')
          uni.showToast({ title: '登录已过期', icon: 'none' })
          // TODO: 跳转到登录页
          reject(new Error('Unauthorized'))
        } else {
          uni.showToast({
            title: (data as any)?.message || '请求失败',
            icon: 'none',
          })
          reject(data)
        }
      },
      fail: (err) => {
        uni.showToast({ title: '网络连接异常', icon: 'none' })
        reject(err)
      },
    })
  })
}
