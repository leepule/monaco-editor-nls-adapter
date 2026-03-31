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
- **SourceMap 支持**: 基于 `magic-string` 实现转换后的精准还原，调试无忧。
- **TypeScript 支持**: 完善的类型定义，为开发提供极佳的智能感知。
- **灵活的 API**: 提供 `getCurrentLocale` 和 `setMessages` (自定义数据) 等高级接口。
- **跨构建工具支持**: 原生支持 **Webpack** (Loader) 以及 **Vite/Rollup** (Plugin)。
- **智能路径探测**: 自动识别 `pnpm` 和 monorepo 路径，**零配置**即可使用。
- **轻量化**: 移除了冗余测试文件，发布包体积进一步精简。

## 📦 支持的框架

本适配器与主流前端框架均可完美兼容：

- **Vue 2**: 完美适配 Vue CLI 和 Webpack 项目。
- **Vue 3**: 深度支持 Vite 和 Vue CLI 配置。
- **React**: 适配原生 React 应用及 `@monaco-editor/react` (支持禁用 CDN)。
- **Angular**: 支持 Angular CLI (Webpack/Vite) 构建环境。
- **SSR 框架**: 兼容 **Next.js** 和 **Nuxt** 等服务端渲染环境。
- **通用**: 理论上支持任何基于 **Webpack**、**Vite** 或 **Rollup** 构建的 web 项目。

## 🚀 安装

```bash
npm install monaco-editor-nls-adapter
```

## 🛠 配置

### 1. Webpack (Loader)

在 `webpack.config.js` 中，添加此适配器的 loader 来处理 Monaco Editor 的 ESM 源码。

```javascript
const { loader } = require('monaco-editor-nls-adapter');

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        // 重要：仅处理 monaco-editor 的 esm 目录
        include: /monaco-editor[\\/]esm/,
        use: [
          {
            loader: loader,
            options: {
              // 可选：自定义 monaco 路径片段
              // 插件会自动探测 node_modules 下的 monaco-editor/esm，通常无需配置
              // monacoPath: 'monaco-editor/esm'
            }
          }
        ]
      }
    ]
  }
}
```

### 2. Vue CLI (`vue.config.js`)

对于使用 Vue CLI 的项目，建议使用 `chainWebpack` 进行配置：

```javascript
const { loader } = require('monaco-editor-nls-adapter');

module.exports = {
  chainWebpack: config => {
    config.module
      .rule('monaco-editor-nls')
      .test(/\.js$/)
      .include.add(/monaco-editor[\\/]esm/)
      .end()
      .use('nls-loader')
      .loader(loader)
      .end();
  }
};
```

### 3. Vite / Rollup (Plugin)

在 `vite.config.js` 中，添加此插件：

```javascript
import { defineConfig } from 'vite';
import { vitePlugin } from 'monaco-editor-nls-adapter';

export default defineConfig({
  plugins: [
    vitePlugin({
      // 可选：自定义 monaco 路径片段
      // 插件会自动探测物理路径（支持 pnpm），通常无需配置
      // monacoPath: 'monaco-editor/esm'
    })
  ]
});
```

## 📖 使用指南

### 初始化

在导入 `monaco-editor` 或创建任何实例**之前**，先调用 `init` 或 `initAsync`。

import * as nlsAdapter from 'monaco-editor-nls-adapter';

// 1. 同步初始化 (标准用法)
nlsAdapter.init('zh-hans');

// 2. 异步初始化 (分包懒加载)
// await nlsAdapter.initAsync('zh-hans');

// 3. 获取当前语言
console.log(nlsAdapter.getCurrentLocale()); // 'zh-hans'

// 4. 使用自定义翻译数据 (不使用内置语言包)
/*
nlsAdapter.setMessages({
  'vs/editor/common/editorContextKeys': {
    'editor.action.clipboardCopyAction': '复制 (Custom)'
  }
});
*/

import * as monaco from 'monaco-editor';
// ... 之后正常创建编辑器
```

### 框架集成 (React / Vue)

本项目与主流框架完美配合。特别注意：若使用 **React** (@monaco-editor/react)，请务必通过 `loader.config({ monaco })` 禁用 CDN 并映射到本地实例。

详细的框架集成指南请参考：[框架集成最佳实践 (Examples)](./examples/framework-integration.md)

### API 详述

| 函数 | 说明 |
| --- | --- |
| `init(locale?: string): boolean` | 同步初始化。如果不传参数，尝试探测浏览器语言。返回是否加载成功。 |
| `initAsync(locale?: string): Promise<boolean>` | 异步初始化。利用动态 import 拆分语言包。返回是否加载成功。 |
| `getCurrentLocale(): string` | 获取当前已生效的语言代码。如果是自定义数据，返回 `custom`。 |
| `setMessages(data: object)` | 手动注入翻译字典。格式需符合 Monaco 的 NLS 结构。 |
| `vitePlugin(options?: object)` | Vite 插件函数。 |
| `loader: string` | Webpack Loader 的绝对路径。 |

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
