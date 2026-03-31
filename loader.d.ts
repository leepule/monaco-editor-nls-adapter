/**
 * Webpack Loader 处理函数。
 */
declare function monacoNlsLoader(this: any, source: string): string | void;

declare namespace monacoNlsLoader {
  /** 可根据需要扩展导出项 */
}

export = monacoNlsLoader;
