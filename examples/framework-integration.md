# 框架集成指南 (React & Vue 2/3)

`monaco-editor-nls-adapter` 与主流前端框架均可完美配合。以下是各个框架的最佳实践集成方案。

## 1. React (配合 `@monaco-editor/react`)

`@monaco-editor/react` 默认从 CDN 加载 Monaco。要使用本适配器的本地化功能，必须强制其使用本地安装的、经过插件处理过的 `monaco-editor`。

### 安装依赖
```bash
npm install monaco-editor monaco-editor-nls-adapter @monaco-editor/react
```

### 集成代码
在您的应用入口文件（如 `App.tsx` 或 `index.tsx`）中：

```tsx
import { loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import * as nlsAdapter from "monaco-editor-nls-adapter";

// 1. 先初始化适配器
nlsAdapter.init('zh-hans');

// 2. 配置 react-monaco-editor 使用本地实例（跳过 CDN）
loader.config({ monaco });

function App() {
  return (
    <Editor
      height="90vh"
      defaultLanguage="javascript"
      defaultValue="// 这里的 UI 已经是中文了"
    />
  );
}
```

---

## 2. Vue 3 (配合 Vite)

Vue 3 项目通常使用 Vite。利用 `initAsync` 可以实现异步加载语言包，优化首屏。

### `vite.config.ts` 配置
```typescript
import { vitePlugin } from 'monaco-editor-nls-adapter';

export default {
  plugins: [vitePlugin()]
};
```

### `main.ts` 初始化
```typescript
import { createApp } from 'vue';
import App from './App.vue';
import { initAsync } from 'monaco-editor-nls-adapter';

(async () => {
  // 在应用挂载前异步加载语言包
  await initAsync('zh-hans');
  
  createApp(App).mount('#app');
})();
```

---

## 3. Vue 2 (配合 Vue CLI / Webpack)

对于经典的 Vue 2 项目，通常使用 `vue.config.js` 进行配置。

### `vue.config.js` 配置
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

### `main.js` 初始化
```javascript
import Vue from 'vue';
import App from './App.vue';
import { init } from 'monaco-editor-nls-adapter';

// 同步初始化
init('zh-hans');

new Vue({
  render: h => h(App),
}).$mount('#app');
```

---

## 4. SSR 环境说明 (Next.js / Nuxt)

本适配器在 `init` 逻辑中内置了环境检查：
- 在 **服务端** 执行时，它会静默跳过浏览器相关的 API（如 `navigator`）。
- 您可以放心地在入口文件中调用它，它会在客户端正式加载 Monaco 之前生效。
