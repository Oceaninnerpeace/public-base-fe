import path from 'node:path'
import { fileURLToPath } from 'node:url'
import dts from 'vite-plugin-dts'
import { defineConfig } from 'vite'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [
    dts({
      entryRoot: 'src',
      outDir: 'dist',
      // @Oceaninnerpeace 含大写，api-extractor rollupTypes 会报错
      rollupTypes: false,
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(dirname, 'src/index.ts'),
      name: 'PublicBaseRequest',
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: ['axios'],
    },
  },
})
