import { defineConfig } from 'vite'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { vitePlugin } = require('monaco-editor-nls-adapter')

export default defineConfig({
  plugins: [
    vitePlugin()
  ],
  optimizeDeps: {
    // monaco-editor 必须排除预构建，否则 dev 模式下插件的 transform 不会作用于其源码，
    // NLS 注入失效，界面会回退为英文
    exclude: ['monaco-editor'],
    // 适配器是 CJS 包，需要预构建做 ESM 互操作。
    // 本 demo 通过 file:../.. 链接安装（链接包默认不预构建），所以要显式 include；
    // 从 npm 正常安装时 Vite 会自动发现并预构建，无需此配置
    include: ['monaco-editor-nls-adapter', 'monaco-editor-nls-adapter/proxy']
  },
  build: {
    // 同样是 file: 链接的缘故：链接包位于 node_modules 之外，
    // 需要显式纳入 commonjs 互操作处理范围。npm 正常安装时无需此配置
    commonjsOptions: {
      include: [/node_modules/, /monaco-editor-nls-adapter/]
    }
  }
})
