# monaco-editor-nls-adapter

[![npm version](https://img.shields.io/npm/v/monaco-editor-nls-adapter.svg)](https://www.npmjs.com/package/monaco-editor-nls-adapter)
[![License](https://img.shields.io/npm/l/monaco-editor-nls-adapter.svg)](https://github.com/your-username/monaco-editor-nls-adapter/blob/main/LICENSE)

针对 Monaco Editor 0.50.0 及以上版本的多语言本地化适配器。专为现代化构建工具（Webpack, Vite）设计的自托管解决方案。

简体中文 | [English](./README.md)

---

## 🌟 特性

- **自托管语言包**: 无需依赖外部 CDN；所有语言数据在本地打包。
- **适配 Monaco 0.50.0+**: 完全兼容 Monaco Editor 最新的内部 NLS 调用签名。
- **性能优化 (懒加载)**: 通过 Webpack/Vite 的动态导入实现按需分包加载。
- **TypeScript 支持**: 完善的类型定义，为开发提供极佳的智能感知。
- **智能语言识别**: 支持自动识别浏览器语言或手动切换。
- **跨构建工具支持**: 原生支持 **Webpack** (Loader) 以及 **Vite/Rollup** (Plugin)。

## 🚀 安装

```bash
npm install monaco-editor-nls-adapter
```

## 🛠 配置

### 1. Webpack (Loader)

在 `webpack.config.js` 中，添加此适配器的 loader 来处理 Monaco Editor 的 ESM 源码。

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        // 重要：仅处理 monaco-editor 的 esm 目录，避免对业务代码产生副作用
        include: /node_modules[\\/]monaco-editor[\\/]esm/,
        use: [
          {
            loader: 'monaco-editor-nls-adapter/loader'
          }
        ]
      }
    ]
  }
}
```

### 2. Vite / Rollup (Plugin)

在 `vite.config.js` 中，添加此插件：

```javascript
import { defineConfig } from 'vite';
import monacoNlsPlugin from 'monaco-editor-nls-adapter/vite-plugin';

export default defineConfig({
  plugins: [
    monacoNlsPlugin()
  ]
});
```

## 📖 使用指南

### 初始化

在导入 `monaco-editor` 或创建任何实例**之前**，先调用 `init` 或 `initAsync`。

```typescript
import * as nlsAdapter from 'monaco-editor-nls-adapter';

/**
 * 方式 1: 同步初始化 (标准用法)
 * 适用于语言包体量较小，或不介意首屏全量包含翻译数据的场景。
 */
nlsAdapter.init('zh-hans');

/**
 * 方式 2: 异步初始化 (性能优化推荐)
 * 利用 Webpack/Vite 的动态 import 实现分包，仅加载当前所需语言。
 */
// await nlsAdapter.initAsync('zh-hans');

/**
 * 方式 3: 自动识别浏览器语言
 */
// nlsAdapter.init(); // 同步
// await nlsAdapter.initAsync(); // 异步

import * as monaco from 'monaco-editor';

monaco.editor.create(document.getElementById('container'), {
  value: 'console.log("Hello Localization!");',
  language: 'javascript'
});
```

## 🗂 支持的语言列表

| 语言代码 | 对应语言 |
| --- | --- |
| `zh-hans` | 简体中文 |
| `zh-hant` | 繁体中文 |
| `en` | 英语 (English) |
| `ja` | 日本语 (Japanese) |
| `ko` | 韩语 (Korean) |
| `de` | 德语 (German) |
| `fr` | 法语 (French) |
| `es` | 西班牙语 (Spanish) |
| `it` | 意大利语 (Italian) |
| `ru` | 俄语 (Russian) |
| `pl` | 波兰语 (Polish) |
| `tr` | 土耳其语 (Turkish) |
| `cs` | 捷克语 (Czech) |
| `pt-br` | 葡萄牙语 - 巴西 (Portuguese) |

## ❓ 常见问题 (FAQ)

### 为什么选择此适配器而不是 `monaco-editor-nls`?
自 0.50.0 版本起，Monaco Editor 更新了内部 `localize` 函数的签名。现有许多插件依赖于旧版本或外部 CDN。此适配器提供了一个完全自托管的代理和针对最新版本的现代转换逻辑。

### 它能配合 `@monaco-editor/react` 使用吗？
可以。请先在您的构建工具（Webpack/Vite）中配置好插件/Loader，然后在应用入口处生命周期（通常是根组件渲染前）调用 `nlsAdapter.init()` 即可。

## 📄 许可证

MIT

---

## 💖 致谢与归属声明

`/locales` 目录中的语言包（`.json` 文件）来源于 [monaco-editor-nls](https://github.com/wang12124468/monaco-editor-nls) 项目。在此对原作者及社区的贡献表示衷心的感谢。
