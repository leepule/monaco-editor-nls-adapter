const { generateLocalesCode, replaceLocaleLoaders } = require('../codegen')
const assert = require('assert')

console.log('Testing codegen...')

const syncCode = generateLocalesCode(['zh-hans', 'en'], false)
console.log('Sync code:', syncCode)
assert(syncCode.includes("'zh-hans': () => require('./locales/zh-hans.json')"))
assert(syncCode.includes("'en': () => require('./locales/en.json')"))
assert(!syncCode.includes("'ja'"))

const asyncCode = generateLocalesCode(['zh-hans', 'ja'], true)
console.log('Async code:', asyncCode)
assert(asyncCode.includes("'zh-hans': () => import('./locales/zh-hans.json')"))
assert(asyncCode.includes("'ja': () => import('./locales/ja.json')"))
assert(!asyncCode.includes("'en'"))

console.log('Codegen test passed!')

// Mock index.js content
const indexContent = `
function SYNC_LOCALE_LOADER(locale) {
  return require(\`./locales/\${locale}.json\`)
}

function ASYNC_LOCALE_LOADER(locale) {
  return import(/* webpackChunkName: "nls-[request]" */ \`./locales/\${locale}.json\`)
}

function init(locale) {
  const currentLocale = locale || 'zh-hans';
  const data = SYNC_LOCALE_LOADER(currentLocale)
  return data;
}
async function initAsync(locale) {
  const currentLocale = locale || 'zh-hans';
  const module = await ASYNC_LOCALE_LOADER(currentLocale)
  return module;
}
`

console.log('Testing marker replacement...')
const languages = ['zh-hans']
const transformed = replaceLocaleLoaders(indexContent, languages)

console.log('Transformed content:', transformed)
assert(transformed.includes("'zh-hans': () => require('./locales/zh-hans.json')"))
assert(transformed.includes("'zh-hans': () => import('./locales/zh-hans.json')"))
assert(!transformed.includes("return require(`./locales/${locale}.json`)"))
assert(!transformed.includes("return import(/* webpackChunkName: \"nls-[request]\" */ `./locales/${locale}.json`)"))

// 运行 eval 来测试 transformed 代码是否会因为没有声明 targetLocale 而抛出 ReferenceError 
try {
  const runTest = new Function('require', `
    ${transformed}
    return init('zh-hans');
  `);
  // 提供一个 mock require 函数避免实际去 require 报错
  runTest(() => ({}));
} catch (e) {
  console.error('Eval failed:', e)
  assert.fail('Eval failed, maybe targetLocale is not defined: ' + e.message)
}

console.log('Marker replacement test passed!')
