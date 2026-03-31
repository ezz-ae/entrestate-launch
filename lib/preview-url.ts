export function resolvePreviewSrc(url?: string | null) {
  if (!url) return undefined
  if (url.startsWith("/")) return url
  return `/api/proxy?url=${encodeURIComponent(url)}`
}
