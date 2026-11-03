import type { Plugin } from 'vite'
import {
  MD_S3_OPTIONS_KEY,
  MD_S3_PLUGIN_NAME,
  type MdS3Options,
} from './types.js'

export type {
  KeyTemplate,
  MdS3Options,
  ResolvedMdS3Options,
  S3Config,
} from './types.js'
export { DEFAULT_EXTENSIONS, MD_S3_OPTIONS_KEY, MD_S3_PLUGIN_NAME } from './types.js'
export { migrateMarkdownAssets } from './migrate.js'
export type { FileMigrateResult, MigrateResult } from './migrate.js'
export { resolveOptions, loadMdS3Options } from './config.js'

/**
 * Vite 插件：仅作为配置载体，构建期 no-op。
 * 实际迁移请使用 CLI：`md-s3 migrate`
 *
 * @param options 迁移配置
 * @example
 * ```ts
 * import { mdS3Plugin } from 'vite-plugin-md-s3'
 *
 * export default defineConfig({
 *   vite: {
 *     plugins: [
 *       mdS3Plugin({
 *         s3: {
 *           endpoint: process.env.S3_ENDPOINT,
 *           region: 'auto',
 *           bucket: 'blog',
 *           accessKeyId: process.env.S3_ACCESS_KEY_ID!,
 *           secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
 *           publicBaseUrl: 'https://static.xxytime.top',
 *         },
 *         includeDir: 'docs',
 *         fromHosts: ['oss.xxytime.top'],
 *       }),
 *     ],
 *   },
 * })
 * ```
 */
export function mdS3Plugin(options: MdS3Options): Plugin {
  const plugin: Plugin & {
    [MD_S3_OPTIONS_KEY]?: MdS3Options
    __mdS3Options?: MdS3Options
  } = {
    name: MD_S3_PLUGIN_NAME,
    // 构建 / 开发均不介入
    apply: () => true,
    // 字符串字段便于 CLI 从配置对象中提取（无需依赖 Symbol 枚举）
    __mdS3Options: options,
  }

  Object.defineProperty(plugin, MD_S3_OPTIONS_KEY, {
    value: options,
    enumerable: false,
    configurable: false,
    writable: false,
  })

  return plugin
}

export default mdS3Plugin
