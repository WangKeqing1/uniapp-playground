import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import electron from 'vite-plugin-electron/simple'
import baseConfig from './vite.base.config'

export default defineConfig({
  ...baseConfig,
  plugins: [
    ...(baseConfig.plugins || []),
    uni(),
    electron({
      main: {
        entry: 'electron/main.ts',
      },
      preload: {
        input: 'electron/preload.ts',
      },
    }),
  ],
})
