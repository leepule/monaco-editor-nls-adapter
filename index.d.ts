import { NLSProxy } from './proxy';
import monacoNlsPlugin from './vite-plugin';

/**
 * 预设的支持语言代码类型 (也可传递任意字符串)
 * Preset of supported locale codes (any string may be used).
 */
export type LocaleCode = 
  | 'zh-hans' | 'zh-cn' | 'zh-hant' | 'zh-tw' | 'zh-hk'
  | 'en' | 'ja' | 'ko' | 'de' | 'fr' | 'es' | 'it' | 'ru' | 'pl' | 'tr' | 'cs' | 'pt-br';

/**
 * [全量入口] 使用指定的语言代码初始化 Monaco Editor 的本地化。
 * 注意：由于包含动态 require 逻辑，在 Webpack/Vite 环境下可能会导致扫描并打包全量语言 JSON。
 * [Full Entry] Initialize Monaco Editor localization with a specific locale.
 * WARNING: Uses dynamic require, which may bundle all locales in development/production.
 * 
 * @param locale 语言代码 (如 'zh-hans') / Locale code identifier.
 * @param force 是否强制重新初始化 / Force re-initialization.
 * @returns 是否加载成功 / Success status.
 */
export function init(locale?: LocaleCode | string, force?: boolean): boolean;

/**
 * [全量入口] 异步初始化 Monaco Editor 的本地化。
 * 使用动态 import 拆分语言包，有助于减小主包体积。
 * [Full Entry] Asynchronously initialize Monaco localization.
 * Uses dynamic import for chunk splitting.
 * 
 * @param locale 语言代码 / Locale code.
 * @param force 是否强制加载 / Force re-load.
 * @returns 是否加载成功 / Success status.
 */
export function initAsync(locale?: LocaleCode | string, force?: boolean): Promise<boolean>;

/**
 * 获取当前已生效的语言代码名称 / Get the current active locale name.
 */
export function getLocaleName(): string;

/**
 * 获取当前已生效的语言代码名称 (同 getLocaleName) / Get current locale (alias).
 */
export function getCurrentLocale(): string;

/**
 * 获取当前加载的原始翻译数据字典 / Get current raw translation data.
 */
export function getLocaleData(): Record<string, any> | null;

/**
 * 手动设置翻译数据字典 / Set current translation messages manually.
 * @param messages 符合 Monaco NLS 格式的 JSON 对象 / Dictionary following Monaco NLS format.
 * @param locale 语言代码标识符 (可选) / Locale code identifier.
 */
export function setMessages(messages: Record<string, any>, locale?: string): void;

/**
 * 设置当前的本地化字典数据到代理中 / Set locale data into the proxy directly.
 */
export function setLocaleData(data: Record<string, any>, locale?: string): void;

/**
 * NLS 代理对象声明 / The NLS proxy instance.
 */
export const proxy: NLSProxy;

/**
 * Vite 插件导出 / Vite plugin for build-time transformation.
 */
export const vitePlugin: typeof monacoNlsPlugin;

/**
 * Webpack Loader 导出 (用于 webpack.config.js) / Webpack loader path.
 */
export const loader: string;

// 重新导出子模块中的类型以便全局引用
export { NLSProxy } from './proxy';
export { PluginOptions } from './vite-plugin';
export { transform } from './transform';
