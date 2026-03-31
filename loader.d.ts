/**
 * Webpack Loader 处理函数。
 * 直接导出 Loader 的绝对路径。
 * [Webpack Loader] Absolute path to the Webpack loader.
 */
declare function monacoNlsLoader(this: any, source: string): string | void;

declare namespace monacoNlsLoader {
  /** 插件配置项同 vitePlugin / Shared PluginOptions */
}

export = monacoNlsLoader;
