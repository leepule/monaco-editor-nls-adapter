/**
 * NLS 代理对象，由 loader/plugin 智能注入到 Monaco Editor 生命周期中。
 * 兼容 VS Code 和 Monaco 0.50.0+ 的内部签名。
 */
export interface NLSProxy {
  /** 
   * 核心本地化翻译函数 / Core localization function.
   * @param path 模块相对于 esm 的路径 (由 transform 注入) / Module path relative to 'esm'.
   * @param data 翻译标识符 (key) 或包含 key 的配置对象 / Translation key or object.
   * @param defaultMessage 默认回退消息 / Fallback message.
   * @param args 模板插值参数 / Template interpolation arguments.
   */
  localize(path: string, data: any, defaultMessage: string, ...args: any[]): string;

  /** 
   * 同 localize，但返回包含原始文本的对象 / Same as localize, returns object with 'value' and 'original'.
   */
  localize2(path: string, data: any, defaultMessage: string, ...args: any[]): { value: string; original: string };

  /** 
   * 设置当前的语言包字典数据 / Set the current locale dictionary data.
   * @param data 翻译数据字典 / Translation dictionary.
   * @param locale 语言代码名称 / Locale code name (e.g. 'zh-hans').
   */
  setLocaleData(data: Record<string, any>, locale?: string): void;

  /** 
   * 获取当前已加载的完整字典数据 / Get the raw translation data.
   */
  getLocaleData(): Record<string, any> | null;

  /** 
   * 获取当前活跃的语言代码名称 / Get the current active locale name.
   */
  getLocaleName(): string;

  /** 获取默认配置语言 (通常为已弃用或返回 undefined) */
  getConfiguredDefaultLocale(): string | undefined;

  /** VS Code 兼容接口：加载消息包 */
  loadMessageBundle(file: string): (path: string, data: any, defaultMessage: string, ...args: any[]) => string;

  /** VS Code 兼容接口：初始化配置 */
  config(opt: any): (file: string) => any;

  /** 
   * 动态创建一个针对特定 Context 的代理实例 / Create a contextual proxy instance.
   */
  create(key: string, data: any): {
    localize: (idx: any, defaultValue: string, ...args: any[]) => string;
    localize2: (idx: any, defaultValue: string, ...args: any[]) => { value: string; original: string };
    getConfiguredDefaultLocale: () => string | undefined;
  };
}

/**
 * 默认导出的 NLS 代理实例
 */
declare const proxy: NLSProxy;
export default proxy;
