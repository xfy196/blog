import fg from 'fast-glob'
import path from 'node:path'
import type { ResolvedMdS3Options } from './types.js'

/**
 * 扫描 includeDir 下所有 .md，并按 exclude 过滤
 * @param options 已解析配置
 * @returns 绝对路径列表
 */
export async function scanMarkdownFiles(
  options: ResolvedMdS3Options,
): Promise<string[]> {
  const cwd = options.root
  const includeDir = options.includeDir.replace(/\\/g, '/')
  const patterns = [`${includeDir.replace(/\/$/, '')}/**/*.md`]

  const files = await fg(patterns, {
    cwd,
    absolute: true,
    onlyFiles: true,
    dot: false,
    ignore: [
      '**/node_modules/**',
      '**/.git/**',
      ...options.exclude,
    ],
  })

  return files.map((f) => path.normalize(f))
}
