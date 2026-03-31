# monaco-editor-nls-adapter

[![npm version](https://img.shields.io/npm/v/monaco-editor-nls-adapter.svg)](https://www.npmjs.com/package/monaco-editor-nls-adapter)
[![License](https://img.shields.io/npm/l/monaco-editor-nls-adapter.svg)](https://github.com/your-username/monaco-editor-nls-adapter/blob/main/LICENSE)

Multi-language NLS adapter for Monaco Editor 0.50.0+ (Self-hosted). Bridge the gap for localization in modern building environments.

[简体中文](./README_zh.md) | English

---

## 🌟 Features

- **Self-hosted Locales**: No external CDN dependencies; all language data is bundled locally.
- **Monaco 0.50.0+ Ready**: Fully compatible with the latest internal NLS signatures of Monaco Editor.
- **SourceMap Support**: Powered by `magic-string` for accurate source-to-bundle mapping and worry-free debugging.
- **Zero-Config Lazy Loading**: Support for asynchronous initialization with Webpack/Vite chunk splitting.
- **TypeScript Support**: First-class TS definitions for an excellent developer experience.
- **Flexible API**: Advanced interfaces like `getCurrentLocale` and `setMessages` (custom data).
- **Cross-Bundler**: Native support for **Webpack** (Loader) and **Vite/Rollup** (Plugin).
- **Zero Configuration**: Automatic detection of `pnpm` and monorepo paths out of the box.
- **Ultra-lightweight**: Redundant test files removed for even faster installation.

## 📦 Supported Frameworks

This adapter is compatible with all modern frontend frameworks:

- **Vue 2**: Seamless integration with Vue CLI and Webpack projects.
- **Vue 3**: Full support for Vite and Vue CLI configurations.
- **React**: Compatible with native React apps and `@monaco-editor/react` (supports disabling CDN).
- **Angular**: Compatible with Angular CLI (Webpack/Vite) build environments.
- **SSR Frameworks**: Ready for **Next.js** and **Nuxt** server-side rendering environments.
- **Universal**: Theoretically supports any web project built with **Webpack**, **Vite**, or **Rollup**.

## 🚀 Installation

```bash
npm install monaco-editor-nls-adapter
```

## 🛠 Configuration

### 1. Webpack (Loader)

In your `webpack.config.js`, add the adapter's loader to process Monaco Editor's ESM files.

```javascript
const { loader } = require('monaco-editor-nls-adapter');

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        // Crucial: Only process monaco-editor ESM files
        include: /monaco-editor[\\/]esm/,
        use: [
          {
            loader: loader,
            options: {
              // Optional: Custom monaco path fragment
              // Detected automatically in most project structures (npm, pnpm, yarn)
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

For projects using Vue CLI, you can configure the loader via `chainWebpack`:

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

In your `vite.config.js` or `vite.config.ts`:

```javascript
import { defineConfig } from 'vite';
import { vitePlugin } from 'monaco-editor-nls-adapter';

export default defineConfig({
  plugins: [
    vitePlugin({
      // Optional: Custom monaco path fragment
      // Automatically detected (works with pnpm and monorepos)
      // monacoPath: 'monaco-editor/esm'
    })
  ]
});
```

## 📖 Usage

### Initialization

Call `init` or `initAsync` **before** importing `monaco-editor` or creating any editor instances.

import * as nlsAdapter from 'monaco-editor-nls-adapter';

// 1. Synchronous (Standard)
nlsAdapter.init('zh-hans');

// 2. Asynchronous (Code Splitting)
// await nlsAdapter.initAsync('zh-hans');

// 3. Get current locale
console.log(nlsAdapter.getCurrentLocale()); // 'zh-hans'

// 4. Custom Messages (Override built-in locales)
/*
nlsAdapter.setMessages({
  'vs/editor/common/editorContextKeys': {
    'editor.action.clipboardCopyAction': 'Copy (Custom)'
  }
});
*/

import * as monaco from 'monaco-editor';
// ... create editor as usual
```

### Framework Integration (React / Vue)

This package works seamlessly with major frameworks. Special note for **React** (@monaco-editor/react): Make sure to use `loader.config({ monaco })` to disable CDN and map to your local, localized monaco instance.

See: [Framework Integration Best Practices (Examples)](./examples/framework-integration.md)

### API Reference

| Function | Description |
| --- | --- |
| `init(locale?: string): boolean` | Synchronous initialization. Tries to detect browser language if omitted. Returns success status. |
| `initAsync(locale?: string): Promise<boolean>` | Asynchronous initialization with dynamic imports. Returns success status. |
| `getCurrentLocale(): string` | Returns the currently active locale code. Returns `custom` if set via `setMessages`. |
| `setMessages(data: object)` | Manually inject translation data. Must follow Monaco's NLS structure. |
| `vitePlugin(options?: object)` | Vite plugin function. |
| `loader: string` | Absolute path to the Webpack loader. |

## 🗂 Supported Locales

| Code | Language |
| --- | --- |
| `zh-hans` | Simplified Chinese (简体中文) |
| `zh-hant` | Traditional Chinese (繁体中文) |
| `en` | English |
| `ja` | Japanese (日本語) |
| `ko` | Korean (한국어) |
| `de` | German (Deutsch) |
| `fr` | French (Français) |
| `es` | Spanish (Español) |
| `it` | Italian (Italiano) |
| `ru` | Russian (Русский) |
| `pl` | Polish (Polski) |
| `tr` | Turkish (Türkçe) |
| `cs` | Czech (Čeština) |
| `pt-br` | Portuguese - Brazil (Português) |

## ❓ FAQ

### Why do I need this instead of `monaco-editor-nls`?
Since version 0.50.0, Monaco Editor updated its internal `localize` function signature. Existing plugins often rely on older versions or external CDNs. This adapter provides a clean, self-hosted proxy and a modern build-time transformation for both Webpack and Vite.

## 📄 License

MIT

---

## 💖 Credits & Attribution

The localized language packs (`.json` files) in the `/locales` directory are sourced from the [monaco-editor-nls](https://github.com/wang12124468/monaco-editor-nls) project. Special thanks to the original authors for their contributions to the community.
