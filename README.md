# monaco-editor-nls-adapter

[![npm version](https://img.shields.io/npm/v/monaco-editor-nls-adapter.svg)](https://www.npmjs.com/package/monaco-editor-nls-adapter)
[![License](https://img.shields.io/npm/l/monaco-editor-nls-adapter.svg)](https://github.com/your-username/monaco-editor-nls-adapter/blob/main/LICENSE)

Multi-language NLS adapter for Monaco Editor 0.50.0+ (Self-hosted). Bridge the gap for localization in modern building environments.

[简体中文](./README_zh.md) | English

---

## 🌟 Features

- **Self-hosted Locales**: No external CDN dependencies; all language data is bundled locally.
- **Monaco 0.50.0+ Ready**: Fully compatible with the latest internal NLS signatures of Monaco Editor.
- **Zero-Config Lazy Loading**: Support for asynchronous initialization with Webpack/Vite chunk splitting.
- **TypeScript Support**: First-class TS definitions for an excellent developer experience.
- **Smart Detection**: Automatically detect browser language or manually switch as needed.
- **Cross-Bundler**: Native support for **Webpack** (Loader) and **Vite/Rollup** (Plugin).

## 🚀 Installation

```bash
npm install monaco-editor-nls-adapter
```

## 🛠 Configuration

### 1. Webpack (Loader)

In your `webpack.config.js`, add the adapter's loader to process Monaco Editor's ESM files.

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        // Crucial: Only process monaco-editor core files to avoid side effects
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

### 2. Vue CLI (`vue.config.js`)

For projects using Vue CLI, you can configure the loader via `chainWebpack`:

```javascript
module.exports = {
  chainWebpack: config => {
    config.module
      .rule('monaco-editor-nls')
      .test(/\.js$/)
      .include.add(/node_modules[\\/]monaco-editor[\\/]esm/)
      .end()
      .use('nls-loader')
      .loader('monaco-editor-nls-adapter/loader')
      .end();
  }
};
```

### 3. Vite / Rollup (Plugin)

In your `vite.config.js` or `vite.config.ts`:

```javascript
import { defineConfig } from 'vite';
import monacoNlsPlugin from 'monaco-editor-nls-adapter/vite-plugin';

export default defineConfig({
  plugins: [
    monacoNlsPlugin()
  ]
});
```

## 📖 Usage

### Initialization

Call `init` or `initAsync` **before** importing `monaco-editor` or creating any editor instances.

```typescript
import * as nlsAdapter from 'monaco-editor-nls-adapter';

/**
 * Option 1: Synchronous (Standard)
 * Recommended for small clusters or if you don't mind the initial bundle size.
 */
nlsAdapter.init('zh-hans');

/**
 * Option 2: Asynchronous (Performance Optimization)
 * Leverages Webpack/Vite dynamic imports for code splitting.
 */
// await nlsAdapter.initAsync('zh-hans');

/**
 * Option 3: Automatic Browser Detection
 */
// nlsAdapter.init(); // Sync
// await nlsAdapter.initAsync(); // Async

import * as monaco from 'monaco-editor';

monaco.editor.create(document.getElementById('container'), {
  value: 'console.log("Hello Localization!");',
  language: 'javascript'
});
```

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
