import fs from 'node:fs'
import path from 'node:path'

/**
 * 解析 .env 单行：KEY=VALUE / KEY="VALUE" / 忽略注释与空行
 */
function parseEnvLine(line: string): [string, string] | null {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith('#')) return null

  const eq = trimmed.indexOf('=')
  if (eq <= 0) return null

  const key = trimmed.slice(0, eq).trim()
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) return null

  let value = trimmed.slice(eq + 1).trim()
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1)
  }

  return [key, value]
}

/**
 * 将项目根目录 .env / .env.local 注入 process.env（已存在的键不覆盖）
 */
export function loadEnvFiles(root: string): string[] {
  const loaded: string[] = []
  for (const name of ['.env', '.env.local']) {
    const file = path.resolve(root, name)
    if (!fs.existsSync(file)) continue

    const text = fs.readFileSync(file, 'utf8')
    for (const line of text.split(/\r?\n/)) {
      const parsed = parseEnvLine(line)
      if (!parsed) continue
      const [key, value] = parsed
      if (process.env[key] === undefined) {
        process.env[key] = value
      }
    }
    loaded.push(name)
  }
  return loaded
}
