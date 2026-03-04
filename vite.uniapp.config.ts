import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import baseConfig from './vite.base.config'

export default defineConfig({
  ...baseConfig,
  plugins: [...(baseConfig.plugins || []), uni()],
})
