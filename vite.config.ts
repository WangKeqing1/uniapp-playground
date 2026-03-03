import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import electron from 'vite-plugin-electron/simple'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni(),
    electron({
      main: { entry: 'electron/main.ts' },
      preload: { entry: 'electron/preload.ts' },
    }),
  ],
})
