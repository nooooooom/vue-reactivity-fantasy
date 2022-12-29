import { defineConfig } from 'vitest/config'
import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig(({ mode }) => {
  return {
    resolve: {
      alias: {
        vue: mode === 'vue2' ? 'vue2' : 'vue'
      }
    },
    plugins: [
      AutoImport({
        imports: ['vitest'],
        dts: false,
        include: [/\.spec\.ts$/]
      })
    ],
    test: {
      // ...
    }
  }
})
