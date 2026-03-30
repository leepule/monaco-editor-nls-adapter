/**
 * 用于 Monaco Editor 0.50.0+ 的自托管 NLS 代理
 * 此文件通过注入 path 参数，替代了对原本 'monaco-editor-nls/vscode-nls' 的内部依赖方式。
 */

let CURRENT_LOCALE_DATA = null

function _format(message, args) {
  if (args.length === 0) {
    return message
  }
  return String(message).replace(/\{(\d+)\}/g, function (match, rest) {
    const index = rest[0]
    return typeof args[index] !== 'undefined' ? args[index] : match
  })
}

function localize(path, data, defaultMessage, ...args) {
  // 针对 Monaco 0.50.0 签名的参数修正：
  // 1. 当通过 loader 调用时，path 是被注入的。
  // 2. 当通过 create 调用时，path 也会被显式作为第一个参数传入。
  const key = (data && typeof data === 'object') ? data.key : data
  const localeData = CURRENT_LOCALE_DATA || {}
  
  let message = (localeData[path] || {})[key]
  // 强化回退逻辑：如果翻译为空或未找到，则回退到默认消息
  if (message === undefined || message === null || message === '') {
    message = defaultMessage
  }
  
  return _format(message, args)
}

function localize2(path, data, defaultMessage, ...args) {
  const value = localize(path, data, defaultMessage, ...args)
  return {
    value: value,
    original: value
  }
}

function setLocaleData(data) {
  CURRENT_LOCALE_DATA = data
}

function getConfiguredDefaultLocale() {
  return undefined
}

function loadMessageBundle(file) {
  return localize
}

function config(opt) {
  return loadMessageBundle
}

function create(key, data) {
  return {
    localize: (idx, defaultValue, ...args) => localize(key, idx, defaultValue, ...args),
    localize2: (idx, defaultValue, ...args) => localize2(key, idx, defaultValue, ...args),
    getConfiguredDefaultLocale: () => undefined
  }
}

module.exports = {
  localize,
  localize2,
  setLocaleData,
  getConfiguredDefaultLocale,
  loadMessageBundle,
  config,
  create
}
