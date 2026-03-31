import { NLSProxy } from './proxy';
import monacoNlsPlugin from './vite-plugin';

/**
 * 获取当前已生效的语言代码名称 / Get the current active locale name.
 * @returns 语言代码 (如 'zh-hans')
 */
export function getLocaleName(): string;

/**
 * 获取当前已生效的语言代码名称 (同 getLocaleName) / Get current locale (alias for getLocaleName).
 */
export function getCurrentLocale(): string;

/**
 * 获取当前加载的原始翻译数据字典 / Get the raw translation dictionary data.
 */
export function getLocaleData(): Record<string, any> | null;

/**
 * 手动注入翻译数据字典 / Manually set the translation messages.
 * @param messages 符合 Monaco NLS 格式的 JSON 字典对象 / Dictionary following Monaco NLS format.
 * @param locale 语言代码名称标识符 (可选) / Locale code identifier (optional).
 */
export function setMessages(messages: Record<string, any>, locale?: string): void;

/**
 * 设置当前的本地化数据内容 / Directly set the locale data in the proxy.
 */
export function setLocaleData(data: Record<string, any>, locale?: string): void;

/**
 * NLS 代理对象实例 / The underlying NLS proxy instance.
 */
export const proxy: NLSProxy;

/**
 * Vite 插件导出 / Vite plugin for build-time transformation.
 */
export const vitePlugin: typeof monacoNlsPlugin;

/**
 * Webpack Loader 导出 (用于 webpack.config.js) / Webpack loader path and utility.
 */
export const loader: string;
