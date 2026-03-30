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
  'en': 'en'
}

/**
 * 使用指定的语言代码初始化 Monaco Editor 的本地化。
 * 此方法会从本地 /locales 目录加载 JSON 数据。
 * @param {string} locale 语言代码 (例如 'zh-hans', 'ja', 'ko')。如果不传，将尝试检测浏览器语言。
 */
function init(locale) {
  // 如果没有传递 locale，尝试从浏览器环境获取
  if (!locale && typeof navigator !== 'undefined') {
    locale = navigator.language || navigator.userLanguage
  }

  // 小写化并查找映射
  let targetLocale = (locale || 'zh-hans').toLowerCase()
  if (LOCALE_MAP[targetLocale]) {
    targetLocale = LOCALE_MAP[targetLocale]
  }

  try {
    const data = require(`./locales/${targetLocale}.json`)
    proxy.setLocaleData(data)
  } catch (e) {
    console.error(`[monaco-editor-nls-adapter] 无法加载本地语言包: ${targetLocale}。回退到默认设置。`, e)
  }
}

/**
 * 异步初始化 Monaco Editor 的本地化。
 * 使用动态 import()，允许 Webpack 将语言包拆分为独立的 chunk，实现按需加载。
 * @param {string} locale 语言代码。如果不传，将尝试检测浏览器语言。
 * @returns {Promise<void>}
 */
async function initAsync(locale) {
  // 如果没有传递 locale，尝试从浏览器环境获取
  if (!locale && typeof navigator !== 'undefined') {
    locale = navigator.language || navigator.userLanguage
  }

  // 小写化并查找映射
  let targetLocale = (locale || 'zh-hans').toLowerCase()
  if (LOCALE_MAP[targetLocale]) {
    targetLocale = LOCALE_MAP[targetLocale]
  }

  try {
    // 使用动态 import 实现懒加载
    const module = await import(`./locales/${targetLocale}.json`)
    proxy.setLocaleData(module.default || module)
  } catch (e) {
    console.error(`[monaco-editor-nls-adapter] 无法异步加载语言包: ${targetLocale}。`, e)
  }
}

module.exports = {
  init: init,
  initAsync: initAsync,
  proxy: proxy
}
