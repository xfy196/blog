import path from 'node:path'
import type { ResolvedMdS3Options } from './types.js'

/**
 * 去掉 Markdown 代码围栏内容，避免误提取示例 URL
 * @param content 原始 Markdown
 */
function stripCodeFences(content: string): string {
  return content.replace(/```[\s\S]*?```/g, '').replace(/~~~[\s\S]*?~~~/g, '')
}

/**
 * 从 Markdown / HTML 中提取资源 URL
 * @param content Markdown 原文
 */
export function extractAssetUrls(content: string): string[] {
  const text = stripCodeFences(content)
  const urls = new Set<string>()

  const mdImageRe = /!\[[^\]]*]\(\s*<?([^)\s>]+)>?(?:\s+(?:"[^"]*"|'[^']*'))?\s*\)/g
  const htmlSrcRe =
    /<(?:img|source|video|audio|embed)\b[^>]*?\bsrc\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s>]+))/gi
  const htmlHrefRe =
    /<a\b[^>]*?\bhref\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s>]+))/gi

  let match: RegExpExecArray | null
  while ((match = mdImageRe.exec(text)) !== null) {
    if (match[1]) urls.add(match[1].trim())
  }
  while ((match = htmlSrcRe.exec(text)) !== null) {
    const url = match[1] || match[2] || match[3]
    if (url) urls.add(url.trim())
  }
  // 仅收集看起来像资源文件的 a[href]
  while ((match = htmlHrefRe.exec(text)) !== null) {
    const url = match[1] || match[2] || match[3]
    if (url) urls.add(url.trim())
  }

  return [...urls]
}

/**
 * 判断 URL 是否应被迁移
 */
export function shouldMigrateUrl(
  rawUrl: string,
  options: ResolvedMdS3Options,
): boolean {
  let url: URL
  try {
    url = new URL(rawUrl)
  } catch {
    // 相对路径 / 非法 URL：本工具面向 OSS 迁移，跳过本地相对路径
    return false
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return false
  }

  const publicBase = options.s3.publicBaseUrl.replace(/\/$/, '')
  if (rawUrl.startsWith(publicBase + '/') || rawUrl === publicBase) {
    return false
  }

  if (options.fromHosts.length > 0) {
    const host = url.hostname.toLowerCase()
    const allowed = options.fromHosts.some(
      (h) => host === h.toLowerCase() || host.endsWith(`.${h.toLowerCase()}`),
    )
    if (!allowed) return false
  }

  const ext = path.extname(url.pathname).toLowerCase()
  // 无扩展名时仍允许（部分 CDN 无后缀）；有扩展名则必须命中白名单
  if (ext && !options.extensions.includes(ext)) {
    return false
  }

  return true
}

/**
 * 过滤出需要迁移的 URL 列表
 */
export function filterMigratableUrls(
  urls: string[],
  options: ResolvedMdS3Options,
): string[] {
  return urls.filter((u) => shouldMigrateUrl(u, options))
}
