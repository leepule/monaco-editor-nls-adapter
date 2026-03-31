import { PluginOptions } from './vite-plugin';

/**
 * 转换 Monaco Editor 源代码以注入本地化路径。
 * 支持 Webpack Loader 和 Vite Plugin 调用。
 * 
 * @param source 源代码内容
 * @param id 文件路径 (resourcePath 或 vite id)
 * @param options 配置项
 * @returns 转换后的对象 { code, map } 或原始字符串
 */
export function transform(
  source: string, 
  id: string, 
  options?: PluginOptions
): { code: string; map: any } | string;
