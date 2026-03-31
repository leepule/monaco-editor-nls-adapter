/**
 * 用于 Monaco Editor 0.50.0+ 的自托管 NLS 代理
 * 此文件通过注入 path 参数，替代了对原本 'monaco-editor-nls/vscode-nls' 的内部依赖方式。
 */

// 状态变量，记录当前的语言数据和代码
let CURRENT_LOCALE_DATA = null
let CURRENT_LOCALE_NAME = ''

// 提前编译正则表达式以提升运行时性能
const FORMAT_REGEX = /\{(\d+)\}/g

/**
 * 格式化占位符消息
 * @param {string} message 包含 {0}, {1} 的模板字符串
 * @param {any[]} args 替换参数数组
 */
function _format(message, args) {
  if (!args || args.length === 0) {
    return message
  }
  return String(message).replace(FORMAT_REGEX, (match, index) => {
    const replacement = args[parseInt(index, 10)]
    return typeof replacement !== 'undefined' ? replacement : match
  })
}

/**
 * 本地化核心函数
 * @param {string} path 模块路径 (由 transform.js 注入)
 * @param {any} data 包含 key 的对象或 key 字符串
 * @param {string} defaultMessage 默认回退消息
 * @param {...any} args 格式化参数
 */
function localize(path, data, defaultMessage, ...args) {
  const key = (data && typeof data === 'object') ? data.key : data
  
  // 优化点：使用可选链或短路评估快速定位翻译
  const fileData = (CURRENT_LOCALE_DATA && CURRENT_LOCALE_DATA[path])
  const message = fileData ? fileData[key] : undefined
  
  // 强化回退逻辑：如果翻译为空或未找到，则回退到默认消息
  const finalMessage = (message !== undefined && message !== null && message !== '') ? message : defaultMessage
  
  // 仅在有参数时才调用格式化函数，减少不必要的开销
  return args.length > 0 ? _format(finalMessage, args) : finalMessage
}

/**
 * 带有原始值结构的本地化函数 (适配 Monaco 的某些内部版本)
 */
function localize2(path, data, defaultMessage, ...args) {
  const value = localize(path, data, defaultMessage, ...args)
  return { value, original: value }
}

/**
 * 设置当前的本地化数据字典
 * @param {Object} data 字典对象
 * @param {string} locale 语言代码
 */
function setLocaleData(data, locale = 'custom') {
  CURRENT_LOCALE_DATA = data
  CURRENT_LOCALE_NAME = locale
}

/**
 * 获取当前已加载的完整字典数据
 */
function getLocaleData() {
  return CURRENT_LOCALE_DATA
}

/**
 * 获取当前生效的语言名称
 */
function getLocaleName() {
  return CURRENT_LOCALE_NAME
}

// 以下为适配 monaco-editor 内部调用的兼容性 Shim 函数
function getConfiguredDefaultLocale() {
  return undefined
}

function loadMessageBundle() {
  return localize
}

function config() {
  return loadMessageBundle
}

/**
 * 适配 NLS create() 调用
 * @param {string} key 模块标识
 */
function create(key) {
  return {
    localize: (idx, def, ...args) => localize(key, idx, def, ...args),
    localize2: (idx, def, ...args) => localize2(key, idx, def, ...args),
    getConfiguredDefaultLocale: () => undefined
  }
}

module.exports = {
  localize,
  localize2,
  setLocaleData,
  getLocaleData,
  getLocaleName,
  getConfiguredDefaultLocale,
  loadMessageBundle,
  config,
  create
}
