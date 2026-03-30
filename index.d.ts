export interface NLSProxy {
  localize(path: string, data: any, defaultMessage: string, ...args: any[]): string;
  localize2(path: string, data: any, defaultMessage: string, ...args: any[]): { value: string; original: string };
  setLocaleData(data: Record<string, any>): void;
  getConfiguredDefaultLocale(): string | undefined;
  loadMessageBundle(file: string): (path: string, data: any, defaultMessage: string, ...args: any[]) => string;
  config(opt: any): (file: string) => any;
  create(key: string, data: any): {
    localize: (idx: any, defaultValue: string, ...args: any[]) => string;
    localize2: (idx: any, defaultValue: string, ...args: any[]) => { value: string; original: string };
    getConfiguredDefaultLocale: () => string | undefined;
  };
}

/**
 * 支持的语言代码类型
 */
export type LocaleCode = 
  | 'zh-hans' | 'zh-cn' | 'zh-hant' | 'zh-tw'
  | 'en' | 'ja' | 'ko' | 'de' | 'fr' | 'es' | 'it' | 'ru' | 'pl' | 'tr' | 'cs' | 'pt-br';

/**
 * 初始化 Monaco Editor 的语言包
 * @param locale 语言代码，如 'zh-hans'。如果不传，将尝试检测浏览器语言。
 */
export function init(locale?: LocaleCode | string): void;

/**
 * 异步初始化 Monaco Editor 的语言包
 * 使用动态 import()，支持 Webpack 分包和懒加载。
 * @param locale 语言代码
 */
export function initAsync(locale?: LocaleCode | string): Promise<void>;

/**
 * NLS 代理对象，由 loader 注入到 Monaco 源码中
 */
export const proxy: NLSProxy;
