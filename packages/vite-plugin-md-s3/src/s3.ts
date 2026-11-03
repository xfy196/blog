import {
  PutObjectCommand,
  S3Client,
  type PutObjectCommandInput,
} from '@aws-sdk/client-s3'
import { createHash, randomUUID } from 'node:crypto'
import path from 'node:path'
import type { KeyTemplate, ResolvedMdS3Options, S3Config } from './types.js'

/**
 * 创建 S3 兼容客户端
 * @param config S3 配置
 */
export function createS3Client(config: S3Config): S3Client {
  return new S3Client({
    region: config.region,
    endpoint: config.endpoint,
    forcePathStyle: config.forcePathStyle,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  })
}

/**
 * 从 Content-Type / URL 推断扩展名
 */
function resolveExtension(
  sourceUrl: string,
  contentType?: string | null,
): string {
  const fromPath = path.extname(new URL(sourceUrl).pathname).toLowerCase()
  if (fromPath) return fromPath

  const map: Record<string, string> = {
    'image/png': '.png',
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/gif': '.gif',
    'image/webp': '.webp',
    'image/svg+xml': '.svg',
    'image/avif': '.avif',
    'video/mp4': '.mp4',
    'video/webm': '.webm',
    'application/pdf': '.pdf',
  }
  if (contentType) {
    const base = contentType.split(';')[0]?.trim().toLowerCase()
    if (base && map[base]) return map[base]
  }
  return ''
}

/**
 * 按策略生成 object key
 */
export function buildObjectKey(
  sourceUrl: string,
  body: Buffer,
  contentType: string | null,
  template: KeyTemplate,
): string {
  const ext = resolveExtension(sourceUrl, contentType)
  const url = new URL(sourceUrl)

  if (template === 'preserve-path') {
    const pathname = decodeURIComponent(url.pathname).replace(/^\/+/, '')
    if (pathname) return pathname
  }

  if (template === 'hash') {
    const hash = createHash('sha256').update(body).digest('hex').slice(0, 32)
    return `${hash}${ext}`
  }

  // date-uuid（默认）
  const now = new Date()
  const yyyy = String(now.getFullYear())
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')
  return `${yyyy}/${mm}/${dd}/${randomUUID()}${ext}`
}

/**
 * 拼接公网访问 URL
 */
export function toPublicUrl(publicBaseUrl: string, key: string): string {
  const base = publicBaseUrl.replace(/\/$/, '')
  const objectKey = key.replace(/^\/+/, '')
  return `${base}/${objectKey}`
}

/**
 * 上传对象到 S3
 */
export async function uploadObject(
  client: S3Client,
  options: ResolvedMdS3Options,
  key: string,
  body: Buffer,
  contentType?: string | null,
): Promise<void> {
  const input: PutObjectCommandInput = {
    Bucket: options.s3.bucket,
    Key: key,
    Body: body,
  }
  if (contentType) {
    input.ContentType = contentType
  }
  await client.send(new PutObjectCommand(input))
}

/**
 * 下载远程资源
 */
export async function downloadAsset(
  url: string,
): Promise<{ body: Buffer; contentType: string | null }> {
  const res = await fetch(url, {
    redirect: 'follow',
    headers: {
      'User-Agent': 'vite-plugin-md-s3/0.1',
    },
  })
  if (!res.ok) {
    throw new Error(`下载失败 ${url}: HTTP ${res.status}`)
  }
  const ab = await res.arrayBuffer()
  return {
    body: Buffer.from(ab),
    contentType: res.headers.get('content-type'),
  }
}
