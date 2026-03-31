/**
 * NLS 代理对象，由 loader/plugin 智能注入到 Monaco Editor 生命周期中。
 * 兼容 VS Code 和 Monaco 0.50.0+ 的内部签名。
 */
export interface NLSProxy {
  /** 
   * 翻译主函数
   * @param path 模块相对于 esm 的路径 (由 transform 函数注入)
   * @param data 翻译 key 或包含 key 的对象
   * @param defaultMessage 默认显示的英文消息
   * @param args 模板插值变量
   */
  localize(path: string, data: any, defaultMessage: string, ...args: any[]): string;

  /** 同 localize，支持返回包含原始文本的对象 */
  localize2(path: string, data: any, defaultMessage: string, ...args: any[]): { value: string; original: string };

  /** 设置当前活跃的语言包内容 */
  setLocaleData(data: Record<string, any>, locale?: string): void;

  /** 获取底层已加载的字典数据 */
  getLocaleData(): Record<string, any> | null;

  /** 获取当前活跃的语言名称 */
  getLocaleName(): string;

  /** 获取底层配置的默认语言 (通常返回 undefined 以保持隔离) */
  getConfiguredDefaultLocale(): string | undefined;

  /** VS Code 兼容接口：加载消息包 */
  loadMessageBundle(file: string): (path: string, data: any, defaultMessage: string, ...args: any[]) => string;

  /** VS Code 兼容接口：配置 NLS */
  config(opt: any): (file: string) => any;

  /** 动态创建代理实例 */
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
