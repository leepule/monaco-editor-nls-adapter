/**
 * 为 Vite/Rollup 应用注入 Monaco Editor 本地化路径转换的插件。
 */
declare function monacoNlsPlugin(options?: monacoNlsPlugin.PluginOptions): any;

declare namespace monacoNlsPlugin {
  /**
   * 插件配置项
   */
  export interface PluginOptions {
    /** 
     * 匹配 monaco-editor 源码的目录名或物理路径片段。
     * 默认会自动探测 node_modules 下的 monaco-editor/esm，通常无需配置。
     */
    monacoPath?: string;
  }
}

export = monacoNlsPlugin;
