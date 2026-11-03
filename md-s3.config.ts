import type { MdS3Options } from 'vite-plugin-md-s3'

/**
 * Markdown OSS 迁移配置（CLI：pnpm migrate:oss）
 * 密钥请用环境变量注入，勿提交真实凭据。
 */
const config: MdS3Options = {
  s3: {
    endpoint: process.env.S3_ENDPOINT,
    region: process.env.S3_REGION || 'auto',
    bucket: process.env.S3_BUCKET || 'blog',
    accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
    forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
    publicBaseUrl:
      process.env.S3_PUBLIC_BASE_URL || 'https://static2.xxytime.top',
  },
  includeDir: 'docs',
  exclude: ['.vitepress/**', '**/node_modules/**'],
  // 按需收窄迁移来源；空数组表示迁移所有远程资源（仍会跳过已是 publicBaseUrl 的）
  fromHosts: ['oss.xxytime.top', 'cdn.jsdelivr.net'],
  keyTemplate: 'date-uuid',
  concurrency: 4,
}

export default config
