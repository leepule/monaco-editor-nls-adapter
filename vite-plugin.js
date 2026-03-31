const { transform } = require('./transform')

/**
 * Vite Plugin for Monaco Editor NLS Adapter
 * @param {Object} options 插件配置
 * @param {string} options.monacoPath 匹配 Monaco Editor ESM 路径的特征字符串，默认为 'monaco-editor/esm'
 */
function monacoNlsPlugin(options = {}) {
  const monacoRoot = options.monacoPath || 'monaco-editor/esm'
  
  return {
    name: 'vite-plugin-monaco-nls-adapter',
    enforce: 'pre',
    transform(code, id) {
      // 极致性能优化：第一层极速过滤，避免非目标文件的正则与替换开销
      if (!id.endsWith('.js') || id.indexOf('monaco-editor') === -1) return

      // 统一路径格式
      const normalizedId = id.replace(/\\/g, '/')
      
      // 快速过滤非目标文件 (进一步细化)
      if (normalizedId.includes(monacoRoot)) {
        const result = transform(code, id, options)
        
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
