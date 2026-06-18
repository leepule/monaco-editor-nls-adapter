const { transform } = require('./transform')
const { replaceLocaleLoaders } = require('./codegen')

/**
 * Vite Plugin for Monaco Editor NLS Adapter
 * @param {Object} options 插件配置
 * @param {string} options.monacoPath 匹配 Monaco Editor ESM 路径的特征字符串，默认为 'monaco-editor/esm'
 * @param {string[]} options.languages 需要包含的语言包列表 (如 ['zh-hans', 'en'])。不传则全量打包。
 */
function monacoNlsPlugin(options = {}) {
  const monacoRoot = options.monacoPath || 'monaco-editor/esm'
  const languages = Array.isArray(options.languages) ? options.languages : null

  return {
    name: 'vite-plugin-monaco-nls-adapter',
    enforce: 'pre',
    transform(code, id) {
      // Vite dev 模式下 id 可能携带查询参数 (如 ?v=xxxx)，需先剥离再判断
      const cleanId = id.split('?')[0]
      if (!cleanId.endsWith('.js')) return

      // 统一路径格式
      const normalizedId = cleanId.replace(/\\/g, '/')

      // 1. 处理适配器自身的 index.js (按需打包语言包)
      if (languages && (normalizedId.endsWith('monaco-editor-nls-adapter/index.js') || normalizedId.endsWith('monaco-editor-nls-adapter/index.ts'))) {
        return {
          code: replaceLocaleLoaders(code, languages),
          map: null // 对于这种简单的替换，暂不生成 sourcemap 以保持性能
        }
      }

      // 2. 处理 Monaco Editor 源代码 (注入本地化逻辑)
      if (normalizedId.indexOf('monaco-editor') !== -1 && normalizedId.includes(monacoRoot)) {
        const result = transform(code, cleanId, options)
        
        // 如果 transform 返回的是对象 ({ code, map })，直接返回
        if (result && typeof result === 'object') {
          return result
        }
        
        // 否则返回原始代码
        return {
          code: result || code,
          map: null
        }
      }
    }
  }
}

module.exports = monacoNlsPlugin
