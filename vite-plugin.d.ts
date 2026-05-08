/**
 * 为 Vite/Rollup 应用注入 Monaco Editor 本地化路径转换的插件。
 * [Vite/Rollup Plugin] Inject localization path transformations into Monaco Editor.
 */
declare function monacoNlsPlugin(options?: monacoNlsPlugin.PluginOptions): any;

declare namespace monacoNlsPlugin {
  /**
   * 插件配置项 / Plugin configuration options.
   */
  export interface PluginOptions {
    /** 
     * 匹配 monaco-editor 源码的目录名或物理路径片段。
     * [Optional] The path fragment to identify Monaco Editor's source directory (e.g. 'monaco-editor/esm').
     * 默认会自动探测 node_modules 下的 monaco-editor/esm，通常无需配置。
     * Matches npm, pnpm, and yarn local paths automatically if using default 'monaco-editor'.
     */
    monacoPath?: string;

    /**
     * 需要包含在最终产物中的语言包列表。
     * [Optional] List of languages to include in the bundle (e.g. ['zh-hans', 'en']).
     * 如果不指定，则默认包含所有可用的语言包。
     * If not specified, all available language packs will be included.
     */
    languages?: string[];
  }
}

export = monacoNlsPlugin;
