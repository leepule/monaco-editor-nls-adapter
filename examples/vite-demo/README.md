# Vite 语言切换 Demo

演示通过 `monaco-editor-nls-adapter` 为 Monaco Editor 切换 14 种界面语言。

## 运行

```bash
npm install
npm run dev      # 开发模式
npm run build    # 生产构建
npm run preview  # 预览构建产物
```

打开页面后，使用顶部下拉框切换界面语言。在编辑器中**右键**打开上下文菜单、或按 <kbd>F1</kbd> 打开命令面板，即可看到本地化后的 UI 文案。

## 工作原理

1. [vite.config.mjs](./vite.config.mjs) 注册 `vitePlugin()`，在构建/服务时改写 monaco 源码中的 NLS 调用，使其从适配器的代理读取翻译。
2. [src/main.js](./src/main.js) 中先 `await initAsync(locale)` 加载语言包，**再**动态 `import('monaco-editor')` —— 顺序不能颠倒，因为 Monaco 大量 UI 文案在模块求值时就已固化。
3. 切换语言时把选择写入 `localStorage` 并刷新页面，刷新后按新语言重新初始化。这是 Monaco 语言切换的标准做法（运行时热切换无法更新已注册的菜单/命令文案）。
4. `en`（英文）是 Monaco 的内置默认文案，无需语言包，直接跳过 `initAsync`。

## 配置注意点

- `optimizeDeps.exclude: ['monaco-editor']` —— **必需**。否则 dev 模式下 Vite 预构建会绕过插件 transform，界面回退英文。
- `optimizeDeps.include` 与 `build.commonjsOptions` —— 仅因本 demo 通过 `file:../..` 软链安装适配器才需要（Vite 默认不预构建/不做 CJS 互操作处理链接包）。从 npm 正常安装时可以省略。
