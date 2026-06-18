const { transform } = require('./transform')
const { replaceLocaleLoaders } = require('./codegen')

/**
 * Webpack Loader for Monaco Editor NLS Adapter
 */
module.exports = function (source) {
  const resourcePath = this.resourcePath.replace(/\\/g, '/')
  const isAdapter = resourcePath.endsWith('monaco-editor-nls-adapter/index.js') || resourcePath.endsWith('monaco-editor-nls-adapter/index.ts')
  const isMonaco = resourcePath.indexOf('monaco-editor') !== -1

  // 1. 第一层过滤：仅处理 monaco-editor 或 适配器自身入口
  if (!isAdapter && !isMonaco) {
    return source
  }

  if (this.cacheable) this.cacheable()
  
  // 获取 loader options
  const options = (typeof this.getOptions === 'function') ? this.getOptions() : this.query
  const languages = (options && Array.isArray(options.languages)) ? options.languages : null

  // 2. 处理适配器自身的 index.js (按需打包语言包)
  if (isAdapter && languages) {
    return replaceLocaleLoaders(source, languages)
  }

  // 3. 处理 Monaco Editor 源代码 (注入本地化逻辑)
  if (isMonaco) {
    const result = transform(source, this.resourcePath, options || {})
    
    // 如果返回包含 SourceMap 的对象，则使用 this.callback 提示 Webpack
    if (result && typeof result === 'object') {
      if (this.callback) {
        this.callback(null, result.code, result.map)
        return
      }
      return result.code
    }
    return result
  }

  return source
}
