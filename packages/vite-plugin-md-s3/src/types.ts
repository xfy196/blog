/**
 * S3 兼容对象存储配置（AWS S3 / Cloudflare R2 / MinIO 等）
 */
export interface S3Config {
  /** 自定义 endpoint，R2/MinIO 必填 */
  endpoint?: string
  /** 区域，R2 可用 `auto` */
  region: string
  bucket: string
  accessKeyId: string
  secretAccessKey: string
  /** MinIO/部分兼容实现需要 path-style */
  forcePathStyle?: boolean
  /** 改写后的公网前缀，如 https://static.xxytime.top */
  publicBaseUrl: string
}

/**
 * Object key 生成策略
 * - `date-uuid`: yyyy/mm/dd/{uuid}{ext}
 * - `hash`: 内容 hash + ext
 * - `preserve-path`: 尽量保留原 URL pathname
 */
export type KeyTemplate = 'date-uuid' | 'hash' | 'preserve-path'

/**
 * Vite 插件 / CLI 共用配置
 */
export interface MdS3Options {
  s3: S3Config
  /** 扫描目录，默认 `docs` */
  includeDir?: string
  /** 排除 glob，相对项目根 */
  exclude?: string[]
  /** 只迁移这些 host；默认不限制（但跳过已是 publicBaseUrl 的） */
  fromHosts?: string[]
  /** 资源扩展名，默认常见图片/视频/文档 */
  extensions?: string[]
  /** object key 生成策略 */
  keyTemplate?: KeyTemplate
  dryRun?: boolean
  concurrency?: number
}

/**
 * 挂在 Vite 插件实例上的内部标记，供 CLI 提取配置
 */
export const MD_S3_PLUGIN_NAME = 'vite-plugin-md-s3'
export const MD_S3_OPTIONS_KEY = Symbol.for('vite-plugin-md-s3:options')

/**
 * 默认资源扩展名
 */
export const DEFAULT_EXTENSIONS = [
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.webp',
  '.svg',
  '.avif',
  '.ico',
  '.bmp',
  '.mp4',
  '.webm',
  '.mp3',
  '.wav',
  '.pdf',
  '.zip',
]

/**
 * 解析后的完整配置（带默认值）
 */
export interface ResolvedMdS3Options {
  s3: S3Config
  includeDir: string
  exclude: string[]
  fromHosts: string[]
  extensions: string[]
  keyTemplate: KeyTemplate
  dryRun: boolean
  concurrency: number
  root: string
}
