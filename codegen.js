/**
 * 生成按需加载语言包的代码片段
 * @param {string[]} languages 语言代码数组
 * @param {boolean} isAsync 是否为异步加载 (ESM/import)
 * @returns {string} 代码片段
 */
function generateLocalesCode(languages, isAsync) {
  if (!languages || languages.length === 0) {
    return null;
  }

  if (isAsync) {
    // 异步版本 (用于 initAsync)
    const map = languages.map(lang => `  '${lang}': () => import('./locales/${lang}.json')`).join(',\n');
    return `(async (locale) => {
      const locales = {
${map}
      };
      if (locales[locale]) return await locales[locale]();
      throw new Error('[monaco-editor-nls-adapter] Locale not bundled: ' + locale);
    })(targetLocale)`;
  } else {
    // 同步版本 (用于 init)
    const map = languages.map(lang => `  '${lang}': () => require('./locales/${lang}.json')`).join(',\n');
    return `((locale) => {
      const locales = {
${map}
      };
      if (locales[locale]) return locales[locale]();
      throw new Error('[monaco-editor-nls-adapter] Locale not bundled: ' + locale);
    })(targetLocale)`;
  }
}

module.exports = {
  generateLocalesCode
};
