import path from 'node:path'
import { loadMdS3Options } from './config.js'
import { loadEnvFiles } from './env.js'
import { migrateMarkdownAssets } from './migrate.js'
import type { MdS3Options } from './types.js'

/**
 * 简单 argv 解析（避免额外 CLI 依赖）
 */
function parseArgs(argv: string[]) {
  const args = argv.slice(2).filter((a) => a !== '--')
  const command = args.find((a) => !a.startsWith('-')) || 'migrate'
  const flags = new Set(args.filter((a) => a.startsWith('-')))

  function getOption(name: string): string | undefined {
    const idx = args.findIndex((a) => a === name || a.startsWith(`${name}=`))
    if (idx === -1) return undefined
    const cur = args[idx]!
    if (cur.includes('=')) return cur.split('=').slice(1).join('=')
    return args[idx + 1]
  }

  function getList(name: string): string[] | undefined {
    const raw = getOption(name)
    if (!raw) return undefined
    return raw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  }

  return {
    command,
    dryRun: flags.has('--dry-run') || flags.has('-n'),
    help: flags.has('--help') || flags.has('-h'),
    root: getOption('--root') || process.cwd(),
    config: getOption('--config'),
    viteConfig: getOption('--vite-config'),
    includeDir: getOption('--include-dir'),
    exclude: getList('--exclude'),
    fromHosts: getList('--from-hosts'),
    concurrency: getOption('--concurrency'),
  }
}

function printHelp(): void {
  console.log(`vite-plugin-md-s3 — Markdown OSS 迁移 CLI

用法:
  md-s3 migrate [options]

选项:
  --dry-run, -n          仅预览，不上传、不改写文件
  --root <dir>           项目根目录（默认 cwd）
  --config <file>        独立配置 md-s3.config.*
  --vite-config <file>   从 Vite/VitePress 配置提取 mdS3Plugin options
  --include-dir <dir>    覆盖扫描目录（默认 docs）
  --exclude <a,b>        覆盖排除 glob，逗号分隔
  --from-hosts <a,b>     只迁移指定 host
  --concurrency <n>      并发数（默认 4）
  --help, -h             显示帮助

环境变量:
  S3_ACCESS_KEY_ID / AWS_ACCESS_KEY_ID
  S3_SECRET_ACCESS_KEY / AWS_SECRET_ACCESS_KEY
  S3_ENDPOINT / S3_BUCKET / S3_REGION / S3_PUBLIC_BASE_URL

  会自动加载项目根目录 .env / .env.local（不覆盖已有环境变量）

示例:
  md-s3 migrate --dry-run
  md-s3 migrate --from-hosts oss.xxytime.top
  pnpm migrate:oss -- --dry-run
`)
}

async function main(): Promise<void> {
  const parsed = parseArgs(process.argv)

  if (parsed.help || parsed.command === 'help') {
    printHelp()
    return
  }

  if (parsed.command !== 'migrate') {
    console.error(`[md-s3] 未知命令: ${parsed.command}`)
    printHelp()
    process.exitCode = 1
    return
  }

  const root = path.resolve(parsed.root)
  const envFiles = loadEnvFiles(root)

  const overrides: Partial<MdS3Options> & { dryRun?: boolean } = {
    dryRun: parsed.dryRun || undefined,
  }
  if (parsed.includeDir) overrides.includeDir = parsed.includeDir
  if (parsed.exclude) overrides.exclude = parsed.exclude
  if (parsed.fromHosts) overrides.fromHosts = parsed.fromHosts
  if (parsed.concurrency) {
    overrides.concurrency = Number(parsed.concurrency) || 4
  }

  const options = await loadMdS3Options({
    root,
    configFile: parsed.config,
    viteConfigFile: parsed.viteConfig,
    overrides,
  })

  console.log(
    `[md-s3] root=${options.root} includeDir=${options.includeDir} dryRun=${options.dryRun}${envFiles.length ? ` env=${envFiles.join(',')}` : ''}`,
  )

  const result = await migrateMarkdownAssets(options)
  const touched = result.files.filter((f) => f.urls.length > 0)

  console.log(
    `[md-s3] done: files=${touched.length}/${result.files.length}, uploaded=${result.uploaded}, reused=${result.skipped}, failed=${result.failed}${result.dryRun ? ' (dry-run)' : ''}`,
  )

  if (result.failed > 0) {
    process.exitCode = 1
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err)
  process.exitCode = 1
})
