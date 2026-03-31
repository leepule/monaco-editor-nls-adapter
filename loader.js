const { transform } = require('./transform')

/**
 * Webpack Loader for Monaco Editor NLS Adapter
 */
module.exports = function (source) {
  // 极致性能优化：第一层极速过滤
  if (!this.resourcePath.endsWith('.js') || this.resourcePath.indexOf('monaco-editor') === -1) {
    return source
  }

  if (this.cacheable) this.cacheable()
  
  // 获取 loader options
  const options = (typeof this.getOptions === 'function') ? this.getOptions() : this.query
  
  // 使用共享的 transform 逻辑
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
