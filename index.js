const proxy = require('./proxy')

/**
 * 语言映射字典，用于将常见的浏览器语言代码还原为本包中支持的代码。
 */
const LOCALE_MAP = {
  'zh-cn': 'zh-hans',
  'zh-hans': 'zh-hans',
  'zh-tw': 'zh-hant',
  'zh-hant': 'zh-hant',
  'zh-hk': 'zh-hant',
  'en-us': 'en',
  'en-gb': 'en',
  'en': 'en',
  'ja-jp': 'ja',
  'ja': 'ja',
  'ko-kr': 'ko',
  'ko': 'ko',
  'de-de': 'de',
  'de': 'de',
  'fr-fr': 'fr',
  'fr': 'fr',
  'es-es': 'es',
  'es': 'es',
  'it-it': 'it',
  'it': 'it',
  'ru-ru': 'ru',
  'ru': 'ru',
  'pt-br': 'pt-br'
}

let CURRENT_LOCALE = ''
let IS_LOADING = false

/**
 * 使用指定的语言代码初始化 Monaco Editor 的本地化。
 * 此方法会从本地 /locales 目录加载 JSON 数据。
 * @param {string} locale 语言代码 (例如 'zh-hans', 'ja', 'ko')。如果不传，将尝试检测浏览器语言。
 * @param {boolean} force 是否强制重新初始化，即使语言相同。
 */
function init(locale, force = false) {
  // SSR 环境安全检查
  const isBrowser = typeof window !== 'undefined' && typeof navigator !== 'undefined'

  // 如果没有传递 locale，尝试从浏览器环境获取
  if (!locale && isBrowser) {
    locale = navigator.language || navigator.userLanguage
  }

  // 小写化并查找映射
  let targetLocale = (locale || 'zh-hans').toLowerCase()
  if (LOCALE_MAP[targetLocale]) {
    targetLocale = LOCALE_MAP[targetLocale]
  }

  // 幂等检查：如果已经加载过该语言且非强制，则直接返回
  if (CURRENT_LOCALE === targetLocale && !force) {
    return true
  }

  try {
    const data = require(`./locales/${targetLocale}.json`)
    proxy.setLocaleData(data)
    CURRENT_LOCALE = targetLocale
    return true
  } catch (e) {
    if (isBrowser) {
      console.warn(`[monaco-editor-nls-adapter] 无法加载本地语言包: ${targetLocale}。回退到默认设置。`, e)
    }
    return false
  }
}

/**
 * 异步初始化 Monaco Editor 的本地化。
 * 使用动态 import()，允许 Webpack 将语言包拆分为独立的 chunk。
 * @param {string} locale 语言代码。
 * @param {boolean} force 是否强制重新加载。
 * @returns {Promise<boolean>}
 */
async function initAsync(locale, force = false) {
  const isBrowser = typeof window !== 'undefined' && typeof navigator !== 'undefined'

  if (!locale && isBrowser) {
    locale = navigator.language || navigator.userLanguage
  }

  let targetLocale = (locale || 'zh-hans').toLowerCase()
  if (LOCALE_MAP[targetLocale]) {
    targetLocale = LOCALE_MAP[targetLocale]
  }

  if (CURRENT_LOCALE === targetLocale && !force) {
    return true
  }

  if (IS_LOADING && !force) return false
  IS_LOADING = true

  try {
    // 使用动态 import 实现懒加载，并添加 Webpack 魔术注释以优化分包命名
    const module = await import(/* webpackChunkName: "nls-[request]" */ `./locales/${targetLocale}.json`)
    proxy.setLocaleData(module.default || module)
    CURRENT_LOCALE = targetLocale
    return true
  } catch (e) {
    if (isBrowser) {
      console.warn(`[monaco-editor-nls-adapter] 无法异步加载语言包: ${targetLocale}。`, e)
    }
    return false
  } finally {
    IS_LOADING = false
  }
}

/**
 * 获取当前已生效的语言代码
 */
function getCurrentLocale() {
  return CURRENT_LOCALE
}

/**
 * 手动设置翻译数据字典
 * @param {Object} data 符合 Monaco NLS 格式的 JSON 对象
 */
function setMessages(data) {
  proxy.setLocaleData(data)
  CURRENT_LOCALE = 'custom'
}

module.exports = {
  init: init,
  initAsync: initAsync,
  getCurrentLocale: getCurrentLocale,
  setMessages: setMessages,
  setLocaleData: proxy.setLocaleData, // 向后兼容
  proxy: proxy,
  // 插件导出 (便于在 config 文件中使用)
  vitePlugin: require('./vite-plugin'),
  loader: __dirname + '/loader.js'
}
