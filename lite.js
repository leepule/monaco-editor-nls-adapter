const proxy = require('./proxy')

/**
 * 获取当前已生效的语言代码
 */
function getCurrentLocale() {
  return proxy.getLocaleName()
}

/**
 * 手动设置翻译数据字典
 * @param {Object} data 符合 Monaco NLS 格式的 JSON 对象
 * @param {string} locale 语言代码标识 (可选)
 */
function setMessages(data, locale = 'custom') {
  proxy.setLocaleData(data, locale)
}

module.exports = {
  getCurrentLocale: getCurrentLocale,
  setMessages: setMessages,
  setLocaleData: proxy.setLocaleData,
  proxy: proxy,
  // 插件导出 (仍保留，以便用户可以从 lite 引用所有工具)
  vitePlugin: require('./vite-plugin'),
  loader: __dirname + '/loader.js'
}
