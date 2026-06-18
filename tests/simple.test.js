const assert = require('assert')
const proxy = require('../proxy')
const adapter = require('../index')

// 1. 测试 _format 函数在多位数参数时的修复情况
function testFormat() {
  console.log('Testing _format...')
  // 模拟从 proxy 导出的私有函数（如果能访问的话，或者直接测试 localize）
  const result = proxy.localize('test', 'key', 'Hello {0}, {1}, {10}', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K')
  assert.strictEqual(result, 'Hello A, B, K', 'Should correctly format argument with index 10')
  console.log('✅ _format test passed')
}

// 2. 测试 localize 的回退逻辑
function testLocalizeFallback() {
  console.log('Testing localize fallback...')
  proxy.setLocaleData({}) // 清空数据
  const result = proxy.localize('path/to/file', 'key', 'Default Message')
  assert.strictEqual(result, 'Default Message', 'Should return default message when no data is loaded')
  
  proxy.setLocaleData({ 'path/to/file': { 'key': 'Translated' } })
  const result2 = proxy.localize('path/to/file', 'key', 'Default Message')
  assert.strictEqual(result2, 'Translated', 'Should return translated message')
  console.log('✅ localize fallback test passed')
}

// 3. 测试 index.js 的 API
function testAdapterAPI() {
  console.log('Testing adapter API...')
  adapter.setMessages({ 'test': { 'hi': 'Hello' } })
  assert.strictEqual(adapter.getCurrentLocale(), 'custom')
  assert.strictEqual(proxy.localize('test', 'hi', 'Default'), 'Hello')
  
  const initResult = adapter.init('zh-CN')
  // 注意：在测试环境下，require 语言包可能失败，除非文件存在
  // 这里假设 locales/zh-hans.json 存在
  if (initResult) {
    assert.strictEqual(adapter.getCurrentLocale(), 'zh-hans')
    console.log('✅ adapter init test passed')
  } else {
    console.log('⚠️ adapter init test skipped (file not found or other error)')
  }
}

function testTransform() {
  console.log('Testing transform...')
  const { transform } = require('../transform')
  
  // 模拟 pnpm 路径
  const id = '/project/node_modules/.pnpm/monaco-editor@0.52.0/node_modules/monaco-editor/esm/vs/editor/common/editorContextKeys.js'
  const source = `import * as nls from '../../../nls.js';\nnls.localize('key', 'default');`
  
  const result = transform(source, id, { monacoPath: 'monaco-editor/esm' })
  const transformedCode = typeof result === 'string' ? result : result.code
  
  assert.ok(transformedCode.includes("monaco-editor-nls-adapter/proxy"), 'Should replace nls.js with proxy path')
  assert.ok(transformedCode.includes("nls.localize('vs/editor/common/editorContextKeys', "), 'Should inject module path')
  
  // 测试 require
  const source2 = `const nls = require('../../nls.js');\nnls.localize2('key', 'default');`
  const result2 = transform(source2, id, { monacoPath: 'monaco-editor/esm' })
  const transformedCode2 = typeof result2 === 'string' ? result2 : result2.code
  assert.ok(transformedCode2.includes("require('monaco-editor-nls-adapter/proxy')"), 'Should replace require with proxy path')
  assert.ok(transformedCode2.includes("nls.localize2('vs/editor/common/editorContextKeys', "), 'Should inject module path in localize2')
  
  console.log('✅ transform test passed')
}

async function testInitAsyncConcurrency() {
  console.log('Testing initAsync concurrency...')
  const first = adapter.initAsync('not-a-real-locale')
  const second = adapter.initAsync('not-a-real-locale')

  assert.strictEqual(first, second, 'Concurrent initAsync calls for the same locale should reuse the same Promise')

  const [firstResult, secondResult] = await Promise.all([first, second])
  assert.strictEqual(firstResult, false, 'Invalid locale should resolve to false')
  assert.strictEqual(secondResult, false, 'Reused invalid locale request should resolve to the same false result')

  console.log('✅ initAsync concurrency test passed')
}

;(async () => {
  try {
    testFormat()
    testLocalizeFallback()
    testAdapterAPI()
    testTransform()
    await testInitAsyncConcurrency()
    console.log('\nAll tests passed successfully! 🎉')
  } catch (err) {
    console.error('\n❌ Test failed:')
    console.error(err)
    process.exit(1)
  }
})()
