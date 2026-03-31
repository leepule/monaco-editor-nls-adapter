import { NLSProxy } from './proxy';
import monacoNlsPlugin from './vite-plugin';

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
