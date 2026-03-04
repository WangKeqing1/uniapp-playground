import { defineConfig, type PluginOption } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import baseConfig from './vite.base.config'
import { UnifiedViteWeappTailwindcssPlugin as uvwt } from 'weapp-tailwindcss/vite'
import tailwindcssPostcss from '@tailwindcss/postcss'
import path from 'node:path'

export default defineConfig({
  ...baseConfig,
  plugins: [
    ...((baseConfig.plugins as PluginOption[]) || []),
    uni(),
    // uvwt 必须放在 uni() 之后，对生成的小程序文件进行 class 转义后处理
    uvwt({
      // tailwindcss v4 必须显式指定入口 CSS 文件路径
      // 让 weapp-tailwindcss 与 tailwindcss 保持一致的处理模式
      cssEntries: [path.resolve(__dirname, './src/main.css')],
    }),
  ],
  css: {
    postcss: {
      plugins: [
        // UniApp Vue3 Vite 项目必须内联注册 PostCSS
        // 不能使用外部 postcss.config.js
        tailwindcssPostcss,
      ],
    },
  },
})
