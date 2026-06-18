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
let LOADING_PROMISE = null
let LOADING_LOCALE = ''

function SYNC_LOCALE_LOADER(locale) {
  return require(`./locales/${locale}.json`)
}

function ASYNC_LOCALE_LOADER(locale) {
  return import(/* webpackChunkName: "nls-[request]" */ `./locales/${locale}.json`)
}

function resolveLocale(locale) {
  const isBrowser = typeof window !== 'undefined' && typeof navigator !== 'undefined'
  let nextLocale = locale

  if (!nextLocale && isBrowser) {
    nextLocale = navigator.language || navigator.userLanguage
  }

  let targetLocale = (nextLocale || 'zh-hans').toLowerCase()
  if (LOCALE_MAP[targetLocale]) {
    targetLocale = LOCALE_MAP[targetLocale]
  }

  return {
    isBrowser,
    targetLocale
  }
}

/**
 * 使用指定的语言代码初始化 Monaco Editor 的本地化。
 * 此方法使用同步 require，会触发构建工具打包所有相关 JSON。
 * @param {string} locale 语言代码
 * @param {boolean} force 是否强制重新初始化
 */
function init(locale, force = false) {
  const { isBrowser, targetLocale } = resolveLocale(locale)

  if (lite.getCurrentLocale() === targetLocale && !force) {
    return true
  }

  try {
    // 这里的占位表达式会在构建期由 loader/plugin 替换为按需语言分发表。
    const data = SYNC_LOCALE_LOADER(targetLocale)
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
function initAsync(locale, force = false) {
  const { isBrowser, targetLocale } = resolveLocale(locale)

  if (lite.getCurrentLocale() === targetLocale && !force) {
    return Promise.resolve(true)
  }

  if (IS_LOADING && !force && LOADING_LOCALE === targetLocale && LOADING_PROMISE) {
    return LOADING_PROMISE
  }

  IS_LOADING = true
  LOADING_LOCALE = targetLocale
  LOADING_PROMISE = ASYNC_LOCALE_LOADER(targetLocale)
    .then((module) => {
      lite.setMessages(module.default || module, targetLocale)
      return true
    })
    .catch((e) => {
      if (isBrowser) {
        console.warn(`[monaco-editor-nls-adapter] 无法异步加载语言包: ${targetLocale}`, e)
      }
      return false
    })
    .finally(() => {
      IS_LOADING = false
      LOADING_PROMISE = null
      LOADING_LOCALE = ''
    })

  return LOADING_PROMISE
}

module.exports = {
  ...lite,
  init: init,
  initAsync: initAsync
}
