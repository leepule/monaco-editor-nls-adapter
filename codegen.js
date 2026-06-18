const SYNC_LOCALE_LOADER_PATTERN = /function SYNC_LOCALE_LOADER\(locale\) \{\s*return require\(`\.\/locales\/\$\{locale\}\.json`\)\s*\}/
const ASYNC_LOCALE_LOADER_PATTERN = /function ASYNC_LOCALE_LOADER\(locale\) \{\s*return import\(\/\* webpackChunkName: "nls-\[request\]" \*\/ `\.\/locales\/\$\{locale\}\.json`\)\s*\}/

/**
 * 生成按需加载语言包的代码片段
 * @param {string[]} languages 语言代码数组
 * @param {boolean} isAsync 是否为异步加载 (ESM/import)
 * @returns {string} 代码片段
 */
function generateLocalesCode(languages, isAsync) {
  if (!languages || languages.length === 0) {
    return null
  }

  if (isAsync) {
    // 异步版本 (用于 initAsync)
    const map = languages.map(lang => `  '${lang}': () => import('./locales/${lang}.json')`).join(',\n')
    return `(async (locale) => {
      const locales = {
${map}
      };
      if (locales[locale]) return await locales[locale]();
      throw new Error('[monaco-editor-nls-adapter] Locale not bundled: ' + locale);
    })(targetLocale)`
  } else {
    // 同步版本 (用于 init)
    const map = languages.map(lang => `  '${lang}': () => require('./locales/${lang}.json')`).join(',\n')
    return `((locale) => {
      const locales = {
${map}
      };
      if (locales[locale]) return locales[locale]();
      throw new Error('[monaco-editor-nls-adapter] Locale not bundled: ' + locale);
    })(targetLocale)`
  }
}

function replaceLocaleLoaders(source, languages) {
  if (!languages || languages.length === 0) {
    return source
  }

  const syncCode = generateLocalesCode(languages, false)
  const asyncCode = generateLocalesCode(languages, true)

  return source
    .replace(SYNC_LOCALE_LOADER_PATTERN, `function SYNC_LOCALE_LOADER(locale) {\n  return ${syncCode}\n}`)
    .replace(ASYNC_LOCALE_LOADER_PATTERN, `function ASYNC_LOCALE_LOADER(locale) {\n  return ${asyncCode}\n}`)
}

module.exports = {
  generateLocalesCode,
  replaceLocaleLoaders,
  SYNC_LOCALE_LOADER_PATTERN,
  ASYNC_LOCALE_LOADER_PATTERN
}
