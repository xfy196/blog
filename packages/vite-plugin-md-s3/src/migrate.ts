import fs from 'node:fs/promises'
import path from 'node:path'
import { extractAssetUrls, filterMigratableUrls } from './extract.js'
import { rewriteUrls } from './rewrite.js'
import { scanMarkdownFiles } from './scan.js'
import {
  buildObjectKey,
  createS3Client,
  downloadAsset,
  toPublicUrl,
  uploadObject,
} from './s3.js'
import type { ResolvedMdS3Options } from './types.js'

/**
 * 单文件迁移结果
 */
export interface FileMigrateResult {
  file: string
  urls: string[]
  rewritten: number
  errors: string[]
}

/**
 * 整体迁移结果
 */
export interface MigrateResult {
  files: FileMigrateResult[]
  uploaded: number
  skipped: number
  failed: number
  dryRun: boolean
}

/**
 * 简单并发池
 */
async function mapPool<T, R>(
  items: T[],
  concurrency: number,
  worker: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length)
  let next = 0

  async function run(): Promise<void> {
    while (next < items.length) {
      const i = next++
      results[i] = await worker(items[i]!)
    }
  }

  const runners = Array.from(
    { length: Math.min(concurrency, Math.max(items.length, 1)) },
    () => run(),
  )
  await Promise.all(runners)
  return results
}

/**
 * 执行 Markdown OSS 迁移
 * @param options 已解析配置
 */
export async function migrateMarkdownAssets(
  options: ResolvedMdS3Options,
): Promise<MigrateResult> {
  const files = await scanMarkdownFiles(options)
  const client = options.dryRun ? null : createS3Client(options.s3)
  const urlCache = new Map<string, string>()
  const urlErrors = new Map<string, string>()

  let uploaded = 0
  let skipped = 0
  let failed = 0

  /**
   * 确保某个 URL 已迁移，返回新 URL
   */
  async function ensureMigrated(oldUrl: string): Promise<string | null> {
    if (urlCache.has(oldUrl)) {
      skipped += 1
      return urlCache.get(oldUrl)!
    }
    if (urlErrors.has(oldUrl)) {
      return null
    }

    if (options.dryRun) {
      const fakeKey = buildObjectKey(oldUrl, Buffer.from(oldUrl), null, options.keyTemplate)
      const newUrl = toPublicUrl(options.s3.publicBaseUrl, fakeKey)
      urlCache.set(oldUrl, newUrl)
      uploaded += 1
      return newUrl
    }

    try {
      const { body, contentType } = await downloadAsset(oldUrl)
      const key = buildObjectKey(
        oldUrl,
        body,
        contentType,
        options.keyTemplate,
      )
      await uploadObject(client!, options, key, body, contentType)
      const newUrl = toPublicUrl(options.s3.publicBaseUrl, key)
      urlCache.set(oldUrl, newUrl)
      uploaded += 1
      return newUrl
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      urlErrors.set(oldUrl, message)
      failed += 1
      return null
    }
  }

  const fileResults: FileMigrateResult[] = []

  for (const file of files) {
    const raw = await fs.readFile(file, 'utf8')
    const allUrls = extractAssetUrls(raw)
    const targets = filterMigratableUrls(allUrls, options)
    const errors: string[] = []

    if (targets.length === 0) {
      fileResults.push({
        file,
        urls: [],
        rewritten: 0,
        errors: [],
      })
      continue
    }

    const replacements = new Map<string, string>()

    await mapPool(targets, options.concurrency, async (url) => {
      const newUrl = await ensureMigrated(url)
      if (newUrl) {
        replacements.set(url, newUrl)
      } else {
        const msg = urlErrors.get(url) || 'unknown error'
        errors.push(`${url}: ${msg}`)
      }
    })

    const { content, replacedCount } = rewriteUrls(raw, replacements)

    if (!options.dryRun && replacedCount > 0 && content !== raw) {
      await fs.writeFile(file, content, 'utf8')
    }

    fileResults.push({
      file,
      urls: targets,
      rewritten: replacedCount,
      errors,
    })

    const rel = path.relative(options.root, file)
    if (targets.length > 0) {
      console.log(
        `[md-s3] ${rel}: ${targets.length} url(s), rewritten=${replacedCount}${options.dryRun ? ' (dry-run)' : ''}`,
      )
      for (const u of targets) {
        const neu = replacements.get(u)
        if (neu) {
          console.log(`  ${u} -> ${neu}`)
        }
      }
      for (const e of errors) {
        console.error(`  ! ${e}`)
      }
    }
  }

  return {
    files: fileResults,
    uploaded,
    skipped,
    failed,
    dryRun: options.dryRun,
  }
}
