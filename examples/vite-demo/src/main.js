import * as nlsAdapter from 'monaco-editor-nls-adapter'
// `?worker` 导入只生成 Worker 构造器，不会在主线程求值 monaco 模块，
// 因此放在顶层是安全的，不会抢在语言包初始化之前固化英文文案
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'

self.MonacoEnvironment = {
  getWorker() {
    return new EditorWorker()
  }
}

const LOCALE_KEY = 'monaco-nls-demo-locale'
const select = document.getElementById('locale-select')
const status = document.getElementById('status')

const savedLocale = localStorage.getItem(LOCALE_KEY) || 'zh-hans'
select.value = savedLocale

// Monaco 的大量 UI 文案（菜单项、命令名等）在模块加载时就已求值固化，
// 因此切换语言采用「持久化 + 刷新页面」的方式，保证所有文案完整切换
select.addEventListener('change', () => {
  localStorage.setItem(LOCALE_KEY, select.value)
  location.reload()
})

const SAMPLE_CODE = `// 👋 欢迎体验 monaco-editor-nls-adapter
// 1. 在编辑器中【右键】查看本地化的上下文菜单
// 2. 按 F1 打开命令面板，搜索任意命令
// 3. 使用顶部下拉框切换 14 种界面语言

function greet(name) {
  const message = \`Hello, \${name}!\`
  console.log(message)
  return message
}

greet('Monaco Editor')
`

async function bootstrap() {
  // 关键：必须在 monaco-editor 模块求值之前完成语言包加载，
  // 所以这里先 await initAsync，再动态 import monaco
  if (savedLocale === 'en') {
    // 英文是 Monaco 的内置默认文案，无需加载语言包
    status.textContent = '当前语言: en (Monaco 内置默认)'
  } else {
    const ok = await nlsAdapter.initAsync(savedLocale)
    status.textContent = ok
      ? `当前语言包: ${nlsAdapter.getCurrentLocale()}`
      : '语言包加载失败，已回退英文'
  }

  // Demo 只需要展示编辑器 UI 本地化和 JavaScript 基础高亮，
  // 因此避免走 monaco-editor 的全量入口，减少 dev 请求数和首屏体积。
  const [monaco] = await Promise.all([
    import('monaco-editor/esm/vs/editor/edcore.main.js'),
    import('monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution.js')
  ])

  monaco.editor.create(document.getElementById('editor'), {
    value: SAMPLE_CODE,
    language: 'javascript',
    theme: 'vs-dark',
    fontSize: 14,
    minimap: { enabled: true },
    automaticLayout: true
  })
}

bootstrap()
