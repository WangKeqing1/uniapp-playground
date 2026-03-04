import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import electron from 'vite-plugin-electron/simple'
import baseConfig from './vite.base.config'
import tailwindcssPostcss from '@tailwindcss/postcss'

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
  css: {
    postcss: {
      plugins: [tailwindcssPostcss],
    },
  },
})
