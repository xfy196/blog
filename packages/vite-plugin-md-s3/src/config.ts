import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { createJiti } from 'jiti'
import {
  DEFAULT_EXTENSIONS,
  MD_S3_OPTIONS_KEY,
  MD_S3_PLUGIN_NAME,
  type MdS3Options,
  type ResolvedMdS3Options,
  type S3Config,
} from './types.js'

const jiti = createJiti(import.meta.url, {
  interopDefault: true,
})

/**
 * 从环境变量补全 S3 密钥
 */
function applyEnvCredentials(s3: S3Config): S3Config {
  return {
    ...s3,
    accessKeyId:
      s3.accessKeyId ||
      process.env.S3_ACCESS_KEY_ID ||
      process.env.AWS_ACCESS_KEY_ID ||
      '',
    secretAccessKey:
      s3.secretAccessKey ||
      process.env.S3_SECRET_ACCESS_KEY ||
      process.env.AWS_SECRET_ACCESS_KEY ||
      '',
    region:
      s3.region ||
      process.env.S3_REGION ||
      process.env.AWS_REGION ||
      'auto',
    endpoint: s3.endpoint || process.env.S3_ENDPOINT || undefined,
    bucket: s3.bucket || process.env.S3_BUCKET || '',
    publicBaseUrl:
      s3.publicBaseUrl || process.env.S3_PUBLIC_BASE_URL || '',
  }
}

/**
 * 合并默认值，得到运行期配置
 * @param options 用户配置
 * @param root 项目根目录
 */
export function resolveOptions(
  options: MdS3Options,
  root: string,
): ResolvedMdS3Options {
  const s3 = applyEnvCredentials(options.s3)

  if (!s3.bucket) {
    throw new Error('[md-s3] 缺少 s3.bucket（或环境变量 S3_BUCKET）')
  }
  if (!s3.publicBaseUrl) {
    throw new Error(
      '[md-s3] 缺少 s3.publicBaseUrl（或环境变量 S3_PUBLIC_BASE_URL）',
    )
  }
  if (!options.dryRun) {
    if (!s3.accessKeyId || !s3.secretAccessKey) {
      throw new Error(
        '[md-s3] 缺少 S3 密钥：请配置 s3.accessKeyId/secretAccessKey 或环境变量 S3_ACCESS_KEY_ID / S3_SECRET_ACCESS_KEY',
      )
    }
  }

  return {
    s3,
    includeDir: options.includeDir ?? 'docs',
    exclude: options.exclude ?? ['.vitepress/**', '**/node_modules/**'],
    fromHosts: options.fromHosts ?? [],
    extensions: (options.extensions ?? DEFAULT_EXTENSIONS).map((e) =>
      e.startsWith('.') ? e.toLowerCase() : `.${e.toLowerCase()}`,
    ),
    keyTemplate: options.keyTemplate ?? 'date-uuid',
    dryRun: options.dryRun ?? false,
    concurrency: options.concurrency ?? 4,
    root,
  }
}

/**
 * 加载 TS/JS 配置模块（支持 .ts）
 */
async function importConfigModule(file: string): Promise<unknown> {
  const mod = await jiti.import(file)
  return (mod as { default?: unknown }).default ?? mod
}

/**
 * 尝试加载独立配置文件 md-s3.config.{ts,mts,js,mjs,cjs}
 */
export async function loadStandaloneConfig(
  root: string,
  configPath?: string,
): Promise<MdS3Options | null> {
  const candidates = configPath
    ? [path.resolve(root, configPath)]
    : [
        'md-s3.config.ts',
        'md-s3.config.mts',
        'md-s3.config.js',
        'md-s3.config.mjs',
        'md-s3.config.cjs',
      ].map((f) => path.resolve(root, f))

  for (const file of candidates) {
    if (!fs.existsSync(file)) continue
    const cfg = (await importConfigModule(file)) as MdS3Options
    if (cfg && typeof cfg === 'object' && 's3' in cfg) {
      return cfg
    }
  }
  return null
}

/**
 * 从 Vite / VitePress 配置模块中提取 mdS3Plugin 的 options
 */
export function extractOptionsFromViteConfig(
  viteConfig: Record<string, unknown> | null | undefined,
): MdS3Options | null {
  if (!viteConfig) return null

  const vite = (viteConfig.vite ?? viteConfig) as {
    plugins?: unknown[]
  }

  const plugins = Array.isArray(vite.plugins) ? vite.plugins.flat(Infinity) : []

  for (const plugin of plugins) {
    if (!plugin || typeof plugin !== 'object') continue
    const p = plugin as {
      name?: string
      [MD_S3_OPTIONS_KEY]?: MdS3Options
      __mdS3Options?: MdS3Options
    }
    if (p.name === MD_S3_PLUGIN_NAME) {
      return p[MD_S3_OPTIONS_KEY] || p.__mdS3Options || null
    }
  }
  return null
}

/**
 * 加载 VitePress / Vite 配置文件并提取插件 options
 * @param root 项目根
 * @param configFile 相对或绝对路径，默认尝试 docs/.vitepress/config.mts
 */
export async function loadOptionsFromViteConfigFile(
  root: string,
  configFile?: string,
): Promise<MdS3Options | null> {
  const candidates = configFile
    ? [path.resolve(root, configFile)]
    : [
        'docs/.vitepress/config.mts',
        'docs/.vitepress/config.ts',
        'docs/.vitepress/config.js',
        'vite.config.ts',
        'vite.config.mts',
        'vite.config.js',
      ].map((f) => path.resolve(root, f))

  for (const file of candidates) {
    if (!fs.existsSync(file)) continue

    try {
      // 优先用 vite 的 loadConfigFromFile，可正确处理 TS
      const vite = await import('vite')
      const loaded = await vite.loadConfigFromFile(
        { command: 'build', mode: 'production' },
        file,
        root,
      )
      if (loaded?.config) {
        const fromVite = extractOptionsFromViteConfig(
          loaded.config as unknown as Record<string, unknown>,
        )
        if (fromVite) return fromVite

        // VitePress defineConfig 结果可能把插件放在 vite.plugins
        const nested = (loaded.config as { vite?: { plugins?: unknown[] } })
          .vite
        if (nested) {
          const fromNested = extractOptionsFromViteConfig({
            plugins: nested.plugins,
          })
          if (fromNested) return fromNested
        }
      }
    } catch {
      // fallback: 直接 dynamic import（可能无法加载 .ts）
      try {
        const mod = await import(pathToFileURL(file).href)
        const cfg = (mod.default ?? mod) as Record<string, unknown>
        const found = extractOptionsFromViteConfig(cfg)
        if (found) return found
        if (cfg.vite) {
          const foundNested = extractOptionsFromViteConfig(
            cfg.vite as Record<string, unknown>,
          )
          if (foundNested) return foundNested
        }
      } catch {
        // ignore
      }
    }
  }

  return null
}

/**
 * 按优先级加载配置：CLI 覆盖 < 独立配置 < Vite 插件配置
 */
export async function loadMdS3Options(params: {
  root: string
  configFile?: string
  viteConfigFile?: string
  overrides?: Partial<MdS3Options> & { dryRun?: boolean }
}): Promise<ResolvedMdS3Options> {
  const { root, configFile, viteConfigFile, overrides = {} } = params

  let base =
    (await loadStandaloneConfig(root, configFile)) ||
    (await loadOptionsFromViteConfigFile(root, viteConfigFile))

  if (!base) {
    throw new Error(
      '[md-s3] 未找到配置。请在 Vite 中注册 mdS3Plugin(...)，或提供 md-s3.config.ts / --config',
    )
  }

  const merged: MdS3Options = {
    ...base,
    ...overrides,
    s3: {
      ...base.s3,
      ...(overrides.s3 || {}),
    },
    exclude: overrides.exclude ?? base.exclude,
    fromHosts: overrides.fromHosts ?? base.fromHosts,
    extensions: overrides.extensions ?? base.extensions,
  }

  return resolveOptions(merged, root)
}
