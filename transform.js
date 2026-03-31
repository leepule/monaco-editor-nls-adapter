const MagicString = require('magic-string')

let CACHED_MONACO_ROOT = null

/**
 * 转换 Monaco Editor 源代码以注入本地化路径
 * @param {string} source 源代码内容
 * @param {string} id 文件路径 (resourcePath 或 vite id)
 * @param {Object} options 配置项
 * @param {string} options.monacoPath 匹配 Monaco Editor 的路径片段，默认为 'monaco-editor/esm'
 * @returns {Object|string} 转换后的对象 { code, map } 或原始字符串
 */
function transform(source, id, options = {}) {
  // 统一路径分隔符
  const resourcePath = id.replace(/\\/g, '/')
  let monacoRoot = options.monacoPath || 'monaco-editor/esm'

  // 4. 自动路径探测增强：如果是默认路径且在 node_modules 中，尝试自动定位物理路径
  if (monacoRoot === 'monaco-editor/esm' && !CACHED_MONACO_ROOT) {
    try {
      // 尝试自动定位 monaco-editor 的安装目录 (适配 pnpm, npm, yarn)
      const pkgPath = require.resolve('monaco-editor/package.json', { paths: [process.cwd()] })
      CACHED_MONACO_ROOT = pkgPath.replace(/\\/g, '/').replace('package.json', 'esm')
    } catch (e) {
      // 容错：如果无法解析，则暂时保持原样
    }
  }

  // 优先匹配物理路径，否则回退到特征字符串匹配
  const matchPath = CACHED_MONACO_ROOT || monacoRoot

  if (resourcePath.includes(matchPath)) {
    // 计算模块路径 (相对于 esm 目录)
    const lastIndex = resourcePath.lastIndexOf(matchPath)
    const startIndex = lastIndex + matchPath.length + 1
    const modulePath = resourcePath.substring(startIndex).replace(/\.js$/, '')

    if (!modulePath || modulePath.includes('node_modules')) return source

    const s = new MagicString(source)
    const proxyPath = 'monaco-editor-nls-adapter/proxy'

    // 2. 替换对 nls.js 的引用 (处理 import 和 require)
    const nlsImportRegex = /(import\s+.*?\s+from\s+['"])(.*?\/nls\.js)(['"])/g
    let match
    while ((match = nlsImportRegex.exec(source)) !== null) {
      s.overwrite(match.index + match[1].length, match.index + match[1].length + match[2].length, proxyPath)
    }

    const nlsRequireRegex = /(require\(['"])(.*?\/nls\.js)(['"]\))/g
    while ((match = nlsRequireRegex.exec(source)) !== null) {
      s.overwrite(match.index + match[1].length, match.index + match[1].length + match[2].length, proxyPath)
    }

    // 3. 在 localize 和 localize2 调用中注入路径作为第一个参数
    const localizeRegex = /nls\.localize(\d?)\(/g
    while ((match = localizeRegex.exec(source)) !== null) {
      // 在 '(' 之后插入路径参数
      s.appendLeft(match.index + match[0].length, `'${modulePath}', `)
    }

    return {
      code: s.toString(),
      map: s.generateMap({ hires: true, source: id, includeContent: true })
    }
  }

  return source
}

module.exports = {
  transform
}
