const lite = require('./lite')
const proxy = lite.proxy

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

let IS_LOADING = false

/**
 * 使用指定的语言代码初始化 Monaco Editor 的本地化。
 * 此方法使用同步 require，会触发构建工具打包所有相关 JSON。
 * @param {string} locale 语言代码
 * @param {boolean} force 是否强制重新初始化
 */
function init(locale, force = false) {
  const isBrowser = typeof window !== 'undefined' && typeof navigator !== 'undefined'
  if (!locale && isBrowser) {
    locale = navigator.language || navigator.userLanguage
  }

  let targetLocale = (locale || 'zh-hans').toLowerCase()
  if (LOCALE_MAP[targetLocale]) {
    targetLocale = LOCALE_MAP[targetLocale]
  }

  if (lite.getCurrentLocale() === targetLocale && !force) {
    return true
  }

  try {
    // 这里的动态 require 是导致全量打包的主要原因，若需精简请改用 lite.setMessages()
    const data = require(`./locales/${targetLocale}.json`)
    lite.setMessages(data, targetLocale)
    return true
  } catch (e) {
    if (isBrowser) {
      console.warn(`[monaco-editor-nls-adapter] 无法加载本地语言包: ${targetLocale}`, e)
    }
    return false
  }
}

/**
 * 异步加载语言包。
 * @param {string} locale 语言代码
 * @param {boolean} force 是否强制重新初始化
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

  if (lite.getCurrentLocale() === targetLocale && !force) {
    return true
  }

  if (IS_LOADING && !force) return false
  IS_LOADING = true

  try {
    const module = await import(/* webpackChunkName: "nls-[request]" */ `./locales/${targetLocale}.json`)
    lite.setMessages(module.default || module, targetLocale)
    return true
  } catch (e) {
    if (isBrowser) {
      console.warn(`[monaco-editor-nls-adapter] 无法异步加载语言包: ${targetLocale}`, e)
    }
    return false
  } finally {
    IS_LOADING = false
  }
}

module.exports = {
  ...lite,
  init: init,
  initAsync: initAsync
}
