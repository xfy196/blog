/**
 * 将 Markdown 文本中的旧 URL 全部替换为新 URL（字面量替换，避免正则转义问题）
 * @param content Markdown 原文
 * @param replacements oldUrl -> newUrl
 */
export function rewriteUrls(
  content: string,
  replacements: Map<string, string>,
): { content: string; replacedCount: number } {
  if (replacements.size === 0) {
    return { content, replacedCount: 0 }
  }

  // 按旧 URL 长度降序，避免短 URL 误伤长 URL 前缀
  const entries = [...replacements.entries()].sort(
    (a, b) => b[0].length - a[0].length,
  )

  let result = content
  let replacedCount = 0

  for (const [oldUrl, newUrl] of entries) {
    if (oldUrl === newUrl) continue
    let idx = result.indexOf(oldUrl)
    while (idx !== -1) {
      result =
        result.slice(0, idx) + newUrl + result.slice(idx + oldUrl.length)
      replacedCount += 1
      idx = result.indexOf(oldUrl, idx + newUrl.length)
    }
  }

  return { content: result, replacedCount }
}
