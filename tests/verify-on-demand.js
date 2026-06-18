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
  const targetLocale = locale || 'zh-hans';
  const data = SYNC_LOCALE_LOADER(targetLocale)
  return data;
}
async function initAsync(locale) {
  const targetLocale = locale || 'zh-hans';
  const module = await ASYNC_LOCALE_LOADER(targetLocale)
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

console.log('Marker replacement test passed!')
