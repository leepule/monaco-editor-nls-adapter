const { transform, MONACO_ESM_ROOT } = require('./transform')

/**
 * Vite Plugin for Monaco Editor NLS Adapter
 * Supports both development and production builds.
 */
function monacoNlsPlugin() {
  return {
    name: 'vite-plugin-monaco-nls-adapter',
    // 强制此插件在代码压缩和混淆之前执行
    enforce: 'pre',
    transform(code, id) {
      // 检查是否是 Monaco Editor 的 ESM 源码文件
      if (id.replace(/\\/g, '/').includes(MONACO_ESM_ROOT)) {
        return {
          code: transform(code, id),
          // 返回原始 map 或 null，由于是简单的正则匹配转换，不处理 SourceMap
          map: null
        }
      }
    }
  }
}

module.exports = monacoNlsPlugin
