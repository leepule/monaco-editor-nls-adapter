import { NLSProxy } from './proxy';
import monacoNlsPlugin from './vite-plugin';

/**
 * 支持的语言代码类型
 */
export type LocaleCode = 
  | 'zh-hans' | 'zh-cn' | 'zh-hant' | 'zh-tw'
  | 'en' | 'ja' | 'ko' | 'de' | 'fr' | 'es' | 'it' | 'ru' | 'pl' | 'tr' | 'cs' | 'pt-br';

/**
 * 初始化 Monaco Editor 的语言包
 * @param locale 语言代码，如 'zh-hans'
 * @param force 是否强制重新初始化
 * @returns 是否加载成功
 */
export function init(locale?: LocaleCode | string, force?: boolean): boolean;

/**
 * 异步初始化 Monaco Editor 的语言包
 * @param locale 语言代码
 * @param force 是否强制重新加载
 * @returns 是否加载成功
 */
export function initAsync(locale?: LocaleCode | string, force?: boolean): Promise<boolean>;

/**
 * 获取当前已生效的语言代码名称
 */
export function getLocaleName(): string;

/**
 * 获取当前加载的原始翻译数据
 */
export function getLocaleData(): Record<string, any> | null;

/**
 * 手动设置翻译数据字典
 * @param messages 符合 Monaco NLS 格式的 JSON 对象
 * @param locale 语言代码 (可选标识符)
 */
export function setMessages(messages: Record<string, any>, locale?: string): void;

/**
 * NLS 代理对象声明
 */
export const proxy: NLSProxy;

/**
 * Vite 插件导出
 */
export const vitePlugin: typeof monacoNlsPlugin;

/**
 * Webpack Loader 绝对路径导出 (用于 webpack.config.js)
 */
export const loader: string;

// 重新导出子模块中的类型，方便从主模块引用
export { NLSProxy } from './proxy';
export { PluginOptions } from './vite-plugin';
export { transform } from './transform';
