const MONACO_ESM_ROOT = 'node_modules/monaco-editor/esm/'

/**
 * 转换 Monaco Editor 源代码以注入本地化路径
 * @param {string} source 源代码内容
 * @param {string} id 文件路径 (resourcePath 或 vite id)
 * @returns {string} 转换后的代码
 */
function transform(source, id) {
  // 统一路径分隔符
  const resourcePath = id.replace(/\\/g, '/')

  if (resourcePath.includes(MONACO_ESM_ROOT)) {
    // 1. 计算 Monaco 模块路径 (例如 vs/editor/common/editorContextKeys)
    const startIndex = resourcePath.indexOf(MONACO_ESM_ROOT) + MONACO_ESM_ROOT.length
    const modulePath = resourcePath.substring(startIndex).replace('.js', '')

    // 2. 将 NLS 引用重定向到本包的代理 (proxy) 文件
    const proxyPath = 'monaco-editor-nls-adapter/proxy'
    
    // 替换对 nls.js 的引用
    source = source.replace(/import\s+\*\s+as\s+nls\s+from\s+['"].*?\/nls\.js['"]/g, `import * as nls from '${proxyPath}'`)
    source = source.replace(/require\(['"].*?\/nls\.js['"]\)/g, `require('${proxyPath}')`)

    // 3. 在 localize 和 localize2 调用中注入路径作为第一个参数
    // 注意：只替换调用，不改变原始代码逻辑
    source = source.replace(/nls\.localize\(/g, `nls.localize('${modulePath}', `)
    source = source.replace(/nls\.localize2\(/g, `nls.localize2('${modulePath}', `)
  }

  return source
}

module.exports = {
  transform,
  MONACO_ESM_ROOT
}
