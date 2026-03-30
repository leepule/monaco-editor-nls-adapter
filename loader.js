const { transform } = require('./transform')

/**
 * Webpack Loader for Monaco Editor NLS Adapter
 */
module.exports = function (source) {
  if (this.cacheable) this.cacheable()
  
  // 使用共享的 transform 逻辑
  return transform(source, this.resourcePath)
}
