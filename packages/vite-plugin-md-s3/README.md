# vite-plugin-md-s3

将 Markdown 中的远程资源迁移到 S3 兼容对象存储（AWS S3 / Cloudflare R2 / MinIO 等），并**原地改写**链接。

迁移通过独立 CLI 执行，**不会**在 `vite` / `vitepress` 的 `dev` / `build` 生命周期里自动触发。

## 安装

```bash
pnpm add -D vite-plugin-md-s3
```

## 配置（Vite / VitePress）

插件仅作配置载体，构建期 no-op：

```ts
import { defineConfig } from 'vitepress'
import { mdS3Plugin } from 'vite-plugin-md-s3'

export default defineConfig({
  vite: {
    plugins: [
      mdS3Plugin({
        s3: {
          endpoint: process.env.S3_ENDPOINT, // R2 必填
          region: 'auto',
          bucket: 'blog',
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
          forcePathStyle: false,
          publicBaseUrl: 'https://static.example.com',
        },
        includeDir: 'docs',
        exclude: ['.vitepress/**'],
        fromHosts: ['oss.example.com', 'cdn.jsdelivr.net'],
        keyTemplate: 'date-uuid',
        concurrency: 4,
      }),
    ],
  },
})
```

也可使用独立配置文件 `md-s3.config.ts`：

```ts
import type { MdS3Options } from 'vite-plugin-md-s3'

const config: MdS3Options = {
  s3: {
    region: 'auto',
    bucket: 'blog',
    accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
    publicBaseUrl: 'https://static.example.com',
    endpoint: process.env.S3_ENDPOINT,
  },
  includeDir: 'docs',
}

export default config
```

## CLI

```bash
# 预览（不上传、不改文件）
md-s3 migrate --dry-run

# 正式迁移
md-s3 migrate

# 只迁移指定旧域名
md-s3 migrate --from-hosts oss.example.com,cdn.jsdelivr.net
```

### 环境变量

| 变量 | 说明 |
|------|------|
| `S3_ACCESS_KEY_ID` / `AWS_ACCESS_KEY_ID` | Access Key |
| `S3_SECRET_ACCESS_KEY` / `AWS_SECRET_ACCESS_KEY` | Secret Key |
| `S3_ENDPOINT` | 兼容 endpoint（R2/MinIO） |
| `S3_BUCKET` | Bucket（可覆盖配置） |
| `S3_REGION` / `AWS_REGION` | Region |
| `S3_PUBLIC_BASE_URL` | 公网 CDN 前缀 |

## Cloudflare R2 示例

```ts
mdS3Plugin({
  s3: {
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    region: 'auto',
    bucket: 'blog-assets',
    accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
    publicBaseUrl: 'https://static.xxytime.top',
  },
  includeDir: 'docs',
  fromHosts: ['oss.xxytime.top'],
})
```

## 说明

- 默认扫描 `docs/**/*.md`
- 已指向 `publicBaseUrl` 的资源会跳过
- 同一 URL 全局只上传一次
- 默认不删除源 OSS 上的旧文件
